import React from 'react';
import { withWidth } from "@material-ui/core";
import { makeStyles } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import TablePagination from '@material-ui/core/TablePagination';
import Typography from '@material-ui/core/Typography';
import { getTrades, getNumOfTrades } from '../../utils/API';
import { NF, NF2 } from "../../constants";

function processTimeFormat(rawTimeStr) {
  const date = new Date(rawTimeStr);
  return `${date.toDateString()} ${date.toLocaleTimeString()}` /*UTC+${0 - date.getTimezoneOffset() / 60}`*/;
}

function processTradeRecord(i, tradeRecord) {
  return { 
    i,
    time: processTimeFormat(tradeRecord.time),
    symbol: tradeRecord.symbol,
    isBuy: tradeRecord.buy,
    action: tradeRecord.buy ? "Buy" : "Sell",
    quantity: NF(tradeRecord.quantity),
    price: NF2(tradeRecord.price),
    cashChange: (tradeRecord.buy ? '-' : '+') + NF2(tradeRecord.quantity * tradeRecord.price),
    cashAfter: NF2(tradeRecord.cashAfter),
  };
}

const useStyles = makeStyles((theme) => ({
  title: {
    display: 'flex',
    flexDirection: 'row',
    flexWrap: "wrap",
  },
  grow: {
    flexGrow: 1,
  },
  rowBuy: {
    background: '#bcb3ff'
  },
  rowSell: {
    background: '#ffdca3'
  }
}));

function TradeTable({ width, rowsPerPageOptions }) {
  const isScreenMidUp = /md|lg|xl/.test(width);
  const pageRowsOpts = rowsPerPageOptions || [5, 10, 20];
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
      <div className={classes.title}>
        <Typography
          component="h2"
          variant="h6"
          color="primary"
          gutterBottom
          style={{ flex: 1, minWidth: 150 }}
        >
          Recent Trades
        </Typography>
        <TablePagination
          component="div"
          count={numOfRecords}
          page={page}
          onChangePage={handleChangePage}   // onPageChange for Material UI ^5
          rowsPerPage={rowsPerPage}
          onChangeRowsPerPage={handleChangeRowsPerPage}   // onRowsPerPageChange for Material UI ^5
          rowsPerPageOptions={pageRowsOpts}
          style={{ paddingLeft: 0 }}
        />
      </div>
      {numOfRecords ? (
        <>
          <Table size="small">
            <TableHead>
              <TableRow>
                <TableCell>Time</TableCell>
                <TableCell>Symbol</TableCell>
                {isScreenMidUp && <TableCell align="right">Action</TableCell>}
                <TableCell align="right">Quantity</TableCell>
                <TableCell align="right">Price (USD)</TableCell>
                <TableCell align="right">Cash In/Out (USD)</TableCell>
                {isScreenMidUp && <TableCell align="right">Cash After (USD)</TableCell>}
              </TableRow>
            </TableHead>
            <TableBody>
              {pageRecords.map((row) => (
                <TableRow key={row.i} className={row.isBuy ? classes.rowBuy : classes.rowSell}>
                  <TableCell>{row.time}</TableCell>
                  <TableCell>{row.symbol}</TableCell>
                  {isScreenMidUp && <TableCell align="right">{row.action}</TableCell>}
                  <TableCell align="right">{row.quantity}</TableCell>
                  <TableCell align="right">{row.price}</TableCell>
                  <TableCell align="right">{row.cashChange}</TableCell>
                  {isScreenMidUp && <TableCell align="right">{row.cashAfter}</TableCell>}
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

export default withWidth()(TradeTable);
