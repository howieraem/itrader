import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Pagination from '@material-ui/lab/Pagination';
import Typography from '@material-ui/core/Typography';
import { getPortfolio, getNumOfPositions } from '../../utils/APIUtils';


function processPositionInfo(i, position) {
  return { 
    i,
    symbol: position.symbol,
    quantity: position.quantity,
    holdingPrice: (parseFloat(position.holdingCost) / position.quantity).toFixed(2),
  };
}

const useStyles = makeStyles((theme) => ({
  title: {
    display: 'flex',
    flexDirection: 'row',
  },
  grow: {
    flexGrow: 1,
  }
}));

export default function Favorites() {
  const classes = useStyles();
  const [page, setPage] = React.useState(0);
  const rowsPerPage = 5;
  // const [rowsPerPage, setRowsPerPage] = React.useState(5);
  const [numOfRecords, setNumOfRecords] = React.useState(0);
  const [pageRecords, setPageRecords] = React.useState([]);
  const numOfPages = Math.floor((numOfRecords + rowsPerPage - 1) / rowsPerPage);

  // const [hidePrev, setHidePrev] = React.useState(page === 0);
  // const [hideNext, setHideNext] = React.useState(true);

  React.useEffect(() => {
    getNumOfPositions()
    .then(res => setNumOfRecords(res))
    .catch(err => console.log(err));

    getPortfolio(page, rowsPerPage)
    .then(raw => {
      setPageRecords(raw.map((row, i) => processPositionInfo(i, row)));
    })
    .catch(err => console.log(err));

    // setHideNext(page === numOfPages - 1);
  }, [page, rowsPerPage, numOfPages])

  const handleChangePage = (ev, newPage) => {
    const page = newPage - 1;
    // setHidePrev(page === 0);
    // setHideNext(page === numOfPages - 1);
    setPage(page);
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
        Favorite Stocks
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
              </TableRow>
            </TableHead>
            <TableBody>
              {pageRecords.map((row) => (
                <TableRow key={row.i}>
                  <TableCell>{row.symbol}</TableCell>
                  <TableCell align="right">{row.quantity}</TableCell>
                  <TableCell align="right">{row.holdingPrice}</TableCell>
                  <TableCell align="right"></TableCell>
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
