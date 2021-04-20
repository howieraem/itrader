// import logo from './logo.svg';
import './App.css';
import React from 'react'
import Grid from '@material-ui/core/Grid';
// import { TypeChooser } from "react-stockcharts/lib/helper";

import PrimarySearchAppBar from './components/bar/AppBar';
import Chart from './components/chart/CandleStickChart';
import { getData } from "./components/chart/utils";


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
			// <TypeChooser>
			// 	{type => <Chart type={type} data={this.state.data} />}
			// </TypeChooser>
      <Chart type="hybrid" data={this.state.data}/>
		)
	}
}


const Clock = ({ date }) => (
  <div>{'UTC+' + (0 - date.getTimezoneOffset() / 60) + ' ' + date.toLocaleTimeString()}</div>
)


class App extends React.Component {
  constructor() {
    super()
    this.state = {
      date: new Date()
    }
  }

  componentWillMount() {
    this.interval = setInterval(
      () => this.setState({ date: new Date() }),
      1000
    )
  }

  componentWillUnmount() {
    clearInterval(this.interval)
  }

  render() {
    return (
      <Grid container spacing={0}>
        <Grid item xs={12}>
          <PrimarySearchAppBar />
        </Grid>
        <Grid item xs={6} style={{ marginTop: 30 }}> 
          <header className="Symbol-title">
            {"COIN - Coinbase Inc."}
          </header>
        </Grid>
        <Grid item xs={6} style={{ marginTop: 30 }}>
          <header className="Symbol-icons">
            Work in progress...
          </header>
        </Grid>
        <Grid item xs={12} align="left">
          <ChartComponent />
        </Grid>
        <Grid item xs={6}>
          <header className="App-region2">
            <Clock date={this.state.date} />
          </header>
        </Grid>

        <Grid item xs={12} style={{backgroundColor: '#ffd83b'}}>
          test
        </Grid>
      </Grid>
    );
  }
}

export default App;
