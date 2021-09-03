import './ChartHolder.css';
import React from 'react';
import { useTheme } from "@material-ui/core/styles";
import HistoryChartCore from './HistoryChartCore';
import { getStockHistory } from '../../utils/DataAPI';
import LoadingIndicator from '../../common/LoadingIndicator';
import FormControlLabel from "@material-ui/core/FormControlLabel";
import Checkbox from "@material-ui/core/Checkbox";
import FormGroup from "@material-ui/core/FormGroup";
import MenuItem from '@material-ui/core/MenuItem';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';

const changeScroll = () => {
  let style = document.body.style.overflow;
  document.body.style.overflow = style === 'hidden' ? 'auto' : 'hidden';
}

export default function HistoryChart(props) {
  const { symbol, interval, latestTime, latestPrice } = props;
  const chartCfgKey = `${symbol}_${interval}_chartCfg`;
  const theme = useTheme();

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
    const symbolKey = `${symbol}_${interval}`;
    const symbolCache = localStorage.getItem(symbolKey);
    if (symbolCache) {
      let data = JSON.parse(symbolCache);
      data.forEach((entry) => {
        // recover date format
        entry.date = new Date(entry.date);
      });
      const lastCachedDate = data[data.length - 1].date;
      const cur = new Date();
      const isWeekend = (cur.getDate() - lastCachedDate.getDate() < 2) && (cur.getDay() % 6 === 0);
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
      <>
        <FormGroup row style={{ paddingLeft: 10 }}>
          <FormControl
            style={{
              minWidth: 100,
              marginRight: theme.spacing(2),
            }}
          >
            <Select
              value={state.chartType}
              onChange={handleChartTypeChange}
              displayEmpty
              style={{ fontSize: "0.8rem" }}
            >
              <MenuItem value="candlestick" style={{ fontSize: "0.8rem" }}>Candle Stick</MenuItem>
              <MenuItem value="ohlc" style={{ fontSize: "0.8rem" }}>OHLC</MenuItem>
            </Select>
          </FormControl>
          <FormControlLabel
            control={
              <Checkbox
                checked={state.showSma}
                onChange={handleCheckboxChange}
                name="showSma"
                color="primary"
                style={{ transform: "scale(0.8)", padding: 3 }}
              />
            }
            label="SMA"
            style={{ marginRight: 20 }}
          />
          <FormControlLabel
            control={
              <Checkbox
                checked={state.showEma}
                onChange={handleCheckboxChange}
                name="showEma"
                color="primary"
                style={{ transform: "scale(0.8)", padding: 3 }}
              />
            }
            label="EMA"
            style={{ marginRight: 20 }}
          />
          <FormControlLabel
            control={
              <Checkbox
                checked={state.showBoll}
                onChange={handleCheckboxChange}
                name="showBoll"
                color="primary"
                style={{ transform: "scale(0.8)", padding: 3 }}
              />
            }
            label="BOLL"
            style={{ marginRight: 20 }}
          />
          <FormControlLabel
            control={
              <Checkbox
                checked={state.showVol}
                onChange={handleCheckboxChange}
                name="showVol"
                color="primary"
                style={{ transform: "scale(0.8)", padding: 3 }}
              />
            }
            label="VOL"
            style={{ marginRight: 20 }}
          />
          <FormControlLabel
            control={
              <Checkbox
                checked={state.showMacd}
                onChange={handleCheckboxChange}
                name="showMacd"
                color="primary"
                style={{ transform: "scale(0.8)", padding: 3 }}
              />
            }
            label="MACD"
            style={{ marginRight: 20 }}
          />
          <FormControlLabel
            control={
              <Checkbox
                checked={state.showRsi}
                onChange={handleCheckboxChange}
                name="showRsi"
                color="primary"
                style={{ transform: "scale(0.8)", padding: 3 }}
              />
            }
            label="RSI"
            style={{ marginRight: 20 }}
          />
          <FormControlLabel
            control={
              <Checkbox
                checked={state.showHover}
                onChange={handleCheckboxChange}
                name="showHover"
                color="primary"
                style={{ transform: "scale(0.8)", padding: 3 }}
              />
            }
            label="Hover Tool"
            style={{ marginRight: 20 }}
          />
          <FormControlLabel
            control={
              <Checkbox
                checked={state.showGrid}
                onChange={handleCheckboxChange}
                name="showGrid"
                color="primary"
                style={{ transform: "scale(0.8)", padding: 3 }}
              />
            }
            label="Grid"
            style={{ marginRight: 20 }}
          />
        </FormGroup>
        <div
          onMouseEnter={changeScroll}
          onMouseLeave={changeScroll}
        >
          <HistoryChartCore
            type="hybrid"
            data={data}
            symbol={symbol}
            showCfg={state}
          />
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
