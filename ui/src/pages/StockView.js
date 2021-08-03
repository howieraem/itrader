import '../components/stockView/StockView.css';
import React from 'react';
import { addTicker, removeTicker } from 'stocksocket';
import { makeStyles, useTheme } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import Button from '@material-ui/core/Button';
import ButtonGroup from '@material-ui/core/ButtonGroup';
import AddIcon from '@material-ui/icons/Add';
import DeleteForeverIcon from '@material-ui/icons/DeleteForever';
import { Helmet } from "react-helmet";
import CharTabs from '../components/stockView/ChartTabs';
import InfoTabs from '../components/stockView/InfoTabs';
import TradeDialog from '../components/stockView/TradeDialog';
import {
  existInWatchlist,
  addToWatchlist,
  removeFromWatchlist
} from '../utils/API';
import { getMarketStates, getStockBasicInfo } from '../utils/DataAPI';
import { MARKET_LOC } from '../constants';

const useStyles = makeStyles((theme) => ({
  watchlistButton: {
    textTransform: 'none', 
    fontSize: 14, 
    color: "white",
    margin: theme.spacing(3, 0, 2),
    maxHeight: '50px', 
    minHeight: '50px',
    maxWidth: '40px', 
    minWidth: '40px', 
    [theme.breakpoints.up('sm')]: {
      fontSize: 14, 
      maxWidth: '90px', 
      minWidth: '90px', 
    },
    [theme.breakpoints.up('md')]: {
      fontSize: 16,
      maxWidth: '120px', 
      minWidth: '120px', 
    },
  },
  buttonLabel: {
    display: 'none',
    [theme.breakpoints.up('sm')]: {
      display: 'block',
    },
  },
  grow: {
    flexGrow: 1,
    display: 'none',
    [theme.breakpoints.up('md')]: {
      display: 'block',
    },
  },
  grow2: {
    display: 'block',
    [theme.breakpoints.up('md')]: {
      display: 'none',
    },
  },
  topContainer: {
    backgroundColor: '#fafaff',
  },
  symbolTitle1: {
    minHeight: '35px',
    maxHeight: '35px',
    fontWeight: 'bold',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'left',
    justifyContent: 'center',
    margin: theme.spacing(2, 0, 1),
    fontSize: '16px',
    [theme.breakpoints.up('md')]: {
      fontSize: '20px',
    },
  },
  symbolTitle2: {
    minHeight: '25px',
    maxHeight: '25px',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'left',
    justifyContent: 'center',
    margin: theme.spacing(1, 0, 2),
    fontSize: '13px',
    [theme.breakpoints.up('md')]: {
      fontSize: '16px',
    },
  }
}));

function roundNumber(number, places=4) {
  if (!number)  return null;
  return parseFloat(number.toFixed(places));
}

function procLargeNum(number, places=2) {
  if (!number)  return number;
  else if (number > 1e9)  return `${(number / 1e9).toFixed(places)}B`;
  else if (number > 1e6)  return `${(number / 1e6).toFixed(places)}M`;
  else if (number > 1e3)  return `${(number / 1e3).toFixed(places)}K`;
  else return number.toFixed(places);
}

function filterInfo(info) {
  return {
    "Market Region": MARKET_LOC[info.market] || info.market,
    "Outstanding Shares": procLargeNum(info.sharesOutstanding) || "N/A",
    "Market Capitalization": info.marketCap ? `${info.currency.toUpperCase()} ${procLargeNum(info.marketCap)}` : "N/A",
    "Volume": info.regularMarketVolume || 0,
    "Day Price Range": info.regularMarketDayRange,
    "52-week High": roundNumber(info.fiftyTwoWeekHigh),
    "52-week Low": roundNumber(info.fiftyTwoWeekLow),
    "Current Year EPS": roundNumber(info.epsCurrentYear) || "N/A",
    "Forward EPS": roundNumber(info.epsForward) || "N/A",
    "Trailing PE": roundNumber(info.trailingPE) || "N/A",
    "Forward PE": roundNumber(info.forwardPE) || "N/A",
    "Book Value": roundNumber(info.bookValue) || "N/A",
    "P/B Ratio": roundNumber(info.priceToBook) || "N/A",
  };
}

