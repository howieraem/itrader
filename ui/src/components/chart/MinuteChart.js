import './ChartHolder.css';
import React from 'react';
import Grid from '@material-ui/core/Grid';
import Chart from './CandleStickMinuteChart';
import { getStockToday } from '../../utils/DataAPIUtils';
import LoadingIndicator from '../../common/LoadingIndicator';

const getTimeout = (minuteInterval) => {
  const cur = new Date();
  return (minuteInterval - cur.getMinutes() % minuteInterval) * 60000 - cur.getSeconds() * 1000;
}

export default function MinuteChart(props) {
  const { symbol, minute, latestPrice } = props;
  const [data, setData] = React.useState(null);

  React.useEffect(() => {
    const cacheKey = symbol + "_m" + minute;

    const loadData = () => {
      let symbolCache;
      if ((symbolCache = localStorage.getItem(cacheKey))) {
        let data = JSON.parse(symbolCache);
        data.forEach((entry) => {
          // recover date format
          entry.date = new Date(entry.date);
        });
        setData(data);
      } else {
        getStockToday(symbol, minute)
          .then(data => {
            if (data && data.length) {
              setData(data);
              try {
                localStorage.setItem(cacheKey, JSON.stringify(data));
              } catch (e) {
                // don't store cache if quota exceeded
              }
            }
            else setData(null);
          })
          .catch(err => { console.log(err); setData(null); })
      }
    }
    loadData();

    let interval;
    setTimeout(() => {
      interval = setInterval(() => {
        localStorage.removeItem(cacheKey);
        loadData();
      }, minute * 60000);
    }, getTimeout(minute));

    return () => {
      clearInterval(interval);
    }
  }, [symbol, minute]);

  React.useEffect(() => {
    if (data && data[0].open && latestPrice > 0) {
      const lastEntry = data[data.length - 1];
      lastEntry.close = latestPrice;
      lastEntry.high = Math.max(lastEntry.high, latestPrice);
      lastEntry.low = Math.min(lastEntry.low, latestPrice);
      data[data.length - 1] = lastEntry;
    }
  }, [data, latestPrice])

  return (
    <Grid container>
      <Grid item xs />
      <Grid item xs={11} align="left">
        { data ? data[0].open === undefined ? (
          <header className="Chart-holder">
            {"Minute data not available. The stock might have been suspended or delisted."}
          </header>
        ) : ( 
          <Chart type="hybrid" data={data} symbol={symbol} /> 
        ) : (
          <header className="Chart-holder">
            {"Loading chart..."}
            <LoadingIndicator />
          </header> )
        }
      </Grid>
      <Grid item xs />
    </Grid>
  )
}
