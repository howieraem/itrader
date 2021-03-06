import { makeStyles } from '@material-ui/core/styles';
import {
  Box,
  Card,
  Typography
} from '@material-ui/core';
import AccountBalanceIcon from '@material-ui/icons/AccountBalance';

const useStyles = makeStyles(theme => ({
  card: {
    boxShadow: 'none',
    textAlign: 'center',
    padding: theme.spacing(3, 0),
    backgroundColor: "#ffe838",
  },
  iconBox: {
    margin: theme.spacing(2, 0)
  }
}));

export default function TotalAssets({ total }) {
  const classes = useStyles();

  return (
    <Card className={classes.card}>
      <Box
        alignItems="center"
        display="flex"
        flexDirection="column"
        className={classes.iconBox}
      >
        <AccountBalanceIcon style={{ width: 60, height: 60 }} />
      </Box>
      <Typography variant="h6">{total}</Typography>
      <Typography variant="subtitle2" style={{ opacity: 0.72 }}>
        Total Assets
      </Typography>
    </Card>
  );
}
