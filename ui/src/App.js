// import logo from './logo.svg';
import './App.css';

function App() {
  let date = new Date();
  return (
    <div className="App">
      <header className="App-header">
        {/*<img src={logo} className="App-logo" alt="logo" />*/}
        <h1>ITrader UI</h1>
        <p>Work in progress...</p>
        <p>{'UTC+' + (0 - date.getTimezoneOffset() / 60)} {date.toLocaleTimeString()}</p>
      </header>
    </div>
  );
}

export default App;
