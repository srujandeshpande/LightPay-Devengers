import React from "react";
import PropTypes from "prop-types";
import { useSelector } from "react-redux";
import { Route, Redirect } from "react-router-dom";

const BankRoute = ({ component: Component, ...rest }) => {
  const isAuthenticated = useSelector(state => !!state.user.token);
  // const user = useSelector(state => state.user);
  return (
    <Route
      {...rest}
      render={props =>
        isAuthenticated ? <Component {...props} /> : <Redirect to="/" />
      }
    />
  );
};

BankRoute.propTypes = {
  component: PropTypes.func.isRequired
};

export default BankRoute;
