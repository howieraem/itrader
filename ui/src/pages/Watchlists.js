import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Container from '@material-ui/core/Container';
import Paper from '@material-ui/core/Paper';
import Watchlist from "../components/dashboard/Watchlist";

const useStyles = makeStyles((theme) => ({
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
}));

export default function Watchlists({ onSymbolClick }) {
  const classes = useStyles();

  return (
    <Container maxWidth="xl" className={classes.container}>
      <Paper className={classes.paper}>
        <Watchlist onSymbolClick={onSymbolClick} />
      </Paper>
    </Container>
  );
}
