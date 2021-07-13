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
import StockView from '../components/stockView/StockView';
import SignIn from '../components/auth/SignIn';
import SignUp from '../components/auth/SignUp';
import Forgot from '../components/auth/Forgot';
import Profile from '../components/profile/Profile';
import NotFound from '../common/NotFound';
import PrivateRoute from '../common/PrivateRoute';
import LoadingIndicator from '../common/LoadingIndicator';
import { COLOR_PRIMARY } from '../common/Theme';
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
    backgroundColor: COLOR_PRIMARY
      // theme.palette.type === 'light' ? theme.palette.grey[200] : theme.palette.grey[800],
  },
}));


export default function App() {
  const [symbol, setSymbol] = React.useState(localStorage.getItem('symbol') || 'TSLA');
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
    // window.location.reload();
    // console.log("Successfully logged out!");
  };

  const changeSymbol = symbol => {
    setSymbol(symbol);
    localStorage.setItem('symbol', symbol);
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
  }, [])

  const classes = useStyles();
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
              <Route exact path="/" render={(props) => <StockView symbol={symbol} authenticated={authenticated} {...props} />} />
              <Route path="/login" render={(props) => <SignIn authenticated={authenticated} {...props} />} />
              <Route path="/signup" render={(props) => <SignUp authenticated={authenticated} {...props} />} />
              <PrivateRoute path="/profile" authenticated={authenticated} initialized={initialized} currentUser={curUser} 
                component={Profile} />
              <Route path="/forgot" component={Forgot} />
              <Route component={NotFound} />
          </Switch>
        </Grid>
      </Container>
      <footer className={classes.footer}>
        <Container maxWidth="xl">
          <Typography variant="body1" style={{color: "#ffffff", fontStyle: "italic"}}>Learn. Try. Trust. Lumine.</Typography>
          <Typography variant="body2" style={{color: "#dddddd"}}>
            {`Copyright © HL ${new Date().getFullYear()}.`}
          </Typography>
        </Container>
      </footer>
    </div>
  ));
}


// class App extends React.Component {
//   constructor(props) {
//     super(props)
//     this.state = {
//       authenticated: false,
//       currentUser: null,
//       loading: false,
//       initialized: false,
//       justLoggedOut: false,
//       symbol: localStorage.getItem('symbol') || 'TSLA',
//     }
//     this.loadCurrentlyLoggedInUser = this.loadCurrentlyLoggedInUser.bind(this);
//     this.handleLogout = this.handleLogout.bind(this);
//     this.changeSymbol = this.changeSymbol.bind(this);
//   }

//   loadCurrentlyLoggedInUser() {
//     this.setState({
//       loading: true
//     });

//     getCurrentUser()
//     .then(response => {
//       this.setState({
//         currentUser: response,
//         authenticated: true,
//         loading: false,
//         initialized: true,
//       });
//     }).catch(error => {
//       this.setState({
//         loading: false,
//         initialized: true,
//       });
//     });
//   }

//   handleLogout() {
//     localStorage.removeItem('accessToken');
//     sessionStorage.removeItem('accessToken');
//     this.setState({
//       authenticated: false,
//       currentUser: null,
//       justLoggedOut: true,
//     });
//     // window.location.reload();
//     // console.log("Successfully logged out!");
//   }

//   componentDidMount() {
//     this.setState({
//       justLoggedOut: false,
//     })
//     this.loadCurrentlyLoggedInUser();
//   }

//   changeSymbol(symbol) {
//     this.setState({ symbol: symbol });
//     localStorage.setItem('symbol', symbol);
//   }

//   render() {
//     const { classes } = this.props;
//     if (this.state.loading) {
//       return <LoadingIndicator />
//     }
//     return (
//       <div className={classes.root}>
//         <CssBaseline />
//         <Container component="main" className={classes.main} maxWidth="xl">
//           <Grid container spacing={0}>
//             <Grid container>
//               <Grid item xs>
//                 <PrimarySearchAppBar authenticated={this.state.authenticated} onLogout={this.handleLogout} onSearch={this.changeSymbol} />
//               </Grid>
//             </Grid>

//             { this.state.justLoggedOut && <AlertMessage message={"Successfully logged out!"} severity={"success"} /> }

//             <Switch>
//                 <Route exact path="/" render={(props) => <StockView symbol={this.state.symbol} authenticated={this.state.authenticated} {...props} />}></Route>
//                 <Route path="/login"
//                   render={(props) => <SignIn authenticated={this.state.authenticated} {...props} />}>
//                 </Route>
//                 <Route path="/signup"
//                   render={(props) => <SignUp authenticated={this.state.authenticated} {...props} />}>
//                 </Route>
//                 <PrivateRoute path="/profile" authenticated={this.state.authenticated} initialized={this.state.initialized} currentUser={this.state.currentUser}
//                   component={Profile}>
//                 </PrivateRoute>
//                 <Route component={NotFound}></Route>
//             </Switch>
//           </Grid>
//         </Container>
//         <footer className={classes.footer}>
//           <Container maxWidth="xl">
//             <Typography variant="body1" style={{color: "#ffffff", fontStyle: "italic"}}>Learn. Try. Trust. Lumine.</Typography>
//             <Typography variant="body2" style={{color: "#dddddd"}}>
//               {`Copyright © HL ${new Date().getFullYear()}.`}
//             </Typography>
//           </Container>
//         </footer>
//       </div>
//     );
//   }
// }

// export default withStyles(useStyles)(App);
