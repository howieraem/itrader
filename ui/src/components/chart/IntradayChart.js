import './ChartHolder.css';
import React from 'react';
import Grid from '@material-ui/core/Grid';
import Chart from './AreaChart';
import { getStockToday } from '../../utils/DataAPI';
import LoadingIndicator from '../../common/LoadingIndicator';


export default function IntradayChart(props) {
  const { symbol, marketClosed, latestTime, latestPrice, latestVolume } = props;
  const [data, setData] = React.useState(null);

  React.useEffect(() => {
    const updateData = () => {
      getStockToday(symbol, 1, 1).then(data => {
        if (data && data.length) {
          setData(data);
        }
        else setData(null);
      }).catch(err => { console.log(err); setData(null); })
    };
    updateData();

    if (!marketClosed) {
      let interval;
      // do update on the minute (i.e. beginning of a minute)
      setTimeout(() => {
        interval = setInterval(updateData, 60000);
      }, (60 - new Date().getSeconds()) * 1000);

      return () => {
        clearInterval(interval);
      };
    }
  }, [symbol, marketClosed]);

  React.useEffect(() => {
    if (data && data[0].open && latestTime !== null && latestPrice > 0 && latestTime > data[data.length - 1].date) {
      data.push({
        date: latestTime,
        open: latestPrice,
        close: latestPrice,
        high: latestPrice,
        low: latestPrice,
        volume: 0   // TODO volume here is within a short period of time, not day volume
      })
    }
  }, [data, latestTime, latestPrice, latestVolume])

  if (data && data[0].open === undefined) {
    return (
      <header className="Chart-holder">
        {"Intraday data not available. The stock might have been suspended or delisted."}
      </header>
    )
  }

  return (
    <Grid container>
      <Grid item xs />
      <Grid item xs={11} align="left">
        { data ? data[0].open === undefined ? (
            <header className="Chart-holder">
              {"Minute data not available. The stock might have been suspended or delisted."}
            </header>
          ) : (
            <Chart type="hybrid" data={data} {...props} />
          ) : (
            <header className="Chart-holder">
              {"Loading chart..."}
              <LoadingIndicator />
            </header>
          )
        }
      </Grid>
      <Grid item xs />
    </Grid>
  )
}
