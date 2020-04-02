import React from 'react';
import './App.css';
import { BrowserRouter as Router, Switch, Route} from "react-router-dom";
import Login from './Login';
import 'bootstrap/dist/css/bootstrap.min.css';
import SignIn from './SignIn';
import Home from './HomePage'

function App() {
  return (<Router>
    <div className="App">
      {/*
      <nav className="navbar navbar-expand-lg navbar-light fixed-top">
        <div className="container">
          <div className="collapse navbar-collapse">
            <ul className="navbar-nav ml-auto">
              <li className="nav-item">
                <Link className="nav-link" to={"/login"}>Login</Link>
              </li>
              <li className="nav-item">
                <Link className="nav-link" to={"/sign-up"}>Sign up</Link>
              </li>
            </ul>
          </div>
        </div>
      </nav>
      */}
      <Switch>
        <Route exact path='/' component={Login} />
        <Route exact path="/login" component={Login} />
        <Route exact path="/sign-up" component={SignIn} />
        <Route exact path="/home" component={Home} />

      </Switch>
    </div></Router>
  );
}

export default App;