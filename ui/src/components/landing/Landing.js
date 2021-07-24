import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import Container from "@material-ui/core/Container";
import Hero from "./Hero";
import Feats from "./Feats";
import Instructions from "./Instructions";
import Background from '../../common/Background';

const useStyles = makeStyles((theme) => ({
  container: {
    paddingTop: theme.spacing(4),
    paddingBottom: theme.spacing(4),
  },
}));

export default function Landing() {
  const classes = useStyles();
  return (
    <>
      <Container maxWidth="lg" className={classes.container}>
        <Hero />
        <Feats />
        <Instructions />
      </Container>
      <Background num={150} />
    </>
  );
}
