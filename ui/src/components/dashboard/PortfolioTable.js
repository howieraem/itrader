import React from 'react';
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
import { nf, nf2, nf4, nfp } from "../../constants";


const procPositionInfo = (position, i, curPrice, value, totValue) => {
  position.i = i;
  const holdingPrice = position.holdingCost / position.quantity;
  const diff = curPrice - holdingPrice;
  position.currentPrice = nf4.format(curPrice);
  position.holdingPrice = nf4.format(holdingPrice);
  position.positive = (diff >= 0);
  position.pl = nf2.format(diff * position.quantity);
  position.plPercent = nfp.format(diff / holdingPrice * 100) + '%';
  position.value = nf2.format(value);
  position.ratio = nfp.format(value / totValue * 100) + '%';
  position.qty = nf.format(position.quantity);
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
  const { portfolio, prices, positionValues, totalValue, onSymbolClick } = props;

  const [page, setPage] = React.useState(0);

  const pageRows = 10;
  // const [pageRows, setPageRows] = React.useState(5);
  const numOfRecords = portfolio.length;
  const numOfPages = Math.floor((numOfRecords + pageRows - 1) / pageRows);
  const [pageRecords, setPageRecords] = React.useState([]);

  const onRowClick = (i) => {
    onSymbolClick(pageRecords[i].symbol);
  }

  React.useEffect(() => {
    portfolio.map((pos, i) => procPositionInfo(pos, i, prices[i], positionValues[i], totalValue));
  }, [portfolio, prices, positionValues, totalValue]);

  React.useEffect(() => {
    const start = page * pageRows;
    setPageRecords(portfolio.slice(start, start + pageRows));
  }, [page, portfolio, prices])

  const handleChangePage = (ev, newPage) => {
    setPage(newPage - 1);
  };

  const CellContent = (props) => {
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
                <TableCell align="right">
                  <CellContent first={"Quantity"} second={"Position Ratio"} />
                </TableCell>
                <TableCell align="right">
                  Price (USD)
                  <CellContent first={"Current"} second={"Holding"} />
                </TableCell>
                <TableCell align="right">
                  Floating P/L
                  <CellContent first={"USD"} second={"Percentage"} />
                </TableCell>
                <TableCell align="right" className={classes.mobileHidden}>
                  Value (USD)
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {pageRecords.map((row) => (
                <TableRow key={row.i} className={row.positive ? classes.rowProfit : classes.rowLoss} onClick={() => onRowClick(row.i)}>
                  <TableCell>{row.symbol}</TableCell>
                  <TableCell align="right">
                    <CellContent
                      first={row.qty}
                      second={row.ratio}
                    />
                  </TableCell>
                  <TableCell align="right">
                    <CellContent first={row.currentPrice} second={row.holdingPrice} />
                  </TableCell>
                  <TableCell align="right">
                    <CellContent first={row.pl} second={row.plPercent} />
                  </TableCell>
                  <TableCell align="right" className={classes.mobileHidden}>
                    {row.value}
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
