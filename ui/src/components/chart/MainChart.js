import React from 'react';
import Chart from './CandleStickChart';
import { getStockHistory } from '../../utils/APIUtils';
import LoadingIndicator from '../../common/LoadingIndicator';


class MainChart extends React.Component {
	componentDidMount() {
		getStockHistory(this.props.symbol, this.props.interval).then(data => {
      if (data && data.length) this.setState({ data });
      else this.setState(null);
		}).catch(err => { console.log(err); this.setState(null); })
	}

	render() {
		return (
      this.state ? <Chart type="hybrid" data={this.state.data}/> : (
        <header className="Chart-placeholder">
          {"Loading chart..."}
          <LoadingIndicator />
        </header>
      )
		)
	}
}

export default MainChart;