import { makeStyles } from '@material-ui/core/styles';
import {
  Box,
  Card,
  Typography
} from '@material-ui/core';
import AccountBalanceWalletIcon from '@material-ui/icons/AccountBalanceWallet';
import { COLORS } from "../../common/Theme";

const useStyles = makeStyles(theme => ({
  card: {
    boxShadow: 'none',
    textAlign: 'center',
    padding: theme.spacing(3, 0),
    backgroundColor: COLORS[5],
  },
  iconBox: {
    margin: theme.spacing(2, 0)
  }
}));

export default function Cash(props) {
  const classes = useStyles();

  return (
    <Card className={classes.card}>
      <Box
        alignItems="center"
        display="flex"
        flexDirection="column"
        className={classes.iconBox}
      >
        <AccountBalanceWalletIcon style={{ width: 60, height: 60 }} />
      </Box>
      <Typography variant="h6">{props.cash}</Typography>
      <Typography variant="subtitle2" style={{ opacity: 0.72 }}>
        Cash Available
      </Typography>
    </Card>
  );
}
