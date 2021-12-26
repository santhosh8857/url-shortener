import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Form, FormGroup, Input, InputGroup, InputGroupText } from "reactstrap";
import email from "../img/email.png";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Footer from "../header-footer/Footer";

const ForgetPassword = () => {
  const [username, setUsername] = useState("");

  const handleSubmit = (e) => {
    axios
      .post(`${process.env.REACT_APP_apiUrl}/users/forget-password`, {
        username: username,
      })
      .then((resp) => checkUser(resp))
      .catch((err) => console.log(err));

    e.preventDefault();
  };

  const checkUser = (details) => {
    if (details.data.status) {
      toast(`${details.data.message}`, { type: "success" });
    } else {
      toast(`${details.data.message}`, { type: "error" });
    }
    // console.log(details.data.status);
  };

  return (
    <>
      <ToastContainer />
      <nav className="navbar navbar-expand-lg">
        <Link to="/" style={{ textDecoration: "none" }}>
          <p
            style={{
              marginLeft: "10px",
              color: "#f5e6c8",
            }}
          >
            <i className="fas fa-arrow-circle-left"></i> Back To Home
          </p>
        </Link>
      </nav>
      <div className="container">
        <div
          className="row gx-4 gx-lg-5 row-cols-2 row-cols-md-3 row-cols-xl-4 align-items-center justify-content-center"
          style={{ height: "80vh" }}
        >
          <div className="card" style={{ width: "33%", background: "#FAFAFA" }}>
            <div className="text-center">
              <img src={email} alt="email" style={{ width: "60%" }}></img>
            </div>
            <div className="card-body p-4">
              <h5 className="card-title">Forgot Password?</h5>
              <p className="card-text">
                Please enter your registered email address. We'll send
                instructions to help reset your password.
              </p>
              <Form onSubmit={handleSubmit}>
                <FormGroup>
                  <InputGroup>
                    <InputGroupText>
                      <i className="far fa-envelope"></i>
                    </InputGroupText>
                    <Input
                      type="email"
                      name="email"
                      id="email"
                      placeholder="Enter your email"
                      onChange={(e) => setUsername(e.target.value)}
                    />
                  </InputGroup>
                </FormGroup>
                <button
                  className="btn btn-inline-block btn-dark"
                  style={{ width: "100%" }}
                >
                  Send reset instructions
                </button>
              </Form>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default ForgetPassword;
