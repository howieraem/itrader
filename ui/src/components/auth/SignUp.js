import React from 'react';
import Button from '@material-ui/core/Button';
import CssBaseline from '@material-ui/core/CssBaseline';
import TextField from '@material-ui/core/TextField';
import Link from '@material-ui/core/Link';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import { makeStyles, withStyles } from '@material-ui/core/styles';
import Container from '@material-ui/core/Container';
import { Redirect } from 'react-router-dom';
import { signup } from '../../utils/APIUtils';
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
        pin: '',
    }
    this.handleInputChange = this.handleInputChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
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

    const signUpRequest = Object.assign({}, this.state);

    signup(signUpRequest)
    .then(response => {
      console.log("successfully registered!");
      // Alert.success("You're successfully registered. Please login to continue!");
      this.props.history.push("/login");
    }).catch(error => {
      console.log(error.message);
      // Alert.error((error && error.message) || 'Oops! Something went wrong. Please try again!');
    });
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
                onChange={this.handleInputChange}
              />
              <TextField
                variant="outlined"
                margin="normal"
                required
                fullWidth
                name="pin"
                label="Trading PIN (4-digit)"
                type="password"
                id="pin"
                onChange={this.handleInputChange}
              />
              <TextField
                variant="outlined"
                margin="normal"
                required
                fullWidth
                name="username"
                label="Username"
                type="username"
                id="username"
                onChange={this.handleInputChange}
              />
              <Button
                type="submit"
                fullWidth
                variant="contained"
                // color="primary"
                className={classes.submit}
                onClick={this.handleSubmit}
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
      
    );
  }
}

export default withStyles(useStyles)(SignIn);