import React from 'react';
import Grid from '@material-ui/core/Grid';
import Button from '@material-ui/core/Button';
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles((theme) => ({
  pageNotFound: {
    maxWidth: '500px',
    margin: '0 auto',
    marginTop: '50px',
    padding: '40px',
    // border: '1px solid #c8c8c8', 
    textAlign: 'center',
  },
  title: {
    fontSize: '60px',
    letterSpacing: '10px',
    marginBottom: '10px',
    color: theme.palette.primary.main,
  },
  desc: {
    fontSize: '20px',
    marginBottom: '20px',
  },
  homeButton: {
    textTransform: 'none', 
    fontSize: 18, 
    backgroundColor: theme.palette.primary.main,
    color: "white",
    '&:hover': {
      backgroundColor: theme.palette.primary.light,
      color: "white",
    },
  }
}));

export default function NotFound() {
  const classes = useStyles();
  return (
    <Grid container spacing={0}>
      <Grid item xs>
        <div className={classes.pageNotFound}>
          <h1 className={classes.title}>
              404
          </h1>
          <div className={classes.desc}>
              The page was not found.
          </div>
          <Button 
              href="/"
              variant="contained"
              className={classes.homeButton}
          >
            Home Page
          </Button>
        </div>
      </Grid>
    </Grid>
  );
}
