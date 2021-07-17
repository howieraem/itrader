import './ChartHolder.css';
import React from 'react';
import Grid from '@material-ui/core/Grid';
import Chart from './CandleStickMinuteChart';
import { getStockToday } from '../../utils/DataAPIUtils';
import LoadingIndicator from '../../common/LoadingIndicator';


export default function MinuteChart(props) {
  const { symbol, minute } = props;
  const [data, setData] = React.useState(null);

  React.useEffect(() => {
    const symbolKey = symbol + "_m" + minute;
    let symbolCache;
    if (minute >= 30 && (symbolCache = localStorage.getItem(symbolKey))) {
      let data = JSON.parse(symbolCache);
      data.forEach((entry) => {
        // recover date format
        entry.date = new Date(entry.date);
      });
      setData(data);
    } else {
      getStockToday(symbol, minute).then(data => {
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
  }, [symbol, minute]);

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
