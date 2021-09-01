const R = "#ff0000", G = "#009660";

export const appearance = {
  fill: (d) => d.close > d.open ? G : R,
  opacity: 1,
}

export const candlesAppearance = {
  // wickStroke: "#000000",
  fill: appearance.fill,
  // stroke: "#000000",
  // candleStrokeWidth: 1,
  // widthRatio: 0.8,
  opacity: appearance.opacity,
};

export const stroke = d => {
  return (d.absoluteChange !== undefined && d.absoluteChange !== null) ? d.absoluteChange > 0 ? G : R : "#000000";
}

export const rsiStroke = {
  line: "#000000",
  top: "#B8C2CC",
  middle: "#8795A1",
  bottom: "#B8C2CC",
}

export const bollStroke = {
  top: "#b17559",
  middle: "#6e6e6e",
  bottom: "#b17559",
  fill: "#b4b246"
};
