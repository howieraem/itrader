import React from "react";
import PropTypes from "prop-types";
import { format } from "d3-format";
import { timeFormat } from "d3-time-format";
import { ChartCanvas, Chart } from "react-stockcharts";
import {
	BarSeries,
	CandlestickSeries,
	LineSeries,
	RSISeries,
} from "react-stockcharts/lib/series";
import { XAxis, YAxis } from "react-stockcharts/lib/axes";
import { EdgeIndicator, MouseCoordinateY } from "react-stockcharts/lib/coordinates";
import { discontinuousTimeScaleProvider } from "react-stockcharts/lib/scale";
import {
	HoverTooltip,
	RSITooltip,
} from "react-stockcharts/lib/tooltip";
import { ema, rsi } from "react-stockcharts/lib/indicator";
import { fitWidth } from "react-stockcharts/lib/helper";
import { last } from "react-stockcharts/lib/utils";

import { appearance, candlesAppearance } from "./Appearance";


const dateFormat = timeFormat("%Y-%m-%d");
const numberFormat = format(".2f");

function tooltipContent(ys) {
	return ({ currentItem, xAccessor }) => {
		return {
			x: dateFormat(xAccessor(currentItem)),
			y: [
				{
					label: "open",
					value: currentItem.open && numberFormat(currentItem.open)
				},
				{
					label: "high",
					value: currentItem.high && numberFormat(currentItem.high)
				},
				{
					label: "low",
					value: currentItem.low && numberFormat(currentItem.low)
				},
				{
					label: "close",
					value: currentItem.close && numberFormat(currentItem.close)
				}
			]
				.concat(
					ys.map(each => ({
						label: each.label,
						value: each.value(currentItem),
						stroke: each.stroke
					}))
				)
				.filter(line => line.value)
		};
	};
}

