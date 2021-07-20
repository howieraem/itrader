import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import CardMedia from '@material-ui/core/CardMedia';
import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import rapid from './rapid.png';
import convenient from './convenient.png';
import detailed from './detailed.png';
import global from './global.png';


const useStyles = makeStyles((theme) => ({
  main: {
    flexGrow: 1,
    position: 'relative',
    marginBottom: theme.spacing(2),
  },
  icon: {
    marginRight: theme.spacing(2),
  },
  heroContent: {
    backgroundColor: theme.palette.background.paper,
    padding: theme.spacing(8, 0, 6),
  },
  heroButtons: {
    marginTop: theme.spacing(4),
  },
  cardGrid: {
    paddingTop: theme.spacing(8),
    paddingBottom: theme.spacing(8),
  },
  card: {
    height: '100%',
    display: 'flex',
    flexDirection: 'column',
    border: 'none',
    boxShadow: "none"
  },
  cardMedia: {
    // height: 0,
    // paddingTop: '100%',
  },
  cardContent: {
    flexGrow: 1,
  },
  footer: {
    backgroundColor: theme.palette.background.paper,
    padding: theme.spacing(6),
  },
}));

const cards = [
  {
    heading: 'Rapid.',
    desc: 'Fast response and real-time data update.',
    icon: rapid,
  },
  {
    heading: 'Convenient.',
    desc: 'Add stocks to watchlist. No complicated operations. Mobile devices supported.', 
    icon: convenient,
  },
  {
    heading: 'Detailed.',
    desc: 'Stock charts at multiple scales with various metrics for your decision.', 
    icon: detailed,
  },
  {
    heading: 'Global.',
    desc: 'View and trade stocks in multiple countries, with simulated currency exchange.', 
    icon: global,
  },
];

export default function Feats() {
  const classes = useStyles();
  return (
    <Paper className={classes.main}>
      <Grid container spacing={2}>
        {cards.map((card, i) => (
          <Grid item key={i} xs={12} sm={6} md={3}>
            <Card className={classes.card}>
              <CardMedia
                component="img"
                className={classes.cardMedia}
                image={card.icon}
              />
              <CardContent className={classes.cardContent}>
                <Typography gutterBottom variant="h5" component="h2">
                  {card.heading}
                </Typography>
                <Typography>
                  {card.desc}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Paper>
  );
}