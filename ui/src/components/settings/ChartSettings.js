import React from 'react';
import FormGroup from '@material-ui/core/FormGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Checkbox from '@material-ui/core/Checkbox';

export default function ChartSettings() {
  const [state, setState] = React.useState({
    showSma: false,
    showEma: true,
    showBoll: true,
    showVol: true,
    showMacd: true,
    showRsi: true,
    showHover: true,
    showGrid: true,
  });

  const handleChange = (event) => {
    setState({ ...state, [event.target.name]: event.target.checked });
  };

  return (
    <FormGroup row>
      <FormControlLabel
        control={
          <Checkbox
            checked={state.showSma}
            onChange={handleChange}
            name="showSma"
            color="primary"
          />
        }
        label="SMA"
      />
      <FormControlLabel
        control={
          <Checkbox
            checked={state.showEma}
            onChange={handleChange}
            name="showEma"
            color="primary"
          />
        }
        label="EMA"
      />
      <FormControlLabel
        control={
          <Checkbox
            checked={state.showBoll}
            onChange={handleChange}
            name="showBoll"
            color="primary"
          />
        }
        label="BOLL"
      />
      <FormControlLabel
        control={
          <Checkbox
            checked={state.showVol}
            onChange={handleChange}
            name="showVol"
            color="primary"
          />
        }
        label="VOL"
      />
      <FormControlLabel
        control={
          <Checkbox
            checked={state.showMacd}
            onChange={handleChange}
            name="showMacd"
            color="primary"
          />
        }
        label="MACD"
      />
      <FormControlLabel
        control={
          <Checkbox
            checked={state.showRsi}
            onChange={handleChange}
            name="showRsi"
            color="primary"
          />
        }
        label="RSI"
      />
      <FormControlLabel
        control={
          <Checkbox
            checked={state.showHover}
            onChange={handleChange}
            name="showHover"
            color="primary"
          />
        }
        label="Hover Tool"
      />
      <FormControlLabel
        control={
          <Checkbox
            checked={state.showGrid}
            onChange={handleChange}
            name="showGrid"
            color="primary"
          />
        }
        label="Grid"
      />
    </FormGroup>
  );
}