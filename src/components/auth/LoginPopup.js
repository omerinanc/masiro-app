import React, { Component } from "react";

export default class LoginPopup extends Component {
  render() {
    return (
      <div className="popup">
        <div className="popup-content">
          {/* Add your pop-up content here */}
          <h2>Login Successful</h2>
          <p>Directing to dashboard</p>
        </div>
      </div>
    );
  }
}
