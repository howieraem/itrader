import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';
import LoadingIndicator from '../../common/LoadingIndicator';

const useStyles = makeStyles(theme => ({
  table: {
    display: 'none',
    [theme.breakpoints.up('md')]: {
      display: 'table',
    },
    minWidth: 650,
  },
  tableMobile: {
    display: 'table',
    [theme.breakpoints.up('md')]: {
      display: 'none',
    },
  },
  tablePlaceholder: {
    minHeight: '200px',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '18px',
    marginLeft: '50px',
    marginRight: '50px',
  },
}));

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
        <>
          <Table className={classes.table} aria-label="info table">
            <TableBody>
              {tabulate(data, 3).map((row, idx) => (
                <TableRow key={idx}>
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
          <Table className={classes.tableMobile} aria-label="info table mobile">
            <TableBody>
              {tabulate(data, 2).map((row, idx) => (
                <TableRow key={idx}>
                  <TableCell component="th" scope="row">
                    <strong>{row[0]}</strong>
                  </TableCell>
                  <TableCell align="left">{row[1]}</TableCell>
                  <TableCell component="th" scope="row">
                    <strong>{row[2]}</strong>
                  </TableCell>
                  <TableCell align="left">{row[3]}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </>
      ) : (
        <div className={classes.tablePlaceholder}>
          {"Loading stock info..."}
          <LoadingIndicator />
        </div>
      )}
      
    </TableContainer>
  );
}