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
    const symbolCache = localStorage.getItem(symbolKey);
    if (symbolCache) {
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
          localStorage.setItem(symbolKey, JSON.stringify(data));
        }
        else setData(null);
      }).catch(err => { console.log(err); setData(null); })
    }
  }, [symbol, minute]);

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
