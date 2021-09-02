import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import Container from "@material-ui/core/Container";
import Grid from "@material-ui/core/Grid";
import ChartSettings from "../components/settings/ChartSettings";
import PasswordSetting from "../components/settings/Password";
import Profile from "../components/settings/Profile";

const useStyles = makeStyles(theme => ({
  container: {
    paddingTop: theme.spacing(4),
    paddingBottom: theme.spacing(4),
  },
}));

export default function Settings(props) {
  const classes = useStyles();

  return (
    <Container maxWidth="md" className={classes.container}>
      <Grid
        container
        spacing={3}
      >
        <Grid
          item
          lg={4}
          md={6}
          xs={12}
        >
          <Profile {...props} />
        </Grid>
        <Grid
          item
          lg={8}
          md={6}
          xs={12}
        >
          <PasswordSetting {...props} />
        </Grid>
        <Grid
          item
          xs={12}
        >
          <ChartSettings {...props} />
        </Grid>
      </Grid>
    </Container>
  );
}