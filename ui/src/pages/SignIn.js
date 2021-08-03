import React from 'react';
import { Helmet } from "react-helmet";
import { Redirect } from 'react-router-dom';
import { makeStyles } from '@material-ui/core/styles';
import { Alert } from "@material-ui/lab";
import Button from '@material-ui/core/Button';
import Checkbox from '@material-ui/core/Checkbox';
import Container from '@material-ui/core/Container';
import CssBaseline from '@material-ui/core/CssBaseline';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Grid from '@material-ui/core/Grid';
import Link from '@material-ui/core/Link';
import TextField from '@material-ui/core/TextField';
import Typography from '@material-ui/core/Typography';
import { login } from '../utils/API';
import Background from '../common/Background';
import { COLORS } from '../common/Theme';


const useStyles = makeStyles((theme) => ({
  paper: {
    marginTop: theme.spacing(8),
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    background: "rgba(255,255,255,0.3)",
  },
  avatar: {
    margin: theme.spacing(1),
    backgroundColor: theme.palette.secondary.main,
  },
  form: {
    width: '100%', // Fix IE 11 issue.
    marginTop: theme.spacing(1),
  },
  submit: {
    textTransform: 'none', 
    background: COLORS[0], 
    color: 'white',
    margin: theme.spacing(3, 0, 2),
  },
}));


export default function SignIn(props) {
  const { authenticated, history, location } = props;
  const [email, setEmail] = React.useState('');
  const [password, setPassword] = React.useState('');
  const [rememberMe, setRememberMe] = React.useState(false);
  const [alertMsg, setAlertMsg] = React.useState('');

  const classes = useStyles();

  const handleSubmit = (event) => {
    event.preventDefault();   

    const loginRequest = Object.assign({}, { email, password });

    login(loginRequest)
      .then(response => {
        if (rememberMe) {
          localStorage.setItem('accessToken', response.accessToken);
        } else {
          sessionStorage.setItem('accessToken', response.accessToken);
        }

        // console.log("Successfully logged in!");
        history.push("/dashboard");
        history.go();
      })
      .catch(err => {
        if (err instanceof Error) {
          setAlertMsg('Oops! Something went wrong. Please try again!');
        } else {
          setAlertMsg('Incorrect email or password.')
        }
      });
  }
  
  if (authenticated) {
    return <Redirect
      to={{
        pathname: "/dashboard",
        state: { from: location }
      }}
    />;            
  }
  return (
    <>
      <Helmet>
        <title>ITrader - Sign In</title>
      </Helmet>
      <Grid item xs={12}>
        <CssBaseline />
        <Container component="main" maxWidth="xs">
          <Grid item xs={12} style={{ minHeight: "10vh" }} />
          <div className={classes.paper}>
            <Typography component="h1" variant="h5">
              Sign in to ITrader
            </Typography>
            <form className={classes.form} noValidate>
              <TextField
                variant="outlined"
                margin="normal"
                required
                fullWidth
                id="email"
                label="Email Address"
                name="email"
                autoComplete="email"
                autoFocus
                onChange={(ev) => setEmail(ev.target.value)}
              />
              <TextField
                variant="outlined"
                margin="normal"
                required
                fullWidth
                name="password"
                label="Password"
                type="password"
                id="password"
                autoComplete="current-password"
                onChange={(ev) => setPassword(ev.target.value)}
              />
              <FormControlLabel
                control={<Checkbox value="remember" color="primary" />}
                label="Remember me"
                onChange={(ev) => setRememberMe(ev.target.checked)}
              />
              { alertMsg ? (
                <Alert severity="error" style={{ fontSize: "15px" }}>{alertMsg}</Alert>
              ) : null }
              <Button
                type="submit"
                fullWidth
                variant="contained"
                className={classes.submit}
                onClick={handleSubmit}
                disabled={!Boolean(email) || !Boolean(password)}
              >
                Sign In
              </Button>
              <Grid container>
                <Grid item xs style={{marginTop: "5px"}}>
                  {/* <Link href="/forgot" variant="body2">
                    Forgot password?
                  </Link> */}
                </Grid>
                <Grid item style={{marginTop: "5px"}}>
                  <Link href="/signup" variant="body2">
                    {"New user? Sign Up!"}
                  </Link>
                </Grid>
              </Grid>
            </form>
          </div>
        </Container>
        <Grid item xs={12} style={{ minHeight: "5vh" }} />
      </Grid>
      <Background num={100} />
    </>
  );
}
