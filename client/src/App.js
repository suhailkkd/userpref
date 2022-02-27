import { Router, Route, Switch, Redirect } from "react-router-dom";
import Dashboard from "./components/dashboard";
import Login from "./components/login";
import history from "./history";
import ProtectedRoute from "./components/ProtectedRoute";
import SignUp from "./components/signup";

if (localStorage.isAuthenticated) {
  history.push("/dashboard");
}

function App() {
  return (
    <div className="ui container">
      <Router history={history}>
        <div>
          <Switch>
            <Route path="/" exact component={Login} />
            <Route path="/signup" exact component={SignUp} />
            <Redirect from="/login" to="/" />
            <ProtectedRoute path="/dashboard" exact component={Dashboard} />
            <Route path="*">
              <Login />
            </Route>
          </Switch>
        </div>
      </Router>
    </div>
  );
}

export default App;
