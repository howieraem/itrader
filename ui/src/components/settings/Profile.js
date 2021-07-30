import React, { useState } from "react";
import {
  Avatar,
  Box,
  Button,
  Card,
  CardActions,
  CardContent,
  Divider,
  Typography
} from '@material-ui/core';
import { makeStyles } from "@material-ui/core/styles";

const useStyles = makeStyles(theme => ({
  profileAvatar: {
    minWidth: "100px",
    minHeight: "100px"
  },
}));

const Profile = (props) => {
  const { currentUser } = props;
  const classes = useStyles();
  const [avatarFile, setAvatarFile] = useState(null);

  const handleAvatarInput = (ev) => {
    setAvatarFile(ev.target.files[0]);
  }

  return (
    <>
      <Card {...props}>
        <CardContent>
          <Box
            alignItems="center"
            display="flex"
            flexDirection="column"
          >
            <Avatar
              src={currentUser.avatar}
              className={classes.profileAvatar}
            />
            <Typography
              color="textPrimary"
              gutterBottom
              variant="h3"
            >
              {currentUser.username}
            </Typography>
            <Typography
              color="textPrimary"
              gutterBottom
              variant="h5"
            >
              {currentUser.email}
            </Typography>
          </Box>
        </CardContent>
        <Divider />
        <CardActions>
          <input
            accept="image/*"
            hidden
            id="button-file"
            type="file"
            onChange={handleAvatarInput}
          />
          <label
            htmlFor="button-file"
            style={{ width: "100%" }}
          >
            <Button
              color="primary"
              fullWidth
              variant="text"
              component="span"
              style={{ textTransform: 'none' }}
            >
              Change profile picture
            </Button>
          </label>
        </CardActions>
      </Card>
    </>
  )
};

export default Profile;
