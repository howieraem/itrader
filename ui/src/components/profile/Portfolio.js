import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Pagination from '@material-ui/lab/Pagination';
import Typography from '@material-ui/core/Typography';
import TradeDialog from './TradeDialogCell';
import { getPortfolio, getNumOfPositions } from '../../utils/APIUtils';
import { getBatchStockPrices } from '../../utils/DataAPIUtils';

function procRawPositionInfo(i, position) {
  position.i = i;
  position.holdingPrice = (parseFloat(position.holdingCost) / position.quantity).toFixed(2);
  position.currentPrice = '--';
  position.pl = '--';
  position.plPercent = '--';
}

function updatePositionPrice(position, currentPrice) {
  position.currentPrice = currentPrice;
  const diff = position.currentPrice - position.holdingPrice;
  position.pl = (diff * position.quantity).toFixed(2);
  position.plPercent = (diff / position.holdingPrice * 100).toFixed(2);
}

const useStyles = makeStyles((theme) => ({
  title: {
    display: 'flex',
    flexDirection: 'row',
  },
  grow: {
    flexGrow: 1,
  },
  rowProfit: {
    background: '#d6ffe1'
  },
  rowLoss: {
    background: '#ffd6d6'
  }
}));

export default function Portfolio(props) {
  const classes = useStyles();
  const authenticated = props.currentUser != null;
  const [page, setPage] = React.useState(0);
  const rowsPerPage = 5;
  // const [rowsPerPage, setRowsPerPage] = React.useState(5);
  const [numOfRecords, setNumOfRecords] = React.useState(0);
  const numOfPages = Math.floor((numOfRecords + rowsPerPage - 1) / rowsPerPage);

  const [pageRecords, setPageRecords] = React.useState([]);
  const [marketClosed, setMarketClosed] = React.useState(false);

  React.useEffect(() => {
    getNumOfPositions()
    .then(res => setNumOfRecords(res))
    .catch(err => console.log(err));

    const updateSymbolPrices = (pageSymbols, pageRecords) => {
      getBatchStockPrices(pageSymbols)
      .then(res => {
        setMarketClosed(res[0]);
        for (let i = 0; i < pageRecords.length; ++i) {
          updatePositionPrice(pageRecords[i], res[1][i]);
        }
        setPageRecords(pageRecords);
      })
      .catch(err => console.log(err))
    };

    let interval;
    const initPortfio = () => {
      getPortfolio(page, rowsPerPage)
      .then(pageRecords => {
        let pageSymbols = [];
        for (let i = 0; i < pageRecords.length; ++i) {
          procRawPositionInfo(i, pageRecords[i]);
          pageSymbols.push(pageRecords[i].symbol);
        }
        // setPageRecords(pageRecords);
        updateSymbolPrices(pageSymbols, pageRecords);
        
        if (!marketClosed) {
          interval = setInterval(() => {
            updateSymbolPrices(pageSymbols, pageRecords);
          }, 5000);
        }
      })
      .catch(err => console.log(err));
    }
    initPortfio();
  
    if (!marketClosed) {
      return () => {
        clearInterval(interval);
      };
    }
  }, [page, rowsPerPage, numOfPages, marketClosed])

  const handleChangePage = (ev, newPage) => {
    setPage(newPage - 1);
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
        Portfolio
        <div className={classes.grow} />
        <Pagination 
            count={numOfPages} 
            variant="outlined" 
            color="primary" 
            siblingCount={0} 
            showFirstButton 
            showLastButton
            onChange={handleChangePage}
          />
      </Typography>
      {numOfRecords ? (
        <>
          <Table size="small">
            <TableHead>
              <TableRow>
                <TableCell>Symbol</TableCell>
                <TableCell align="right">Quantity</TableCell>
                <TableCell align="right">Holding Price ($)</TableCell>
                <TableCell align="right">Current Price ($)</TableCell>
                <TableCell align="right">Profit/Loss ($)</TableCell>
                <TableCell align="right">Profit/Loss Percentage</TableCell>
                <TableCell align="right"></TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {pageRecords.map((row) => (
                <TableRow key={row.i} className={row.pl >= 0 ? classes.rowProfit : classes.rowLoss}>
                  <TableCell>{row.symbol}</TableCell>
                  <TableCell align="right">{row.quantity}</TableCell>
                  <TableCell align="right">{row.holdingPrice}</TableCell>
                  <TableCell align="right">{row.currentPrice}</TableCell>
                  <TableCell align="right">{row.pl}</TableCell>
                  <TableCell align="right">{`${row.plPercent} %`}</TableCell>
                  <TableCell align="right"><TradeDialog symbol={row.symbol} authenticated={authenticated} /></TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </>
      ) : (
        <div>You don't hold any position.</div>
      )}
      
    </React.Fragment>
  );
}
