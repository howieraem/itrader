import React from "react";
import PropTypes from "prop-types";
import { format } from "d3-format";
import { timeFormat } from "d3-time-format";
import { ChartCanvas, Chart } from "react-stockcharts";
import {
	BarSeries,
	BollingerSeries,
	CandlestickSeries,
	LineSeries,
	OHLCSeries,
	RSISeries,
} from "react-stockcharts/lib/series";
import { XAxis, YAxis } from "react-stockcharts/lib/axes";
import {
	CrossHairCursor,
	CurrentCoordinate,
	EdgeIndicator,
	MouseCoordinateY
} from "react-stockcharts/lib/coordinates";
import { discontinuousTimeScaleProvider } from "react-stockcharts/lib/scale";
import {
	BollingerBandTooltip,
	HoverTooltip,
	MovingAverageTooltip,
	OHLCTooltip,
	RSITooltip,
} from "react-stockcharts/lib/tooltip";
import {
	bollingerBand,
	change,
	ema,
	rsi,
	sma
} from "react-stockcharts/lib/indicator";
import { fitWidth } from "react-stockcharts/lib/helper";
import { last } from "react-stockcharts/lib/utils";

import { appearance, candlesAppearance, stroke, bollStroke } from "./Appearance";


const dateFormat = timeFormat("%Y-%m-%d");
const numberFormat = format(".2f");
const volFormat = format(".4s");

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

class HistoryChartCore extends React.Component {
	render() {
		let {
			type,
			data: initialData,
			symbol,
			width,
			ratio,
			chartType,
			showCfg
		} = this.props;

		const {
			showSma,
			showEma,
			showBoll,
			showVol,
			showMacd,
			showRsi,
			showHover
		} = showCfg;

		if (initialData.length === 1) {
			// If only one valid data point is available (e.g. recently IPOed),
			// need to add a made-up data point to the front.
			// See https://github.com/rrag/react-stockcharts/issues/393
			initialData.push(Object.assign({}, initialData[0]));
			initialData[0].high = initialData[0].low = initialData[0].close = initialData[0].open;
			initialData[0].volume = 0;
		}

		const heights = [
			300,	// main chart
			100 * (showVol | 0),
			// 100 * (showMacd | 0),
			100 * (showRsi | 0),
		];
		const height = heights.reduce((a, b) => a + b, 0) + 50;

		const changeCalculator = change();

		const ema20 = ema()
			.id(0)
			.options({ windowSize: 20 })
			.merge((d, c) => {
				d.ema20 = c;
			})
			.accessor(d => d.ema20);

		const ema50 = ema()
			.id(1)
			.options({ windowSize: 50 })
			.merge((d, c) => {
				d.ema50 = c;
			})
			.accessor(d => d.ema50);

		const ema100 = ema()
			.id(2)
			.options({ windowSize: 100 })
			.merge((d, c) => {
				d.ema100 = c;
			})
			.accessor(d => d.ema100);

		const ema250 = ema()
			.id(5)
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

		const bb = bollingerBand()
			.merge((d, c) => {d.bb = c;})
			.accessor(d => d.bb);

		const margin = { left: 50, right: 70, top: 10, bottom: 20 };

		let calculatedData = initialData;
		if (showEma)  calculatedData = ema250(ema100(ema50(ema20(calculatedData))));
		if (chartType === "ohlc")  calculatedData = changeCalculator(calculatedData);
		if (showBoll)  calculatedData = bb(calculatedData);
		if (showRsi)  calculatedData = rsi3(rsi2(rsi1(calculatedData)))

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

		const mainChart = chartType === "candlestick" ?
			<CandlestickSeries {...candlesAppearance} /> :
			<OHLCSeries stroke={stroke} />;

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
					{ mainChart }

					{ showEma && (
						<>
							<LineSeries yAccessor={ema20.accessor()} stroke={ema20.stroke()} />
							<LineSeries yAccessor={ema50.accessor()} stroke={ema50.stroke()} />
							<LineSeries yAccessor={ema100.accessor()} stroke={ema100.stroke()} />
							<LineSeries yAccessor={ema250.accessor()} stroke={ema250.stroke()} />
							<CurrentCoordinate yAccessor={ema20.accessor()} fill={ema20.stroke()} />
							<CurrentCoordinate yAccessor={ema50.accessor()} fill={ema50.stroke()} />
							<CurrentCoordinate yAccessor={ema100.accessor()} fill={ema100.stroke()} />
							<CurrentCoordinate yAccessor={ema250.accessor()} fill={ema250.stroke()} />
						</>
					)}

					<EdgeIndicator
						itemType="last"
						orient="right"
						edgeAt="right"
						yAccessor={d => d.close}
						{...appearance}
					/>

					{!showHover && (
						<>
							<OHLCTooltip origin={[-38, 0]} />
							<MovingAverageTooltip
								origin={[-38, 15]}
								options={
									showEma ? [
										{
											yAccessor: ema20.accessor(),
											type: "EMA",
											stroke: ema20.stroke(),
											windowSize: ema20.options().windowSize,
										},
										{
											yAccessor: ema50.accessor(),
											type: "EMA",
											stroke: ema50.stroke(),
											windowSize: ema50.options().windowSize,
										},
										{
											yAccessor: ema100.accessor(),
											type: "EMA",
											stroke: ema100.stroke(),
											windowSize: ema100.options().windowSize,
										},
										{
											yAccessor: ema250.accessor(),
											type: "EMA",
											stroke: ema250.stroke(),
											windowSize: ema250.options().windowSize,
										},
									] : []}
							/>
						</>
					)}


					{ showBoll && (
						<>
							<BollingerSeries
								yAccessor={d => d.bb}
								stroke={bollStroke}
								fill={bollStroke.fill}
							/>
							{ !showHover && (
								<BollingerBandTooltip
									origin={[-38, showEma ? 60 : 15]}
									yAccessor={d => d.bb}
									options={bb.options()}
								/>
							)}
						</>
					)}

					{ showHover && (
						<HoverTooltip
							yAccessor={ema50.accessor()}
							tooltipContent={tooltipContent([
								{
									label: "vol",
									value: d => volFormat(d.volume),
								}
							].concat(showEma ? [
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
							] : []).concat(showBoll ? [
								{
									label: 'Boll Bottom',
									value: d => d.bb && numberFormat(d.bb.bottom),
									stroke: bollStroke.bottom
								},
								{
									label: 'Boll Middle',
									value: d => d.bb && numberFormat(d.bb.middle),
									stroke: bollStroke.middle
								},
								{
									label: 'Boll Top',
									value: d => d.bb && numberFormat(d.bb.top),
									stroke: bollStroke.top
								},
							] : []))}
							fontSize={13}
						/>
					)}
					{!showHover && <CrossHairCursor />}
				</Chart>
				{ showVol && (
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
				{ showRsi && (
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

HistoryChartCore.propTypes = {
	data: PropTypes.array.isRequired,
	width: PropTypes.number.isRequired,
	ratio: PropTypes.number.isRequired,
	type: PropTypes.oneOf(["svg", "hybrid"]).isRequired,
	symbol: PropTypes.string.isRequired,
	chartType: PropTypes.oneOf(["candlestick", "ohlc"]).isRequired,
	showCfg: PropTypes.object.isRequired,
};

HistoryChartCore.defaultProps = {
	type: "svg"
};
HistoryChartCore = fitWidth(HistoryChartCore);

export default HistoryChartCore;
