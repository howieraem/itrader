const R = "#ff0000", G = "#009660";

export const appearance = {
  fill: (d) => d.close > d.open ? G : R,
  opacity: 1,
}

export const candlesAppearance = {
  fill: appearance.fill,
  opacity: appearance.opacity,
};

export const ohlcStroke = d => {
  return (d.absoluteChange !== undefined && d.absoluteChange !== null) ? d.absoluteChange > 0 ? G : R : "#000000";
}

export const bollStroke = {
  top: "#b17559",
  middle: "#6e6e6e",
  bottom: "#b17559",
  fill: "#b4b246"
};

export const macdAppearance = {
  stroke: {
    macd: "#FF0000",
    signal: "#00F300",
  },
  fill: {
    divergence: "#4682B4"
  },
};

export const mouseEdgeAppearance = {
  textFill: "#542605",
  stroke: "#05233B",
  strokeOpacity: 1,
  strokeWidth: 3,
  arrowWidth: 5,
  fill: "#BCDEFA",
};

const rsiStroke = {
  line: "#000000",
  top: "#B8C2CC",
  middle: "#8795A1",
  bottom: "#B8C2CC",
}

export const rsi1Stroke = {
  outsideThreshold: "#cd5b00",
  insideThreshold: "#ff9740",
  ...rsiStroke
}

export const rsi2Stroke = {
  outsideThreshold: "#0051b3",
  insideThreshold: "#529fff",
  ...rsiStroke
}

export const rsi3Stroke = {
  outsideThreshold: "#b300b3",
  insideThreshold: "#ff66ff",
  ...rsiStroke
}
