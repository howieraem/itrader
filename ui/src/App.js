import React from 'react'
import { Route, Switch, useHistory } from 'react-router-dom';

import Container from '@material-ui/core/Container';
import CssBaseline from '@material-ui/core/CssBaseline';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import { makeStyles, ThemeProvider } from '@material-ui/core/styles';

import Dashboard from './pages/Dashboard';
// import Forgot from '../components/auth/Forgot';
import NavBar from './components/bar/NavBar';
import NotFound from './pages/NotFound';
import Landing from './pages/Landing';
import Settings from "./pages/Settings";
import SignIn from './pages/SignIn';
import SignUp from './pages/SignUp';
import StockView from './pages/StockView';
import AlertMessage from './common/SnackbarAlert';
import PrivateRoute from './common/PrivateRoute';
import LoadingIndicator from './common/LoadingIndicator';
import theme from "./theme";
import { COLORS } from './common/Theme';
import { getCurrentUser } from './utils/API';


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

  const [symbol, setSymbol] = React.useState(sessionStorage.getItem('symbol') || 'TSLA');
  const [authenticated, setAuthenticated] = React.useState(false);
  const [loading, setLoading] = React.useState(false);
  const [initialized, setInitialized] = React.useState(false);
  const [justLoggedOut, setJustLoggedOut] = React.useState(false);
  const [curUser, setCurUser] = React.useState(null);

  let history = useHistory();

  const handleLogout = (alert=true) => {
    localStorage.removeItem('accessToken');
    sessionStorage.removeItem('accessToken');
    setAuthenticated(false);
    setCurUser(null);
    setJustLoggedOut(alert);
  };

  const changeSymbol = symbol => {
    setSymbol(symbol);
    sessionStorage.setItem('symbol', symbol);
    history.push('/stockView');
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
      }).catch(e => {
        console.log(e);
        setLoading(false);
        setInitialized(true);
      });
    };
    loadCurrentlyLoggedInUser();
  }, [])

  return ( loading ? <LoadingIndicator /> : (
    <ThemeProvider theme={theme}>
      <div className={classes.root}>
        <CssBaseline />
        <Container component="main" className={classes.main} maxWidth="xl">
          <Grid container spacing={0}>
            <Grid container>
              <Grid item xs>
                <NavBar authenticated={authenticated} onLogout={handleLogout} onSearch={changeSymbol} />
              </Grid>
            </Grid>

            { justLoggedOut && <AlertMessage message={"Successfully logged out!"} severity={"success"} /> }

            <Switch>
                <Route exact path="/" render={(props) => <Landing authenticated={authenticated} {...props} />} />
                <Route path="/stockView" render={(props) => <StockView symbol={symbol} authenticated={authenticated} {...props} />} />
                <Route path="/login" render={(props) => <SignIn authenticated={authenticated} {...props} />} />
                <Route path="/signup" render={(props) => <SignUp authenticated={authenticated} {...props} />} />
                <PrivateRoute
                  path="/dashboard"
                  authenticated={authenticated}
                  initialized={initialized}
                  currentUser={curUser}
                  component={Dashboard}
                  onSymbolClick={changeSymbol}
                />
                <PrivateRoute
                  path="/settings"
                  authenticated={authenticated}
                  initialized={initialized}
                  currentUser={curUser}
                  onLogout={handleLogout}
                  component={Settings}
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
    </ThemeProvider>
  ));
}
