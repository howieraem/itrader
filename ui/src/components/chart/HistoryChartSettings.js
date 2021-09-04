import React from "react";
import { useTheme } from "@material-ui/core";
import Checkbox from "@material-ui/core/Checkbox";
import FormControl from "@material-ui/core/FormControl";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import FormGroup from "@material-ui/core/FormGroup";
import MenuItem from "@material-ui/core/MenuItem";
import Select from "@material-ui/core/Select";

export default function HistoryChartSettings(props) {
  const { state, handleChartTypeChange, handleCheckboxChange } = props;
  const theme = useTheme();

  return (
    <FormGroup row style={{ paddingLeft: 10 }}>
      <FormControl
        style={{
          minWidth: 100,
          marginRight: theme.spacing(2),
        }}
      >
        <Select
          value={state.chartType}
          onChange={handleChartTypeChange}
          displayEmpty
          style={{ fontSize: "0.8rem" }}
        >
          <MenuItem value="candlestick" style={{ fontSize: "0.8rem" }}>Candle Stick</MenuItem>
          <MenuItem value="ohlc" style={{ fontSize: "0.8rem" }}>OHLC</MenuItem>
        </Select>
      </FormControl>
      <FormControlLabel
        control={
          <Checkbox
            checked={state.showSma}
            onChange={handleCheckboxChange}
            name="showSma"
            color="primary"
            style={{ transform: "scale(0.8)", padding: 3 }}
          />
        }
        label="SMA"
        style={{ marginRight: 20 }}
      />
      <FormControlLabel
        control={
          <Checkbox
            checked={state.showEma}
            onChange={handleCheckboxChange}
            name="showEma"
            color="primary"
            style={{ transform: "scale(0.8)", padding: 3 }}
          />
        }
        label="EMA"
        style={{ marginRight: 20 }}
      />
      <FormControlLabel
        control={
          <Checkbox
            checked={state.showBoll}
            onChange={handleCheckboxChange}
            name="showBoll"
            color="primary"
            style={{ transform: "scale(0.8)", padding: 3 }}
          />
        }
        label="BOLL"
        style={{ marginRight: 20 }}
      />
      <FormControlLabel
        control={
          <Checkbox
            checked={state.showVol}
            onChange={handleCheckboxChange}
            name="showVol"
            color="primary"
            style={{ transform: "scale(0.8)", padding: 3 }}
          />
        }
        label="VOL"
        style={{ marginRight: 20 }}
      />
      <FormControlLabel
        control={
          <Checkbox
            checked={state.showMacd}
            onChange={handleCheckboxChange}
            name="showMacd"
            color="primary"
            style={{ transform: "scale(0.8)", padding: 3 }}
          />
        }
        label="MACD"
        style={{ marginRight: 20 }}
      />
      <FormControlLabel
        control={
          <Checkbox
            checked={state.showRsi}
            onChange={handleCheckboxChange}
            name="showRsi"
            color="primary"
            style={{ transform: "scale(0.8)", padding: 3 }}
          />
        }
        label="RSI"
        style={{ marginRight: 20 }}
      />
      <FormControlLabel
        control={
          <Checkbox
            checked={state.showHover}
            onChange={handleCheckboxChange}
            name="showHover"
            color="primary"
            style={{ transform: "scale(0.8)", padding: 3 }}
          />
        }
        label="Hover Tool"
        style={{ marginRight: 20 }}
      />
      <FormControlLabel
        control={
          <Checkbox
            checked={state.showGrid}
            onChange={handleCheckboxChange}
            name="showGrid"
            color="primary"
            style={{ transform: "scale(0.8)", padding: 3 }}
          />
        }
        label="Grid"
        style={{ marginRight: 20 }}
      />
    </FormGroup>
  );
}