const Blinking = (props) => (
  <div className={`element${props.highlight ? props.rise ? " stock-rise" : " stock-fall" : ""}`}>
    {props.children}
  </div>
);

function StockViewCore(props) {
  const classes = useStyles();
  const { symbol, authenticated, marketOpen, dataTime, livePrice, change, changePercent, dayVolume } = props;

  const [stockName, setStockName] = React.useState(null);
  const [basicInfo, setBasicInfo] = React.useState(null);
  const [currency, setCurrency] = React.useState("USD");
  const [highlight, setHighlight] = React.useState(false);
  const [isRising, setIsRising] = React.useState(false);
  const [watchlisted, setWatchlisted] = React.useState(false);
  const [regularMarketTime, setRegularMarketTime] = React.useState(null);
  const [regularMarketPrice, setRegularMarketPrice] = React.useState(0);
  const [regularMarketChange, setRegularMarketChange] = React.useState(0);
  const [regularMarketChangePercent, setRegularMarketChangePercent] = React.useState(0);
  const [regularMarketVolume, setRegularMarketVolume] = React.useState(0);

  const handleWlButtonClick = () => {
    if (watchlisted) {
      removeFromWatchlist(symbol)
      .then(res => setWatchlisted(false))
      .catch(err => console.log(err));
    } else {
      addToWatchlist(symbol)
      .then(res => setWatchlisted(true))
      .catch(err => console.log(err));
    }
  }

  const usePre = (value) => {
    const ref = React.useRef();
    React.useEffect(() => {
      ref.current = value;
    });
    return ref.current;
  }

  React.useEffect(() => {
    if (authenticated) {
      existInWatchlist(symbol)
      .then(res => setWatchlisted(res))
      .catch(err => console.log(err));
    }
  }, [symbol, authenticated])

  React.useEffect(() => {
    const updateBasicInfo = () => {
      getStockBasicInfo(symbol)
        .then(basicInfo => {
          setBasicInfo(filterInfo(basicInfo));
          setStockName(basicInfo.displayName || basicInfo.longName || basicInfo.shortName);
          setCurrency(basicInfo.currency.toUpperCase());
          setRegularMarketTime(new Date(basicInfo.regularMarketTime * 1000));
          setRegularMarketPrice(roundNumber(basicInfo.regularMarketPrice, 3));
          setRegularMarketChange(roundNumber(basicInfo.regularMarketChange, 3));
          setRegularMarketChangePercent(roundNumber(basicInfo.regularMarketChangePercent, 2));
          setRegularMarketVolume(basicInfo.regularMarketVolume || 0);
        })
        .catch(err => { console.log(err) })
    };
    updateBasicInfo();

    const interval = setInterval(() => {
      // Update info table every 15s, not as frequent as live price
      updateBasicInfo();
    }, 15000);

    return () => {
      clearInterval(interval);
    };
  }, [symbol])

  const prePrice = usePre(livePrice);
  React.useEffect(() => {
    const handlePriceChange = () => {
      setHighlight(true);
      setTimeout(() => {
        setHighlight(false);
      }, 500);
    };
    if (livePrice > 0 && prePrice > 0) {
      if (livePrice !== prePrice) {
        setIsRising(livePrice - prePrice > 0);
        handlePriceChange();
      }
    }
  }, [livePrice]);  // don't put prePrice here

  let changeSign = "", priceColor = "#000000", tradeNotAvailMsg = "";
  if (marketOpen) {
    if (change >= 0 && regularMarketChange >= 0) {
      changeSign = "+";
      priceColor = "#00aa00";
    } else {
      priceColor = "#cc0000";
    }
  } else {
    tradeNotAvailMsg = "Market is closed.";
  }

  const theme = useTheme();

  return (
    <Grid container spacing={0}>
      <Grid container spacing={2} className={classes.topContainer}>
        <Grid item xs={4} sm={4}> 
          <div className={classes.symbolTitle1}>
            {symbol}
          </div>
          <div className={classes.symbolTitle2}>
            { basicInfo ? stockName : "" }
          </div>
        </Grid>

        <Grid item className={classes.grow} />
        <Grid item xs={4} sm={2} md={2}>
          <Blinking highlight={highlight} rise={isRising}>
            <div className={classes.symbolTitle1}>
                { `${currency} ${livePrice || regularMarketPrice}` }
            </div>
            <div className={classes.symbolTitle2} style={{ color: priceColor }}>
                { marketOpen ? (
                    `${changeSign}${change || regularMarketChange} (${changeSign}${changePercent || regularMarketChangePercent}%)`
                  ) : "Market closed"
                }
            </div>
          </Blinking>
        </Grid>
        <Grid item md={2} /> 

        <Grid item xs className={classes.grow2} />
        <Grid item xs={3} sm={3} align="right">
          { authenticated ? (
              <ButtonGroup size="small">
                <Button 
                  variant="contained" 
                  className={classes.watchlistButton} 
                  onClick={handleWlButtonClick}
                  style={{ background: (watchlisted ? "#ee0000" : `${theme.palette.primary.main}`) }}
                >
                  {watchlisted ? <DeleteForeverIcon /> : <AddIcon />}
                  <div className={classes.buttonLabel}>Watchlist</div>
                </Button>
                <TradeDialog 
                  symbol={symbol}
                  foreignCurrency={currency === "USD" ? null : currency}
                  errMsg={tradeNotAvailMsg}
                />
              </ButtonGroup>
            ) : null 
          }
        </Grid>
      </Grid>

      <Grid container spacing={2}>
        <Grid item xs={12}>
          <CharTabs
            symbol={symbol}
            latestTime={dataTime || regularMarketTime}
            latestPrice={livePrice || regularMarketPrice}
            latestVolume={dayVolume || regularMarketVolume}
          />
        </Grid>
        <Grid item xs={12}>
          <InfoTabs
            symbol={symbol}
            overviewData={basicInfo}
          />
        </Grid>
      </Grid>
    </Grid>
  )
}

