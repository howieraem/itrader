import React from 'react';
// import clsx from 'clsx';
import { makeStyles } from '@material-ui/core/styles';
import CssBaseline from '@material-ui/core/CssBaseline';
import Box from "@material-ui/core/Box";
import Container from '@material-ui/core/Container';
import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';
import Typography from "@material-ui/core/Typography";
import Cash from './Cash';
import NetWorth from "./NetWorth";
import FloatingProfit from "./FloatingProfit";
import PositionPercent from "./PositionPercent";
import Trades from './Trades';
import Portfolio from './Portfolio';
import Watchlist from './Watchlist';
import { getPortfolio } from "../../utils/APIUtils";
import { getBatchStockPrices } from "../../utils/DataAPIUtils";

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
  const { onSymbolClick, currentUser } = props;
  const authenticated = currentUser != null;
  const cash = currentUser.balance;

  const initCash = 10000;
  const [portfolioWorth, setPortfolioWorth] = React.useState(0);

  React.useEffect(() => {
    const updatePortfolioWorth = () => {
      getPortfolio(-1, -1)
        .then(positions => {
          let symbols = [], quantities = [];
          for (let i = 0; i < positions.length; ++i) {
            symbols.push(positions[i].symbol);
            quantities.push(positions[i].quantity);
          }

          getBatchStockPrices(symbols)
            .then(prices => {
              const portfolioWorths = prices.map((price, i) => price * quantities[i]);
              setPortfolioWorth(portfolioWorths.reduce((a, b) => a + b, 0));
            })
        })
    }
    updatePortfolioWorth();
  }, [])

  const totalWorth = cash + portfolioWorth;

  return (
    <Grid container>
      <CssBaseline />
      <main className={classes.content}>
        <Container maxWidth="md" className={classes.container}>
          <Box className={classes.topBox}>
            <Typography variant="h4">Welcome back, {currentUser.username}!</Typography>
          </Box>
          <Grid container spacing={5}>
            <Grid item xs={6} md={3}>
              <NetWorth total={totalWorth.toFixed(2)} />
            </Grid>
            <Grid item xs={6} md={3}>
              <Cash cash={cash} />
            </Grid>
            <Grid item xs={6} md={3}>
              <PositionPercent percentage={(portfolioWorth / totalWorth * 100).toFixed(2)} />
            </Grid>
            <Grid item xs={6} md={3}>
              <FloatingProfit percentage={Math.abs(1 - totalWorth / initCash).toFixed(2)} />
            </Grid>

            <Grid item xs={12}>
              <Paper className={classes.paper}>
                <Watchlist authenticated={authenticated} onSymbolClick={onSymbolClick} />
              </Paper>
            </Grid>

            <Grid item xs={12}>
              <Paper className={classes.paper}>
                <Portfolio authenticated={authenticated} onSymbolClick={onSymbolClick} />
              </Paper>
            </Grid>

            <Grid item xs={12}>
              <Paper className={classes.paper}>
                <Trades />
              </Paper>
            </Grid>
          </Grid>
        </Container>
      </main>
    </Grid>
  );
}
