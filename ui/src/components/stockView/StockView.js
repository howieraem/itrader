import './StockView.css';
import React from 'react';
import Grid from '@material-ui/core/Grid';
import Button from '@material-ui/core/Button';
import ButtonGroup from '@material-ui/core/ButtonGroup';
import AddIcon from '@material-ui/icons/Add';
import RemoveIcon from '@material-ui/icons/Remove';
import { makeStyles } from '@material-ui/core/styles';
import InfoTable from './Table';
import MultiCharts from './MultiCharts';
import TradeDialog from './TradeDialog';
import { addTicker, removeTicker } from 'stocksocket';
import { getStockBasicInfo } from '../../utils/DataAPIUtils';
import { COLOR_PRIMARY } from '../../common/Theme';


const useStyles = makeStyles((theme) => ({
  watchlistButton: {
    textTransform: 'none', 
    fontSize: 14, 
    color: "white", 
    // borderRadius: 12,
    margin: theme.spacing(3, 0, 2),
    maxHeight: '50px', 
    minHeight: '50px',
    maxWidth: '50px', 
    minWidth: '50px', 
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
    // marginTop: '10px',
    fontSize: '16px',
    [theme.breakpoints.up('sm')]: {
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
    fontSize: '14px',
    [theme.breakpoints.up('sm')]: {
      fontSize: '16px',
    },
  }
}));

function roundNumber(number, places=4) {
  return parseFloat(number.toFixed(places))
}


// function sortByKey(unordered) {
//   return Object.keys(unordered).sort().reduce(
//     (obj, key) => { 
//       obj[key] = unordered[key]; 
//       return obj;
//     }, 
//     {}
//   );
// }


function filterInfo(info) {
  return {
    "Currency": info.currency,
    "52-wk High": info.fiftyTwoWeekHigh,
    "52-wk Low": info.fiftyTwoWeekLow,
    "Market": info.market,
    "Market State": info.marketState,
    "Price Range": info.regularMarketDayRange,
    "Current EPS": info.epsCurrentYear ? info.epsCurrentYear : "N/A",
    "PE (Trailing)": info.trailingPE ? info.trailingPE : "N/A", 
  }
}

const Blinking = (props) => (
  <div className={`element${props.highlight ? props.rise ? " stock-rise" : " stock-fall" : ""}`}>
    {props.children}
  </div>
);

function StockViewCore(props) {
  const classes = useStyles();
  const { symbol, authenticated, dataTime, price, change, changePercent } = props;
  
  const [fullName, setFullName] = React.useState(null);
  const [basicInfo, setBasicInfo] = React.useState(null);
  const [highlight, setHighlight] = React.useState(false);
  const [isRising, setIsRising] = React.useState(false);
  const [watchlisted, setWatchlisted] = React.useState(false);

  const handleWlButtonClick = () => {
    setWatchlisted(!watchlisted);
  }

  const usePre = (value) => {
    const ref = React.useRef();
    React.useEffect(() => {
      ref.current = value;
    });
    return ref.current;
  }

  const prePrice = usePre(price);
  React.useEffect(() => {
    const updateBasicInfo = () => {
      getStockBasicInfo(symbol)
      .then(basicInfo => {
        setBasicInfo(filterInfo(basicInfo));
        setFullName(basicInfo.longName);
      }).catch(err => { console.log(err) })
    };
    updateBasicInfo();

    const interval = setInterval(() => {
      updateBasicInfo();
    }, 600000);

    const handlePriceChange = () => {
      setHighlight(true);
      setTimeout(() => {
        setHighlight(false);
      }, 700);
    };
    if (price > 0 && prePrice > 0) {
      if (price !== prePrice) {
        setIsRising(price - prePrice > 0);
        handlePriceChange();
      }
    }

    return () => {
      clearInterval(interval);
    };
  }, [symbol, price]);  // don't put prePrice here

  const priceLoaded = price > 0;
  const changeSign = change > 0 ? "+" : "";
  const marketClosed = basicInfo ? basicInfo["Market State"] === "CLOSED" : false;
  return (
    <Grid container spacing={0}>
      <Grid container spacing={2} className={classes.topContainer}>
        <Grid item xs={4} sm={4}> 
          <header className={classes.symbolTitle1}>
            {symbol}
          </header>
          <header className={classes.symbolTitle2}>
            { basicInfo ? fullName : "" }
          </header>
        </Grid>

        <Grid item className={classes.grow} />
        <Grid item xs={4} sm={4}> 
          <header className={classes.symbolTitle1}>
            <Blinking highlight={highlight} rise={isRising}>
              { marketClosed ? "Market closed" : priceLoaded ? ("$" + price) : "Loading price..." }
            </Blinking>
          </header>
          <header className={classes.symbolTitle2}>
            <Blinking highlight={highlight} rise={isRising}>
              { priceLoaded ? (`${changeSign}${change} (${changeSign}${changePercent}%)`) : "" }
            </Blinking>
          </header>
        </Grid>
        
        <Grid item xs className={classes.grow2} />
        <Grid item xs={3} sm={3} align="right">
          <ButtonGroup size="small">
            <Button 
              variant="contained" 
              className={classes.watchlistButton} 
              onClick={handleWlButtonClick}
              style={{ background: (watchlisted ? "#ee0000" : COLOR_PRIMARY) }}
            >
              {watchlisted ? <RemoveIcon /> : <AddIcon />}
              <div className={classes.buttonLabel}>Watchlist</div>
            </Button>
            <TradeDialog symbol={symbol} authenticated={authenticated} marketClosed={marketClosed} />
          </ButtonGroup>
        </Grid>
      </Grid>

      <Grid container>
        <Grid item xs={12}>
          <MultiCharts symbol={symbol} dateTime={dataTime} lastestPrice={price} />
        </Grid>
      </Grid>

      <InfoTable data={basicInfo} />
    </Grid>
  )
}

export default function StockView(props) {
  const symbol = props.symbol;
  // const [curData, setCurData] = React.useState(null);
  const [dataTime, setDataTime] = React.useState(null);
  const [price, setPrice] = React.useState(0.);
  const [change, setChange] = React.useState(0.);
  const [changePercent, setChangePercent] = React.useState(0.);

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
      // setCurData(sortByKey(liveData));
      setDataTime(new Date(liveData.time));
      setPrice(roundNumber(liveData.price));
      setChange(roundNumber(liveData.change));
      setChangePercent(roundNumber(liveData.changePercent, 2));
    };
    addTicker(symbol, updateLiveData);

    return () => {
      removeTicker(symbol);
      setPrice(0.);
      setChange(0.);
      setChangePercent(0.);
    };
  }, [symbol]);

  return <StockViewCore dataTime={dataTime} price={price} change={change} changePercent={changePercent} {...props} />
}
