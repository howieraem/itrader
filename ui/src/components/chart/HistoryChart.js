import './ChartHolder.css';
import React from 'react';
import Grid from '@material-ui/core/Grid';
import Chart from './CandleStickChart';
import { getStockHistory } from '../../utils/DataAPIUtils';
import LoadingIndicator from '../../common/LoadingIndicator';


export default function HistoryChart(props) {
  const { symbol, interval, latestPrice } = props;
  const [data, setData] = React.useState(null);

  React.useEffect(() => {
    const symbolKey = symbol + "_" + interval;
    const symbolCache = localStorage.getItem(symbolKey);
    if (symbolCache) {
      let data = JSON.parse(symbolCache);
      data.forEach((entry) => {
        // recover date format
        entry.date = new Date(entry.date);
      });
      setData(data);
    } else {
      getStockHistory(symbol, interval).then(data => {
        if (data && data.length) {
          setData(data);
          try {
            localStorage.setItem(symbolKey, JSON.stringify(data));
          } catch (e) {
            // don't store cache if quota exceeded
          }
        }
        else setData(null);
      }).catch(err => { console.log(err); setData(null); })
    }
  }, [symbol, interval])

  React.useEffect(() => {
    if (data && data[0].open && latestPrice > 0) {
      const lastEntry = data[data.length - 1];
      lastEntry.close = latestPrice;
      lastEntry.high = Math.max(lastEntry.high, latestPrice);
      lastEntry.low = Math.min(lastEntry.low, latestPrice);
      data[data.length - 1] = lastEntry;
    }
  }, [data, latestPrice])

  if (data && data[0].open === undefined) {
    return (
      <header className="Chart-holder">
        {"History data not available. The stock might have been suspended or delisted."}
      </header>
    )
  }

  return (
    <Grid container>
      <Grid item xs />
      <Grid item xs={11} align="left">
        { data ? 
          <Chart type="hybrid" data={data} symbol={symbol} /> : (
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
