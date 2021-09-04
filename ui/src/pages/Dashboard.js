import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import CssBaseline from '@material-ui/core/CssBaseline';
import Box from "@material-ui/core/Box";
import Container from '@material-ui/core/Container';
import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';
import Typography from "@material-ui/core/Typography";
import LoadingIndicator from "../common/LoadingIndicator";
import Cash from '../components/dashboard/Cash';
import TotalAssets from "../components/dashboard/TotalAssets";
import PositionRatio from "../components/dashboard/PositionRatio";
import CurReturn from "../components/dashboard/CurReturn";
import PortfolioTable from '../components/dashboard/PortfolioTable';
import { INIT_CASH, nf2, nfp } from "../constants";
import { getPortfolio } from "../utils/API";
import { getBatchStockPrices } from "../utils/DataAPI";

const useStyles = makeStyles((theme) => ({
  topBox: {
    margin: theme.spacing(0, 0, 3),
  },
  content: {
    flexGrow: 1,
    height: '80vh',
    overflow: 'auto',
  },
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

export default function Dashboard(props) {
  const classes = useStyles();
  const { onSymbolClick, curUser } = props;
  const cash = curUser.balance;

  const [portfolioLoaded, setPortfolioLoaded] = React.useState(false);
  const [portfolio, setPortfolio] = React.useState([]);
  const [portfolioPrices, setPortfolioPrices] = React.useState([]);
  const [positionValues, setPositionValues] = React.useState([]);
  const [portfolioValue, setPortfolioValue] = React.useState(0);
  const [totalValue, setTotalValue] = React.useState(-1);

  React.useEffect(() => {
    const updatePortfolioValue = () => {
      getPortfolio()
        .then(positions => {
          setPortfolio(positions);
          let symbols = [], quantities = [];
          for (let i = 0; i < positions.length; ++i) {
            symbols.push(positions[i].symbol);
            quantities.push(positions[i].quantity);
          }

          if (symbols.length) {
            getBatchStockPrices(symbols)
              .then(prices => {
                setPortfolioPrices(prices);
                const pValues = prices.map((price, i) => price * quantities[i]);
                setPositionValues(pValues);
                const pValue = pValues.reduce((a, b) => a + b, 0);
                setPortfolioValue(pValue);
                setTotalValue(cash + pValue);
                setPortfolioLoaded(true);
              })
              .catch(err => console.log(err));
          } else {
            // no positions
            setTotalValue(cash);
            setPortfolioLoaded(true);
          }
        })
        .catch(err => console.log(err));
    }
    updatePortfolioValue();

    const interval = setInterval(() => {
      updatePortfolioValue();
    }, 10000);

    return () => {
      clearInterval(interval);
    }
  }, [cash])

  return (
    <Grid container>
      <CssBaseline />
      <main className={classes.content}>
        <Container maxWidth="lg" className={classes.container}>
          <Box className={classes.topBox}>
            <Typography variant="h4">Welcome back, {curUser.username}!</Typography>
          </Box>

          <Grid container spacing={2}>
            { portfolioLoaded ? (
                <>
                  <Grid item xs={6} md={3}>
                    <TotalAssets total={"USD " + nf2.format(totalValue)} />
                  </Grid>
                  <Grid item xs={6} md={3}>
                    <CurReturn
                      percentage={nfp.format((totalValue / INIT_CASH - 1) * 100) + '%'}
                      positive={totalValue >= INIT_CASH}
                    />
                  </Grid>
                  <Grid item xs={6} md={3}>
                    <Cash cash={"USD " + nf2.format(cash)} />
                  </Grid>
                  <Grid item xs={6} md={3}>
                    <PositionRatio percentage={nfp.format(portfolioValue / totalValue * 100) + '%'} />
                  </Grid>

                  <Grid item xs={12}>
                    <Paper className={classes.paper}>
                      <PortfolioTable
                        portfolio={portfolio}
                        prices={portfolioPrices}
                        positionValues={positionValues}
                        totalValue={totalValue}
                        onSymbolClick={onSymbolClick}
                      />
                    </Paper>
                  </Grid>
                </>
              ) : (
                <Grid item xs={12}>
                  <LoadingIndicator />
                </Grid>
              )
            }
          </Grid>
        </Container>
      </main>
    </Grid>
  );
}
