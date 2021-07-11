import React from 'react';
import Button from '@material-ui/core/Button';
import CssBaseline from '@material-ui/core/CssBaseline';
import TextField from '@material-ui/core/TextField';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Checkbox from '@material-ui/core/Checkbox';
import Link from '@material-ui/core/Link';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import { makeStyles, withStyles } from '@material-ui/core/styles';
import Container from '@material-ui/core/Container';
import { Redirect } from 'react-router-dom';
import { login } from '../../utils/APIUtils';
import { COLOR_PRIMARY } from '../../common/Theme';


const useStyles = (theme) => ({
  paper: {
    marginTop: theme.spacing(8),
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
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
    background: COLOR_PRIMARY, 
    color: 'white',
    margin: theme.spacing(3, 0, 2),
  },
});

class SignIn extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      email: '',
      password: '',
      rememberMe: false,
    };
    this.handleInputChange = this.handleInputChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleChecked = this.handleChecked.bind(this);
  }

  componentDidMount(){
    if (this.props.authenticated) {
      this.props.history.push("/")
    }
  }

  componentDidUpdate(){
    if (this.props.authenticated) {
      this.props.history.push("/")
    }
  }

  handleInputChange(event) {
    const target = event.target;
    const inputName = target.name;        
    const inputValue = target.value;

    this.setState({
      [inputName] : inputValue
    });        
  }

  handleChecked = event => {
    this.setState({ rememberMe: event.target.checked });
  }

  handleSubmit(event) {
    event.preventDefault();   

    const loginRequest = Object.assign({}, this.state);

    login(loginRequest)
    .then(response => {
      if (this.state.rememberMe) {
        localStorage.setItem('accessToken', response.accessToken);
      } else {
        sessionStorage.setItem('accessToken', response.accessToken);
      }

      // console.log("Successfully logged in!");
      this.props.history.push("/");
      this.props.history.go();
      // window.location.reload()
    }).catch(error => {
      // console.log((error && error.message) || 'Oops! Something went wrong. Please try again!');
    });
  }

  render() {
    if (this.props.authenticated) {
      return <Redirect
        to={{
          pathname: "/",
          state: { from: this.props.location }
        }}
      />;            
    }
    const { classes } = this.props;
    return (
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
                onChange={this.handleInputChange}
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
                onChange={this.handleInputChange}
              />
              <FormControlLabel
                control={<Checkbox value="remember" color="primary" />}
                label="Remember me"
                onChange={this.handleChecked}
              />
              <Button
                type="submit"
                fullWidth
                variant="contained"
                className={classes.submit}
                onClick={this.handleSubmit}
              >
                Sign In
              </Button>
              <Grid container>
                <Grid item xs style={{marginTop: "5px"}}>
                  <Link href="/forgot" variant="body2">
                    Forgot password?
                  </Link>
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
    );
  }
}

export default withStyles(useStyles)(SignIn);