import React from 'react';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import Typography from '@material-ui/core/Typography';
import Box from '@material-ui/core/Box';
import IntradayChart from '../chart/IntradayChart';
import HistoryChart from '../chart/HistoryChart';
import MinuteChart from '../chart/MinuteChart';

function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`scrollable-auto-tabpanel-${index}`}
      aria-labelledby={`scrollable-auto-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box p={1}>
          <Typography>{children}</Typography>
        </Box>
      )}
    </div>
  );
}

TabPanel.propTypes = {
  children: PropTypes.node,
  index: PropTypes.any.isRequired,
  value: PropTypes.any.isRequired,
};

function a11yProps(index) {
  return {
    id: `scrollable-auto-tab-${index}`,
    'aria-controls': `scrollable-auto-tabpanel-${index}`,
  };
}

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
    backgroundColor: theme.palette.background.paper,
  },
  bar: {
    backgroundColor: theme.palette.secondary.main,
  },
  tab: {
    textTransform: 'none',
    minWidth: 10,
  },
  indicator: {
    backgroundColor: 'white',
  },
  scrollButtons: {
    width: 'initial',

    '&:first-child': {
      paddingRight: theme.spacing(2),
      height: '100%',
      position: 'absolute',
      left: 0,
      opacity: 1,
      zIndex: 1,
    },

    '&.MuiTabs-scrollButtonsDesktop': {
      display: 'flex',

      '&.Mui-disabled:first-child': {
        visibility: 'hidden',
      },
    },
  }
}));

export default function CharTabs(props) {
  const classes = useStyles();
  const [value, setValue] = React.useState(0);
  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  return (
    <div className={classes.root}>
      <AppBar position="static" className={classes.bar}>
        <Tabs 
          value={value} 
          onChange={handleChange} 
          variant="scrollable"
          scrollButtons="auto"
          aria-label="interval tabs"
          classes={{ 
            indicator: classes.indicator, 
            scrollButtons: classes.scrollButtons 
          }}
        >
          <Tab label="Intraday" {...a11yProps(0)} className={classes.tab} />
          <Tab label="Day" {...a11yProps(1)} className={classes.tab} />
          <Tab label="Week" {...a11yProps(2)} className={classes.tab} />
          <Tab label="Month" {...a11yProps(3)} className={classes.tab} />
          <Tab label="Quarter" {...a11yProps(4)} className={classes.tab} />
          <Tab label="1min" {...a11yProps(5)} className={classes.tab} />
          <Tab label="5min" {...a11yProps(6)} className={classes.tab} />
          <Tab label="15min" {...a11yProps(7)} className={classes.tab} />
          <Tab label="30min" {...a11yProps(8)} className={classes.tab} />
          <Tab label="60min" {...a11yProps(9)} className={classes.tab} />
          <Tab label="90min" {...a11yProps(10)} className={classes.tab} />
        </Tabs>
      </AppBar>
      <TabPanel value={value} index={0}>
        <IntradayChart {...props} />
      </TabPanel>
      <TabPanel value={value} index={1}>
        <HistoryChart interval="d" {...props} />
      </TabPanel>
      <TabPanel value={value} index={2}>
        <HistoryChart interval="w" {...props} />
      </TabPanel>
      <TabPanel value={value} index={3}>
        <HistoryChart interval="m" {...props} />
      </TabPanel>
      <TabPanel value={value} index={4}>
        <HistoryChart interval="q" {...props} />
      </TabPanel>
      <TabPanel value={value} index={5}>
        <MinuteChart minute={1} {...props} />
      </TabPanel>
      <TabPanel value={value} index={6}>
        <MinuteChart minute={5} {...props} />
      </TabPanel>
      <TabPanel value={value} index={7}>
        <MinuteChart minute={15} {...props} />
      </TabPanel>
      <TabPanel value={value} index={8}>
        <MinuteChart minute={30} {...props} />
      </TabPanel>
      <TabPanel value={value} index={9}>
        <MinuteChart minute={60} {...props} />
      </TabPanel>
      <TabPanel value={value} index={10}>
        <MinuteChart minute={90} {...props} />
      </TabPanel>
    </div>
  );
}