class CandleStickChartWithHoverTooltip extends React.Component {
	render() {
		let { type, data: initialData, symbol, width, ratio } = this.props;

		if (initialData.length === 1) {
			// If only one valid data point is available (e.g. recently IPOed),
			// need to add a made-up data point to the front.
			// See https://github.com/rrag/react-stockcharts/issues/393
			initialData.push(Object.assign({}, initialData[0]));
			initialData[0].high = initialData[0].low = initialData[0].close = initialData[0].open;
			initialData[0].volume = 0;
		}

		const heights = [300, 100, 100];	// TODO show/hide charts by setting heights to nonzero/zero
		const height = heights.reduce((a, b) => a + b, 0) + 50;

		const ema20 = ema()
			.id(0)
			.options({ windowSize: 20 })
			.merge((d, c) => {
				d.ema20 = c;
			})
			.accessor(d => d.ema20);

		const ema50 = ema()
			.id(2)
			.options({ windowSize: 50 })
			.merge((d, c) => {
				d.ema50 = c;
			})
			.accessor(d => d.ema50);

		const ema100 = ema()
			.id(3)
			.options({ windowSize: 100 })
			.merge((d, c) => {
				d.ema100 = c;
			})
			.accessor(d => d.ema100);

		const ema250 = ema()
			.id(4)
			.options({ windowSize: 250 })
			.merge((d, c) => {
				d.ema250 = c;
			})
			.accessor(d => d.ema250);

		const rsi1 = rsi()
			.id(0)
			.options({ windowSize: 7 })
			.merge((d, c) => {d.rsi1 = c;})
			.accessor(d => d.rsi1);

		const rsi2 = rsi()
			.id(1)
			.options({ windowSize: 14 })
			.merge((d, c) => {d.rsi2 = c;})
			.accessor(d => d.rsi2);

		const rsi3 = rsi()
			.id(2)
			.options({ windowSize: 21 })
			.merge((d, c) => {d.rsi3 = c;})
			.accessor(d => d.rsi3);

		const margin = { left: 50, right: 70, top: 10, bottom: 20 };

		const calculatedData = rsi3(rsi2(rsi1(ema250(ema100(ema50(ema20(initialData)))))));
		const xScaleProvider = discontinuousTimeScaleProvider
			.inputDateAccessor(d => d.date);
    const {
      data,
      xScale,
      xAccessor,
      displayXAccessor,
    } = xScaleProvider(calculatedData);

		const start = xAccessor(last(data));
		const end = xAccessor(data[Math.max(0, data.length - 150)]);
		const xExtents = [start, end];

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
				ratio={ratio}
				width={width}
				margin={margin}
				type={type}
				seriesName={symbol + '_history'}
				data={data}
				xScale={xScale}
				xAccessor={xAccessor}
				displayXAccessor={displayXAccessor}
				xExtents={xExtents}
			>
				<Chart
					id={1}
					height={heights[0]}
					yExtents={[
						d => [d.high, d.low], ema20.accessor(), ema50.accessor(), ema100.accessor(), ema250.accessor()
					]}
				>
					<YAxis axisAt="right" orient="right" ticks={5} {...yGrid} />
					<XAxis axisAt="bottom" orient="bottom" {...xGrid} />
					<CandlestickSeries {...candlesAppearance} />
          <LineSeries yAccessor={ema20.accessor()} stroke={ema20.stroke()} />
					<LineSeries yAccessor={ema50.accessor()} stroke={ema50.stroke()} />
					<LineSeries yAccessor={ema100.accessor()} stroke={ema100.stroke()} />
					<LineSeries yAccessor={ema250.accessor()} stroke={ema250.stroke()} />

					<EdgeIndicator
						itemType="last"
						orient="right"
						edgeAt="right"
						yAccessor={d => d.close}
						{...appearance}
					/>

					<HoverTooltip
						yAccessor={ema50.accessor()}
						tooltipContent={tooltipContent([
							{
								label: `${ema20.type()}(${ema20.options().windowSize})`,
								value: d => ema20.accessor()(d) && numberFormat(ema20.accessor()(d)),
								stroke: ema20.stroke()
							},
							{
								label: `${ema50.type()}(${ema50.options().windowSize})`,
								value: d => ema50.accessor()(d) && numberFormat(ema50.accessor()(d)),
								stroke: ema50.stroke()
							},
							{
								label: `${ema100.type()}(${ema100.options().windowSize})`,
								value: d => ema100.accessor()(d) && numberFormat(ema100.accessor()(d)),
								stroke: ema100.stroke()
							},
							{
								label: `${ema250.type()}(${ema250.options().windowSize})`,
								value: d => ema250.accessor()(d) && numberFormat(ema250.accessor()(d)),
								stroke: ema250.stroke()
							}
						])}
						fontSize={15}
					/>
				</Chart>
				{ heights[1] && (
					<Chart
						id={2}
						origin={(w, h) => [0, h - heights[1] - heights[2]]}
						height={heights[1]}
						yExtents={d => d.volume}
					>
						<XAxis axisAt="bottom" orient="bottom" showTicks={false} />
						<YAxis axisAt="left" orient="left" ticks={5} tickFormat={format(".2s")} />
						<BarSeries yAccessor={d => d.volume} {...appearance} />
					</Chart>
				)}
				{ heights[2] && (
					<Chart
						id={3}
						yExtents={[0, 100]}
						height={heights[2]}
						origin={(w, h) => [0, h - heights[2]]}
					>
						<XAxis axisAt="bottom" orient="bottom" showTicks={false} outerTickSize={0} />
						<YAxis
							axisAt="right"
							orient="right"
							tickValues={[30, 50, 70]}
						/>
						<MouseCoordinateY
							at="right"
							orient="right"
							displayFormat={format(".2f")}
						/>

						<RSISeries
							yAccessor={d => d.rsi1}
							stroke={{
								line: "#000000",
								top: "#B8C2CC",
								middle: "#8795A1",
								bottom: "#B8C2CC",
								outsideThreshold: "#cd5b00",
								insideThreshold: "#ff9740"
							}}
						/>
						<RSISeries
							yAccessor={d => d.rsi2}
							stroke={{
								line: "#000000",
								top: "#B8C2CC",
								middle: "#8795A1",
								bottom: "#B8C2CC",
								outsideThreshold: "#0051b3",
								insideThreshold: "#529fff"
							}}
						/>
						<RSISeries
							yAccessor={d => d.rsi3}
							stroke={{
								line: "#000000",
								top: "#B8C2CC",
								middle: "#8795A1",
								bottom: "#B8C2CC",
								outsideThreshold: "#b300b3",
								insideThreshold: "#ff66ff"
							}}
						/>

						<RSITooltip
							origin={[-38, 15]}
							yAccessor={d => d.rsi1}
							options={rsi1.options()}
							labelFill={"#ff9740"}
						/>
						<RSITooltip
							origin={[38, 15]}
							yAccessor={d => d.rsi2}
							options={rsi2.options()}
							labelFill={"#529fff"}
						/>
						<RSITooltip
							origin={[120, 15]}
							yAccessor={d => d.rsi3}
							options={rsi3.options()}
							labelFill={"#ff66ff"}
						/>
					</Chart>
				)}

			</ChartCanvas>
		);
	}
}

CandleStickChartWithHoverTooltip.propTypes = {
	data: PropTypes.array.isRequired,
	width: PropTypes.number.isRequired,
	ratio: PropTypes.number.isRequired,
	type: PropTypes.oneOf(["svg", "hybrid"]).isRequired
};

CandleStickChartWithHoverTooltip.defaultProps = {
	type: "svg"
};
CandleStickChartWithHoverTooltip = fitWidth(CandleStickChartWithHoverTooltip);

export default CandleStickChartWithHoverTooltip;
