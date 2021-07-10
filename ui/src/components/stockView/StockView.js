import React from 'react';
// import Button from '@material-ui/core/Button';
import Grid from '@material-ui/core/Grid';
import { withStyles } from '@material-ui/core/styles';
import InfoTable from './Table';
import MultiCharts from './MultiCharts';
import TradeDialog from './TradeDialog';
import { addTicker, removeTicker, removeAllTickers } from 'stocksocket';
import { getStockBasicInfo } from '../../utils/DataAPIUtils';


const useStyles = theme => ({
  grow: {
    flexGrow: 1,
    display: 'none',
    [theme.breakpoints.up('md')]: {
      display: 'block',
    },
  },
  grow2: {
    display: 'block',
    [theme.breakpoints.up('md')]: {
      display: 'none',
    },
  },
  topContainer: {
    backgroundColor: '#fafaff',
  },
  symbolTitle1: {
    minHeight: '35px',
    maxHeight: '35px',
    fontWeight: 'bold',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'left',
    justifyContent: 'center',
    fontSize: '16px',
    [theme.breakpoints.up('sm')]: {
      fontSize: '20px',
    },
  },
  symbolTitle2: {
    minHeight: '25px',
    maxHeight: '25px',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'left',
    justifyContent: 'center',
    fontSize: '15px',
    [theme.breakpoints.up('sm')]: {
      fontSize: '17px',
    },
  }
})


function roundNumber(number, places=4) {
  return parseFloat(number.toFixed(places))
}


function sortByKey(unordered) {
  return Object.keys(unordered).sort().reduce(
    (obj, key) => { 
      obj[key] = unordered[key]; 
      return obj;
    }, 
    {}
  );
}


function filterInfo(info) {
  return {
    "Currency": info.currency,
    "52-wk High": info.fiftyTwoWeekHigh,
    "52-wk Low": info.fiftyTwoWeekLow,
    "Market": info.market,
    "Market State": info.marketState,
    "Price Range": info.regularMarketDayRange,
    "Current EPS": info.epsCurrentYear ? info.epsCurrentYear : "N/A",
    "PE (Trailing)": info.trailingPE ? info.trailingPE : "N/A", 
  }
}


class StockView extends React.Component {
  _mounted = false

  constructor(props) {
    super(props);
    this.state = {
      symbol: props.symbol,
      curData: null,
      preData: null,
      price: 0.,
      change: 0.,
      changePercent: 0.,
      dayVolume: 0.,
      prePrice: 0.,
      time: 0,
      basicInfo: null,
      fullName: null,
    }
    this.interval = setInterval(
      function() {
        getStockBasicInfo(this.state.symbol)
        .then(basicInfo => {
          this.setState({
            basicInfo: filterInfo(basicInfo),
            fullName: basicInfo.longName
          });;
        }).catch(err => { console.log(err) })
      }.bind(this),
      10000
    )

    /* 
    live data:
    id
    price
    time
    exchange
    quoteType
    marketHours
    changePercent
    dayVolume
    change
    lastSize
    priceHint
    */
    this.updateData = this.updateData.bind(this);
  }

  updateData(liveData) {
    if (this._mounted) {
      this.setState({
        preData: this.state.curData,
        prePrice: this.state.price,
        curData: sortByKey(liveData),
        price: roundNumber(liveData.price),
        change: roundNumber(liveData.change),
        changePercent: roundNumber(liveData.changePercent, 2),
        dayVolume: liveData.dayVolume,
        time: liveData.time,
      });
    }
  }

  componentDidMount() {
    this._mounted = true;
    
    addTicker(this.state.symbol, this.updateData);

    getStockBasicInfo(this.state.symbol)
    .then(basicInfo => {
      this.setState({
        basicInfo: filterInfo(basicInfo),
        fullName: basicInfo.longName
      });
    }).catch(err => { console.log(err) })
  }

  componentWillUnmount() {
    this._mounted = false;
    clearInterval(this.interval);
    removeAllTickers();
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.symbol !== this.props.symbol) {
      removeTicker(this.state.symbol);
      const curSymbol = nextProps.symbol;
      this.setState({ 
        symbol: curSymbol,
        fullName: null,
      });
      getStockBasicInfo(curSymbol)
      .then(basicInfo => {
        this.setState({
          basicInfo: filterInfo(basicInfo),
          fullName: basicInfo.longName
        });
      }).catch(err => { console.log(err) })
      addTicker(curSymbol, this.updateData);
    }
  }

  render() {
    const { classes } = this.props;
    const priceLoaded = this.state.price > 0;
    const changeSign = this.state.change > 0 ? "+" : "";
    const marketClosed = this.state.basicInfo ? this.state.basicInfo["Market State"] === "CLOSED" : false;
    return (
      <Grid container spacing={0}>
        <Grid container spacing={2} className={classes.topContainer}>
          <Grid item xs={4} sm={4}> 
            <header className={classes.symbolTitle1}>
              {this.state.symbol}
            </header>
            <header className={classes.symbolTitle2}>
              { this.state.basicInfo ? this.state.fullName : "" }
            </header>
          </Grid>

          <Grid item className={classes.grow} />

          <Grid item xs={4} sm={5}> 
            <header className={classes.symbolTitle1}>
              { marketClosed ? "Market closed" : priceLoaded ? ("$" + this.state.price) : "Loading price..." }
            </header>
            <header className={classes.symbolTitle2}>
              { priceLoaded ? (`${changeSign}${this.state.change} (${changeSign}${this.state.changePercent}%)`) : "" }
            </header>
          </Grid>
          
          <Grid item xs className={classes.grow2} />

          <Grid item xs={2} sm={2} align="right">
            <TradeDialog symbol={this.state.symbol} authenticated={this.props.authenticated} marketClosed={marketClosed} />
          </Grid>
        </Grid>

        <Grid container>
          <Grid item xs={12}>
            <MultiCharts key={this.state.symbol} symbol={this.state.symbol} lastestPrice={this.state.price} />
          </Grid>
        </Grid>

        <InfoTable key={this.state.fullName} data={this.state.basicInfo} />
      </Grid>
    )
  }
}

export default withStyles(useStyles)(StockView);