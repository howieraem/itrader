import React from 'react';
import { Helmet } from "react-helmet";
import { Redirect } from 'react-router-dom';
import Button from '@material-ui/core/Button';
import CssBaseline from '@material-ui/core/CssBaseline';
import TextField from '@material-ui/core/TextField';
import Link from '@material-ui/core/Link';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';
import Container from '@material-ui/core/Container';
import { signup } from '../../utils/APIUtils';
import Background from '../../common/Background';
import { COLORS } from '../../common/Theme';


const useStyles = makeStyles((theme) => ({
  paper: {
    marginTop: theme.spacing(8),
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    background: "rgba(255, 255, 255, .3)",
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

export default function SignUp(props) {
  const classes = useStyles();
  const { authenticated, history, location } = props;
  
  const [email, setEmail] = React.useState('');
  const [password, setPassword] = React.useState('');
  const [password2, setPassword2] = React.useState('');
  // const [pin, setPin] = React.useState('');
  const [username, setUsername] = React.useState('');

  const [pwd2ErrMsg, setPwdErrMsg] = React.useState('');

  const checkPwdMatch = (ev) => {
    const pwd2 = ev.target.value;
    setPassword2(pwd2);
    if (pwd2 && pwd2 !== password) {
      setPwdErrMsg("Passwords must match!")
    } else {
      setPwdErrMsg("");
    }
  }

  const handleSubmit = (event) => {
    event.preventDefault();

    const signUpRequest = Object.assign({}, {
      email,
      password2,
      // pin,
      username,
    });

    signup(signUpRequest)
    .then(response => {
      console.log("successfully registered!");
      // Alert.success("You're successfully registered. Please login to continue!");
      history.push("/login");
    }).catch(error => {
      console.log(error.message);
      // Alert.error((error && error.message) || 'Oops! Something went wrong. Please try again!');
    });
  };

  React.useEffect(() => {
    if (location.state && location.state.error) {
      setTimeout(() => {
          console.log(location.state.error);
          // Alert.error(location.state.error, {
          //     timeout: 5000
          // });
          history.replace({
              pathname: location.pathname,
              state: {}
          });
      }, 100);
    }
  }, [history, location]);

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
        <title>ITrader - Sign Up</title>
      </Helmet>
      <Grid item xs={12}>
        <CssBaseline />
        <Container component="main" maxWidth="xs">
          <Grid item xs={12} style={{ minHeight: "10vh" }} />
          <div className={classes.paper}>
            <Typography component="h1" variant="h5">
              Sign up with ITrader
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
                onChange={(ev) => setPassword(ev.target.value)}
              />
              <TextField
                variant="outlined"
                margin="normal"
                required
                fullWidth
                name="password2"
                label="Confirm Password"
                type="password"
                id="password2"
                error={Boolean(pwd2ErrMsg)}
                helperText={pwd2ErrMsg}
                onChange={(ev) => checkPwdMatch(ev)}
              />
              {/* <TextField
                variant="outlined"
                margin="normal"
                required
                fullWidth
                name="pin"
                label="Trading PIN (4-digit)"
                type="password"
                id="pin"
                onChange={(ev) => setPin(ev.target.value)}
              /> */}
              <TextField
                variant="outlined"
                margin="normal"
                required
                fullWidth
                name="username"
                label="Username"
                type="username"
                id="username"
                onChange={(ev) => setUsername(ev.target.value)}
              />
              <Button
                type="submit"
                fullWidth
                variant="contained"
                className={classes.submit}
                onClick={handleSubmit}
                disabled={Boolean(pwd2ErrMsg) || !Boolean(email) || !Boolean(username)}
              >
                Sign Up
              </Button>
              <Grid container justify="flex-end">
                <Grid item style={{marginTop: '5px'}}>
                  <Link href="/login" variant="body2">
                    Already have an account? Sign in!
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
