import './ChartHolder.css';
import React from 'react';
import Chart from './CandleStickChart';
import { getStockHistory } from '../../utils/DataAPI';
import LoadingIndicator from '../../common/LoadingIndicator';


export default function HistoryChart(props) {
  const { symbol, interval, latestTime, latestPrice } = props;
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
      const lastCachedDate = data[data.length - 1].date;
      const cur = new Date();
      const isWeekend = (cur.getDate() - lastCachedDate.getDate() < 2) && (cur.getDay() === 6 || cur.getDay() === 0);
      if (isWeekend || lastCachedDate.getDate() === cur.getDate()) {
        setData(data);
        return;
      } else {
        localStorage.removeItem(symbolKey);
      }
    }

    getStockHistory(symbol, interval)
      .then(data => {
        if (data && data.length) {
          const lastEntry = data[data.length - 1];
          if (!lastEntry.open && !lastEntry.close && !lastEntry.high && !lastEntry.low) {
            // this may happen on the first day of a month
            data.pop();
          }
          setData(data);
          try {
            localStorage.setItem(symbolKey, JSON.stringify(data));
          } catch (e) {
            // don't cache if quota exceeded
          }
        } else {
          setData(null);
        }})
      .catch(err => { console.log(err); setData(null); })
  }, [symbol, interval])

  React.useEffect(() => {
    if (data && data[0].open && latestPrice > 0) {
      const lastEntry = data[data.length - 1];
      if (lastEntry.open !== undefined && lastEntry.date.getDate() === latestTime.getDate()) {
        lastEntry.close = latestPrice;
        lastEntry.high = Math.max(lastEntry.high, latestPrice);
        lastEntry.low = Math.min(lastEntry.low, latestPrice);
        data[data.length - 1] = lastEntry;
      }
    }
  }, [data, latestTime, latestPrice])

  if (data && data[0].open === undefined) {
    return (
      <header className="Chart-holder">
        {"History data not available. The stock might have been suspended or delisted."}
      </header>
    )
  }

  return (
    data ? <Chart type="hybrid" data={data} symbol={symbol} /> : (
      <header className="Chart-holder">
        {"Loading chart..."}
        <LoadingIndicator />
      </header>
    )
  )
}
