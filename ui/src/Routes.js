import React from 'react'
import { Route, Switch } from 'react-router-dom';
import PrivateRoute from './common/PrivateRoute';
import Dashboard from './pages/Dashboard';
// import Forgot from './pages/Forgot';
import NotFound from './pages/NotFound';
import Landing from './pages/Landing';
import Settings from './pages/Settings';
import SignIn from './pages/SignIn';
import SignUp from './pages/SignUp';
import StockView from './pages/StockView';

// Pending
import Portfolio from "./pages/Portfolio";
import Trades from "./pages/Trades";
import Watchlists from "./pages/Watchlists";

export default function Routes(props) {
  const { initialized, symbol, authenticated, curUser, changeSymbol, handleLogout } = props;

  return (
    <Switch>
      <Route exact path="/" render={(props) => <Landing authenticated={authenticated} {...props} />} />
      <Route path="/stockView" render={(props) => <StockView symbol={symbol} authenticated={authenticated} {...props} />} />
      <Route path="/login" render={(props) => <SignIn authenticated={authenticated} {...props} />} />
      <Route path="/signup" render={(props) => <SignUp authenticated={authenticated} {...props} />} />
      <PrivateRoute
        path="/dashboard"
        authenticated={authenticated}
        initialized={initialized}
        currentUser={curUser}
        onSymbolClick={changeSymbol}
        component={Dashboard}
      />
      <PrivateRoute
        path="/settings"
        authenticated={authenticated}
        initialized={initialized}
        currentUser={curUser}
        onLogout={handleLogout}
        component={Settings}
      />
      <PrivateRoute
        path="/portfolio"
        authenticated={authenticated}
        onSymbolClick={changeSymbol}
        component={Portfolio}
      />
      <PrivateRoute
        path="/trades"
        authenticated={authenticated}
        component={Trades}
      />
      <PrivateRoute
        path="/watchlist"
        authenticated={authenticated}
        onSymbolClick={changeSymbol}
        component={Watchlists}
      />
      <Route component={NotFound} />
      {/* <Route path="/forgot" component={Forgot} /> */}
    </Switch>
  );
}
