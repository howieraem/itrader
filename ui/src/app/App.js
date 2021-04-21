import './App.css';
import React from 'react'
import Grid from '@material-ui/core/Grid';

import PrimarySearchAppBar from '../components/bar/AppBar';
import Chart from '../components/chart/CandleStickChart';
import { getData } from "../components/chart/utils";
import { ACCESS_TOKEN } from "../constants";
import { getCurrentUser } from '../utils/APIUtils';


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


const Clock = ({ date }) => (
  <div>{'UTC+' + (0 - date.getTimezoneOffset() / 60) + ' ' + date.toLocaleTimeString()}</div>
)


class App extends React.Component {
  constructor() {
    super()
    this.state = {
      date: new Date(),
      authenticated: false,
      curUser: null,
      loading: false
    }
    this.loadCurrentlyLoggedInUser = this.loadCurrentlyLoggedInUser.bind(this);
    this.handleLogout = this.handleLogout.bind(this);
  }

  loadCurrentlyLoggedInUser() {
    this.setState({
      loading: true
    });

    getCurrentUser()
    .then(response => {
      this.setState({
        currentUser: response,
        authenticated: true,
        loading: false
      });
    }).catch(error => {
      this.setState({
        loading: false
      });  
    });    
  }

  handleLogout() {
    localStorage.removeItem(ACCESS_TOKEN);
    this.setState({
      authenticated: false,
      currentUser: null
    });
  }

  componentWillMount() {
    this.interval = setInterval(
      () => this.setState({ date: new Date() }),
      1000
    )
  }

  componentDidMount() {
    this.loadCurrentlyLoggedInUser();
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
        <Grid item xs={12} style={{ backgroundColor: '#ffd83b' }} align="center">
          <Clock date={this.state.date} />
        </Grid>
        <Grid item xs={12} style={{ backgroundColor: '#eeeeee' }}>
          Copyright © 2021 · HL
        </Grid>
      </Grid>
    );
  }
}

export default App;
