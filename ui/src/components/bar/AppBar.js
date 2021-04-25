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
import Link from '@material-ui/core/Link';

import AccountMenu from './AccountMenu';


const useStyles = theme => ({
  grow: {
    flexGrow: 1,
  },
  menuButton: {
    marginRight: theme.spacing(2),
  },
  title: {
    display: 'none',
    [theme.breakpoints.up('sm')]: {
      display: 'block',
    },
  },
  search: {
    position: 'relative',
    borderRadius: theme.shape.borderRadius,
    backgroundColor: fade(theme.palette.common.white, 0.15),
    '&:hover': {
      backgroundColor: fade(theme.palette.common.white, 0.25),
    },
    marginRight: theme.spacing(2),
    marginLeft: 0,
    width: '100%',
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
      mobileMoreAnchorEl: null
    };
    this.handleMobileMenuOpen = this.handleMobileMenuOpen.bind(this);
    this.handleProfileMenuOpen = this.handleProfileMenuOpen.bind(this);
    this.handleMobileMenuClose = this.handleMobileMenuClose.bind(this);
    this.handleMenuClose = this.handleMenuClose.bind(this);
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
        <MenuItem onClick={this.handleMenuClose}>Profile</MenuItem>
        <MenuItem onClick={this.handleMenuClose}>Settings</MenuItem>
        <MenuItem onClick={this.handleMenuClose}>Log out</MenuItem>
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
      >
        <MenuItem onClick={this.handleProfileMenuOpen}>Account</MenuItem>
      </Menu>
    );

    return (
      <div className={classes.grow}>
        <AppBar style={{ background: '#00a6b6' }}>
          <Toolbar>
            <Typography className={classes.title} variant="h5" noWrap>
              <Link href="#" color="inherit" style={{textDecoration: 'none'}}>ITrader</Link>
            </Typography>
            <div className={classes.grow} />
            <div className={classes.search}>
              <InputBase
                placeholder="COIN"
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
              <AccountMenu />
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
          </Toolbar>
        </AppBar>
        {renderMobileMenu}
        {renderMenu}
      </div>
    );
  }
};

export default withStyles(useStyles)(PrimarySearchAppBar);