import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import IconButton from '@material-ui/core/IconButton';
import Typography from '@material-ui/core/Typography';
import MenuItem from '@material-ui/core/MenuItem';
import Menu from '@material-ui/core/Menu';
import MoreIcon from '@material-ui/icons/MoreVert';
import Button from '@material-ui/core/Button';
// import Avatar from '@material-ui/core/Avatar';
import Search from './Search';
import { COLORS } from '../../common/Theme';


const Clock = ({ date }) => (
  <div>{`${date.toDateString()} ${date.toLocaleTimeString()} UTC+${0 - date.getTimezoneOffset() / 60}`}</div>
)


const ClockMobile = ({ date }) => (
  <div>{`${date.toLocaleTimeString()} +${0 - date.getTimezoneOffset() / 60}`}</div>
)


const useStyles = makeStyles((theme) => ({
  barButton: {
    textTransform: 'none',
    fontSize: 17,
  },
  iconButton: {
    background: COLORS[0],
    textTransform: 'none', 
    alignItems: 'center',
    '&:hover': {
      backgroundColor: COLORS[0],
    },
  },
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
}));


export default function NavBar(props) {
  const { authenticated, onLogout, onSearch } = props;
  const classes = useStyles();
  const [mobileMoreAnchorEl, setMobileMoreAnchorEl] = React.useState(null);
  const [date, setDate] = React.useState(new Date());

  const isMobileMenuOpen = Boolean(mobileMoreAnchorEl);

  React.useEffect(() => {
    const interval = setInterval(() => {
      setDate(new Date());
    }, 1000);
  
    return () => {
      clearInterval(interval);
    };
  }, []);

  const handleMobileMenuOpen = (event) => {
    setMobileMoreAnchorEl(event.currentTarget);
  };

  const handleMobileMenuClose = () => {
    setMobileMoreAnchorEl(null);
  };

  const mobileMenuId = 'primary-search-account-menu-mobile';
  const renderMobileMenu = (
    <Menu
      anchorEl={mobileMoreAnchorEl}
      anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
      id={mobileMenuId}
      keepMounted
      transformOrigin={{ vertical: 'top', horizontal: 'right' }}
      open={isMobileMenuOpen}
      onClose={handleMobileMenuClose}
      // If false and a vertical scroll bar exists , the popover will add padding to body
      MenuProps={{ disableScrollLock: true }}
    >
      {authenticated ? (
        <div>
          <MenuItem component="a" href="/dashboard">Dashboard</MenuItem>
          <MenuItem component="a" href="/settings">Settings</MenuItem>
          <MenuItem onClick={onLogout}>Logout</MenuItem>
        </div>
      ) : (
        <div>
          <MenuItem component="a" href="/login">Sign In</MenuItem>
          <MenuItem component="a" href="/signup">Sign Up</MenuItem>
        </div>
      )}
    </Menu>
  );

  return (
    <div className={classes.grow}>
      <AppBar style={{ background: COLORS[0] }}>
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
            <Clock date={date} />
          </div>
          <div className={classes.sectionMobile}>
            <ClockMobile date={date} />
          </div>
          <div className={classes.grow} />

          <div className={classes.sectionDesktop}>
            { authenticated ? (
              <>
                <Button 
                  aria-label="dashboard" 
                  href="/dashboard"
                  color="inherit"
                  m={2}
                  className={classes.barButton}
                >
                  Dashboard
                </Button>
                <Button 
                  aria-label="settings" 
                  href="/settings"
                  color="inherit"
                  m={2}
                  className={classes.barButton}
                >
                  Settings
                </Button>
              </>
              // <AccountMenu />
            ) : (
              <Button 
                aria-label="login" 
                href="/login"
                color="inherit"
                m={2}
                className={classes.barButton}
              >
                Sign In
              </Button>
            )}

            { authenticated ? (
              <Button 
                aria-label="logout" 
                color="inherit"
                m={2}
                className={classes.barButton}
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
              onClick={handleMobileMenuOpen}
              color="inherit"
            >
              <MoreIcon />
            </IconButton>
          </div>
        </Toolbar>
      </AppBar>
      {renderMobileMenu}
    </div>
  );
};
