import React from "react";
import { withWidth } from "@material-ui/core";
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

function Landing({ width }) {
  const classes = useStyles();
  const isScreenSmall = /xs|sm/.test(width);
  return (
    <>
      <div className={classes.heroContent}>
        <Hero />
        <Background num={isScreenSmall ? 60 : 80} />
      </div>
      <Container maxWidth="lg">
        <Feats />
        <Instructions />
      </Container>
    </>
  );
}

export default withWidth()(Landing);