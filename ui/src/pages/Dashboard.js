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
import NetWorth from "../components/dashboard/NetWorth";
import PositionPercent from "../components/dashboard/PositionPercent";
import ProfitPercent from "../components/dashboard/ProfitPercent";
import PortfolioTable from '../components/dashboard/PortfolioTable';
import { INIT_CASH } from "../constants";
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
  const [totalWorth, setTotalWorth] = React.useState(-1);
  const [portfolioWorth, setPortfolioWorth] = React.useState(0);
  const [portfolio, setPortfolio] = React.useState([]);
  const [portfolioPrices, setPortfolioPrices] = React.useState([]);

  React.useEffect(() => {
    const updatePortfolioWorth = () => {
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
                const pWorths = prices.map((price, i) => price * quantities[i]);
                const pWorth = pWorths.reduce((a, b) => a + b, 0);
                setPortfolioWorth(pWorth);
                setTotalWorth(cash + pWorth);
                setPortfolioLoaded(true);
              })
              .catch(err => console.log(err));
          } else {
            // no positions
            setTotalWorth(cash);
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
  }, [cash])

  return (
    <Grid container>
      <CssBaseline />
      <main className={classes.content}>
        <Container maxWidth="md" className={classes.container}>
          <Box className={classes.topBox}>
            <Typography variant="h4">Welcome back, {curUser.username}!</Typography>
          </Box>

          <Grid container spacing={2}>
            { portfolioLoaded ? (
                <>
                  <Grid item xs={6} md={3}>
                    <NetWorth total={`USD ${totalWorth.toFixed(2)}`} />
                  </Grid>
                  <Grid item xs={6} md={3}>
                    <ProfitPercent percentage={((totalWorth / INIT_CASH - 1) * 100).toFixed(2)} />
                  </Grid>
                  <Grid item xs={6} md={3}>
                    <Cash cash={`USD ${cash.toFixed(2)}`} />
                  </Grid>
                  <Grid item xs={6} md={3}>
                    <PositionPercent percentage={(portfolioWorth / totalWorth * 100).toFixed(2)} />
                  </Grid>

                  <Grid item xs={12}>
                    <Paper className={classes.paper}>
                      <PortfolioTable
                        portfolio={portfolio}
                        prices={portfolioPrices}
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
