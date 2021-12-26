import { Form, FormGroup, Input, InputGroup, InputGroupText } from "reactstrap";
import React, { useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import { useHistory } from "react-router";

import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import cardImg from "../img/user-icon.svg";
import "./LoginPage.css";
import Navbar from "../header-footer/Navbar";

const LoginPage = () => {
  const history = useHistory();

  // states to get the details
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  // login
  const handleSubmit = (e) => {
    axios
      .post(`${process.env.REACT_APP_apiUrl}/users/login`, {
        username: username,
        password: password,
      })
      .then((resp) => {
        checkUser(resp);
      })
      .catch((err) => console.log(err));
    e.preventDefault();
  };

  const checkUser = async (details) => {
    if (details.data.status) {
      await toast(details.data.message, { type: "success" });
      history.push("/dashboard");
    } else {
      toast(details.data.message, { type: "error" });
    }
  };

  return (
    <>
      <ToastContainer />
      <Navbar />
      <div className="container">
        <div
          className="row gx-4 gx-lg-5 row-cols-2 row-cols-md-3 row-cols-xl-4 align-items-center justify-content-center"
          style={{ marginTop: "10px" }}
        >
          <div className="card" style={{ width: "20rem", marginBottom: "0px" }}>
            <img
              className="card-img-top"
              style={{ marginBottom: "0px" }}
              src={cardImg}
              alt="..."
            />
            <div className="card-body p-2" style={{ marginBottom: "0px" }}>
              <Form onSubmit={handleSubmit} style={{ marginTop: "0px" }}>
                <FormGroup>
                  <InputGroup>
                    <InputGroupText>
                      <i className="far fa-envelope"></i>
                    </InputGroupText>
                    <Input
                      type="email"
                      name="email"
                      id="email"
                      placeholder="Enter your username"
                      onChange={(e) => setUsername(e.target.value)}
                      required
                    />
                  </InputGroup>
                </FormGroup>
                <FormGroup>
                  <InputGroup>
                    <InputGroupText>
                      <i className="fas fa-unlock-alt"></i>
                    </InputGroupText>
                    <Input
                      type="password"
                      name="password"
                      id="password"
                      placeholder="Enter your password"
                      onChange={(e) => setPassword(e.target.value)}
                      required
                    />
                  </InputGroup>
                </FormGroup>
                <FormGroup>
                  <p className="forget-password">
                    <Link to="/forget-password" className="forget-password">
                      Forgot password?
                    </Link>
                  </p>
                </FormGroup>
                <FormGroup>
                  <div className="text-center">
                    <button
                      className="btn btn-inline-block btn-dark"
                      style={{ marginRight: "5px", width: "45%" }}
                    >
                      Log In
                    </button>
                    <button
                      className="btn btn-inline-block"
                      style={{
                        width: "45%",
                        background: "#f5e6c8",
                        border: "1px black solid",
                      }}
                      onClick={(e) => {
                        history.push("/register");
                        e.preventDefault();
                      }}
                    >
                      Sign up
                    </button>
                  </div>
                </FormGroup>
              </Form>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default LoginPage;
