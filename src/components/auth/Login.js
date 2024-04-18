import React, { Component } from "react";
import axios from "axios";
import { Redirect } from "react-router-dom";
import LoginPopup from "./LoginPopup"; // Import the LoginPopup component

export default class Login extends Component {
  constructor(props) {
    super(props);

    this.state = {
      email: "",
      password: "",
      loginError: "",
      showPopup: false, // Add state for the pop-up
      redirectToDashboard: false, // Add state for delayed redirection
      userData: null, // Initialize userData to null
      userResponse: null,
    };

    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.togglePopup = this.togglePopup.bind(this); // Function to toggle the pop-up
  }
  togglePopup() {
    this.setState((prevState) => ({
      showPopup: !prevState.showPopup,
    }));
  }

  handleChange(event) {
    this.setState({
      [event.target.name]: event.target.value,
    });
  }

  handleSubmit(event) {
    event.preventDefault();
    const { email, password } = this.state;
    console.log("Logging in with:", email, password);

    axios
      .post(
        "http://localhost:3001/sessions",
        {
          user: {
            email: email,
            password: password,
          },
        },
        {
          withCredentials: true,
        }
      )
      .then((response) => {
        console.log("Login response:", response.data);

        if (response.data.logged_in) {
          const userResponseToken = response.data.token;
          const userData = response.data.user; // This contains user information, including the user ID
          console.log("userdata:", userData);
          const token = response.data.token;
          localStorage.setItem("token", token);
          localStorage.setItem("userData", JSON.stringify(userData)); // Store userData in localStorage
          localStorage.setItem(
            "userResponseToken",
            JSON.stringify(userResponseToken)
          );
          console.log("Token created.");
          console.log("Login successful!");
          this.props.handleSuccessfulAuth(token); // Pass the token to App.js
          this.setState({
            showPopup: true,
            userData: userData,
            userResponseToken: userResponseToken,
          });

          setTimeout(() => {
            this.setState({ redirectToDashboard: true });
          }, 5000);
          window.location.reload();
        } else {
          console.log("Login failed:", response.data.status);
          this.setState({
            loginError: "Login failed. Please check your credentials.",
          });
        }
      })
      .catch((error) => {
        console.log("Login error", error);
        this.setState({
          loginError: "An error occurred during login. Please try again.",
        });
      });
  }

  render() {
    if (this.state.redirectToDashboard) {
      return <Redirect to="/dashboard" />;
    }

    return (
      <div className="div-login">
        <form onSubmit={this.handleSubmit}>
          <div className="form-group">
            <input
              className="form-control"
              type="email"
              name="email"
              placeholder="Email"
              required
              value={this.state.email}
              onChange={this.handleChange}
            />
          </div>
          <div className="form-group">
            <input
              className="form-control"
              type="password"
              name="password"
              placeholder="Password"
              required
              value={this.state.password}
              onChange={this.handleChange}
            />
          </div>
          {this.state.loginError && (
            <div className="error-message">{this.state.loginError}</div>
          )}
          <button type="submit" className="button-52">
            Login
          </button>
        </form>
        {this.state.showPopup && <LoginPopup closePopup={this.togglePopup} />}
      </div>
    );
  }
}
