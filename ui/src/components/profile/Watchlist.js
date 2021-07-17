import React from 'react';
import { useHistory } from 'react-router-dom';
import { makeStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import ButtonGroup from '@material-ui/core/ButtonGroup';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';
import Typography from '@material-ui/core/Typography';
import Pagination from '@material-ui/lab/Pagination';
import DeleteForeverIcon from '@material-ui/icons/DeleteForever';
import TradeDialog from './TradeDialogCell';
import { getWatchlist, getWatchlistSize, removeFromWatchlist } from '../../utils/APIUtils';
import { getStockBasicInfo } from '../../utils/DataAPIUtils';


const useStyles = makeStyles((theme) => ({
  removeButton: {
    textTransform: 'none',
  },
  title: {
    display: 'flex',
    flexDirection: 'row',
  },
  grow: {
    flexGrow: 1,
  }
}));

export default function Watchlist(props) {
  const classes = useStyles();
  const { authenticated, onSymbolClick } = props;

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
  }

  const handleWatchlistItemClick = (i) => {
    onSymbolClick(pageRecords[i].symbol);
    history.push('/');
  }

  React.useEffect(() => {
    getWatchlistSize()
    .then(res => setNumOfRecords(res))
    .catch(err => console.log(err));

    getWatchlist(page, rowsPerPage)
    .then(records => {
      if (records && records.length) {
        let symbols = [];
        for (let i = 0; i < records.length; ++i) {
          symbols.push(records[i].symbol);
          records[i].i = i;
        }

        getStockBasicInfo(symbols)
        .then(res => {
          for (let i = 0; i < res.length; ++i) {
            records[i].name = res[i].displayName || res[i].shortName || res[i].longName;
            records[i].marketClosed = (res[i].marketState !== "REGULAR");
          }
          setPageRecords(records);
        });
      }
    })
    .catch(err => console.log(err));
  }, [page, rowsPerPage, numOfPages, pageRecords])

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
        Stock Watchlist
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
                <ListItemText primary={row.symbol} />
                <ListItemText primary={row.name} primaryTypographyProps={{ align: "left" }} />
                <ListItemSecondaryAction>
                  <ButtonGroup>
                    <TradeDialog 
                      symbol={row.symbol} 
                      authenticated={authenticated} 
                      marketClosed={row.marketClosed} 
                    />
                    <Button 
                      variant="contained" 
                      color="secondary" 
                      startIcon={<DeleteForeverIcon />}
                      className={classes.removeButton}
                      onClick={() => handleRemove(row.i)}
                    >
                      Remove
                    </Button>
                  </ButtonGroup>
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
