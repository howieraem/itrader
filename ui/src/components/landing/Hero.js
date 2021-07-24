import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import Grid from '@material-ui/core/Grid';
import DoubleArrowIcon from '@material-ui/icons/DoubleArrow';
import { COLORS } from '../../common/Theme';

const useStyles = makeStyles((theme) => ({
  main: {
    flexGrow: 1,
    background: "rgba(255, 255, 255, .3)",
    position: 'relative',
    marginBottom: theme.spacing(2),
  },
  content: {
    position: 'relative',
    padding: theme.spacing(3),
    [theme.breakpoints.up('md')]: {
      padding: theme.spacing(6),
      paddingRight: 0,
    },
  },
  button: {
    textTransform: 'none', 
    fontSize: 18, 
    backgroundColor: COLORS[1], 
    color: "white",
    [theme.breakpoints.down('md')]: {
      marginLeft: theme.spacing(3),
    },
    marginBottom: theme.spacing(5),
    maxWidth: 230,
    minWidth: 230,
    '&:hover': {
      backgroundColor: COLORS[1],
      color: "white",
    },
  }
}));

const content = {
  title: "Paper trading made easy.",
  description: "ITrader is a platform for viewing stocks and simulating trades with real market prices."
}

export default function Hero() {
  const classes = useStyles();
  return (
    <Paper className={classes.main}>
      <Grid container>
        <Grid item md={1} />
        <Grid item md={10}>
          <div className={classes.content}>
            <Typography component="h1" variant="h3" color="inherit" gutterBottom>
              {content.title}
            </Typography>
            <Typography variant="h5" color="inherit" paragraph>
              {content.description}
            </Typography>
          </div>
        </Grid>
        <Grid item md={1} />

        <Grid item md={2} />
        <Grid item md={8} align="center">
          <Button
            href='#instructions'
            className={classes.button}
            endIcon={<DoubleArrowIcon />}
          >
            Get started
          </Button>
        </Grid>
        <Grid item md={2} />
      </Grid>
    </Paper>
  );
}
