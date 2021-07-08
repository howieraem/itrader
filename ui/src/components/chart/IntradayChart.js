import React from 'react';
import Grid from '@material-ui/core/Grid';
import Chart from './AreaChart';
import { getStockToday } from '../../utils/DataAPIUtils';
import LoadingIndicator from '../../common/LoadingIndicator';


class IntradayChart extends React.Component {
  constructor(props) {
    super(props);
    this.updateData.bind(this);
    this.interval = setInterval(
      () => this.updateData(),
      60000
    )
  }

  updateData() {
    getStockToday(this.props.symbol, 1, 1).then(data => {
      if (data && data.length) { 
        this.setState({ data });
      }
      else this.setState(null);
    }).catch(err => { console.log(err); this.setState(null); })
  }

	componentDidMount() {
    this.updateData();
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