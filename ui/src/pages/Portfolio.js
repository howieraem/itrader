import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Container from '@material-ui/core/Container';
import Paper from '@material-ui/core/Paper';
import PortfolioTable from '../components/dashboard/PortfolioTable';
import { getPortfolio } from "../utils/API";
import { getBatchStockPrices } from "../utils/DataAPI";

const useStyles = makeStyles((theme) => ({
  container: {
    paddingTop: theme.spacing(4),
    paddingBottom: theme.spacing(4),
  },
  paper: {
    padding: theme.spacing(2),
    display: 'flex',
    overflowY: 'auto',
    flexDirection: 'column',
  },
}));

export default function Portfolio(props) {
  const classes = useStyles();
  const { onSymbolClick } = props;

  const [portfolioLoaded, setPortfolioLoaded] = React.useState(false);
  const [portfolio, setPortfolio] = React.useState([]);
  const [portfolioPrices, setPortfolioPrices] = React.useState([]);

  React.useEffect(() => {
    const updatePortfolioWorth = () => {
      getPortfolio()
        .then(positions => {
          setPortfolio(positions);
          let symbols = [];
          for (let i = 0; i < positions.length; ++i) {
            symbols.push(positions[i].symbol);
          }

          if (symbols.length) {
            getBatchStockPrices(symbols)
              .then(prices => {
                setPortfolioPrices(prices);
                setPortfolioLoaded(true);
              })
              .catch(err => console.log(err));
          } else {
            // no positions
            setPortfolioLoaded(true);
          }
        })
        .catch(err => console.log(err));
    }
    updatePortfolioWorth();

    const interval = setInterval(() => {
      updatePortfolioWorth();
    }, 10000);

    return () => {
      clearInterval(interval);
    }
  }, [])

  return (
    portfolioLoaded && (
      <Container maxWidth="lg" className={classes.container}>
        <Paper className={classes.paper}>
          <PortfolioTable
            portfolio={portfolio}
            prices={portfolioPrices}
            rowsPerPage={20}
            onSymbolClick={onSymbolClick}
          />
        </Paper>
      </Container>
    )
  );
}
