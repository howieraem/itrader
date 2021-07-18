import './App.css';
import React from 'react'
import { Route, Switch } from 'react-router-dom';

import Container from '@material-ui/core/Container';
import CssBaseline from '@material-ui/core/CssBaseline';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';

import AlertMessage from '../common/Alert';
import PrimarySearchAppBar from '../components/bar/AppBar';
import Landing from '../components/landing/Landing';
import StockView from '../components/stockView/StockView';
import SignIn from '../components/auth/SignIn';
import SignUp from '../components/auth/SignUp';
// import Forgot from '../components/auth/Forgot';
import Dashboard from '../components/dashboard/Dashboard';
import NotFound from '../common/NotFound';
import PrivateRoute from '../common/PrivateRoute';
import LoadingIndicator from '../common/LoadingIndicator';
import { COLORS } from '../common/Theme';
import { getCurrentUser } from '../utils/APIUtils';


const useStyles = makeStyles((theme) => ({
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
    backgroundColor: COLORS[0]
      // theme.palette.type === 'light' ? theme.palette.grey[200] : theme.palette.grey[800],
  },
}));


export default function App() {
  const classes = useStyles();

  const [symbol, setSymbol] = React.useState('');
  const [authenticated, setAuthenticated] = React.useState(false);
  const [loading, setLoading] = React.useState(false);
  const [initialized, setInitialized] = React.useState(false);
  const [justLoggedOut, setJustLoggedOut] = React.useState(false);
  const [curUser, setCurUser] = React.useState(null);

  const handleLogout = () => {
    localStorage.removeItem('accessToken');
    sessionStorage.removeItem('accessToken');
    setAuthenticated(false);
    setCurUser(null);
    setJustLoggedOut(true);
  };

  const changeSymbol = symbol => {
    setSymbol(symbol);
    sessionStorage.setItem('symbol', symbol);
  };

  React.useEffect(() => {
    setJustLoggedOut(false);

    const loadCurrentlyLoggedInUser = () => {
      setLoading(true);
      getCurrentUser()
      .then(response => {
        setCurUser(response);
        setAuthenticated(true);
        setLoading(false);
        setInitialized(true);
      }).catch(error => {
        setLoading(false);
        setInitialized(true);
      });
    };
    loadCurrentlyLoggedInUser();

    setSymbol(sessionStorage.getItem('symbol') || 'TSLA');
  }, [])

  return ( loading ? (<LoadingIndicator />) : (
    <div className={classes.root}>
      <CssBaseline />
      <Container component="main" className={classes.main} maxWidth="xl">
        <Grid container spacing={0}>
          <Grid container>
            <Grid item xs>
              <PrimarySearchAppBar authenticated={authenticated} onLogout={handleLogout} onSearch={changeSymbol} />
            </Grid>
          </Grid>

          { justLoggedOut && <AlertMessage message={"Successfully logged out!"} severity={"success"} /> }

          <Switch>
              <Route exact path="/" render={(props) => <Landing authenticated={authenticated} {...props} />} />
              <Route path="/stockView" render={(props) => <StockView symbol={symbol} authenticated={authenticated} {...props} />} />
              <Route path="/login" render={(props) => <SignIn authenticated={authenticated} {...props} />} />
              <Route path="/signup" render={(props) => <SignUp authenticated={authenticated} {...props} />} />
              <PrivateRoute path="/dashboard" 
                authenticated={authenticated} 
                initialized={initialized} 
                currentUser={curUser} 
                component={Dashboard}
                onSymbolClick={changeSymbol}
              />
              {/* <Route path="/forgot" component={Forgot} /> */}
              <Route component={NotFound} />
          </Switch>
        </Grid>
      </Container>
      <footer className={classes.footer}>
        <Container maxWidth="xl">
          <Typography variant="body1" style={{color: "#ffffff", fontStyle: "italic"}}>
            Sky is the limit.
          </Typography>
          <Typography variant="body2" style={{color: "#dddddd"}}>
            {`Copyright © HL ${new Date().getFullYear()}.`}
          </Typography>
        </Container>
      </footer>
    </div>
  ));
}
