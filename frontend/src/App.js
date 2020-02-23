import React from "react";
import { Switch, Route } from "react-router-dom";

// import { useSelector } from "react-redux";
import HomePage from "./components/pages/HomePage";
import BankHomePage from "./components/pages/BankHomePage";
import Bank2HomePage from "./components/pages/Bank2HomePage";
import LoginPage from "./components/pages/LoginPage";
import InvestmentsPage from "./components/pages/InvestmentsPage";

import UserRoute from "./components/routes/UserRoute";
import BankRoute from "./components/routes/BankRoute";
import BankRouter2 from "./components/routes/BankRouter2";
import GuestRoute from "./components/routes/GuestRoute";
import "./App.css";

/* const HomeRoute = () => {
  const database = useSelector(state => database);

  if (database === "lightpay") {
    return <HomePage />;
  } else if (database === "bank") {
    return <BankHomePage />;
  } else {
    return <Bank2HomePage />;
  }
}; */

function App() {
  return (
    <Switch>
      <GuestRoute exact path="/" component={LoginPage} />
      <UserRoute exact path="/home" component={HomePage} />
      <BankRoute exact path="/bankhome" component={BankHomePage} />
      <BankRouter2 exact path="/bank2home" component={Bank2HomePage} />
      <UserRoute exact path="/investments" component={InvestmentsPage} />
      <Route component={() => "404 page"} />
    </Switch>
  );
}

export default App;
