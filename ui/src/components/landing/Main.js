import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Container from '@material-ui/core/Container';
import Hero from './Hero';
import Feats from './Feats';

const useStyles = makeStyles((theme) => ({
  container: {
    paddingTop: theme.spacing(4),
    paddingBottom: theme.spacing(4),
  },
}));

export default function MainFeaturedPost(props) {
  const classes = useStyles();

  return (
    <Container maxWidth="md" className={classes.container}>
      <Hero />
      <Feats />
    </Container>
  );
}
