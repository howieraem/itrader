import React from 'react';
import { fade, withStyles } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import IconButton from '@material-ui/core/IconButton';
import Typography from '@material-ui/core/Typography';
import InputBase from '@material-ui/core/InputBase';
import MenuItem from '@material-ui/core/MenuItem';
import Menu from '@material-ui/core/Menu';
import SearchIcon from '@material-ui/icons/Search';
import MoreIcon from '@material-ui/icons/MoreVert';
// import Link from '@material-ui/core/Link';
import Button from '@material-ui/core/Button';
// import HomeIcon from '@material-ui/icons/Home';
import Avatar from '@material-ui/core/Avatar';
import AccountMenu from './AccountMenu';


const Clock = ({ date }) => (
  <div>{`${date.toDateString()} ${date.toLocaleTimeString()} UTC+${0 - date.getTimezoneOffset() / 60}`}</div>
)


const ClockMobile = ({ date }) => (
  <div>{`${date.toLocaleTimeString()} +${0 - date.getTimezoneOffset() / 60}`}</div>
)


const useStyles = theme => ({
  grow: {
    flexGrow: 1,
  },
  menuButton: {
    marginRight: theme.spacing(3),
  },
  title: {
    color: 'white',
    textDecoration: 'none',
    display: 'none',
    [theme.breakpoints.up('sm')]: {
      display: 'block',
    },
  },
  // titleMobile: {
  //   display: 'block',
  //   [theme.breakpoints.up('sm')]: {
  //     display: 'none',
  //   },
  // },
  search: {
    position: 'relative',
    borderRadius: theme.shape.borderRadius,
    backgroundColor: fade(theme.palette.common.white, 0.15),
    '&:hover': {
      backgroundColor: fade(theme.palette.common.white, 0.25),
    },
    marginRight: theme.spacing(2),
    marginLeft: 0,
    width: '46%',
    [theme.breakpoints.up('sm')]: {
      marginLeft: theme.spacing(3),
      width: 'auto',
    },
  },
  searchIcon: {
    padding: theme.spacing(0, 2),
    height: '100%',
    position: 'absolute',
    pointerEvents: 'none',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  inputRoot: {
    color: 'inherit',
  },
  inputInput: {
    padding: theme.spacing(1, 1, 1, 0),
    // vertical padding + font size from searchIcon
    paddingLeft: `calc(1em + ${theme.spacing(0)}px)`,
    transition: theme.transitions.create('width'),
    width: '80%',
    [theme.breakpoints.up('md')]: {
      width: '20ch',
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
});


class PrimarySearchAppBar extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      anchorEl: null,
      mobileMoreAnchorEl: null,
      date: new Date(),
    };
    this.handleMobileMenuOpen = this.handleMobileMenuOpen.bind(this);
    this.handleProfileMenuOpen = this.handleProfileMenuOpen.bind(this);
    this.handleMobileMenuClose = this.handleMobileMenuClose.bind(this);
    this.handleMenuClose = this.handleMenuClose.bind(this);
    this.interval = setInterval(
      () => this.setState({ date: new Date() }),
      1000
    )
  }

  handleProfileMenuOpen(event) {
    this.anchorEl = event.currentTarget;
  };

  handleMobileMenuOpen(event) {
    this.mobileMoreAnchorEl = event.currentTarget;
  };

  handleMobileMenuClose() {
    this.mobileMoreAnchorEl = null;
  };

  handleMenuClose() {
    this.anchorEl = null;
    this.handleMobileMenuClose();
  };

  componentWillUnmount() {
    clearInterval(this.interval)
  }

  render() {
    const {classes} = this.props;

    const isMenuOpen = Boolean(this.anchorEl);
    const isMobileMenuOpen = Boolean(this.mobileMoreAnchorEl);

    const menuId = 'primary-search-account-menu';
    const renderMenu = (
      <Menu
        anchorEl={this.anchorEl}
        anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
        id={menuId}
        keepMounted
        transformOrigin={{ vertical: 'top', horizontal: 'right' }}
        open={isMenuOpen}
        onClose={this.handleMenuClose}
      >
        <MenuItem component="a" href="/profile" onClick={this.handleMenuClose}>
          Details
        </MenuItem>
        <MenuItem component="a" href="/settings" onClick={this.handleMenuClose}>
          Settings
        </MenuItem>
      </Menu>
    );

    const mobileMenuId = 'primary-search-account-menu-mobile';
    const renderMobileMenu = (
      <Menu
        anchorEl={this.mobileMoreAnchorEl}
        anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
        id={mobileMenuId}
        keepMounted
        transformOrigin={{ vertical: 'top', horizontal: 'right' }}
        open={isMobileMenuOpen}
        onClose={this.handleMobileMenuClose}
        // If false and a vertical scroll bar exists , the popover will add padding to body
        MenuProps={{ disableScrollLock: true }}
      >
        {this.props.authenticated ? (
          <div>
            <MenuItem onClick={this.handleProfileMenuOpen}>Profile</MenuItem>
            <MenuItem onClick={this.props.onLogout}>Logout</MenuItem>
          </div>
        ) : (
          <div>
            <MenuItem component="a" href="/login">Login</MenuItem>
            <MenuItem component="a" href="/signup">Sign Up</MenuItem>
          </div>
        )}
      </Menu>
    );

    return (
      <div className={classes.grow}>
        <AppBar style={{ background: '#005480' }}>
          <Toolbar>
            {/* <div className={classes.grow} /> */}
            <Button 
              aria-label="home" 
              href="/"
              color="inherit"
              m={2}
              // className={classes.titleMobile}
              style={{textTransform: 'none', fontSize: 18, alignItems: 'center'}}
              startIcon={<Avatar src={'./logo192.png'} />}
            />
            <Typography component="a" href="/" className={classes.title} variant="h5" noWrap>
              ITrader
            </Typography>
            <div className={classes.grow} />
            <div className={classes.search}>
              <InputBase
                // placeholder="TSLA"
                classes={{
                  root: classes.inputRoot,
                  input: classes.inputInput,
                }}
                inputProps={{ 'aria-label': 'search' }}
                startAdornment={<SearchIcon/>}
              />
            </div>

            <div className={classes.grow} />
            <div className={classes.sectionDesktop}>
              <Clock date={this.state.date} />
            </div>
            <div className={classes.sectionMobile}>
              <ClockMobile date={this.state.date} />
            </div>
            <div className={classes.grow} />

            <div className={classes.sectionDesktop}>
              { this.props.authenticated ? (
                <AccountMenu />
              ) : (
                <Button 
                  aria-label="login" 
                  href="/login"
                  color="inherit"
                  m={2}
                  style={{textTransform: 'none', fontSize: 18}}
                >
                  Login
                </Button>
              )}

              { this.props.authenticated ? (
                <Button 
                  aria-label="logout" 
                  color="inherit"
                  m={2}
                  style={{textTransform: 'none', fontSize: 18}}
                  onClick={this.props.onLogout}
                >
                  Logout
                </Button>
              ) : (
                <Button 
                  aria-label="signup" 
                  href="/signup"
                  color="inherit"
                  m={2}
                  style={{textTransform: 'none', fontSize: 18}}
                >
                  Sign Up
                </Button>
              )}
            </div>
            <div className={classes.sectionMobile}>
              <IconButton
                aria-label="show more"
                aria-controls={mobileMenuId}
                aria-haspopup="true"
                onClick={this.handleMobileMenuOpen}
                color="inherit"
              >
                <MoreIcon />
              </IconButton>
            </div>
            {/* <div className={classes.grow} /> */}
          </Toolbar>
        </AppBar>
        {renderMobileMenu}
        {renderMenu}
      </div>
    );
  }
};

export default withStyles(useStyles)(PrimarySearchAppBar);