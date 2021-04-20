import React from 'react'
import useDimensions from 'react-use-dimensions'
import Chart from './CandleStickChart'
import { getData } from "./utils";


class ChartComponent extends React.Component {
  componentDidMount() {
    getData().then(data => {
      this.setState({ data })
    })
  }

  render() {
    if (this.state == null) {
      return <div>Loading...</div>
    }
    return (
      // <TypeChooser>
      // 	{type => <Chart type={type} data={this.state.data} />}
      // </TypeChooser>
      <Chart type="svg" data={this.state.data}/>
    )
  }
}


function ChartWrapper (props) {
  const [ref, { width, height }] = useDimensions();
  return (
    <div ref={ref} style={{ width: '100%', height: '100%' }}>
      <ChartComponent
        height={height}
        width={width}
      />
    </div>
  )
}

export default ChartWrapper;