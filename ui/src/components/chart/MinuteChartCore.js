import React from "react";
import PropTypes from "prop-types";
import { format } from "d3-format";
import { timeFormat } from "d3-time-format";
import { ChartCanvas, Chart } from "react-stockcharts";
import {
	BarSeries,
	CandlestickSeries,
} from "react-stockcharts/lib/series";
import { XAxis, YAxis } from "react-stockcharts/lib/axes";
import {
	CrossHairCursor,
	EdgeIndicator,
	CurrentCoordinate,
	MouseCoordinateX,
	MouseCoordinateY,
} from "react-stockcharts/lib/coordinates";
import { discontinuousTimeScaleProvider } from "react-stockcharts/lib/scale";
import { OHLCTooltip } from "react-stockcharts/lib/tooltip";
import { fitWidth } from "react-stockcharts/lib/helper";
import { last } from "react-stockcharts/lib/utils";
import { appearance, candlesAppearance } from "./Appearance";


class MinuteChartCore extends React.Component {
	render() {
		const { type, data: initialData, symbol, width, ratio } = this.props;
		const height = 450;

		const xScaleProvider = discontinuousTimeScaleProvider
			.inputDateAccessor(d => d.date);
		const {
			data,
			xScale,
			xAccessor,
			displayXAccessor,
		} = xScaleProvider(initialData);

		const start = xAccessor(last(data));
		const end = xAccessor(data[Math.max(0, data.length - 150)]);
		const xExtents = [start, end];

		const margin = { left: 50, right: 50, top: 10, bottom: 20 };
		const showGrid = true;
		const yGrid = showGrid ? {
			innerTickSize: -1 * (width - margin.left - margin.right),
			tickStrokeDasharray: 'ShortDot',
			tickStrokeOpacity: 0.2,
			tickStrokeWidth: 1
		} : {};
		const xGrid = showGrid ? {
			innerTickSize: -1 * (height - margin.top - margin.bottom),
			tickStrokeDasharray: 'ShortDot',
			tickStrokeOpacity: 0.2,
			tickStrokeWidth: 1
		} : {};

		return (
			<ChartCanvas
				height={height}
				width={width}
				ratio={ratio}
				margin={margin}
				type={type}
				seriesName={symbol + '_minutes'}
				data={data}
				xScale={xScale}
				xAccessor={xAccessor}
				displayXAccessor={displayXAccessor}
				xExtents={xExtents}
			>
				<Chart id={1}
          height={300}
					yExtents={[d => [d.high, d.low]]}
				>
					<XAxis axisAt="bottom" orient="bottom" {...xGrid} />
					<YAxis axisAt="right" orient="right" ticks={5} {...yGrid} />

					<MouseCoordinateX
						rectWidth={60}
						at="bottom"
						orient="bottom"
						displayFormat={timeFormat("%H:%M:%S")} />
					<MouseCoordinateY
						at="right"
						orient="right"
						displayFormat={format(".2f")} />

					<CandlestickSeries {...candlesAppearance} />
					<EdgeIndicator itemType="last" orient="right" edgeAt="right"
						yAccessor={d => d.close} {...appearance} 
          />

					<OHLCTooltip origin={[-40, 0]} xDisplayFormat={timeFormat("%Y-%m-%d %H:%M:%S")}/>
				</Chart>
        <Chart id={2}
					yExtents={[d => d.volume]}
					height={100} origin={(w, h) => [0, h - 100]}
				>
          <XAxis axisAt="bottom" orient="bottom" showTicks={false} />
					<YAxis axisAt="left" orient="left" ticks={5} tickFormat={format(".2s")} />

					<MouseCoordinateY
						at="left"
						orient="left"
						displayFormat={format(".4s")} />

					<BarSeries yAccessor={d => d.volume} {...appearance} />

					<CurrentCoordinate yAccessor={d => d.volume} fill="#9B0A47" />

					<EdgeIndicator itemType="last" orient="right" edgeAt="right"
						yAccessor={d => d.volume} displayFormat={format(".4s")} fill="#0F0F0F"/>
				</Chart>
				<CrossHairCursor />
			</ChartCanvas>
		);
	}
}

MinuteChartCore.propTypes = {
	data: PropTypes.array.isRequired,
	width: PropTypes.number.isRequired,
	ratio: PropTypes.number.isRequired,
	type: PropTypes.oneOf(["svg", "hybrid"]).isRequired,
	symbol: PropTypes.string.isRequired,
};

MinuteChartCore.defaultProps = {
	type: "svg",
};
MinuteChartCore = fitWidth(MinuteChartCore);

export default MinuteChartCore;