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
	MACDSeries,
	OHLCSeries,
	RSISeries,
} from "react-stockcharts/lib/series";
import { XAxis, YAxis } from "react-stockcharts/lib/axes";
import {
	CrossHairCursor,
	CurrentCoordinate,
	EdgeIndicator,
	MouseCoordinateX,
	MouseCoordinateY
} from "react-stockcharts/lib/coordinates";
import { discontinuousTimeScaleProvider } from "react-stockcharts/lib/scale";
import {
	BollingerBandTooltip,
	HoverTooltip,
	MACDTooltip,
	MovingAverageTooltip,
	OHLCTooltip,
	RSITooltip,
} from "react-stockcharts/lib/tooltip";
import {
	bollingerBand,
	change,
	ema,
	macd,
	rsi,
	sma,
} from "react-stockcharts/lib/indicator";
import { fitWidth } from "react-stockcharts/lib/helper";
import { last } from "react-stockcharts/lib/utils";

import {
	appearance,
	bollStroke,
	candlesAppearance,
	macdAppearance,
	mouseEdgeAppearance,
	ohlcStroke,
	rsi1Stroke,
	rsi2Stroke,
	rsi3Stroke,
} from "./Appearance";


const dateFormat = timeFormat("%Y-%m-%d");
const mintFormat = timeFormat("%Y-%m-%d %H:%M");
const numberFormat = format(".2f");
const volFormat = format(".4s");

const calcChange = change();

const sma5 = sma()
	.options({ windowSize: 5 })
	.merge((d, c) => {
		d.sma5 = c;
	})
	.accessor(d => d.sma5);

const sma20 = sma()
	.options({ windowSize: 20 })
	.merge((d, c) => {
		d.sma20 = c;
	})
	.accessor(d => d.sma20);

const sma50 = sma()
	.options({ windowSize: 50 })
	.merge((d, c) => {
		d.sma50 = c;
	})
	.accessor(d => d.sma50);

const sma100 = sma()
	.options({ windowSize: 100 })
	.merge((d, c) => {
		d.sma100 = c;
	})
	.accessor(d => d.sma100);

const sma250 = sma()
	.options({ windowSize: 250 })
	.merge((d, c) => {
		d.sma250 = c;
	})
	.accessor(d => d.sma250);

const ema5 = ema()
	.options({ windowSize: 5 })
	.merge((d, c) => {
		d.ema5 = c;
	})
	.accessor(d => d.ema5);

const ema20 = ema()
	.options({ windowSize: 20 })
	.merge((d, c) => {
		d.ema20 = c;
	})
	.accessor(d => d.ema20);

const ema50 = ema()
	.options({ windowSize: 50 })
	.merge((d, c) => {
		d.ema50 = c;
	})
	.accessor(d => d.ema50);

const ema100 = ema()
	.options({ windowSize: 100 })
	.merge((d, c) => {
		d.ema100 = c;
	})
	.accessor(d => d.ema100);

const ema250 = ema()
	.options({ windowSize: 250 })
	.merge((d, c) => {
		d.ema250 = c;
	})
	.accessor(d => d.ema250);

const bb = bollingerBand()
	.merge((d, c) => {d.bb = c;})
	.accessor(d => d.bb);

const calcMacd = macd()
	.options({
		fast: 12,
		slow: 26,
		signal: 9,
	})
	.merge((d, c) => {d.macd = c;})
	.accessor(d => d.macd);

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

const xScaleProvider = discontinuousTimeScaleProvider.inputDateAccessor(d => d.date);

const margin = { left: 50, right: 70, top: 10, bottom: 20 };

