import React from 'react'
import { ThemeProvider } from '@material-ui/core/styles';
import theme from "./theme";
import MainView from './MainView';

export default function App() {
  return (
    <ThemeProvider theme={theme}>
      <MainView />
    </ThemeProvider>
  )
}
