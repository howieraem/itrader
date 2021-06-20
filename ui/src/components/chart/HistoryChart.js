import React from 'react';
import Grid from '@material-ui/core/Grid';
import Chart from './CandleStickChart';
import { getStockHistory } from '../../utils/APIUtils';
import LoadingIndicator from '../../common/LoadingIndicator';


class HistoryChart extends React.Component {
	componentDidMount() {
    let symbolKey = this.props.symbol + "_" + this.props.interval;
    let symbolCache = localStorage.getItem(symbolKey);
    if (symbolCache) {
      let data = JSON.parse(symbolCache);
      data.forEach((entry) => {
        // recover date format
        entry.date = new Date(entry.date);
      });
      this.setState({ data })
    } else {
      getStockHistory(this.props.symbol, this.props.interval).then(data => {
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

export default HistoryChart;