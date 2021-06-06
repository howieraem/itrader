import React from 'react';
import Link from '@material-ui/core/Link';
import { makeStyles } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Title from './Title';

// Generate Order Data
function createData(id, time, symbol, action, shares, amount) {
  return { id, time, symbol, action, shares, amount };
}

const rows = [
  createData(0, 'Mar 16 2019, UTC+8 6:30:00 PM', 'TSLA', 'Buy', '1', 312.44),
  createData(1, 'Mar 16 2019, UTC+8 6:00:00 PM', 'MSFT', 'Buy', '15', 1866.99),
  createData(2, 'Mar 16 2019, UTC+8 5:00:00 PM ', 'COIN', 'Buy', '1', 210.81),
  createData(3, 'Mar 16 2019, UTC+8 4:00:00 PM ', 'APPL', 'Sell', '20', 1654.39),
  createData(4, 'Mar 16 2019, UTC+8 3:00:00 PM', 'GOOGL', 'Sell', '36', 1212.79),
];

const useStyles = makeStyles((theme) => ({
  seeMore: {
    marginTop: theme.spacing(3),
  },
}));

export default function Transactions() {
  const classes = useStyles();
  return (
    <React.Fragment>
      <Title>Recent Transactions</Title>
      <Table size="small">
        <TableHead>
          <TableRow>
            <TableCell>Time</TableCell>
            <TableCell>Symbol</TableCell>
            <TableCell>Action</TableCell>
            <TableCell>Shares</TableCell>
            <TableCell align="right">Amount ($)</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {rows.map((row) => (
            <TableRow key={row.id}>
              <TableCell>{row.time}</TableCell>
              <TableCell>{row.symbol}</TableCell>
              <TableCell>{row.action}</TableCell>
              <TableCell>{row.shares}</TableCell>
              <TableCell align="right">{row.amount}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      <div className={classes.seeMore}>
        <Link color="primary" href="/transactions">
          See more transaction history
        </Link>
      </div>
    </React.Fragment>
  );
}
