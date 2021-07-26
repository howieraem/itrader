import { makeStyles } from '@material-ui/core/styles';
import {
  Box,
  Card,
  Typography
} from '@material-ui/core';
import TrendingUpIcon from '@material-ui/icons/TrendingUp';
// import { COLORS } from "../../common/Theme";

const useStyles = makeStyles(theme => ({
  card: {
    boxShadow: 'none',
    textAlign: 'center',
    padding: theme.spacing(3, 0),
    backgroundColor: "#45ff38",
  },
  iconBox: {
    margin: theme.spacing(2, 0)
  }
}));

export default function FloatingProfit(props) {
  const classes = useStyles();

  return (
    <Card className={classes.card}>
      <Box
        alignItems="center"
        display="flex"
        flexDirection="column"
        className={classes.iconBox}
      >
        <TrendingUpIcon style={{ width: 60, height: 60 }} />
      </Box>
      <Typography variant="h6">{props.percentage} %</Typography>
      <Typography variant="subtitle2" style={{ opacity: 0.72 }}>
        Floating Profit
      </Typography>
    </Card>
  );
}
