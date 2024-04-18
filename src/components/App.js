import React, { Component } from "react";
import { BrowserRouter, Switch, Route } from "react-router-dom";
import Dashboard from "./dashboard";
import Home from "./home";
import Registration from "./auth/registration";
import Profile from "./auth/profile"; // Import the Profile component

export default class App extends Component {
  constructor() {
    super();

    this.state = {
      loggedInStatus: "You are not logged in.",
      token: null, // Added to store the JWT token
      userPosts: [],
      userId: null,
    };

    this.handleLogin = this.handleLogin.bind(this);
    this.handleLogout = this.handleLogout.bind(this);
    this.handleSuccessfulAuth = this.handleSuccessfulAuth.bind(this);
  }

  componentDidMount() {
    // Check if a token is already stored in localStorage
    const storedToken = localStorage.getItem("token");
    if (storedToken) {
      this.setState({
        loggedInStatus: "You are logged in.",
        token: storedToken,
      });
    }
  }

  handleSuccessfulAuth(token) {
    this.handleLogin(token);
  }

  handleLogin(token) {
    console.log("Setting loggedInStatus to LOGGED_IN...");
    // Store the token in the state and localStorage
    this.setState({
      loggedInStatus: "You are logged in.",
      token: token,
    });
    localStorage.setItem("token", token);
  }

  handleLogout() {
    console.log("Logging out...");
    // Remove the token from the state and localStorage
    this.setState({
      loggedInStatus: "You are not logged in.",
      token: null,
    });
    localStorage.removeItem("token");
  }

  render() {
    return (
      <div className="app">
        <BrowserRouter>
          <Switch>
            <Route
              exact
              path={"/"}
              render={(props) => (
                <Home
                  {...props}
                  loggedInStatus={this.state.loggedInStatus}
                  handleLogin={this.handleLogin}
                  handleLogout={this.handleLogout}
                  token={this.state.token}
                />
              )}
            />
            <Route
              exact
              path={"/dashboard"}
              render={(props) => (
                <Dashboard
                  {...props}
                  loggedInStatus={this.state.loggedInStatus}
                  token={this.state.token} // Pass the token to the dashboard
                />
              )}
            />
            <Route
              exact
              path={"/registration"}
              render={(props) => (
                <Registration
                  handleSuccessfulAuth={this.handleSuccessfulAuth}
                  {...props}
                  loggedInStatus={this.state.loggedInStatus}
                />
              )}
            />
            <Route
              exact
              path="/profile"
              render={(props) => (
                <Profile
                  {...props}
                  loggedInStatus={this.state.loggedInStatus}
                  token={this.state.token}
                  userId={this.state.userId}
                  userPosts={this.state.userPosts}
                  userData={this.state.userData}
                  handleEditInputChange={this.handleEditInputChange}
                />
              )}
            />
          </Switch>
        </BrowserRouter>
      </div>
    );
  }
}
