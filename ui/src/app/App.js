import './App.css';
import React from 'react'
import { Route, Switch } from 'react-router-dom';

import Container from '@material-ui/core/Container';
import Grid from '@material-ui/core/Grid';
import PrimarySearchAppBar from '../components/bar/AppBar';
import Dashboard from '../components/dashboard/Dashboard';
import { ACCESS_TOKEN } from "../constants";
import { getCurrentUser } from '../utils/APIUtils';


import SignIn from '../user/login/SignIn';
import SignUp from '../user/signup/SignUp';
import Profile from '../user/profile/Profile';
import NotFound from '../common/NotFound';
import PrivateRoute from '../common/PrivateRoute';
import LoadingIndicator from '../common/LoadingIndicator';


class App extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      authenticated: false,
      curUser: null,
      loading: false,
      initialized: false,
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
  
  render() {
    if (this.state.loading) {
      return <LoadingIndicator />
    }
    return (
      <Container>
        <Grid container spacing={0}>
          <Grid item xs>
            <PrimarySearchAppBar authenticated={this.state.authenticated} onLogout={this.handleLogout} />
          </Grid>

          <Switch>
              <Route exact path="/" render={(props) => <Dashboard {...props} />}></Route>
              <Route path="/login"
                // render={(props) => <Login authenticated={this.state.authenticated} {...props} />}>
                render={(props) => <SignIn authenticated={this.state.authenticated} {...props} />}>
              </Route>
              <Route path="/signup"
                render={(props) => <SignUp authenticated={this.state.authenticated} {...props} />}>
              </Route>
              <PrivateRoute path="/profile" authenticated={this.state.authenticated} initialized={this.state.initialized} currentUser={this.state.currentUser}
                component={Profile}>
              </PrivateRoute>
              <Route component={NotFound}></Route>
          </Switch>

          <Grid item xs={12} style={{ backgroundColor: '#cccccc', marginTop: '30px', marginBottom: '10px' }} align="center">
            Copyright © HL {new Date().getFullYear()}.
          </Grid>
        </Grid>
      </Container>
    );
  }
}

export default App;
