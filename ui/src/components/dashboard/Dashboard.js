import './Dashboard.css';
import React from 'react';
import Grid from '@material-ui/core/Grid';
import Chart from '../chart/CandleStickChart';
import { getData } from "../chart/utils";
import { addTicker, removeAllTickers } from 'stocksocket';
import { getStockBasicInfo } from '../../yahoo-finance-webscraper';


class ChartComponent extends React.Component {
	componentDidMount() {
		getData().then(data => {
			this.setState({ data })
		})
	}
	render() {
		if (this.state == null) {
			return <div>Loading...</div>
		}
		return (
      <Chart type="hybrid" data={this.state.data}/>
		)
	}
}


class DataItem extends React.Component {
  render() {
    return <div>{this.props.k + ": " + this.props.v}</div>;
  }
}


function roundNumber(number, places=4) {
  return parseFloat(number.toFixed(places))
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
      getStockBasicInfo(this.state.symbol).then(basicInfo => {
        this.setState({basicInfo: basicInfo});
      }),
      5000
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
        curData: liveData,
        price: roundNumber(liveData.price),
        change: roundNumber(liveData.change),
        changePercent: roundNumber(liveData.changePercent, 2),
        dayVolume: liveData.dayVolume,
        time: liveData.time,
      });
    }
  }

  componentDidMount() {
    this._mounted = true

    // getStockBasicInfo(this.state.symbol).then(basicInfo => {
    //   this.setState({basicInfo: basicInfo});
    // });
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

        <Grid container spacing={0}>
          <Grid item xs={6} align="center">
            <div className="Symbol-info1">
              {this.state.curData ? (Object.keys(this.state.curData).map(key => 
                <DataItem k={key} v={this.state.curData[key]} />
              )) : ("pending...")}
            </div>
          </Grid>
          <Grid item xs={6} align="center">
            <div className="Symbol-info1">
              {this.state.basicInfo ? (Object.keys(this.state.basicInfo).map(key => 
                <DataItem k={key} v={this.state.basicInfo[key]} />
              )) : ("pending...")}
            </div>
          </Grid>
        </Grid>

        <Grid container>
          <Grid item xs></Grid>
          <Grid item xs={11} align="left">
            <ChartComponent />
          </Grid>
          <Grid item xs></Grid>
        </Grid>

        <Grid item xs={4}>
          <header className="Symbol-stats">
            Symbol stats
          </header>
        </Grid>
        <Grid item xs={8}>
          <header className="Misc">
            Misc
          </header>
        </Grid>

      </Grid>
    )
  }
}

export default Dashboard;