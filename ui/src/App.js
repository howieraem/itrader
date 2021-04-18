// import logo from './logo.svg';
import './App.css';
import React from 'react'
import Grid from '@material-ui/core/Grid';
import { TypeChooser } from "react-stockcharts/lib/helper";

import PrimarySearchAppBar from './components/bar/AppBar';
import Chart from './components/chart/CandleStickChart';
import { getData } from "./components/chart/utils"


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
			<TypeChooser>
				{type => <Chart type={type} data={this.state.data} />}
			</TypeChooser>
		)
	}
}


function App() {
  let date = new Date();
  return (
    <div className="App">
      <Grid container spacing={0}>
        <Grid item xs={12}>
          <PrimarySearchAppBar/>
        </Grid>
        <Grid item xs={10}>
          <ChartComponent />
          {/* 
          <header className="App-region1">
          </header>
           */}
        </Grid>
        <Grid item xs={2}>
          <header className="App-region2">
            <p>{'UTC+' + (0 - date.getTimezoneOffset() / 60)} {date.toLocaleTimeString()}</p>
          </header>
        </Grid>
      </Grid>
    </div>
  );
}

export default App;
