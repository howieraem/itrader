import React from 'react';
import clsx from 'clsx';
import { makeStyles } from '@material-ui/core/styles';
import CssBaseline from '@material-ui/core/CssBaseline';
import Container from '@material-ui/core/Container';
import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';
// import Chart from './Chart';
import Balance from './Balance';
import Trades from './Trades';
import Portfolio from './Portfolio';
import Watchlist from './WatchlistVertical';

const useStyles = makeStyles((theme) => ({
  content: {
    flexGrow: 1,
    height: '80vh',
    overflow: 'auto',
  },
  container: {
    paddingTop: theme.spacing(4),
    paddingBottom: theme.spacing(4),
  },
  paper: {
    padding: theme.spacing(2),
    display: 'flex',
    overflowY: 'auto',
    flexDirection: 'column',
  },
  fixedHeight: {
    height: 288,
  },
}));

export default function Profile(props) {
  const classes = useStyles();
  const fixedHeightPaper = clsx(classes.paper, classes.fixedHeight);

  return (
    <Grid container>
      <CssBaseline />
      <main className={classes.content}>
        <Container maxWidth="xl" className={classes.container}>
          <Grid container spacing={5}>
            <Grid item xs={12} md={4} lg={3} xl={3}>
              <Paper className={fixedHeightPaper}>
                <Balance {...props} />
              </Paper>
            </Grid>

            <Grid item xs={12} md={8} lg={9} xl={9}>
              <Paper className={fixedHeightPaper}>
                <Watchlist />
              </Paper>
            </Grid>

            <Grid item xs={12}>
              <Paper className={classes.paper}>
                <Portfolio {...props} />
              </Paper>
            </Grid>

            <Grid item xs={12}>
              <Paper className={classes.paper}>
                <Trades />
              </Paper>
            </Grid>
          </Grid>
        </Container>
      </main>
    </Grid>
  );
}
