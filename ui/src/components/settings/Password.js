import React, { useState } from 'react';
import {
  Box,
  Button,
  Card,
  CardContent,
  CardHeader,
  Divider,
  TextField
} from '@material-ui/core';
import Alert from "@material-ui/lab/Alert";
import { makeStyles } from "@material-ui/core/styles";
import { changePassword } from "../../utils/API";

const useStyles = makeStyles(theme => ({
  submit: {
    textTransform: 'none',
    backgroundColor: theme.palette.primary.main,
    color: 'white',
  },
}))

const PasswordSetting = ({ onLogout }) => {
  const classes = useStyles();

  const [cur, setCur] = useState('');
  const [pwd, setPwd] = useState('');
  const [pwd2, setPwd2] = useState('');
  const [newPwdErrMsg, setNewPwdErrMsg] = useState('');
  const [disabled, setDisabled] = useState(true);

  const [alertMsg, setAlertMsg] = useState(null);
  const [severity, setSeverity] = useState("success");

  const checkPwdMatch = (ev) => {
    const confirmedPwd = ev.target.value;
    setPwd2(confirmedPwd);
    if (confirmedPwd !== pwd) {
      setNewPwdErrMsg("Passwords don't match!");
      setDisabled(true);
    } else {
      setNewPwdErrMsg('');
      setDisabled(false);
    }
  }

  const handleSubmit = () => {
    changePassword({
      oldPassword: cur,
      newPassword: pwd2
    }).then(response => {
      if (response.success) {
        setAlertMsg("Password changed successfully! Please sign in again.")
        setSeverity("success");
        setDisabled(true);
        setTimeout(() => {
          setAlertMsg(null);
          onLogout(false);
        }, 2000);
      } else {
        setAlertMsg(response.message);
        setSeverity("error");
      }
    }).catch(e => {
      setSeverity("error");
      if (e instanceof Error) {
        setAlertMsg('Oops! Something went wrong. Please try again!');
      } else {
        setAlertMsg('Incorrect old password.')
      }
    });
  }

  return (
    <form>
      <Card>
        <CardHeader
          title="Change Password"
        />
        <Divider />
        <CardContent>
          <TextField
            variant="outlined"
            required
            fullWidth
            label="Current password"
            margin="normal"
            name="cur"
            onChange={ev => setCur(ev.target.value)}
            type="password"
          />
          <TextField
            variant="outlined"
            required
            fullWidth
            label="Password"
            margin="normal"
            name="password"
            onChange={ev => setPwd(ev.target.value)}
            type="password"
          />
          <TextField
            variant="outlined"
            required
            fullWidth
            label="Confirm password"
            margin="normal"
            name="confirm"
            onChange={ev => checkPwdMatch(ev)}
            type="password"
            helperText={newPwdErrMsg}
            error={Boolean(newPwdErrMsg)}
          />
        </CardContent>
        <Divider />
        <Box
          display={'flex'}
          justifyContent={'flex-end'}
          margin={2}
        >
          <Button
            color="primary"
            variant="contained"
            className={classes.submit}
            onClick={handleSubmit}
            disabled={disabled || !Boolean(cur) || !Boolean(pwd2)}
          >
            Update
          </Button>
        </Box>
        { alertMsg && <Alert severity={severity}>{alertMsg}</Alert> }
      </Card>
    </form>
  );
};

export default PasswordSetting;
