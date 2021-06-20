import React from 'react';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import Typography from '@material-ui/core/Typography';
import Box from '@material-ui/core/Box';
import MinuteChart from '../chart/MinuteChart';
import HistoryChart from '../chart/HistoryChart';


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
}));

export default function MultiCharts(props) {
  const classes = useStyles();
  const [value, setValue] = React.useState(0);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  return (
    <div className={classes.root}>
      <AppBar position="static">
        <Tabs value={value} onChange={handleChange} aria-label="interval tabs">
          <Tab label="Minute" {...a11yProps(0)} style={{ textTransform: 'none' }} />
          <Tab label="Day" {...a11yProps(1)} style={{ textTransform: 'none' }} />
          <Tab label="Week" {...a11yProps(2)} style={{ textTransform: 'none' }} />
          <Tab label="Month" {...a11yProps(3)} style={{ textTransform: 'none' }} />
          <Tab label="Quarter" {...a11yProps(4)} style={{ textTransform: 'none' }} />
          <Tab label="Year" {...a11yProps(5)} style={{ textTransform: 'none' }} />
        </Tabs>
      </AppBar>
      <TabPanel value={value} index={0}>
        <MinuteChart symbol={props.symbol} />
      </TabPanel>
      <TabPanel value={value} index={1}>
        <HistoryChart symbol={props.symbol} interval="d" />
      </TabPanel>
      <TabPanel value={value} index={2}>
        <HistoryChart symbol={props.symbol} interval="w" />
      </TabPanel>
      <TabPanel value={value} index={3}>
        <HistoryChart symbol={props.symbol} interval="m" />
      </TabPanel>
      <TabPanel value={value} index={4}>
        <HistoryChart symbol={props.symbol} interval="q" />
      </TabPanel>
      <TabPanel value={value} index={5}>
        <HistoryChart symbol={props.symbol} interval="y" />
      </TabPanel>
    </div>
  );
}