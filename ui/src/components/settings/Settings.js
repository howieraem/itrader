import React from "react";
// import Box from "@material-ui/core/Box";
import Container from "@material-ui/core/Container";
import Grid from "@material-ui/core/Grid";
import Profile from "./Profile";
import PasswordSetting from "./Password";
import {makeStyles} from "@material-ui/core/styles";

const useStyles = makeStyles(theme => ({
  container: {
    paddingTop: theme.spacing(4),
    paddingBottom: theme.spacing(4),
  },
}));

export default function Settings(props) {
  const classes = useStyles();

  return (
    <Container maxWidth="lg" className={classes.container}>
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
          {/*<Box sx={{ pt: 3 }}>*/}
            <PasswordSetting />
          {/*</Box>*/}
        </Grid>
      </Grid>
    </Container>
  );
}