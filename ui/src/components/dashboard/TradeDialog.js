import React from 'react';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import Paper from '@material-ui/core/Paper';
import { makeStyles } from '@material-ui/core/styles';
import { trade } from '../../utils/APIUtils';


const useStyles = makeStyles((theme) => ({
  tradeButton: {
    textTransform: 'none', 
    fontSize: 16, 
    backgroundColor: "#0077b7", 
    color: "white", 
    borderRadius: 12,
    maxWidth: '130px', 
    maxHeight: '50px', 
    minWidth: '130px', 
    minHeight: '50px',
    marginTop: "5px"
  },
  dialogButton: {
    textTransform: 'none',
  },
  symbolLabel: {
    fontSize: 16, 
    marginBottom: '10px',
    fontWeight: 'bold'
  }
}))


export default function TradeDialog(props) {
  const classes = useStyles();

  const [open, setOpen] = React.useState(false);

  const [qty, setQty] = React.useState(0);

  const [textFieldErr, setTextFieldErr] = React.useState(null);

  const handleQtyChange = (event) => {
    const qty = event.target.value;
    if (isNaN(qty) || isNaN(parseInt(qty)) || qty <= 0) { 
      setTextFieldErr("Quantity must be a positive integer!") 
    } else {
      setTextFieldErr(null);
      setQty(qty);
    }
  };

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleTrade = (isBuy) => {
    if (textFieldErr)  return;
    const tradeRequest = {
      'symbol': props.symbol,
      'qty': qty * (isBuy ? 1 : -1),
    }
    trade(tradeRequest)
    .then(response => {
      console.log(response)
    }).catch(error => {
      console.log(error);
    });
    setOpen(false);
  }

  return (
    <div>
      <Button variant="contained" className={classes.tradeButton} onClick={handleClickOpen}>
        Trade
      </Button>
      <Dialog open={open} onClose={handleClose} aria-labelledby="form-dialog-title">
        <DialogTitle id="form-dialog-title">Trade</DialogTitle>
          
          { props.authenticated ? (
            <div>
              <DialogContent>
                <DialogContentText>
                  Be sure to double check details below before you trade.
                </DialogContentText>
                <Paper className={classes.symbolLabel}>Stock Symbol: {props.symbol}</Paper>
                <TextField
                  autoFocus
                  onChange={handleQtyChange}
                  variant="outlined"
                  margin="dense"
                  id="dialogQty"
                  label="Quantity (shares)"
                  error={textFieldErr}
                  helperText={textFieldErr}
                  fullWidth
                />
              </DialogContent>
              <DialogActions>
                <Button onClick={() => handleTrade(true)} color="primary" className={classes.dialogButton}>
                  Buy
                </Button>
                <Button onClick={() => handleTrade(false)} color="primary" className={classes.dialogButton}>
                  Sell
                </Button>
                <Button onClick={handleClose} color="primary" className={classes.dialogButton}>
                  Cancel
                </Button>
              </DialogActions>
            </div>
          ) : (
            <div>
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
            </div>
          ) }

        
      </Dialog>
    </div>
  );
}
