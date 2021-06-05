import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
// import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';
import './Dashboard.css';
import LoadingIndicator from '../../common/LoadingIndicator';

const useStyles = makeStyles({
  table: {
    minWidth: 650,
  },
});

function tabulate(data, keysPerRow=3) {
  let pairs = Object.entries(data);
  let results = [], row = [], i = 0;
  while (i < pairs.length) {
    row.push(pairs[i][0]);
    row.push(pairs[i][1]);
    if (i && (i + 1) % keysPerRow === 0) {
      results.push(row);
      row = [];
    }
    ++i;
  }

  // handle the last row
  if (row.length) {
    while (row.length < keysPerRow * 2) {
      row.push('');
    }
    results.push(row);
  }
  return results;
}

export default function InfoTable({ data }) {
  const classes = useStyles();

  return (
    <TableContainer component={Paper}>
      { data ? (
        <Table className={classes.table} aria-label="info table">
          <TableBody>
            {tabulate(data).map((row) => (
              <TableRow>
                <TableCell component="th" scope="row">
                  <strong>{row[0]}</strong>
                </TableCell>
                <TableCell align="left">{row[1]}</TableCell>
                <TableCell component="th" scope="row">
                  <strong>{row[2]}</strong>
                </TableCell>
                <TableCell align="left">{row[3]}</TableCell>
                <TableCell component="th" scope="row">
                  <strong>{row[4]}</strong>
                </TableCell>
                <TableCell align="left">{row[5]}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      ) : (
        <div className="Table-placeholder">
          {"Loading stock info..."}
          <LoadingIndicator />
        </div>
      )}
      
    </TableContainer>
  );
}