import React from 'react';
import { useHistory } from 'react-router-dom';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import Paper from '@material-ui/core/Paper';
import { Alert } from "@material-ui/lab"
import { makeStyles } from '@material-ui/core/styles';
import { trade, getAffordable, getHolding } from '../../utils/APIUtils';
import { COLOR_TERTIARY } from '../../common/Theme';


const useStyles = makeStyles((theme) => ({
  tradeButton: {
    textTransform: 'none', 
    fontSize: 12, 
    backgroundColor: COLOR_TERTIARY, 
    color: "white", 
    borderRadius: 10,
    maxHeight: '20px', 
    minHeight: '20px',
    maxWidth: '60px', 
    minWidth: '60px',
  },
  dialogButton: {
    textTransform: 'none',
  },
  symbolLabel: {
    fontSize: 16, 
    marginBottom: '10px',
    fontWeight: 'bold',
    border: 0
  },
  validQuantityLabel: {
    fontSize: 13, 
    marginBottom: '10px',
    border: 0
  }
}))


export default function TradeDialog(props) {
  const classes = useStyles();
  const { symbol, authenticated, marketClosed }  = props;

  const [open, setOpen] = React.useState(false);
  const [buttonsDisabled, setButtonsDisabled] = React.useState(false);

  const [qty, setQty] = React.useState(0);
  const [maxBuyQty, setMaxBuyQty] = React.useState(0);
  const [maxSellQty, setMaxSellQty] = React.useState(0);

  const [textFieldErr, setTextFieldErr] = React.useState(null);

  const [alertMsg, setAlertMsg] = React.useState(null);
  const [alertSeverity, setAlertSeverity] = React.useState("info");

  let history = useHistory();

  React.useEffect(() => {
    const updateValidQty = () => {
      if (open && authenticated) {
        getAffordable(symbol)
        .then(qty => setMaxBuyQty(qty))
        .catch(err => console.log(err));
    
        getHolding(symbol)
        .then(qty => setMaxSellQty(qty))
        .catch(err => console.log(err));
      }
    }
    updateValidQty();

    const interval = setInterval(() => {
      updateValidQty();
    }, 5000);
  
    return () => {
      clearInterval(interval);
    };
  }, [symbol, open, authenticated]);

  const handleQtyChange = (event) => {
    const qty = event.target.value;
    if (isNaN(qty) || isNaN(parseInt(qty)) || qty <= 0) { 
      setTextFieldErr("Quantity must be a positive integer!");
    } else {
      setTextFieldErr(null);
      setQty(qty);
    }
  };

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setAlertMsg(null);
    setTextFieldErr(null);
    setOpen(false);
  };

  const handleTrade = (isBuy) => {
    if (textFieldErr)  return;
    if (isBuy) {
      if (qty > maxBuyQty) {
        setTextFieldErr("Quantity exceeds the maximum affordable quantity!")
        return;
      }
    } else {
      if (qty > maxSellQty) {
        setTextFieldErr("You cannot sell more than you hold! Short not yet supported.")
        return;
      }
    }
    const tradeRequest = {
      'symbol': symbol,
      'qty': qty * (isBuy ? 1 : -1),
    }

    trade(tradeRequest)
    .then(response => {
      console.log(response);
      if (response.success) {
        setAlertMsg(response.message);
        setAlertSeverity("success");
        setButtonsDisabled(true);
        setTimeout(() => {
          setOpen(false);
          setAlertMsg(null);
          setButtonsDisabled(false);
        }, 2000);
        history.go();
      } else {
        setAlertMsg("An error occurred. Please try again.")
        setAlertSeverity("error");
      }
    }).catch(error => {
      console.log(error);
      setAlertMsg("An error occurred. Please try again.")
      setAlertSeverity("error");
    });
  }

  return (
    <>
      <Button variant="contained" className={classes.tradeButton} onClick={handleClickOpen}>
        Trade
      </Button>
      <Dialog open={open} onClose={handleClose} aria-labelledby="form-dialog-title">
        <DialogTitle id="form-dialog-title">Trade</DialogTitle>
          { marketClosed ? (
            <>
              <DialogContent>
                <DialogContentText>
                  The stock market is closed.
                </DialogContentText>
                <DialogActions>
                  <Button onClick={handleClose} color="primary" className={classes.dialogButton}>
                    OK
                  </Button>
                </DialogActions>
              </DialogContent>
            </>
          ) : (
            authenticated ? (
              <>
                <DialogContent>
                  <DialogContentText>
                    Be sure to double check details below before you trade.
                  </DialogContentText>
                  <Paper variant='outlined' className={classes.symbolLabel}>Stock Symbol: {symbol}</Paper>
                  <Paper variant='outlined' className={classes.validQuantityLabel}>Maximum quantity affordable: {maxBuyQty}</Paper>  
                  <Paper variant='outlined' className={classes.validQuantityLabel}>Existing quantity: {maxSellQty}</Paper>
                  <TextField
                    autoFocus
                    onChange={handleQtyChange}
                    variant="outlined"
                    margin="dense"
                    id="dialogQty"
                    label="Quantity (shares)"
                    error={Boolean(textFieldErr)}
                    helperText={textFieldErr}
                    fullWidth
                  />
                  { alertMsg ? (
                    <Alert severity={alertSeverity} style={{fontSize: "15px"}}>{alertMsg}</Alert>
                  ) : null }
                </DialogContent>
                <DialogActions>
                  <Button 
                    onClick={() => handleTrade(true)} 
                    color="primary" 
                    disabled={buttonsDisabled}
                    className={classes.dialogButton}
                  >
                    Buy
                  </Button>
                  <Button 
                    onClick={() => handleTrade(false)} 
                    color="primary" 
                    disabled={buttonsDisabled}
                    className={classes.dialogButton}
                  >
                    Sell
                  </Button>
                  <Button 
                    onClick={handleClose} 
                    color="primary" 
                    disabled={buttonsDisabled}
                    className={classes.dialogButton}
                  >
                    Cancel
                  </Button>
                </DialogActions>
              </>
            ) : (
              <>
                <DialogContent>
                  <DialogContentText>
                    Please log in first.
                  </DialogContentText>
                  <DialogActions>
                    <Button href="/login" color="primary" className={classes.dialogButton}>
                      Login
                    </Button>
                    <Button onClick={handleClose} color="primary" className={classes.dialogButton}>
                      Cancel
                    </Button>
                  </DialogActions>
                </DialogContent>
              </>
            )
          ) }
      </Dialog>
    </>
  );
}
