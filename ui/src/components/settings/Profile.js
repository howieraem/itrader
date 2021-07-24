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
import {makeStyles} from "@material-ui/core/styles";

const useStyles = makeStyles(theme => ({
  profileAvatar: {
    minWidth: "100px",
    minHeight: "100px"
  },
}));

const Profile = (props) => {
  const { currentUser } = props;
  const classes = useStyles();

  return (
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
            variant="h3"
          >
            {currentUser.email}
          </Typography>
        </Box>
      </CardContent>
      <Divider />
      <CardActions>
        <Button
          color="primary"
          fullWidth
          variant="text"
          style={{ textTransform: 'none' }}
        >
          Change profile picture
        </Button>
      </CardActions>
    </Card>
  )
};

export default Profile;
