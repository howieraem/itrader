import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import Avatar from "@material-ui/core/Avatar";
import Drawer from "@material-ui/core/Drawer";
import Divider from "@material-ui/core/Divider";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemText from "@material-ui/core/ListItemText";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import Typography from "@material-ui/core/Typography";
import DashboardIcon from '@material-ui/icons/Dashboard';
import ExitToAppIcon from '@material-ui/icons/ExitToApp';
import FormatListBulletedIcon from '@material-ui/icons/FormatListBulleted';
import HistoryIcon from "@material-ui/icons/History";
import SettingsIcon from '@material-ui/icons/Settings';

const useStyles = makeStyles(theme => ({
  drawerPaper: {
    width: 160,
  },
  drawerPaperAuthed: {
    width: 220,
  },
  drawerContainer: {
    overflow: 'auto',
  },
  toolbar: theme.mixins.toolbar,
}));

export default function DrawerMenu({open, onClose, authenticated, curUser, onLogout}) {
  const classes = useStyles();

  const drawer = (
    <div className={classes.drawerContainer}>
      { authenticated ? (
        <>
          <div className={classes.toolbar}>
            <List style={{ padding: 0 }}>
              <ListItem style={{ paddingTop: 2, paddingBottom: 2 }}>
                <ListItemIcon src={curUser.avatar}>
                  <Avatar src={curUser.avatar} style={{ minHeight: 50, minWidth: 50 }} />
                </ListItemIcon>
                <ListItemText primary={curUser.username} secondary={curUser.email} style={{ paddingLeft: 5 }} />
              </ListItem>
            </List>
          </div>
          <Divider />
          <List>
            <ListItem button key="dashboard" component="a" href="/dashboard">
              <ListItemIcon>
                <DashboardIcon />
              </ListItemIcon>
              <ListItemText primary="Dashboard" />
            </ListItem>
            <ListItem button key="watchlist" component="a" href="/watchlist">
              <ListItemIcon>
                <FormatListBulletedIcon />
              </ListItemIcon>
              <ListItemText primary="Watchlist" />
            </ListItem>
            <ListItem button key="tradehistory" component="a" href="/trades">
              <ListItemIcon>
                <HistoryIcon />
              </ListItemIcon>
              <ListItemText primary="Recent Trades" />
            </ListItem>
          </List>
          <Divider />
          <List>
            <ListItem button key="settings" component="a" href="/settings">
              <ListItemIcon>
                <SettingsIcon />
              </ListItemIcon>
              <ListItemText primary="Settings" />
            </ListItem>
            <ListItem button key="signout" onClick={onLogout}>
              <ListItemIcon>
                <ExitToAppIcon />
              </ListItemIcon>
              <ListItemText primary="Sign out" />
            </ListItem>
          </List>
        </>
      ) : (
        <>
          <div className={classes.toolbar}>
            <Typography color="primary" variant="h5" align="center" style={{ paddingTop: 10 }}>
              Welcome!
            </Typography>
          </div>
          <Divider />
          <List>
            <ListItem button key="signin" component="a" href="/login">
              <ListItemText primary="Sign in" />
            </ListItem>
            <ListItem button key="signup" component="a" href="/signup">
              <ListItemText primary="Sign up" />
            </ListItem>
          </List>
        </>
      ) }
    </div>
  );

  return (
    <Drawer
      variant="temporary"
      anchor="right"
      open={open}
      onClose={onClose}
      classes={{
        paper: authenticated ? classes.drawerPaperAuthed : classes.drawerPaper
      }}
      ModalProps={{
        keepMounted: true // Better open performance on mobile.
      }}
    >
      {drawer}
    </Drawer>
  );
}