import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import AppBar from "@material-ui/core/AppBar";
import Tabs from "@material-ui/core/Tabs";
import Tab from "@material-ui/core/Tab";
import Box from "@material-ui/core/Box";
import Typography from "@material-ui/core/Typography";
import InfoTable from "./Table";
import {
  getAssetProfile,
  getFinancialData,
  getOtherStats
} from "../../utils/DataProc";

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

function a11yProps(index) {
  return {
    id: `scrollable-auto-tab-${index}`,
    'aria-controls': `scrollable-auto-tabpanel-${index}`,
  };
}

export default function InfoTabs({ symbol, overviewData }) {
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
          <Tab label="Overview" {...a11yProps(0)} className={classes.tab} />
          <Tab label="Asset Profile" {...a11yProps(1)} className={classes.tab} />
          <Tab label="Financial Data" {...a11yProps(2)} className={classes.tab} />
          <Tab label="Other Stats" {...a11yProps(3)} className={classes.tab} />
        </Tabs>
      </AppBar>
      <TabPanel value={value} index={0}>
        <InfoTable preparedData={overviewData} columns={3} columnsMobile={2} />
      </TabPanel>
      <TabPanel value={value} index={1}>
        <InfoTable getData={() => getAssetProfile(symbol)} columns={1} columnsMobile={1} />
      </TabPanel>
      <TabPanel value={value} index={2}>
        <InfoTable getData={() => getFinancialData(symbol)} columns={3} columnsMobile={2} />
      </TabPanel>
      <TabPanel value={value} index={3}>
        <InfoTable getData={() => getOtherStats(symbol)} columns={3} columnsMobile={2} />
      </TabPanel>
    </div>
  );
}
