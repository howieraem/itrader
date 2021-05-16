import React from 'react';
// import Link from '@material-ui/core/Link';
import { makeStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import Title from './Title';

// function preventDefault(event) {
//   event.preventDefault();
// }

const useStyles = makeStyles({
  profileInfo: {
    align: "center",
    textAlign: "center"
  },
  profileAvatar: {
    horizontalAlign: "middle",
    borderRadius: "50%",
    maxWidth: "160px"
  },
  textAvatar: {
    width: "120px",
    height: "120px",
    margin: "0 auto",
    marginLeft: "50px",
    verticalAlign: "middle",
    textAlign: "center",
    borderRadius: "50%",
    background: "#005480",
  },
  textAvatarSpan: {
    lineHeight: "120px",
    color: "#ffffff",
    fontSize: "3em"
  }
});

export default function Balance(props) {
  const classes = useStyles();
  return (
    <React.Fragment>
      <div className={classes.profileInfo}>
        <div className={classes.profileAvatar}>
          {
            <div className={classes.textAvatar}>
              <span className={classes.textAvatarSpan}>{props.currentUser.email[0]}</span>
            </div>
          }
        </div>
        <Title>{props.currentUser.email}</Title>
      </div>
      <Title>Current Balance</Title>
      <Typography component="p" variant="h4">
        $5000.00
      </Typography>
    </React.Fragment>
  );
}
