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
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box p={3}>
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
    id: `simple-tab-${index}`,
    'aria-controls': `simple-tabpanel-${index}`,
  };
}

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
    backgroundColor: theme.palette.background.paper,
  },
  tab: {
    textTransform: 'none',
    minWidth: 10,
  },
  indicator: {
    backgroundColor: 'white',
  },
}));

export default function MultiCharts(props) {
  const classes = useStyles();
  const [value, setValue] = React.useState(0);
  const { symbol, latestPrice, marketClosed } = props;

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  return (
    <div className={classes.root}>
      <AppBar position="static">
        <Tabs value={value} onChange={handleChange} aria-label="interval tabs" classes={{ indicator: classes.indicator }}>
          <Tab label="Intraday" {...a11yProps(0)} className={classes.tab} />
          <Tab label="Day" {...a11yProps(1)} className={classes.tab} />
          <Tab label="Week" {...a11yProps(2)} className={classes.tab} />
          <Tab label="Month" {...a11yProps(3)} className={classes.tab} />
          <Tab label="Quarter" {...a11yProps(4)} className={classes.tab} />
          <Tab label="Year" {...a11yProps(5)} className={classes.tab} />
          <Tab label="1min" {...a11yProps(6)} className={classes.tab} />
          <Tab label="5min" {...a11yProps(7)} className={classes.tab} />
          <Tab label="15min" {...a11yProps(8)} className={classes.tab} />
          <Tab label="30min" {...a11yProps(9)} className={classes.tab} />
          <Tab label="60min" {...a11yProps(10)} className={classes.tab} />
          <Tab label="90min" {...a11yProps(11)} className={classes.tab} />
        </Tabs>
      </AppBar>
      <TabPanel value={value} index={0}>
        <IntradayChart symbol={symbol} marketClosed={marketClosed} />
      </TabPanel>
      <TabPanel value={value} index={1}>
        <HistoryChart symbol={symbol} interval="d" />
      </TabPanel>
      <TabPanel value={value} index={2}>
        <HistoryChart symbol={symbol} interval="w" />
      </TabPanel>
      <TabPanel value={value} index={3}>
        <HistoryChart symbol={symbol} interval="m" />
      </TabPanel>
      <TabPanel value={value} index={4}>
        <HistoryChart symbol={symbol} interval="q" />
      </TabPanel>
      <TabPanel value={value} index={5}>
        <HistoryChart symbol={symbol} interval="y" />
      </TabPanel>
      <TabPanel value={value} index={6}>
        <MinuteChart symbol={symbol} minute={1} />
      </TabPanel>
      <TabPanel value={value} index={7}>
        <MinuteChart symbol={symbol} minute={5} />
      </TabPanel>
      <TabPanel value={value} index={8}>
        <MinuteChart symbol={symbol} minute={15} />
      </TabPanel>
      <TabPanel value={value} index={9}>
        <MinuteChart symbol={symbol} minute={30} />
      </TabPanel>
      <TabPanel value={value} index={10}>
        <MinuteChart symbol={symbol} minute={60} />
      </TabPanel>
      <TabPanel value={value} index={11}>
        <MinuteChart symbol={symbol} minute={90} />
      </TabPanel>
    </div>
  );
}