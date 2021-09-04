import React from 'react';
import { useHistory } from 'react-router-dom';
import { makeStyles } from '@material-ui/core/styles';
import IconButton from "@material-ui/core/IconButton";
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';
import Typography from '@material-ui/core/Typography';
import Pagination from '@material-ui/lab/Pagination';
import DeleteForeverIcon from '@material-ui/icons/DeleteForever';
import { nf2, nf4, nfp } from "../../constants";
import { getWatchlist, getWatchlistSize, removeFromWatchlist } from '../../utils/API';
import { getStockBasicInfo } from '../../utils/DataAPI';


const useStyles = makeStyles((theme) => ({
  removeButton: {
    textTransform: 'none',
    backgroundColor: '#ee0000',
    color: 'white',
    '&:hover': {
      backgroundColor: '#ee6666',
    }
  },
  title: {
    display: 'flex',
    flexDirection: 'row',
  },
  grow: {
    flexGrow: 1,
  },
  listItemText: {
    minWidth: 200,
    maxWidth: 200
  }
}));

export default function Watchlist(props) {
  const classes = useStyles();
  const { onSymbolClick } = props;

  const [page, setPage] = React.useState(0);
  const rowsPerPage = 10;
  // const [rowsPerPage, setRowsPerPage] = React.useState(5);
  const [numOfRecords, setNumOfRecords] = React.useState(0);
  const [pageRecords, setPageRecords] = React.useState([]);
  const numOfPages = Math.floor((numOfRecords + rowsPerPage - 1) / rowsPerPage);

  let history = useHistory();

  const handleRemove = (i) => {
    removeFromWatchlist(pageRecords[i].symbol)
    .catch(err => console.log(err));

    setNumOfRecords(numOfRecords - 1);
  }

  const handleWatchlistItemClick = (i) => {
    onSymbolClick(pageRecords[i].symbol);
    history.push('/stockView');
  }

  React.useEffect(() => {
    getWatchlistSize()
    .then(res => setNumOfRecords(res))
    .catch(err => console.log(err));

    getWatchlist(page, rowsPerPage)
    .then(records => {
      if (records && records.length) {
        const symbols = records.map(r => r.symbol);

        getStockBasicInfo(symbols)
        .then(res => {
          for (let i = 0; i < res.length; ++i) {
            records[i].i = i;
            records[i].name = res[i].displayName || res[i].longName || res[i].shortName;
            // records[i].marketClosed = (res[i].marketState !== "REGULAR");
            const sign = res[i].regularMarketChange >= 0 ? "+" : "";
            records[i].price = `${nf4.format(res[i].regularMarketPrice)}`;
            records[i].change = `${sign}${nf2.format(res[i].regularMarketChange)} 
                                 (${sign}${nfp.format(res[i].regularMarketChangePercent)}%)`;
          }
          setPageRecords(records);
        });
      }
    })
    .catch(err => console.log(err));
  }, [page, rowsPerPage, numOfPages, numOfRecords])

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
        Watchlist
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
          <List component="nav" aria-label="profile watchlist">
            {pageRecords.map((row) => (
              <ListItem button key={row.i} onClick={() => handleWatchlistItemClick(row.i)}>
                <ListItemText
                  primary={row.symbol}
                  secondary={row.name}
                  className={classes.listItemText}
                />
                <div className={classes.grow} />
                <ListItemText
                  primary={row.price}
                  secondary={row.change}
                  className={classes.listItemText}
                />
                <div className={classes.grow} />
                <ListItemSecondaryAction>
                  <IconButton
                    className={classes.removeButton}
                    onClick={() => handleRemove(row.i)}
                    style={{ borderRadius: 2, maxHeight: 40 }}
                  >
                    <DeleteForeverIcon />
                  </IconButton>
                </ListItemSecondaryAction>
              </ListItem>
            ))}
          </List>
        </>
      ) : (
        <div>Your watchlist is empty.</div>
      )}
    </React.Fragment>
  );
}
