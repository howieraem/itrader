import './App.css';
import React from 'react'
import { Route, Switch } from 'react-router-dom';

import Grid from '@material-ui/core/Grid';
import PrimarySearchAppBar from '../components/bar/AppBar';
import Chart from '../components/chart/CandleStickChart';
import { getData } from "../components/chart/utils";
import { ACCESS_TOKEN } from "../constants";
import { getCurrentUser } from '../utils/APIUtils';

import Login from '../user/login/Login';
import Signup from '../user/signup/Signup';
import Profile from '../user/profile/Profile';
import NotFound from '../common/NotFound';
import PrivateRoute from '../common/PrivateRoute';
import LoadingIndicator from '../common/LoadingIndicator';


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


class Home extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      loaded: false,
      symbol: "COIN",
      price: 0.,
      change: 0.,
      changePercent: 0.,
      dayVolume: 0.,
      prePrice: 0.,
    }
    this.stockSocket = require("stocksocket");
    this.stockSocket.addTicker(this.state.symbol, stockData => {
      console.log(stockData);
      if (this.state.loaded) {
        this.setState({
          prePrice: this.state.price,
          price: stockData.price,
          change: stockData.change,
          changePercent: stockData.changePercent,
          dayVolume: stockData.dayVolume,
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
        <Grid item xs={6} style={{ marginTop: 30 }}> 
          <header className="Symbol-title">
            {this.state.symbol}
          </header>
        </Grid>
        <Grid item xs={6} style={{ marginTop: 30 }}>
          <header className="Symbol-icons">
            Work in progress...
          </header>
        </Grid>
        <Grid item xs={12} style={{ backgroundColor: '#ff6b6b' }} align="center">
          {this.state.price}
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
      </Grid>
    )
  }
}


const Clock = ({ date }) => (
  <div>{'UTC+' + (0 - date.getTimezoneOffset() / 60) + ' ' + date.toLocaleTimeString()}</div>
)


class App extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      date: new Date(),
      authenticated: false,
      curUser: null,
      loading: false,
      initialized: false,
    }
    this.loadCurrentlyLoggedInUser = this.loadCurrentlyLoggedInUser.bind(this);
    this.handleLogout = this.handleLogout.bind(this);
    this.interval = setInterval(
      () => this.setState({ date: new Date() }),
      1000
    )
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
        loading: false,
        initialized: true
      });
    }).catch(error => {
      this.setState({
        loading: false,
        initialized: true
      });
    });    
  }

  handleLogout() {
    localStorage.removeItem(ACCESS_TOKEN);
    this.setState({
      authenticated: false,
      currentUser: null
    });
    console.log("logged out");
    window.location.reload();
  }

  componentDidMount() {
    this.loadCurrentlyLoggedInUser();
  }

  componentWillUnmount() {
    clearInterval(this.interval)
  }
  
  render() {
    if (this.state.loading) {
      return <LoadingIndicator />
    }
    return (
      <Grid container spacing={0}>
        <Grid item xs={12}>
          <PrimarySearchAppBar authenticated={this.state.authenticated} onLogout={this.handleLogout} />
        </Grid>
        <Switch>
            <Route exact path="/" render={(props) => <Home {...props} />}></Route>
            <Route path="/login"
              render={(props) => <Login authenticated={this.state.authenticated} {...props} />}></Route>
            <Route path="/signup"
              render={(props) => <Signup authenticated={this.state.authenticated} {...props} />}></Route>
            <PrivateRoute path="/profile" authenticated={this.state.authenticated} initialized={this.state.initialized} currentUser={this.state.currentUser}
              component={Profile}></PrivateRoute>
            <Route component={NotFound}></Route>
        </Switch>

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
