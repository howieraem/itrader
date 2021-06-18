const R = "red", G = "#009660";

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
