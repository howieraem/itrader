import React from "react";
import { Alert } from "@material-ui/lab"
import Snackbar from "@material-ui/core/Snackbar";
// import IconButton from "@material-ui/core/IconButton";
// import CloseIcon from "@material-ui/icons/Close";


export default function AlertMessage({ message, rank=1, severity="info" }) {
  const [open, setOpen] = React.useState(true);
  function handleClose(event, reason) {
    if (reason === "clickaway") {
      return;
    }
    setOpen(false);
  }

  return (
    <div>
      <Snackbar
        anchorOrigin={{
          vertical: "top",
          horizontal: "right"
        }}
        open={open}
        autoHideDuration={2000}
        onClose={handleClose}
        variant="warning"
        ContentProps={{
          "aria-describedby": "message-id"
        }}
        style={{
          marginTop: `${50 * rank}px`
        }}
      >
        <Alert severity={severity} style={{fontSize: "15px"}}><strong>{message}</strong></Alert>
      </Snackbar>
    </div>
  );
}
