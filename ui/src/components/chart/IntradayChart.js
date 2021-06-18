import React from 'react';
import Grid from '@material-ui/core/Grid';
import Chart from './CandleStickChartIntraday';
import { getStockIntraday } from '../../utils/APIUtils';
import LoadingIndicator from '../../common/LoadingIndicator';


class IntradayChart extends React.Component {
	componentDidMount() {
		getStockIntraday(this.props.symbol).then(data => {
      if (data && data.length) this.setState({ data });
      else this.setState(null);
		}).catch(err => { console.log(err); this.setState(null); })
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

export default IntradayChart;