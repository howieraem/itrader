import './ChartHolder.css';
import React from 'react';
import Chart from './AreaChart';
import { getStockToday } from '../../utils/DataAPI';
import LoadingIndicator from '../../common/LoadingIndicator';

export default function IntradayChart(props) {
  const { symbol, marketClosed, latestTime, latestPrice, latestVolume } = props;
  const [data, setData] = React.useState(null);
  const [initialLatestTime, setInitialLatestTime] = React.useState(null);

  React.useEffect(() => {
    const cacheKey = symbol + "_i";

    const updateData = () => {
      let rawCache, cache;
      let cacheValid = false;
      if ((rawCache = localStorage.getItem(cacheKey))) {
        cache = JSON.parse(rawCache);
        cache.forEach((entry) => {
          // recover date format
          entry.date = new Date(entry.date);
        });
        cacheValid = (new Date() - cache[cache.length - 1].date < 58000);
      }
      if (cacheValid) {
        setData(cache);
      } else {
        getStockToday(symbol, 1, 1).then(fetched => {
          if (fetched && fetched.length) {
            if (fetched[0].open !== undefined && fetched[fetched.length - 1].date) {
              setInitialLatestTime(fetched[fetched.length - 1].date);
            }
            try {
              localStorage.setItem(cacheKey, JSON.stringify(fetched));
            } catch (e) {
              // don't store cache if quota exceeded
            }
            setData(fetched);
          }
          else setData(null);
        }).catch(err => { console.log(err); setData(null); })
      }
    };
    updateData();

    if (!marketClosed) {
      let interval;
      // update on the minute (i.e. beginning of a minute)
      setTimeout(() => {
        interval = setInterval(updateData, 60000);
      }, (60 - new Date().getSeconds()) * 1000);

      return () => {
        clearInterval(interval);
      };
    }
  }, [symbol, marketClosed, ]);

  React.useEffect(() => {
    if (initialLatestTime && latestTime !== null && latestTime > initialLatestTime && latestPrice > 0 ) {
      setData(preData => [...preData, {
        date: latestTime,
        open: latestPrice,
        close: latestPrice,
        high: latestPrice,
        low: latestPrice,
        volume: 0   // TODO volume here is within a short period of time, not day volume
      }]);
    }
  }, [initialLatestTime, latestTime, latestPrice, latestVolume])

  if (data && data[0].open === undefined) {
    return (
      <header className="Chart-holder">
        {"Failed to fetch intraday data. Please try refreshing the page, or check whether the stock has been delisted."}
      </header>
    )
  }

  return (
    data ? (
      <Chart type="hybrid" data={data} {...props} />
    ) : (
      <header className="Chart-holder">
        {"Loading chart..."}
        <LoadingIndicator />
      </header>
    )
  )
}
