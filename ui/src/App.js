// import logo from './logo.svg';
import './App.css';
import Button from '@material-ui/core/Button';

import PrimarySearchAppBar from './components/bar/AppBar';

function App() {
  let date = new Date();
  return (
    <div className="App">
      <header className="App-header">
        {/*<img src={logo} className="App-logo" alt="logo" />*/}
        <PrimarySearchAppBar/>
        {/* <h1>ITrader UI</h1> */}
      </header>
      <p>Work in progress...</p>
      {/* <Button variant="contained">Push!</Button> */}
      <p>{'UTC+' + (0 - date.getTimezoneOffset() / 60)} {date.toLocaleTimeString()}</p>
    </div>
  );
}

export default App;
