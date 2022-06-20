import './ChartHolder.css';
import React from 'react';
import HistoryChartCore from "./HistoryChartCore";
import HistoryChartSettings from "./HistoryChartSettings";
import { getMinuteData } from '../../utils/DataAPI';
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
  const chartCfgKey = `${symbol}_${minute}min_chartCfg`;

  const [data, setData] = React.useState(null);
  const [state, setState] = React.useState(JSON.parse(localStorage.getItem(chartCfgKey)) || {
    chartType: "candlestick",
    showSma: false,
    showEma: true,
    showBoll: false,
    showVol: true,
    showMacd: false,
    showRsi: false,
    showHover: false,
    showGrid: true,
  });

  const handleChartTypeChange = (event) => {
    const newState = { ...state, chartType: event.target.value };
    setState(newState);
    localStorage.setItem(chartCfgKey, JSON.stringify(newState));
  };

  const handleCheckboxChange = (event) => {
    const newState = { ...state, [event.target.name]: event.target.checked };
    setState(newState);
    localStorage.setItem(chartCfgKey, JSON.stringify(newState));
  };

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
        getMinuteData(symbol, minute)
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
      <>
        <HistoryChartSettings
          state={state}
          handleChartTypeChange={handleChartTypeChange}
          handleCheckboxChange={handleCheckboxChange}
        />
        <div
          onMouseEnter={changeScroll}
          onMouseLeave={changeScroll}
        >
          <HistoryChartCore
            type="hybrid"
            data={data}
            showCfg={state}
            isMinute={true}
          />
          <div style={{ fontSize: 12, marginLeft: 5 }}>
            Due to data source limitations, minute chart can only cover a maximum of 7 days.
          </div>
        </div>
      </>
    ) : (
      <header className="Chart-holder">
        {"Loading chart..."}
        <LoadingIndicator />
      </header>
    )
  )
}