class HistoryChartCore extends React.Component {
	render() {
		let {
			type,
			data: initialData,
			width,
			ratio,
			showCfg,
			isMinute
		} = this.props;

		const tFormat = isMinute ? mintFormat : dateFormat;
		const tooltipContent = (ys, tFormat) => {
			return ({ currentItem, xAccessor }) => {
				return {
					x: tFormat(xAccessor(currentItem)),
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
						},
						{
							label: "vol",
							value: currentItem.volume && volFormat(currentItem.volume).replace(/G/, "B")
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

		const {
			chartType,
			showSma,
			showEma,
			showBoll,
			showVol,
			showMacd,
			showRsi,
			showHover,
			showGrid,
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
			100 * (showMacd | 0),
			100 * (showRsi | 0),
		];
		const height = heights.reduce((a, b) => a + b, 0) + 50;

		let calculatedData = initialData;
		if (chartType === "ohlc")  calculatedData = calcChange(calculatedData);
		if (showSma)  calculatedData = sma250(sma100(sma50(sma20(sma5(calculatedData)))));
		if (showEma)  calculatedData = ema250(ema100(ema50(ema20(ema5(calculatedData)))));
		if (showBoll)  calculatedData = bb(calculatedData);
		if (showMacd)  calculatedData = calcMacd(calculatedData);
		if (showRsi)  calculatedData = rsi3(rsi2(rsi1(calculatedData)));

    const {
      data,
      xScale,
      xAccessor,
      displayXAccessor,
    } = xScaleProvider(calculatedData);

		const start = xAccessor(last(data));
		const end = xAccessor(data[Math.max(0, data.length - 150)]);
		const xExtents = [start, end];

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
			<OHLCSeries stroke={ohlcStroke} />;

		return (
      <ChartCanvas 
        height={height}
				ratio={ratio}
				width={width}
				margin={margin}
				type={type}
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
						d => [d.high, d.low], sma250.accessor(), ema250.accessor(), bb.accessor()
					]}
				>
					<XAxis axisAt="bottom" orient="bottom" {...xGrid} />
					<YAxis axisAt="right" orient="right" ticks={5} {...yGrid} />
					{ mainChart }

					{ showSma && (
						<>
							<LineSeries yAccessor={sma5.accessor()} stroke={sma5.stroke()} />
							<LineSeries yAccessor={sma20.accessor()} stroke={sma20.stroke()} />
							<LineSeries yAccessor={sma50.accessor()} stroke={sma50.stroke()} />
							<LineSeries yAccessor={sma100.accessor()} stroke={sma100.stroke()} />
							<LineSeries yAccessor={sma250.accessor()} stroke={sma250.stroke()} />
							<CurrentCoordinate yAccessor={sma5.accessor()} fill={sma5.stroke()} />
							<CurrentCoordinate yAccessor={sma20.accessor()} fill={sma20.stroke()} />
							<CurrentCoordinate yAccessor={sma50.accessor()} fill={sma50.stroke()} />
							<CurrentCoordinate yAccessor={sma100.accessor()} fill={sma100.stroke()} />
							<CurrentCoordinate yAccessor={sma250.accessor()} fill={sma250.stroke()} />
						</>
					)}

					{ showEma && (
						<>
							<LineSeries yAccessor={ema5.accessor()} stroke={ema5.stroke()} />
							<LineSeries yAccessor={ema20.accessor()} stroke={ema20.stroke()} />
							<LineSeries yAccessor={ema50.accessor()} stroke={ema50.stroke()} />
							<LineSeries yAccessor={ema100.accessor()} stroke={ema100.stroke()} />
							<LineSeries yAccessor={ema250.accessor()} stroke={ema250.stroke()} />
							<CurrentCoordinate yAccessor={ema5.accessor()} fill={ema5.stroke()} />
							<CurrentCoordinate yAccessor={ema20.accessor()} fill={ema20.stroke()} />
							<CurrentCoordinate yAccessor={ema50.accessor()} fill={ema50.stroke()} />
							<CurrentCoordinate yAccessor={ema100.accessor()} fill={ema100.stroke()} />
							<CurrentCoordinate yAccessor={ema250.accessor()} fill={ema250.stroke()} />
						</>
					)}

					{ !showHover && (
						<MouseCoordinateX
							at="bottom"
							orient="bottom"
							displayFormat={tFormat}
							rectRadius={5}
							{...mouseEdgeAppearance}
						/>
					)}

					<MouseCoordinateY
						at="right"
						orient="right"
						displayFormat={volFormat}
						{...mouseEdgeAppearance}
					/>
					<EdgeIndicator
						itemType="last"
						orient="right"
						edgeAt="right"
						yAccessor={d => d.close}
						{...appearance}
					/>

					{!showHover && (
						<>
							<OHLCTooltip origin={[-38, 0]} xDisplayFormat={tFormat} />
							<MovingAverageTooltip
								origin={[-38, 15]}
								options={
									[].concat(showSma ? [
										{
											yAccessor: sma5.accessor(),
											type: "SMA",
											stroke: sma5.stroke(),
											windowSize: sma5.options().windowSize,
										},
										{
											yAccessor: sma20.accessor(),
											type: "SMA",
											stroke: sma20.stroke(),
											windowSize: sma20.options().windowSize,
										},
										{
											yAccessor: sma50.accessor(),
											type: "SMA",
											stroke: sma50.stroke(),
											windowSize: sma50.options().windowSize,
										},
										{
											yAccessor: sma100.accessor(),
											type: "SMA",
											stroke: sma100.stroke(),
											windowSize: sma100.options().windowSize,
										},
										{
											yAccessor: sma250.accessor(),
											type: "SMA",
											stroke: sma250.stroke(),
											windowSize: sma250.options().windowSize,
										},
									] : []).concat(showEma ? [
										{
											yAccessor: ema5.accessor(),
											type: "EMA",
											stroke: ema5.stroke(),
											windowSize: ema5.options().windowSize,
										},
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
									] : [])
								}
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
									origin={[-38, showSma || showEma ? 60 : 25]}
									yAccessor={d => d.bb}
									options={bb.options()}
								/>
							)}
						</>
					)}

					{ showHover && (
						<HoverTooltip
							tooltipContent={tooltipContent([].concat(showSma ? [
								{
									label: `${sma5.type()}(${sma5.options().windowSize})`,
									value: d => sma5.accessor()(d) && numberFormat(sma5.accessor()(d)),
									stroke: sma5.stroke()
								},
								{
									label: `${sma20.type()}(${sma20.options().windowSize})`,
									value: d => sma20.accessor()(d) && numberFormat(sma20.accessor()(d)),
									stroke: sma20.stroke()
								},
								{
									label: `${sma50.type()}(${sma50.options().windowSize})`,
									value: d => sma50.accessor()(d) && numberFormat(sma50.accessor()(d)),
									stroke: sma50.stroke()
								},
								{
									label: `${sma100.type()}(${sma100.options().windowSize})`,
									value: d => sma100.accessor()(d) && numberFormat(sma100.accessor()(d)),
									stroke: sma100.stroke()
								},
								{
									label: `${sma250.type()}(${sma250.options().windowSize})`,
									value: d => sma250.accessor()(d) && numberFormat(sma250.accessor()(d)),
									stroke: sma250.stroke()
								}
							] : []).concat(showEma ? [
								{
									label: `${ema5.type()}(${ema5.options().windowSize})`,
									value: d => ema5.accessor()(d) && numberFormat(ema5.accessor()(d)),
									stroke: ema5.stroke()
								},
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
							] : []), tFormat)}
							fontSize={13}
						/>
					)}
				</Chart>

				{ showVol && (
					<Chart
						id={2}
						origin={(w, h) => [0, h - heights[1] - heights[2] - heights[3]]}
						height={heights[1]}
						yExtents={d => d.volume}
					>
						<XAxis axisAt="bottom" orient="bottom" showTicks={false} />
						<YAxis axisAt="right" orient="right" ticks={5} tickFormat={format(".2s")} />
						<BarSeries yAccessor={d => d.volume} {...appearance} />
						<MouseCoordinateY
							at="right"
							orient="right"
							displayFormat={volFormat}
							{...mouseEdgeAppearance}
						/>
					</Chart>
				)}

				{ showMacd && (
					<Chart
						id={3}
						height={heights[2]}
						yExtents={calcMacd.accessor()}
						origin={(w, h) => [0, h - heights[2] - heights[3]]}
						padding={{ top: 10, bottom: 10 }}
					>
						<XAxis axisAt="bottom" orient="bottom" showTicks={false} outerTickSize={0} />
						<YAxis axisAt="right" orient="right" ticks={1} />
						<MouseCoordinateY
							at="right"
							orient="right"
							displayFormat={numberFormat}
							{...mouseEdgeAppearance}
						/>

						<MACDSeries
							yAccessor={d => d.macd}
							{...macdAppearance}
						/>
						<MACDTooltip
							origin={[-38, 15]}
							yAccessor={d => d.macd}
							options={calcMacd.options()}
							appearance={macdAppearance}
						/>
					</Chart>
				)}

				{ showRsi && (
					<Chart
						id={4}
						yExtents={[0, 100]}
						height={heights[3]}
						origin={(w, h) => [0, h - heights[3]]}
					>
						<XAxis axisAt="bottom" orient="bottom" showTicks={false} outerTickSize={0} />
						<YAxis axisAt="right" orient="right" tickValues={[30, 50, 70]} />
						<MouseCoordinateY
							at="right"
							orient="right"
							displayFormat={numberFormat}
							{...mouseEdgeAppearance}
						/>

						<RSISeries
							yAccessor={d => d.rsi1}
							stroke={rsi1Stroke}
						/>
						<RSISeries
							yAccessor={d => d.rsi2}
							stroke={rsi2Stroke}
						/>
						<RSISeries
							yAccessor={d => d.rsi3}
							stroke={rsi3Stroke}
						/>

						<RSITooltip
							origin={[-38, 15]}
							yAccessor={d => d.rsi1}
							options={rsi1.options()}
							labelFill={rsi1Stroke.insideThreshold}
						/>
						<RSITooltip
							origin={[38, 15]}
							yAccessor={d => d.rsi2}
							options={rsi2.options()}
							labelFill={rsi2Stroke.insideThreshold}
						/>
						<RSITooltip
							origin={[120, 15]}
							yAccessor={d => d.rsi3}
							options={rsi3.options()}
							labelFill={rsi3Stroke.insideThreshold}
						/>
					</Chart>
				)}

				<CrossHairCursor />
			</ChartCanvas>
		);
	}
}

HistoryChartCore.propTypes = {
	data: PropTypes.array.isRequired,
	width: PropTypes.number.isRequired,
	ratio: PropTypes.number.isRequired,
	type: PropTypes.oneOf(["svg", "hybrid"]).isRequired,
	showCfg: PropTypes.object.isRequired,
	isMinute: PropTypes.bool.isRequired,
};

HistoryChartCore.defaultProps = {
	type: "hybrid"
};
HistoryChartCore = fitWidth(HistoryChartCore);

export default HistoryChartCore;