import './ChartHolder.css';
import React from 'react';
import HistoryChartCore from './HistoryChartCore';
import { getStockHistory } from '../../utils/DataAPI';
import LoadingIndicator from '../../common/LoadingIndicator';
import FormControlLabel from "@material-ui/core/FormControlLabel";
import Checkbox from "@material-ui/core/Checkbox";
import FormGroup from "@material-ui/core/FormGroup";

const changeScroll = () => {
  let style = document.body.style.overflow;
  document.body.style.overflow = style === 'hidden' ? 'auto' : 'hidden';
}

export default function HistoryChart(props) {
  const { symbol, interval, latestTime, latestPrice } = props;
  const [data, setData] = React.useState(null);

  const [state, setState] = React.useState({
    showSma: false,
    showEma: true,
    showBoll: false,
    showVol: true,
    showMacd: false,
    showRsi: false,
    showHover: false,
    showGrid: true,
  });

  const handleChange = (event) => {
    setState({ ...state, [event.target.name]: event.target.checked });
  };

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
          data = data.filter(d => {
            return d.open && d.close && d.high && d.low
          });
          if (data.length) {
            setData(data);
            try {
              localStorage.setItem(symbolKey, JSON.stringify(data));
            } catch (e) {
              // don't cache if quota exceeded
            }
          } else setData(null);
        } else setData(null);
      })
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
    data ? (
      <div
        onMouseEnter={changeScroll}
        onMouseLeave={changeScroll}
      >
        <FormGroup row>
          <FormControlLabel
            control={
              <Checkbox
                checked={state.showSma}
                onChange={handleChange}
                name="showSma"
                color="primary"
                style={{ transform: "scale(0.8)" }}
              />
            }
            label="SMA"
          />
          <FormControlLabel
            control={
              <Checkbox
                checked={state.showEma}
                onChange={handleChange}
                name="showEma"
                color="primary"
                style={{ transform: "scale(0.8)" }}
              />
            }
            label="EMA"
          />
          <FormControlLabel
            control={
              <Checkbox
                checked={state.showBoll}
                onChange={handleChange}
                name="showBoll"
                color="primary"
                style={{ transform: "scale(0.8)" }}
              />
            }
            label="BOLL"
          />
          <FormControlLabel
            control={
              <Checkbox
                checked={state.showVol}
                onChange={handleChange}
                name="showVol"
                color="primary"
                style={{ transform: "scale(0.8)" }}
              />
            }
            label="VOL"
          />
          <FormControlLabel
            control={
              <Checkbox
                checked={state.showMacd}
                onChange={handleChange}
                name="showMacd"
                color="primary"
                style={{ transform: "scale(0.8)" }}
              />
            }
            label="MACD"
          />
          <FormControlLabel
            control={
              <Checkbox
                checked={state.showRsi}
                onChange={handleChange}
                name="showRsi"
                color="primary"
                style={{ transform: "scale(0.8)" }}
              />
            }
            label="RSI"
          />
          <FormControlLabel
            control={
              <Checkbox
                checked={state.showHover}
                onChange={handleChange}
                name="showHover"
                color="primary"
                style={{ transform: "scale(0.8)" }}
              />
            }
            label="Hover Tool"
          />
          <FormControlLabel
            control={
              <Checkbox
                checked={state.showGrid}
                onChange={handleChange}
                name="showGrid"
                color="primary"
                style={{ transform: "scale(0.8)" }}
              />
            }
            label="Grid"
          />
        </FormGroup>
        <HistoryChartCore
          type="hybrid"
          data={data}
          symbol={symbol}
          chartType="candlestick"
          showCfg={state}
        />
      </div>
    ) : (
      <header className="Chart-holder">
        {"Loading chart..."}
        <LoadingIndicator />
      </header>
    )
  )
}
