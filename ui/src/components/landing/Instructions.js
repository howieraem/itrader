import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import Container from '@material-ui/core/Container';
// import Button from '@material-ui/core/Button';
import Paper from "@material-ui/core/Paper";
import Typography from '@material-ui/core/Typography';
import { COLORS } from "../../common/Theme";

const useStyles = makeStyles(theme => ({
  root: {
    display: 'flex',
    backgroundColor: 'white',
    overflow: 'hidden',
  },
  container: {
    marginTop: theme.spacing(10),
    marginBottom: theme.spacing(15),
    position: 'relative',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  item: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    padding: theme.spacing(0, 5),
  },
  title: {
    marginBottom: theme.spacing(8),
  },
  number: {
    fontSize: 24,
    fontFamily: theme.typography.fontFamily,
    color: COLORS[1],
    fontWeight: theme.typography.fontWeightMedium,
  },
  image: {
    height: 55,
    marginTop: theme.spacing(4),
    marginBottom: theme.spacing(4),
  },
  button: {
    marginTop: theme.spacing(8),
  },
}));

const instructions = [
  <>
    <a href="/signup">Sign up</a> for free, or <a href="/login">sign in</a> if you have an account
  </>,
  "Find a stock by searching on the top navigation bar",
  // "View the stock's charts and statistics",
  // "Add the stock to watchlist, or remove it from the watchlist",
  "Click on the \"Trade\" button, then confirm the details",
  "View your watchlist, portfolio and trades on the dashboard",
]

function Instructions() {
  const classes = useStyles();
  return (
    <section id="instructions">
      <Paper className={classes.root}>
        <Container className={classes.container}>
          <Typography variant="h4" marked="center" className={classes.title} component="h2">
            How it works
          </Typography>
          <div>
            <Grid container spacing={5}>
              {instructions.map((instruction, i) => (
                <Grid item xs={12} md={6} lg={3}>
                  <div className={classes.item}>
                    <div className={classes.number}>{i + 1}.</div>
                    {/*<img*/}
                    {/*  src=`/static/instructions/${i}.svg`*/}
                    {/*  alt=`instruction${i}`*/}
                    {/*  className={classes.image}*/}
                    {/*/>*/}
                    <Typography variant="h6" align="center">
                      {instruction}
                    </Typography>
                  </div>
                </Grid>
              ))}
            </Grid>
          </div>
        </Container>
      </Paper>
    </section>
  );
}

export default Instructions;
