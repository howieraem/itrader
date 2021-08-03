import { createMuiTheme } from '@material-ui/core';

const theme = createMuiTheme({
  palette: {
    primary: {
      light: '#0077b7',
      main: '#005480',
      dark: '#002d45',
      contrastText: '#ffffff',
    },
    secondary: {
      light: '#008bd6',
      main: '#006da7',
      dark: '#003e5e',
      contrastText: '#eeeeee',
    }
  },
})

export default theme;
