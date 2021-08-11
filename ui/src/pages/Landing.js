import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import Container from "@material-ui/core/Container";
import Hero from "../components/landing/Hero";
import Feats from "../components/landing/Feats";
import Instructions from "../components/landing/Instructions";
import Background from '../common/Background';

const useStyles = makeStyles((theme) => ({
  heroContent: {
    padding: theme.spacing(8, 0, 6),
    backgroundColor:"transparent",
    position:"relative",
  },
}));

export default function Landing() {
  const classes = useStyles();
  return (
    <>
      <div className={classes.heroContent}>
        <Hero />
        <Background num={100} />
      </div>
      <Container maxWidth="lg">
        <Feats />
        <Instructions />
      </Container>
    </>
  );
}
