import React, { useState } from 'react';
import { useHistory } from 'react-router-dom';
import {
  Box,
  Button,
  Card,
  CardContent,
  CardHeader,
  Divider,
  TextField
} from '@material-ui/core';
import { makeStyles } from "@material-ui/core/styles";
import { COLORS } from "../../common/Theme";
import { changePassword } from "../../utils/API";

const useStyles = makeStyles(theme => ({
  submit: {
    textTransform: 'none',
    background: COLORS[0],
    color: 'white',
  },
}))

const PasswordSetting = (props) => {
  const classes = useStyles();

  const [cur, setCur] = useState('');
  const [pwd, setPwd] = useState('');
  const [pwd2, setPwd2] = useState('');
  const [newPwdErrMsg, setNewPwdErrMsg] = useState('');
  const [disabled, setDisabled] = useState(true);

  let history = useHistory();

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
      console.log(response.message);
      if (response.success) {
        localStorage.removeItem('accessToken');
        sessionStorage.removeItem('accessToken');
        history.push('/');
        history.go(0);
      }
    }).catch(err => console.log(err));
  }

  return (
    <form {...props}>
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
      </Card>
    </form>
  );
};

export default PasswordSetting;
