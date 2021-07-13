import React from 'react';
import Link from '@material-ui/core/Link';
import { makeStyles } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Title from './Title';
import { getPortfolio } from '../../utils/APIUtils';


function processPosition(i, position) {
  return { 
    id: i,
    symbol: position.symbol,
    quantity: position.quantity,
    holdingPrice: (parseFloat(position.holdingCost) / position.quantity).toFixed(6),
  };
}

const useStyles = makeStyles((theme) => ({
  seeMore: {
    marginTop: theme.spacing(3),
  },
}));

export default function Portfolio(props) {
  const classes = useStyles();
  const maxDisplayRows = 5;
  const [hasMoreRecords, setHasMoreRecords] = React.useState(false);
  const [records, setRecords] = React.useState([]);

  React.useEffect(() => {
    getPortfolio(maxDisplayRows + 1)
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
        res.push(processPosition(i, raw[i]));
      }
      setRecords(res);
    })
    .catch(err => console.log(err));
  }, [])

  return (
    <React.Fragment>
      <Title>Portfolio</Title>
      {records.length ? (
        <>
          <Table size="small">
            <TableHead>
              <TableRow>
                <TableCell>Symbol</TableCell>
                <TableCell align="right">Quantity</TableCell>
                <TableCell align="right">Holding Price ($)</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {records.map((row) => (
                <TableRow key={row.id}>
                  <TableCell>{row.symbol}</TableCell>
                  <TableCell align="right">{row.quantity}</TableCell>
                  <TableCell align="right">{row.holdingPrice}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>

          {hasMoreRecords ? (
            <div className={classes.seeMore}>
              <Link color="primary" href="/portfolio">
                See more positions
              </Link>
            </div>
          ) : null}
        </>
      ) : (
        <div>You don't hold any position.</div>
      )}
      
    </React.Fragment>
  );
}
