import React from 'react';
import { useHistory } from 'react-router-dom';
import { fade, makeStyles } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Autocomplete from '@material-ui/lab/Autocomplete';
import Toolbar from '@material-ui/core/Toolbar';
import IconButton from '@material-ui/core/IconButton';
import Typography from '@material-ui/core/Typography';
import InputBase from '@material-ui/core/InputBase';
import MenuItem from '@material-ui/core/MenuItem';
import Menu from '@material-ui/core/Menu';
import SearchIcon from '@material-ui/icons/Search';
import MoreIcon from '@material-ui/icons/MoreVert';
import Button from '@material-ui/core/Button';
import Avatar from '@material-ui/core/Avatar';
import AccountMenu from './AccountMenu';
import { COLORS } from '../../common/Theme';
import { searchTicker } from '../../utils/DataAPIUtils'; 


const Clock = ({ date }) => (
  <div>{`${date.toDateString()} ${date.toLocaleTimeString()} UTC+${0 - date.getTimezoneOffset() / 60}`}</div>
)


const ClockMobile = ({ date }) => (
  <div>{`${date.toLocaleTimeString()} +${0 - date.getTimezoneOffset() / 60}`}</div>
)


const useStyles = makeStyles((theme) => ({
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
      width: '35ch',
    },
  },
  searchOptions: {
    
  },
  inputRoot: {
    color: 'inherit',
  },
  inputInput: {
    paddingLeft: '1em',
    transition: theme.transitions.create('width'),
    height: 30,
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


export default function PrimarySearchAppBar(props) {
  const { authenticated, onLogout, onSearch } = props;
  const classes = useStyles();
  const [anchorEl, setAnchorEl] = React.useState(null);
  const [mobileMoreAnchorEl, setMobileMoreAnchorEl] = React.useState(null);
  const [date, setDate] = React.useState(new Date());
  const [searchRes, setSearchRes] = React.useState([]);
  // const [symbol, setSymbol] = React.useState(null);

  const isMenuOpen = Boolean(anchorEl);
  const isMobileMenuOpen = Boolean(mobileMoreAnchorEl);

  let history = useHistory();

  React.useEffect(() => {
    const interval = setInterval(() => {
      setDate(new Date());
    }, 1000);
  
    return () => {
      clearInterval(interval);
    };
  }, []);

  const handleProfileMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMobileMenuOpen = (event) => {
    setMobileMoreAnchorEl(event.currentTarget);
  };

  const handleMobileMenuClose = () => {
    setMobileMoreAnchorEl(null);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    handleMobileMenuClose();
  };

  const handleOptionFetch = (str) => {
    // setSymbol(null);
    searchTicker(str)
    .then(res => setSearchRes(res))
    .catch(err => console.log(err));
  }

  const handleSearchClick = (symbol) => {
    onSearch(symbol);
    history.push('/stockView');
  }

  const menuId = 'primary-search-account-menu';
  const renderMenu = (
    <Menu
      anchorEl={anchorEl}
      anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
      id={menuId}
      keepMounted
      transformOrigin={{ vertical: 'top', horizontal: 'right' }}
      open={isMenuOpen}
      onClose={handleMenuClose}
    >
      <MenuItem component="a" href="/profile" onClick={handleMenuClose}>
        Details
      </MenuItem>
      <MenuItem component="a" href="/settings" onClick={handleMenuClose}>
        Settings
      </MenuItem>
    </Menu>
  );

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
          <MenuItem onClick={handleProfileMenuOpen}>Profile</MenuItem>
          <MenuItem onClick={onLogout}>Logout</MenuItem>
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
      <AppBar style={{ background: COLORS[0] }}>
        <Toolbar>
          <Button 
            aria-label="home" 
            href="/"
            color="inherit"
            m={2}
            className={classes.iconButton}
            disableRipple={true}
            startIcon={<Avatar src={'./logo192.png'} />}
          />
          <Typography component="a" href="/" className={classes.title} variant="h5" noWrap>
            ITrader
          </Typography>

          <div className={classes.grow} />
          <Autocomplete
            id="autocomplete"
            freeSolo
            options={searchRes}
            getOptionLabel={(option) => option ? option.symbol : ""}
            filterOptions={x => x}  // don't filter options
            classes={{
              root: classes.search, 
              paper: classes.searchOptions 
            }}
            onChange={(ev, val) => {
              if (val && val.symbol) { 
                // setSymbol(val.symbol);
                handleSearchClick(val.symbol);
              }
            }}
            onInputChange={(ev, val) => handleOptionFetch(val)}
            renderInput={(params) => (
              <InputBase
                ref={params.InputProps.ref}
                inputProps={params.inputProps}
                autoFocus
                placeholder="Search stock here"
                classes={{
                  root: classes.inputRoot,
                  input: classes.inputInput,
                }}
                endAdornment={
                  <SearchIcon style={{ marginLeft: 10, marginRight: 5 }} />
                }
                // onKeyPress={(ev) => {
                //   if (ev.key === 'Enter') {
                //     handleSearchClick();
                //     ev.preventDefault();
                //   }
                // }}
              />
            )}
          />

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

            { authenticated ? (
              <Button 
                aria-label="logout" 
                color="inherit"
                m={2}
                style={{textTransform: 'none', fontSize: 18}}
                onClick={onLogout}
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
          {/* <div className={classes.grow} /> */}
        </Toolbar>
      </AppBar>
      {renderMobileMenu}
      {renderMenu}
    </div>
  );
};
