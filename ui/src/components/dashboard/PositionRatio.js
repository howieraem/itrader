import { makeStyles } from '@material-ui/core/styles';
import {
  Box,
  Card,
  Typography
} from '@material-ui/core';
import PieChartIcon from '@material-ui/icons/PieChart';

const useStyles = makeStyles(theme => ({
  card: {
    boxShadow: 'none',
    textAlign: 'center',
    padding: theme.spacing(3, 0),
    backgroundColor: "#5effec",
  },
  iconBox: {
    margin: theme.spacing(2, 0)
  }
}));

export default function PositionRatio({ percentage }) {
  const classes = useStyles();

  return (
    <Card className={classes.card}>
      <Box
        alignItems="center"
        display="flex"
        flexDirection="column"
        className={classes.iconBox}
      >
        <PieChartIcon style={{ width: 60, height: 60 }} />
      </Box>
      <Typography variant="h6">{percentage}</Typography>
      <Typography variant="subtitle2" style={{ opacity: 0.72 }}>
        Position Ratio
      </Typography>
    </Card>
  );
}
