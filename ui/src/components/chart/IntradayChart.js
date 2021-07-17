import './ChartHolder.css';
import React from 'react';
import Grid from '@material-ui/core/Grid';
import Chart from './AreaChart';
import { getStockToday } from '../../utils/DataAPIUtils';
import LoadingIndicator from '../../common/LoadingIndicator';


export default function IntradayChart(props) {
  const { symbol, marketClosed } = props;
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
      const interval = setInterval(() => {
        updateData();
      }, 60000);
    
      return () => {
        clearInterval(interval);
      };
    }
  }, [symbol, marketClosed]);

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
          </header> )
        }
      </Grid>
      <Grid item xs />
    </Grid>
  )
}
