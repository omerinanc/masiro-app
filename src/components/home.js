import React, { Component } from "react";
import Login from "./auth/Login";
import { Link } from "react-router-dom";

export default class Home extends Component {
  constructor(props) {
    super(props);
    this.handleSuccessfulAuth = this.handleSuccessfulAuth.bind(this);
  }
  componentDidMount() {
    // Check if a token is already stored in the App component's state
    const storedToken = localStorage.getItem("token");

    if (storedToken) {
      // Redirect to the dashboard if the user is logged in
      this.props.history.push("/dashboard");
    }
  }

  handleSuccessfulAuth(data) {
    this.props.handleLogin(data); // Pass the data received from the login response
    this.props.history.push("/dashboard");
    console.log("pushing to dashboard.");
  }
  handleRegistartion() {
    window.location.reload();
  }
  render() {
    return (
      <div className="home">
        <div className="home-container">
          <h1>Masiro</h1>
          <h1>Home</h1>
        </div>
        <h1>Status: {this.props.loggedInStatus}</h1>

        <Login handleSuccessfulAuth={this.handleSuccessfulAuth} />
        <p onClick={this.handleRegistartion}>
          Don't have an account? <Link to="/registration">Register</Link>
        </p>
      </div>
    );
  }
}
