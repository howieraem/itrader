import './Dashboard.css';
import React from 'react';
import Grid from '@material-ui/core/Grid';
import Chart from '../chart/CandleStickChart';
import { getData } from "../chart/utils";


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


function roundNumber(number) {
  return parseFloat(number.toFixed(4))
}


class Dashboard extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      loaded: false,
      symbol: "COIN",
      companyName: "Coinbase Global, Inc.",
      curData: null,
      preData: null,
      price: 0.,
      change: 0.,
      changePercent: 0.,
      dayVolume: 0.,
      prePrice: 0.,
      time: 0,
    }
    this.stockSocket = require("stocksocket");
    this.stockSocket.addTicker(this.state.symbol, liveData => {
      if (this.state.loaded) {
        this.setState({
          preData: this.state.curData,
          prePrice: this.state.price,
          curData: liveData,
          price: roundNumber(liveData.price),
          change: roundNumber(liveData.change),
          changePercent: roundNumber(liveData.changePercent),
          dayVolume: liveData.dayVolume,
          time: liveData.time,
        });
      }
    });
  }

  componentDidMount() {
    this.setState({loaded: true});
  }

  render() {
    return (
      <Grid container spacing={0}>

        <Grid item xs={2} style={{ marginTop: 50 }}> 
          <header className="Symbol-title">
          </header>
        </Grid>
        <Grid item xs={4} style={{ marginTop: 50 }}> 
          <header className="Symbol-title">
            {this.state.symbol} -- {this.state.companyName}
          </header>
        </Grid>
        <Grid item xs={2} style={{ marginTop: 50 }}> 
          <header className="Symbol-title">
            $ {this.state.price}
          </header>
        </Grid>
        <Grid item xs={2} style={{ marginTop: 50 }}> 
          <header className="Symbol-title">
            {this.state.change} ({this.state.changePercent} %)
          </header>
        </Grid>
        <Grid item xs={2} style={{ marginTop: 50 }}> 
          <header className="Symbol-title">
          </header>
        </Grid>

        <Grid item xs={2} style={{ backgroundColor: '#ff6b6b' }}></Grid>
        <Grid item xs={8} style={{ backgroundColor: '#ff6b6b' }} align="center">
          <div>
            {this.state.curData ? (Object.keys(this.state.curData).map(key => 
              <DataItem k={key} v={this.state.curData[key]} />
            )) : ("pending...")}
          </div>
        </Grid>
        <Grid item xs={2} style={{ backgroundColor: '#ff6b6b' }}></Grid>

        <Grid item xs={12} style={{ marginTop: 0 }}>
          <header className="Symbol-icons">
            Work in progress...
          </header>
        </Grid>

        <Grid item xs={2}></Grid>
        <Grid item xs={8} align="left">
          <ChartComponent />
        </Grid>
        <Grid item xs={2}></Grid>

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