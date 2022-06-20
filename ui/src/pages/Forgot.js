import React from 'react';
import Grid from '@material-ui/core/Grid';
import Button from '@material-ui/core/Button';
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles((theme) => ({
  forgotPage: {
    maxWidth: '500px',
    margin: '0 auto',
    marginTop: '50px',
    padding: '40px',
    textAlign: 'center',
  },
  desc: {
    fontSize: '20px',
    marginBottom: '20px',
  },
  button: {
    textTransform: 'none', 
    fontSize: 18, 
    backgroundColor: theme.palette.secondary.main,
    color: "white",
    margin: theme.spacing(3, 2, 2),
    maxWidth: 150,
    minWidth: 150,
    '&:hover': {
      backgroundColor: theme.palette.secondary.light,
      color: "white",
    },
  }
}));

export default function Forgot() {
  const classes = useStyles();
  return (
    <Grid container spacing={0}>
      <Grid item xs>
        <div className={classes.forgotPage}>
          <div className={classes.desc}>
              Credential reset has not been implemented. Please register a new account.
          </div>
          <Button 
              href="/"
              variant="contained"
              className={classes.button}
          >
            Home Page
          </Button>
          <Button 
              href="/signup"
              variant="contained"
              className={classes.button}
          >
            Sign up
          </Button>
        </div>
      </Grid>
    </Grid>
  );
}
