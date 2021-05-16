import React from 'react';
import Button from '@material-ui/core/Button';
import CssBaseline from '@material-ui/core/CssBaseline';
import TextField from '@material-ui/core/TextField';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Checkbox from '@material-ui/core/Checkbox';
import Link from '@material-ui/core/Link';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';
import Container from '@material-ui/core/Container';
import { withStyles } from '@material-ui/styles';
import { Redirect } from 'react-router-dom';
import { ACCESS_TOKEN } from '../../constants';
import { login } from '../../utils/APIUtils';


const useStyles = makeStyles((theme) => ({
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
    margin: theme.spacing(3, 0, 2),
  },
}));

class SignIn extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
        email: '',
        password: ''
    };
    this.handleInputChange = this.handleInputChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  componentDidMount() {
    if (this.props.location.state && this.props.location.state.error) {
        setTimeout(() => {
            console.log(this.props.location.state.error);
            // Alert.error(this.props.location.state.error, {
            //     timeout: 5000
            // });
            this.props.history.replace({
                pathname: this.props.location.pathname,
                state: {}
            });
        }, 100);
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

  handleSubmit(event) {
      event.preventDefault();   

      const loginRequest = Object.assign({}, this.state);

      login(loginRequest)
      .then(response => {
          localStorage.setItem(ACCESS_TOKEN, response.accessToken);
          console.log("successfully logged in");
          // Alert.success("You're successfully logged in!");
          this.props.history.push("/");
          window.location.reload();
      }).catch(error => {
          console.log(error.message);
          // Alert.error((error && error.message) || 'Oops! Something went wrong. Please try again!');
      });
  }

  render() {
    if (this.props.authenticated) {
      return <Redirect
          to={{
          pathname: "/",
          state: { from: this.props.location }
      }}/>;            
    }
    const { classes } = this.props;
    return (
      <Grid item xs={12}>
        <Container component="main" maxWidth="xs">
          <CssBaseline />
          <Grid item xs={12} style={{ minHeight: "10vh" }}></Grid>
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
              />
              <Button
                type="submit"
                fullWidth
                variant="contained"
                color="primary"
                className={classes.submit}
                style={{textTransform: 'none', background: '#005480'}}
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
        <Grid item xs={12} style={{ minHeight: "5vh" }}></Grid>
      </Grid>
      
    );
  }
}

export default withStyles(useStyles)(SignIn);