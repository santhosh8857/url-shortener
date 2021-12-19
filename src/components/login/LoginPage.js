import {
  Button,
  Form,
  FormGroup,
  Input,
  InputGroup,
  InputGroupText,
} from "reactstrap";
import React, { useState } from "react";
import axios from "axios";
import cardImg from "../img/user-icon.svg";
import "./LoginPage.css";

const LoginPage = () => {
  // states to get the details
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  // login
  const handleSubmit = (e) => {
    axios
      .post(`${process.env.REACT_APP_apiUrl}users/login`, {
        username: username,
        password: password,
      })
      .then((resp) => {
        checkUser(resp);
        console.log(resp);
      })
      .catch((err) => console.log(err));
    e.preventDefault();
  };

  const checkUser = (details) => {
    if (details.data.status) {
      console.log(details.data.message);
    } else {
      console.log(details.data.message);
    }
  };

  return (
    <>
      <div className="container">
        <div
          className="row gx-4 gx-lg-5 row-cols-2 row-cols-md-3 row-cols-xl-4 align-items-center justify-content-center"
          style={{ height: "100vh" }}
        >
          <div className="card" style={{ width: "20rem" }}>
            <img className="card-img-top img-height" src={cardImg} alt="..." />
            <div className="card-body p-4">
              <Form onSubmit={handleSubmit}>
                <FormGroup>
                  <InputGroup>
                    <InputGroupText>
                      <i class="far fa-user"></i>
                    </InputGroupText>
                    <Input
                      type="email"
                      name="email"
                      id="email"
                      placeholder="Enter your username"
                      onChange={(e) => setUsername(e.target.value)}
                    />
                  </InputGroup>
                </FormGroup>
                <FormGroup>
                  <InputGroup>
                    <InputGroupText>
                      <i class="fas fa-unlock-alt"></i>
                    </InputGroupText>
                    <Input
                      type="password"
                      name="password"
                      id="password"
                      placeholder="Enter your password"
                      onChange={(e) => setPassword(e.target.value)}
                    />
                  </InputGroup>
                </FormGroup>
                <FormGroup>
                  <div className="text-center">
                    <button
                      className="btn btn-inline-block btn-dark"
                      style={{ marginRight: "5px", width: "100%" }}
                    >
                      Log In
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