export default function StockView(props) {
  const { symbol } = props;
  const [regularMarketOpen, setRegularMarketOpen] = React.useState(false);
  const [dataTime, setDataTime] = React.useState(null);
  const [livePrice, setLivePrice] = React.useState(0.);
  const [change, setChange] = React.useState(0.);
  const [changePercent, setChangePercent] = React.useState(0.);
  const [dayVolume, setDayVolume] = React.useState(0);

  React.useEffect(() => {
    getMarketStates([symbol])
    .then(res => setRegularMarketOpen(res[0] === "REGULAR"))
  }, [symbol])

  React.useEffect(() => {
    /* 
    LiveData:
    id
    price
    time
    exchange
    quoteType
    marketHours
    changePercent
    dayVolume
    change
    lastSize
    priceHint
    */
    const updateLiveData = (liveData) => {
      setDataTime(new Date(liveData.time));
      setLivePrice(roundNumber(liveData.price, 3));
      setChange(roundNumber(liveData.change, 3));
      setChangePercent(roundNumber(liveData.changePercent, 2));
      setDayVolume(liveData.dayVolume);
    };
    if (regularMarketOpen) {
      addTicker(symbol, updateLiveData);
    }

    return () => {
      if (regularMarketOpen) {
        removeTicker(symbol);
        setLivePrice(0);
        setChange(0);
        setChangePercent(0);
      }
    };
  }, [symbol, regularMarketOpen]);

  return (
    <>
      <Helmet>
        <title>ITrader - {symbol}</title>
      </Helmet>
      <StockViewCore
        marketOpen={regularMarketOpen}
        dataTime={dataTime}
        livePrice={livePrice}
        change={change}
        changePercent={changePercent}
        dayVolume={dayVolume}
        {...props}
      />
    </>
  );
}
