import React from "react";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import "./App.css";
import WelcomPage from "./containers/WelcomPage/WelcomPage";
import Authentication from "./containers/Authentication/Authentication";
import Logged from "./hoc/Layout/Logged";
import Calendar from "./containers/Calendar/Calendar";

function App() {
  return (
    <Router>
      <div className="App">
        <Switch>
          <Route
            exact
            path="/authentication/:type"
            render={(props) => <Authentication {...props} />}
          />
          <Route exact path="/" component={WelcomPage} />
          <Logged>
            <Route path="/logged/calendar" component={Calendar} />
          </Logged>
        </Switch>
      </div>
    </Router>
  );
}

export default App;
