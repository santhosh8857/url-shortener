import React from "react";
import { Link } from "react-router-dom";

const Navbar = () => {
  return (
    <div>
      <nav className="navbar navbar-expand-lg">
        <Link to="/" className="navbar-brand">
          <h3
            className="text-center"
            style={{ marginLeft: "10px", color: "#f5e6c8" }}
          >
            <i className="fas fa-compress-alt" style={{ fontSize: "25px" }}></i>{" "}
            Bit-Sized URL
          </h3>
        </Link>
        <div className="collapse navbar-collapse" id="navbarText">
          <ul className="navbar-nav me-auto mb-2 mb-lg-0"></ul>
          <span className="navbar-text">
            <Link
              to="/about"
              className="nav-link"
              id="nav-hover"
              aria-current="page"
              style={{ color: "#f5e6c8" }}
            >
              About
            </Link>
          </span>
          <span className="navbar-text">
            <Link
              to="/contact"
              className="nav-link"
              id="nav-hover"
              style={{ color: "#f5e6c8" }}
            >
              Contact Us
            </Link>
          </span>
        </div>
      </nav>
      {/* <nav id="navigation">
        <div class="box">
          <h3 class="logo">
            <Link to="/login">
              <i class="fas fa-compress-alt"> Bit-Sized URL</i>
            </Link>
          </h3>
          <ul>
            <li>
              <Link to="/about">About</Link>
            </li>
            <li>
              <Link to="/contact">Contact Us</Link>
            </li>
          </ul>
        </div>
      </nav> */}
    </div>
  );
};

export default Navbar;
