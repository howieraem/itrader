import React from "react";
import PropTypes from "prop-types";

import { scaleTime } from "d3-scale";
import { curveMonotoneX } from "d3-shape";
import { format } from "d3-format";
import { timeFormat } from "d3-time-format";

import { ChartCanvas, Chart } from "react-stockcharts";
import { AreaSeries } from "react-stockcharts/lib/series";
import { XAxis, YAxis } from "react-stockcharts/lib/axes";
import { CrossHairCursor, MouseCoordinateX, MouseCoordinateY } from "react-stockcharts/lib/coordinates";
import { fitWidth } from "react-stockcharts/lib/helper";
import { createVerticalLinearGradient, hexToRGBA } from "react-stockcharts/lib/utils";


const canvasGradient = createVerticalLinearGradient([
	{ stop: 0, color: hexToRGBA("#b5d0ff", 0.2) },
	{ stop: 0.7, color: hexToRGBA("#6fa4fc", 0.4) },
	{ stop: 1, color: hexToRGBA("#4286f4", 0.8) },
]);

class AreaChart extends React.Component {
	render() {
		const { data, symbol, type, width, ratio } = this.props;
		const height = 400;

		const openTime = data[0].date;
		const lastTime = data[data.length - 1].date;
		let closeTime  = new Date(openTime);
		const endHour = openTime.getHours() + 7;
		const offset = endHour > 24 ? 1 : 0;
		closeTime.setDate(openTime.getDate() + offset);
		closeTime.setHours(endHour % 24);
		closeTime.setMinutes(0);
		closeTime.setSeconds(0);
		closeTime.setMilliseconds(0);
		if (lastTime > closeTime)  closeTime = lastTime;

    const xAccessor = d => d.date;
		const xExtents = [closeTime, openTime];
		const horizontalMargin = width <= 200 ? 0 : 50;

		const showGrid = true;
		const yGrid = showGrid ? {
			innerTickSize: -1 * width,
			tickStrokeDasharray: 'ShortDot',
			tickStrokeOpacity: 0.2,
			tickStrokeWidth: 1
		} : {};
		const xGrid = showGrid ? {
			innerTickSize: -1 * height,
			tickStrokeDasharray: 'ShortDot',
			tickStrokeOpacity: 0.2,
			tickStrokeWidth: 1
		} : {};

		return (
			<ChartCanvas ratio={ratio} width={width} height={height}
				margin={{ left: horizontalMargin, right: horizontalMargin, top: 10, bottom: 30 }}
				seriesName={symbol + '_intraday'}
				data={data} 
				type={type}
				xAccessor={xAccessor}
				displayXAccessor={xAccessor}
				xScale={scaleTime()}
				xExtents={xExtents}
				panEvent={false}
				zoomEvent={false}
			>
				<Chart id={0} yExtents={d => d.close}>
					<defs>
						<linearGradient id="MyGradient" x1="0" y1="100%" x2="0" y2="0%">
							<stop offset="0%" stopColor="#b5d0ff" stopOpacity={0.2} />
							<stop offset="70%" stopColor="#6fa4fc" stopOpacity={0.4} />
							<stop offset="100%"  stopColor="#4286f4" stopOpacity={0.8} />
						</linearGradient>
					</defs>
					<XAxis
						axisAt="bottom"
						orient="bottom"
						ticks={width >= 640 ? 14 : 7}
						zoomEnabled={false}
						{...xGrid}
					/>
					<YAxis axisAt="left" orient="left" {...yGrid} />
					<AreaSeries
						yAccessor={d => d.close}
						fill="url(#MyGradient)"
						strokeWidth={2}
						interpolation={curveMonotoneX}
						canvasGradient={canvasGradient}
					/>
					<MouseCoordinateX
						rectWidth={60}
						at="bottom"
						orient="bottom"
						displayFormat={timeFormat("%H:%M:%S")} />
					<MouseCoordinateY
						at="right"
						orient="right"
						displayFormat={format(".2f")} />
				</Chart>
				<CrossHairCursor />
			</ChartCanvas>
		);
	}
}


AreaChart.propTypes = {
	data: PropTypes.array.isRequired,
	width: PropTypes.number.isRequired,
	ratio: PropTypes.number.isRequired,
	type: PropTypes.oneOf(["svg", "hybrid"]).isRequired,
};

AreaChart.defaultProps = {
	type: "svg",
};
AreaChart = fitWidth(AreaChart);

export default AreaChart;
