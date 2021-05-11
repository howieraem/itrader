import React from 'react';
import {
    Route,
    Redirect
  } from "react-router-dom";
  

const PrivateRoute = ({ component: Component, authenticated, initialized, ...rest }) => (
    <Route
      {...rest}
      render={props =>
        authenticated ? (
          <Component {...rest} {...props} />
        ) : !initialized ? (
          ""
        ) : (
          <Redirect
            to={{
              pathname: '/login',
              state: { from: props.location }
            }}
          />
        )
      }
    />
);

export default PrivateRoute;