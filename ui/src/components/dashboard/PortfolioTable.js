import React from 'react';
import { useHistory } from 'react-router-dom';
import { makeStyles } from '@material-ui/core/styles';
import ListItem from "@material-ui/core/ListItem";
import ListItemText from "@material-ui/core/ListItemText";
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Pagination from '@material-ui/lab/Pagination';
import Typography from '@material-ui/core/Typography';

const procPositionInfo = (position, i, curPrice) => {
  position.i = i;
  position.holdingPrice = (position.holdingCost / position.quantity).toFixed(4);
  position.currentPrice = curPrice;
  const diff = position.currentPrice - position.holdingPrice;
  position.pl = (diff * position.quantity).toFixed(2);
  position.plPercent = `${(diff / position.holdingPrice * 100).toFixed(2)}%`;
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
    background: '#d6ffe1',
    '&:hover': {
      background: '#e6ffec',
      cursor: 'pointer',
    },
  },
  rowLoss: {
    background: '#ffd6d6',
    '&:hover': {
      background: '#ffeded',
      cursor: 'pointer',
    },
  },
  mobileHidden: {
    [theme.breakpoints.down('sm')]: {
      display: 'none'
    },
  },
  specialCellContent: {
    fontSize: 14
  }
}));

export default function PortfolioTable(props) {
  const classes = useStyles();
  const { portfolio, prices, onSymbolClick, rowsPerPage } = props;

  const [page, setPage] = React.useState(0);

  const pageRows = rowsPerPage || 5;
  // const [pageRows, setPageRows] = React.useState(5);
  const numOfRecords = portfolio.length;
  const numOfPages = Math.floor((numOfRecords + pageRows - 1) / pageRows);
  const [pageRecords, setPageRecords] = React.useState([]);

  let history = useHistory();

  const onRowClick = (i) => {
    onSymbolClick(pageRecords[i].symbol);
    history.push('/stockView');
  }

  React.useEffect(() => {
    portfolio.map((pos, i) => procPositionInfo(pos, i, prices[i]));
  }, [portfolio, prices]);

  React.useEffect(() => {
    const start = page * pageRows;
    setPageRecords(portfolio.slice(start, start + pageRows));
  }, [page, portfolio, prices])

  const handleChangePage = (ev, newPage) => {
    setPage(newPage - 1);
  };

  const SpecialCellContent = (props) => {
    return (
      <ListItem style={{ textAlign: 'right', padding: 0 }}>
        <ListItemText
          primary={props.first}
          secondary={props.second}
          classes={{
            primary: classes.specialCellContent,
            secondary: classes.specialCellContent,
          }}
        />
      </ListItem>
    );
  }

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
          <Table size="medium">
            <TableHead>
              <TableRow>
                <TableCell>Symbol</TableCell>
                <TableCell align="right">Quantity</TableCell>
                <TableCell align="right">Current/Holding Price (USD)</TableCell>
                <TableCell align="right" className={classes.mobileHidden}>
                  Market Capitalization (USD)
                </TableCell>
                <TableCell align="right">Floating Profit (USD/Percentage)</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {pageRecords.map((row) => (
                <TableRow key={row.i} className={row.pl >= 0 ? classes.rowProfit : classes.rowLoss} onClick={() => onRowClick(row.i)}>
                  <TableCell>{row.symbol}</TableCell>
                  <TableCell align="right">{row.quantity}</TableCell>
                  <TableCell align="right">
                    <SpecialCellContent first={row.currentPrice || '--'} second={row.holdingPrice} />
                  </TableCell>
                  <TableCell align="right" className={classes.mobileHidden}>
                    {row.currentPrice ? (row.currentPrice * row.quantity).toFixed(4) : '--'}
                  </TableCell>
                  <TableCell align="right">
                    <SpecialCellContent first={row.pl || '--'} second={row.plPercent || '--'} />
                  </TableCell>
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
