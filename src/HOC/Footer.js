import React, { Component } from "react";
import { Link } from "react-router-dom";

export default class Footer extends Component {
  render() {
    return (
      <nav
        className="navbar fixed-bottom navbar-expand-lg navbar-dark"
        style={navbarStyle}
      >
        <div className="container">
          <Link style={headerStyle} className="navbar-brand" to="/">
            &copy; FSUPTUTORIAL 2019
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
                  className="nav-link"
                  style={headingStyle}
                  href="https://www.facebook.com/Niweera"
                >
                  <i
                    style={{ fontSize: "25px" }}
                    className="fab fa-facebook-square"
                  />
                </a>
              </li>
              <li className="nav-item">
                <a
                  className="nav-link"
                  style={headingStyle}
                  href="https://twitter.com/Niweera"
                >
                  <i
                    style={{ fontSize: "25px" }}
                    className="fab fa-twitter-square"
                  />
                </a>
              </li>
              <li className="nav-item">
                <a
                  className="nav-link"
                  href="https://github.com/Niweera/fsuptutorial"
                >
                  <i style={{ fontSize: "25px" }} className="fab fa-github" />
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
