// import logo from './logo.svg';
import './App.css';
import Grid from '@material-ui/core/Grid';

import PrimarySearchAppBar from './components/bar/AppBar';

function App() {
  let date = new Date();
  return (
    <div className="App">
      {/* 
      
      */}
      <Grid container spacing={0}>
        <Grid item xs={12}>
          <PrimarySearchAppBar/>
        </Grid>
        <Grid item xs={4}>
          <header className="App-region1">
            <p>Work in progress...</p>
          </header>
        </Grid>
        <Grid item xs={8}>
          <header className="App-region2">
            <p>{'UTC+' + (0 - date.getTimezoneOffset() / 60)} {date.toLocaleTimeString()}</p>
          </header>
        </Grid>
      </Grid>
    </div>
  );
}

export default App;
