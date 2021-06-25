import React from 'react';
import Grid from '@material-ui/core/Grid';
import Chart from './CandleStickChartIntraday';
import { getStockToday } from '../../utils/APIUtils';
import LoadingIndicator from '../../common/LoadingIndicator';


class MinuteChart extends React.Component {
	componentDidMount() {
    let symbolKey = this.props.symbol + "_m" + this.props.minute;
    let symbolCache = localStorage.getItem(symbolKey);
    if (symbolCache) {
      let data = JSON.parse(symbolCache);
      data.forEach((entry) => {
        // recover date format
        entry.date = new Date(entry.date);
      });
      this.setState({ data })
    } else {
      getStockToday(this.props.symbol, this.props.minute).then(data => {
        if (data && data.length) { 
          this.setState({ data }); 
          localStorage.setItem(symbolKey, JSON.stringify(data));
        }
        else this.setState(null);
      }).catch(err => { console.log(err); this.setState(null); })
    }
	}

	render() {
		return (
      <Grid container>
        <Grid item xs />
        <Grid item xs={11} align="left">
          { this.state ? 
            <Chart type="hybrid" data={this.state.data} symbol={this.props.symbol} /> : (
            <header className="Chart-placeholder">
              {"Loading chart..."}
              <LoadingIndicator />
            </header> )
          }
        </Grid>
        <Grid item xs />
      </Grid>
		)
	}
}

export default MinuteChart;