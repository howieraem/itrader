import './Dashboard.css';
import React from 'react';
import Button from '@material-ui/core/Button';
import Grid from '@material-ui/core/Grid';
import InfoTable from './Table';
import Chart from '../chart/CandleStickChart';
import { addTicker, removeAllTickers } from 'stocksocket';
import { getStockBasicInfo, getStockHistory } from '../../utils/APIUtils';
import LoadingIndicator from '../../common/LoadingIndicator';


class ChartComponent extends React.Component {
	componentDidMount() {
		getStockHistory(this.props.symbol).then(data => {
      if (data) this.setState({ data });
      else this.setState(null);
		}).catch(err => { console.log(err); this.setState(null); })
	}

	render() {
		return (
      this.state ? <Chart type="hybrid" data={this.state.data}/> : (
        <header className="Chart-placeholder">
          {"Loading chart..."}
          <LoadingIndicator />
        </header>
      )
		)
	}
}


// class DataItem extends React.Component {
//   render() {
//     return <div>{this.props.k + ": " + this.props.v}</div>;
//   }
// }


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
    "Current EPS": info.epsCurrentYear,
    "52-wk High": info.fiftyTwoWeekHigh,
    "52-wk Low": info.fiftyTwoWeekLow,
    "Full Name": info.longName,
    "Market": info.market,
    "Market State": info.marketState,
    "Price Range": info.regularMarketDayRange,
    "PE (Trailing)": info.trailingPE, 
  }
}


class Dashboard extends React.Component {
  _mounted = false

  constructor(props) {
    super(props)
    this.state = {
      symbol: "TSLA",
      companyName: "Tesla, Inc.",
      curData: null,
      preData: null,
      price: 0.,
      change: 0.,
      changePercent: 0.,
      dayVolume: 0.,
      prePrice: 0.,
      time: 0,
      basicInfo: null,
    }
    this.interval = setInterval(
      function() {
        getStockBasicInfo(this.state.symbol)
        .then(basicInfo => {
          this.setState({basicInfo: filterInfo(basicInfo)});
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

    addTicker(this.state.symbol, this.updateData);
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

    getStockBasicInfo(this.state.symbol)
    .then(basicInfo => {
      this.setState({basicInfo: filterInfo(basicInfo)});
    }).catch(err => { console.log(err) })
  }

  componentWillUnmount() {
    this._mounted = false;
    clearInterval(this.interval);
    removeAllTickers();
  }

  render() {
    return (
      <Grid container spacing={0}>
        <Grid container spacing={0}>
          <Grid item xs={4}> 
            <header className="Symbol-title">
              {this.state.symbol} -- {this.state.companyName}
            </header>
          </Grid>
          <Grid item xs><header className="Symbol-title"></header></Grid>
          <Grid item xs={3}> 
            <header className="Symbol-title">
              $ {this.state.price}
            </header>
          </Grid>
          <Grid item xs={3}> 
            <header className="Symbol-title">
              {this.state.change} ({this.state.changePercent} %)
            </header>
          </Grid>
          <Grid item><header className="Symbol-title"></header></Grid>
        </Grid>

        <Grid container>
          <Grid item xs />
          <Grid item xs={11} align="left">
            <ChartComponent symbol={this.state.symbol} />
          </Grid>
          <Grid item xs />
        </Grid>

        {/* <Grid container spacing={0}>
          <Grid item xs align="center">
            <div className="Symbol-info1">
              <DataItem k={"Day Volume"} v={this.state.dayVolume} />
              {this.state.basicInfo ? (Object.keys(this.state.basicInfo).map(key => 
                <DataItem k={key} v={this.state.basicInfo[key]} />
              )) : ("pending...")}
            </div>
          </Grid>
        </Grid> */}

        <InfoTable data={this.state.basicInfo} />

        <Grid container spacing={2} style={{marginTop: "15px"}}>
          <Grid item xs />
          <Grid item xs={3} align="left">
            <Button 
                variant="contained"
                style={{textTransform: 'none', fontSize: 18, backgroundColor: "#0077b7", color: "white", borderRadius: 12,
                        maxWidth: '150px', maxHeight: '50px', minWidth: '150px', minHeight: '50px'}}
            >
              Trade
            </Button>
          </Grid>
          <Grid item xs={3} align="left">
            <Button 
                variant="contained"
                style={{textTransform: 'none', fontSize: 18, backgroundColor: "#0077b7", color: "white", borderRadius: 12,
                        maxWidth: '150px', maxHeight: '50px', minWidth: '150px', minHeight: '50px'}}
            >
              More Info
            </Button>
          </Grid>
          <Grid item xs />
        </Grid>
      </Grid>
    )
  }
}

export default Dashboard;