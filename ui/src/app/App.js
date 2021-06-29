import './App.css';
import React from 'react'
import { Route, Switch } from 'react-router-dom';

import Container from '@material-ui/core/Container';
import CssBaseline from '@material-ui/core/CssBaseline';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import { withStyles } from '@material-ui/core/styles';

import AlertMessage from '../common/Alert';
import PrimarySearchAppBar from '../components/bar/AppBar';
import Dashboard from '../components/dashboard/Dashboard';
import SignIn from '../components/auth/SignIn';
import SignUp from '../components/auth/SignUp';
import Profile from '../components/profile/Profile';
import NotFound from '../common/NotFound';
import PrivateRoute from '../common/PrivateRoute';
import LoadingIndicator from '../common/LoadingIndicator';
import { getCurrentUser } from '../utils/APIUtils';


const useStyles = theme => ({
  root: {
    display: 'flex',
    flexDirection: 'column',
    minHeight: '100vh',
  },
  main: {
    marginTop: theme.spacing(8),
    marginBottom: theme.spacing(2),
  },
  footer: {
    // position: 'fixed',
    // bottom: 0,
    // width: '100%',
    padding: theme.spacing(3, 2),
    paddingRight: 0,
    marginTop: 'auto',
    backgroundColor: "#005480"
      // theme.palette.type === 'light' ? theme.palette.grey[200] : theme.palette.grey[800],
  },
});


class App extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      authenticated: false,
      curUser: null,
      loading: false,
      initialized: false,
      justLoggedOut: false,
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
        initialized: true,
      });
    }).catch(error => {
      this.setState({
        loading: false,
        initialized: true,
      });
    });
  }

  handleLogout() {
    localStorage.removeItem('accessToken');
    this.setState({
      authenticated: false,
      currentUser: null,
      justLoggedOut: true,
    });
    // window.location.reload();
    // console.log("Successfully logged out!");
  }

  componentDidMount() {
    this.setState({
      justLoggedOut: false,
    })
    this.loadCurrentlyLoggedInUser();
  }

  render() {
    const { classes } = this.props;
    if (this.state.loading) {
      return <LoadingIndicator />
    }
    return (
      <div className={classes.root}>
        <CssBaseline />
        <Container component="main" className={classes.main} maxWidth="xl">
          <Grid container spacing={0}>
            <PrimarySearchAppBar authenticated={this.state.authenticated} onLogout={this.handleLogout} />

            { this.state.justLoggedOut && <AlertMessage message={"Successfully logged out!"} severity={"success"} /> }

            <Switch>
                <Route exact path="/" render={(props) => <Dashboard {...props} />}></Route>
                <Route path="/login"
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
          </Grid>
        </Container>
        <footer className={classes.footer}>
          <Container maxWidth="xl">
            {/* <Typography variant="body1" style={{color: "#ffffff"}}>Lumine.</Typography> */}
            <Typography variant="body2" style={{color: "#dddddd"}}>
              {`Copyright © HL ${new Date().getFullYear()}.`}
            </Typography>
          </Container>
        </footer>
      </div>
    );
  }
}

export default withStyles(useStyles)(App);
