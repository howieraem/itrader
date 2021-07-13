import React from 'react';
import Link from '@material-ui/core/Link';
import { makeStyles } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Title from './Title';
import { getTrades } from '../../utils/APIUtils';


function processTimeFormat(rawTime) {
  const date = new Date(rawTime); 
  return `${date.toDateString()} ${date.toLocaleTimeString()} UTC+${0 - date.getTimezoneOffset() / 60}`;
}

function processTradeRecord(i, tradeRecord) {
  return { 
    id: i,
    time: processTimeFormat(tradeRecord.time),
    symbol: tradeRecord.symbol,
    action: tradeRecord.buy ? "Buy" : "Sell",
    quantity: tradeRecord.quantity,
    price: tradeRecord.price,
    cashChange: (tradeRecord.buy ? '-' : '+') + (tradeRecord.quantity * tradeRecord.price).toFixed(2),
    cashAfter: tradeRecord.cashAfter.toFixed(2),
  };
}

const useStyles = makeStyles((theme) => ({
  seeMore: {
    marginTop: theme.spacing(3),
  },
}));

export default function Trades() {
  const classes = useStyles();
  const maxDisplayRows = 10;
  const [hasMoreRecords, setHasMoreRecords] = React.useState(false);
  const [records, setRecords] = React.useState([]);

  React.useEffect(() => {
    getTrades(maxDisplayRows + 1)
    .then(raw => {
      let n;
      if (raw.length > maxDisplayRows) {
        setHasMoreRecords(true);
        n = maxDisplayRows;
      } else {
        setHasMoreRecords(false);
        n = raw.length;
      }
      let res = [];
      for (let i = 0; i < n; ++i) {
        res.push(processTradeRecord(i, raw[i]));
      }
      setRecords(res);
    })
    .catch(err => console.log(err));
  }, [])

  return (
    <React.Fragment>
      <Title>Recent Trades</Title>
      {records.length ? (
        <>
          <Table size="small">
            <TableHead>
              <TableRow>
                <TableCell>Time</TableCell>
                <TableCell>Symbol</TableCell>
                <TableCell>Action</TableCell>
                <TableCell align="right">Quantity</TableCell>
                <TableCell align="right">Price ($)</TableCell>
                <TableCell align="right">Cash Change ($)</TableCell>
                <TableCell align="right">Cash After ($)</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {records.map((row) => (
                <TableRow key={row.id}>
                  <TableCell>{row.time}</TableCell>
                  <TableCell>{row.symbol}</TableCell>
                  <TableCell>{row.action}</TableCell>
                  <TableCell align="right">{row.quantity}</TableCell>
                  <TableCell align="right">{row.price}</TableCell>
                  <TableCell align="right">{row.cashChange}</TableCell>
                  <TableCell align="right">{row.cashAfter}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>

          {hasMoreRecords ? (
            <div className={classes.seeMore}>
              <Link color="primary" href="/trades">
                See more trades
              </Link>
            </div>
          ) : null}
        </>
      ) : (
        <div>Your trade history is empty.</div>
      )}
    </React.Fragment>
  );
}
