import React from "react";
import { Alert } from "@material-ui/lab"
import Snackbar from "@material-ui/core/Snackbar";

export default function AlertMessage({ message, rank=0, severity="info" }) {
  const [open, setOpen] = React.useState(true);

  const handleClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }
    setOpen(false);
  }

  return (
    <>
      <Snackbar
        anchorOrigin={{
          vertical: "top",
          horizontal: "right"
        }}
        open={open}
        autoHideDuration={1500}
        onClose={handleClose}
        variant="warning"
        ContentProps={{
          "aria-describedby": "message-id"
        }}
        style={{
          marginTop: `${65 + 25 * rank}px`
        }}
      >
        <Alert severity={severity} style={{fontSize: "15px"}}><strong>{message}</strong></Alert>
      </Snackbar>
    </>
  );
}
