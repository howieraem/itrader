import './ChartHolder.css';
import React from 'react';
import MinuteChartCore from './MinuteChartCore';
import { getStockToday } from '../../utils/DataAPI';
import LoadingIndicator from '../../common/LoadingIndicator';

const changeScroll = () => {
  let style = document.body.style.overflow;
  document.body.style.overflow = style === 'hidden' ? 'auto' : 'hidden';
}

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
              data = data.filter(d => {
                return d.open && d.close && d.high && d.low
              });
              if (data.length) {
                setData(data);
                try {
                  localStorage.setItem(cacheKey, JSON.stringify(data));
                } catch (e) {
                  // don't store cache if quota exceeded
                }
              } else setData(null);
            } else setData(null);
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
    data ? data[0].open === undefined ? (
      <header className="Chart-holder">
        {"Failed to fetch minute data. Please try refreshing the page, or check whether the stock is listed."}
      </header>
    ) : (
      <div
        onMouseEnter={changeScroll}
        onMouseLeave={changeScroll}
      >
        <MinuteChartCore type="hybrid" data={data} symbol={symbol} />
        <div style={{ fontSize: 12, marginLeft: 5 }}>
          Due to data source limitations, minute chart can only cover a maximum of 7 days.
        </div>
      </div>
    ) : (
      <header className="Chart-holder">
        {"Loading chart..."}
        <LoadingIndicator />
      </header>
    )
  )
}
