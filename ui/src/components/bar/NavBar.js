import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Box from '@material-ui/core/Box';
import Button from '@material-ui/core/Button';
import Toolbar from '@material-ui/core/Toolbar';
import IconButton from '@material-ui/core/IconButton';
import Typography from '@material-ui/core/Typography';
import MenuIcon from "@material-ui/icons/Menu";
import Search from './Search';
import DrawerMenu from "./DrawerMenu";

const useStyles = makeStyles((theme) => ({
  bar: {
    backgroundColor: theme.palette.type === 'light' ?
      theme.palette.primary.main : theme.palette.primary.dark
  },
  barButton: {
    textTransform: 'none',
    fontSize: 17,
  },
  iconButton: {
    background: theme.palette.type === 'light' ?
      theme.palette.primary.main : theme.palette.primary.dark,
    textTransform: 'none', 
    alignItems: 'center',
    '&:hover': {
      backgroundColor: theme.palette.type === 'light' ?
        theme.palette.primary.main : theme.palette.primary.dark,
    },
  },
  grow: {
    flexGrow: 1,
  },
  title: {
    color: 'white',
    textDecoration: 'none',
    display: 'none',
    [theme.breakpoints.up('md')]: {
      display: 'block',
    },
  },
  sectionDesktop: {
    display: 'none',
    [theme.breakpoints.up('md')]: {
      display: 'flex',
    },
  },
  sectionMobile: {
    display: 'flex',
    [theme.breakpoints.up('md')]: {
      display: 'none',
    },
  },
  menuIcon: {
    minWidth: 30,
    minHeight: 30
  }
}));

export default function NavBar(props) {
  const { authenticated, curUser, onLogout, onSearch } = props;
  const classes = useStyles();
  const [drawerOpen, setDrawerOpen] = React.useState(false);

  const handleDrawerToggle = () => {
    setDrawerOpen(!drawerOpen);
  };

  return (
    <div>
      <AppBar className={classes.bar}>
        <Toolbar>
          <Button
            aria-label="home"
            href="/"
            color="inherit"
            m={2}
            className={classes.iconButton}
            disableRipple={true}
          >
            <img alt="Logo" src="/logo_small.png" />
          </Button>
          <Typography component="a" href="/" className={classes.title} variant="h5" noWrap>
            ITrader
          </Typography>

          <div className={classes.grow} />
          <Search onSearch={onSearch} />
          <div className={classes.grow} />

          <div className={classes.sectionDesktop}>
            { authenticated ? (
              <IconButton
                color="inherit"
                aria-label="Open drawer"
                edge="end"
                onClick={handleDrawerToggle}
              >
                <MenuIcon className={classes.menuIcon} />
              </IconButton>
            ) : (
              <>
                <Box ml={2}>
                  <Button
                    aria-label="login"
                    href="/login"
                    color="inherit"
                    className={classes.barButton}
                  >
                    Sign in
                  </Button>
                </Box>
                <Box ml={2}>
                  <Button
                    aria-label="signup"
                    href="/signup"
                    color="inherit"
                    className={classes.barButton}
                    style={{border: '1px solid'}}
                  >
                    Sign up
                  </Button>
                </Box>
              </>
            )}
          </div>

          <div className={classes.sectionMobile}>
            <IconButton
              color="inherit"
              aria-label="Open drawer"
              edge="end"
              onClick={handleDrawerToggle}
            >
              <MenuIcon className={classes.menuIcon} />
            </IconButton>
          </div>
        </Toolbar>
      </AppBar>
      <DrawerMenu
        open={drawerOpen}
        onClose={handleDrawerToggle}
        authenticated={authenticated}
        curUser={curUser}
        onLogout={() => {
          onLogout();
          setDrawerOpen(false);
        }}
      />
    </div>
  );
};
