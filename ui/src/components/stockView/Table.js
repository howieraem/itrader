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

function tabulate(data, columns) {
  let pairs = Object.entries(data);
  let results = [], row = [], i = 0;
  while (i < pairs.length) {
    row.push(pairs[i][0]);
    row.push(pairs[i][1]);
    if ((i + 1) % columns === 0) {
      results.push(row);
      row = [];
    }
    ++i;
  }

  // handle the last row
  if (row.length) {
    while (row.length < columns * 2) {
      row.push('');
    }
    results.push(row);
  }
  return results;
}

export default function InfoTable(props) {
  const classes = useStyles();
  const { getData, preparedData, columns, columnsMobile } = props;
  const [data, setData] = React.useState(null);

  React.useEffect(() => {
    if (getData) {
      getData()
        .then(res => setData(res))
        .catch(err => console.log(err));
    } else {
      setData(preparedData);
    }
  }, [getData, preparedData])

  return (
    <TableContainer component={Paper}>
      { data ? (
        <>
          <Table className={classes.table} aria-label="info table">
            <TableBody>
              {tabulate(data, columns).map((row, idx) => (
                <TableRow key={idx}>
                  {row.map((elem, j) => (
                    (j & 1) ? (
                      <TableCell align="left">{elem}</TableCell>
                    ) : (
                      <TableCell component="th" scope="row">
                        <strong>{elem}</strong>
                      </TableCell>
                    )
                  ))}
                </TableRow>
              ))}
            </TableBody>
          </Table>
          <Table className={classes.tableMobile} aria-label="info table mobile">
            <TableBody>
              {tabulate(data, columnsMobile).map((row, idx) => (
                <TableRow key={idx}>
                  {row.map((elem, j) => (
                    (j & 1) ? (
                      <TableCell align="left">{elem}</TableCell>
                    ) : (
                      <TableCell component="th" scope="row">
                        <strong>{elem}</strong>
                      </TableCell>
                    )
                  ))}
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

InfoTable.defaultProps = {
  getData: null,
  preparedData: null,
  columns: 3,
  columnsMobile: 2,
}