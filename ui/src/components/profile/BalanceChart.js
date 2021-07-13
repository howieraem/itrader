import React from 'react';
import { useTheme } from '@material-ui/core/styles';
import { LineChart, Line, XAxis, YAxis, Label, ResponsiveContainer } from 'recharts';
import Title from './Title';

// Generate Sales Data
function createData(time, net) {
  return { time, net };
}

const data = [
  createData('00:00', 5000),
  createData('03:00', 5000),
  createData('06:00', 5000),
  createData('09:00', 5000),
  createData('12:00', 5000),
  createData('15:00', 5000),
  createData('18:00', 5000),
  createData('21:00', 5000),
  createData('24:00', undefined),
];

export default function BalanceChart() {
  const theme = useTheme();

  return (
    <React.Fragment>
      <Title>Net Worth Trend</Title>
      <ResponsiveContainer>
        <LineChart
          data={data}
          margin={{
            top: 16,
            right: 16,
            bottom: 0,
            left: 24,
          }}
        >
          <XAxis dataKey="time" stroke={theme.palette.text.secondary} />
          <YAxis stroke={theme.palette.text.secondary}>
            <Label
              angle={270}
              position="left"
              style={{ textAnchor: 'middle', fill: theme.palette.text.primary }}
            >
              Net ($)
            </Label>
          </YAxis>
          <Line type="monotone" dataKey="net" stroke={theme.palette.primary.main} dot={false} />
        </LineChart>
      </ResponsiveContainer>
    </React.Fragment>
  );
}
