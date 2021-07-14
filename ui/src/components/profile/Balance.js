import React from 'react';
import Avatar from '@material-ui/core/Avatar';
import Box from "@material-ui/core/Box";
// import Link from '@material-ui/core/Link';
import { makeStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import Title from './Title';


const useStyles = makeStyles(theme => ({
  profileInfo: {
    align: "center",
    textAlign: "center",
    horizontalAlign: "middle",
    margin: theme.spacing(2, 0, 2),
  },
  profileAvatar: {
    justifyContent: "center",
    justifyItems: "center",
    minWidth: "100px",
    minHeight: "100px"
  },
}));

export default function Balance(props) {
  const classes = useStyles();
  return (
    <React.Fragment>
      <div className={classes.profileInfo}>
        <Box
          display="flex"
          justifyContent="center"
          alignItems="center"
        >
          <Avatar className={classes.profileAvatar} />
        </Box>
        
        <Title>{props.currentUser.username}</Title>

        <Title>Cash</Title>
        <Typography component="p" variant="h4">
          ${props.currentUser.balance.toFixed(2)}
        </Typography>
      </div>
    </React.Fragment>

  );
}
