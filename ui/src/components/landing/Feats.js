import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import CardMedia from '@material-ui/core/CardMedia';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';


const useStyles = makeStyles((theme) => ({
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
  },
  cardMedia: {
    paddingTop: '100%',
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
    heading: 'Light.',
    desc: 'Built with React JS and Spring Boot. Fast response and data update.',
    icon: 'https://image.flaticon.com/icons/png/512/1067/1067256.png',
  },
  {
    heading: 'Convenient.',
    desc: 'Add stocks to watchlist. No complicated operations. Mobile devices supported.', 
    icon: 'https://image.flaticon.com/icons/png/512/633/633652.png',
  },
  {
    heading: 'Detailed.',
    desc: 'Stock charts at multiple scales with various metrics for your decision.', 
    icon: 'https://image.flaticon.com/icons/png/512/751/751463.png',
  },
  {
    heading: 'Global.',
    desc: 'View and trade stocks in multiple countries, with simulated currency exchange.', 
    icon: 'https://image.flaticon.com/icons/png/512/900/900782.png',
  },
];

export default function Feats() {
  const classes = useStyles();
  return (
    <Grid container spacing={2}>
      {cards.map((card, i) => (
        <Grid item key={i} xs={12} sm={6} md={3}>
          <Card className={classes.card}>
            <CardMedia
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
  );
}