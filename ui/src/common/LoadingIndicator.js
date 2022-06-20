import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import LinearProgress from '@material-ui/core/LinearProgress';

const useStyles = makeStyles((theme) => ({
  root: {
    width: '100%',
    '& > * + *': {
      marginTop: theme.spacing(2),
    },
  },
  bar: {
    backgroundColor: theme.palette.secondary.main
  },
}));

export default function LoadingIndicator() {
  const classes = useStyles();

  return (
    <div className={classes.root}>
      <LinearProgress classes={{ bar: classes.bar }} />
    </div>
  );
}
