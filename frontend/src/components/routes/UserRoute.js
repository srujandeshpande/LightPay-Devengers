import React from "react";
import PropTypes from "prop-types";
import { useSelector } from "react-redux";
import { Route, Redirect } from "react-router-dom";

const UserRoute = ({ component: Component, ...rest }) => {
  const isAuthenticated = useSelector(state => !!state.user.token);
  const user = useSelector(state => state.user);
  return (
    <Route
      {...rest}
      render={props =>
        isAuthenticated ? (
          (user && user.server === "devenger" && <Component {...props} />) ||
          (user && user.server === "bank_server_2" && (
            <Redirect to="/bankhome" />
          )) ||
          (user && user.server === "bank_server_1" && (
            <Redirect to="/bank2home" />
          ))
        ) : (
          <Redirect to="/" />
        )
      }
    />
  );
};

UserRoute.propTypes = {
  component: PropTypes.func.isRequired
};

export default UserRoute;
