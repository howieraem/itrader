import { useState } from 'react';
import {
  Box,
  Button,
  Card,
  CardContent,
  CardHeader,
  Divider,
  TextField
} from '@material-ui/core';
import { COLORS } from "../../common/Theme";

const PasswordSetting = (props) => {
  const [values, setValues] = useState({
    cur: '',
    password: '',
    confirm: ''
  });

  const handleChange = (event) => {
    setValues({
      ...values,
      [event.target.name]: event.target.value
    });
  };

  return (
    <form {...props}>
      <Card>
        <CardHeader
          title="Change Password"
        />
        <Divider />
        <CardContent>
          <TextField
            fullWidth
            label="Current password"
            margin="normal"
            name="current"
            onChange={handleChange}
            type="password"
            value={values.cur}
            variant="outlined"
          />
          <TextField
            fullWidth
            label="Password"
            margin="normal"
            name="password"
            onChange={handleChange}
            type="password"
            value={values.password}
            variant="outlined"
          />
          <TextField
            fullWidth
            label="Confirm password"
            margin="normal"
            name="confirm"
            onChange={handleChange}
            type="password"
            value={values.confirm}
            variant="outlined"
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
            style={{ textTransform: "none", background: COLORS[1] }}
          >
            Update
          </Button>
        </Box>
      </Card>
    </form>
  );
};

export default PasswordSetting;
