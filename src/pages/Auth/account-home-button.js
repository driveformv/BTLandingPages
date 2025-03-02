import React, { Component } from "react";
import { Link } from "react-router-dom";

class AccountHomeButton extends Component {
  render() {
    return (
      <React.Fragment>
        <div className="account-home-btn d-none d-sm-block">
          <Link to="/" className="text-white">
            <i className="mdi mdi-home h1"></i>
          </Link>
        </div>
      </React.Fragment>
    );
  }
}

export default AccountHomeButton;
