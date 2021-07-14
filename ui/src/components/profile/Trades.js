import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import TablePagination from '@material-ui/core/TablePagination';
import Typography from '@material-ui/core/Typography';
import { getTrades, getNumOfTrades } from '../../utils/APIUtils';


function processTimeFormat(rawTime) {
  const date = new Date(rawTime); 
  return `${date.toDateString()} ${date.toLocaleTimeString()} UTC+${0 - date.getTimezoneOffset() / 60}`;
}

function processTradeRecord(i, tradeRecord) {
  return { 
    i,
    time: processTimeFormat(tradeRecord.time),
    symbol: tradeRecord.symbol,
    isBuy: tradeRecord.buy,
    action: tradeRecord.buy ? "Buy" : "Sell",
    quantity: tradeRecord.quantity,
    price: tradeRecord.price,
    cashChange: (tradeRecord.buy ? '-' : '+') + (tradeRecord.quantity * tradeRecord.price).toFixed(2),
    cashAfter: tradeRecord.cashAfter.toFixed(2),
  };
}

const useStyles = makeStyles((theme) => ({
  title: {
    display: 'flex',
    flexDirection: 'row',
  },
  grow: {
    flexGrow: 1,
  },
  rowBuy: {
    background: '#d6ffe1'
  },
  rowSell: {
    background: '#ffd6d6'
  }
}));

export default function Trades() {
  const classes = useStyles();
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(10);
  const [numOfRecords, setNumOfRecords] = React.useState(0);
  const [pageRecords, setPageRecords] = React.useState([]);

  React.useEffect(() => {
    getNumOfTrades()
    .then(res => setNumOfRecords(res))
    .catch(err => console.log(err));

    getTrades(page, rowsPerPage)
    .then(raw => {
      setPageRecords(raw.map((row, i) => processTradeRecord(i, row)));
    })
    .catch(err => console.log(err));
  }, [rowsPerPage, page])

  const handleChangePage = (ev, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (ev) => {
    setRowsPerPage(parseInt(ev.target.value, 10));
    setPage(0);
  };

  return (
    <React.Fragment>
      <Typography 
        component="h2" 
        variant="h6" 
        color="primary" 
        gutterBottom
        className={classes.title}
      >
        Recent Trades
        <div className={classes.grow} />
        <TablePagination
          component="div"
          count={numOfRecords}
          page={page}
          onChangePage={handleChangePage}   // onChangePage for Material UI ^5
          rowsPerPage={rowsPerPage}
          onChangeRowsPerPage={handleChangeRowsPerPage}   // onRowsPerPageChange for Material UI ^5
          rowsPerPageOptions={[5, 10, 20]}
        />
      </Typography>
      {numOfRecords ? (
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
              {pageRecords.map((row) => (
                <TableRow key={row.i} className={row.isBuy ? classes.rowBuy : classes.rowSell}>
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
        </>
      ) : (
        <div>Your trade history is empty.</div>
      )}
    </React.Fragment>
  );
}
