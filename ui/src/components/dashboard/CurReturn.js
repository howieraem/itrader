import { makeStyles } from '@material-ui/core/styles';
import {
  Box,
  Card,
  Typography
} from '@material-ui/core';
import TrendingUpIcon from '@material-ui/icons/TrendingUp';
import TrendingDownIcon from '@material-ui/icons/TrendingDown';

const useStyles = makeStyles(theme => ({
  card: {
    boxShadow: 'none',
    textAlign: 'center',
    padding: theme.spacing(3, 0),
  },
  iconBox: {
    margin: theme.spacing(2, 0)
  }
}));

export default function CurReturn({ percentage }) {
  const classes = useStyles();
  const bgColor = percentage >= 0 ?  "#45ff38" : "#ff7777";

  return (
    <Card className={classes.card} style={{ backgroundColor: bgColor }}>
      <Box
        alignItems="center"
        display="flex"
        flexDirection="column"
        className={classes.iconBox}
      >
        {percentage >= 0 ? <TrendingUpIcon style={{ width: 60, height: 60 }} /> :
          <TrendingDownIcon style={{ width: 60, height: 60 }} />}
      </Box>
      <Typography variant="h6">{percentage}</Typography>
      <Typography variant="subtitle2" style={{ opacity: 0.72 }}>
        Current Return
      </Typography>
    </Card>
  );
}
