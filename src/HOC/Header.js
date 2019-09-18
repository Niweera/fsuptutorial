import React, { Component } from "react";
import { Link } from "react-router-dom";

export default class Header extends Component {
  render() {
    return (
      <nav className="navbar navbar-expand-lg navbar-dark" style={navbarStyle}>
        <div className="container">
          <Link style={headerStyle} className="navbar-brand" to="/">
            FSUPTUTORIAL
          </Link>
          <button
            className="navbar-toggler"
            type="button"
            data-toggle="collapse"
            data-target="#navbarSupportedContent"
            aria-controls="navbarSupportedContent"
            aria-expanded="false"
            aria-label="Toggle navigation"
          >
            <span className="navbar-toggler-icon" />
          </button>

          <div className="collapse navbar-collapse" id="navbarSupportedContent">
            <ul className="navbar-nav ml-auto">
              <li className="nav-item">
                <a
                  style={headingStyle}
                  className="nav-link"
                  rel="noopener noreferrer"
                  target="_blank"
                  href="https://niweera.gq"
                >
                  Niweera.GQ
                </a>
              </li>
              <li className="nav-item">
                <a
                  style={headingStyle}
                  className="nav-link"
                  rel="noopener noreferrer"
                  target="_blank"
                  href="https://blog.niweera.gq"
                >
                  <i className="fab fa-wordpress"></i> Blog
                </a>
              </li>
            </ul>
          </div>
        </div>
      </nav>
    );
  }
}

const navbarStyle = {
  backgroundColor: "#3b3a30",
  textShadow: "0 1px 3px rgba(0,0,0,.5)",
  color: "white"
};

const headingStyle = {
  fontSize: "20px"
};

const headerStyle = {
  fontSize: "24px"
};
