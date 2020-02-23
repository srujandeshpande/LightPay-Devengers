import React from "react";
import ReactDOM from "react-dom";
import { BrowserRouter, Route } from "react-router-dom";
import { Provider } from "react-redux";
import Cookies from "js-cookie";

import "./index.css";
import store from "./store";
import { userLoggedIn } from "./store/actions/user";
import App from "./App";
import * as serviceWorker from "./serviceWorker";
import "semantic-ui-css/semantic.min.css";

const userinfo = Cookies.get("userinfo");
if (userinfo) {
  const user = JSON.parse(userinfo);
  if (user) {
    store.dispatch(userLoggedIn(user));
  }
}

ReactDOM.render(
  <BrowserRouter>
    <Provider store={store}>
      <Route component={App} />
    </Provider>
  </BrowserRouter>,
  document.getElementById("root")
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
