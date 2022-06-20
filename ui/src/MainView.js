import React from 'react'
import { useHistory } from 'react-router-dom';
import Container from '@material-ui/core/Container';
import CssBaseline from '@material-ui/core/CssBaseline';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';
import AlertMessage from './common/SnackbarAlert';
import LoadingIndicator from './common/LoadingIndicator';
import NavBar from './components/bar/NavBar';
import Routes from './Routes';
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
    marginLeft: 0,
    marginRight: 0,
    padding: 0,
  },
  footer: {
    padding: theme.spacing(3, 2),
    paddingRight: 0,
    marginTop: 'auto',
    backgroundColor: theme.palette.type === 'light' ?
      theme.palette.primary.main : theme.palette.primary.dark,
  },
}));

export default function MainView() {
  const classes = useStyles();

  const [initialized, setInitialized] = React.useState(false);
  const [loading, setLoading] = React.useState(false);
  const [symbol, setSymbol] = React.useState(sessionStorage.getItem('symbol') || 'TSLA');
  const [authenticated, setAuthenticated] = React.useState(false);
  const [curUser, setCurUser] = React.useState(null);
  const [justLoggedOut, setJustLoggedOut] = React.useState(false);

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
    <div className={classes.root}>
      <CssBaseline />
      <NavBar authenticated={authenticated} curUser={curUser} onLogout={handleLogout} onSearch={changeSymbol} />
      <Container component="main" className={classes.main} maxWidth="xl">

        { justLoggedOut && <AlertMessage message={"Successfully logged out!"} severity={"success"} /> }

        <Routes
          initialized={initialized}
          symbol={symbol}
          authenticated={authenticated}
          curUser={curUser}
          changeSymbol={changeSymbol}
          handleLogout={handleLogout}
        />
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
