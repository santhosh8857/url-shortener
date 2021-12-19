import React from "react";
import ReactDOM from "react-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import "./index.css";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import App from "./App";
import LoginPage from "./components/login/LoginPage";
import ForgetPassword from "./components/login/ForgetPassword";
import ResetPassword from "./components/login/ResetPassword";
import Register from "./components/login/Register";
import Dashboard from "./components/Dashboard";

const routing = (
  // parent for the routes
  <Router>
    <Switch>
      <Route exact path="/" component={App} />
      <Route exact path="/login" component={LoginPage} />
      <Route exact path="/forget-password" component={ForgetPassword} />
      <Route exact path="/dashboard" component={Dashboard} />
      <Route exact path="/reset-password">
        <ResetPassword />
      </Route>
      <Route exact path="/register">
        <Register />
      </Route>
    </Switch>
  </Router>
);

ReactDOM.render(routing, document.getElementById("root"));
