import axios from "axios";
import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useHistory } from "react-router";
import {
  Form,
  FormGroup,
  Input,
  InputGroup,
  InputGroupText,
  Label,
} from "reactstrap";

import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import registerImg from "../img/register.PNG";
import Footer from "../header-footer/Footer";

const Register = () => {
  const history = useHistory();
  const [userDetails, setUserDetails] = useState({
    username: "",
    firstname: "",
    lastname: "",
    password: "",
    checkpwd: "",
  });

  const { username, firstname, lastname, password, checkpwd } = userDetails;

  const handleSubmit = (e) => {
    if (password === checkpwd) {
      axios
        .post(`${process.env.REACT_APP_apiUrl}/users/register`, {
          username: username,
          firstname: firstname,
          lastname: lastname,
          password: password,
        })
        .then((resp) => checkNewUser(resp))
        .catch((err) => console.log(err));
    } else {
      toast("Please check your re-entered password", { type: "warning" });
    }
    e.preventDefault();
  };

  const checkNewUser = (details) => {
    if (details.data.status) {
      toast("Account created!", {
        type: "success",
        onClose: () => {
          history.push("/login");
        },
      });
    } else if (details.data.error.code === 11000) {
      toast("Please use different username", { type: "error" });
    }
  };

  const handleChange = (e) => {
    setUserDetails({ ...userDetails, [e.target.name]: e.target.value });
    e.preventDefault();
  };

  return (
    <>
      <ToastContainer />
      <div className="mt-5 text-light mx-4">
        <div className="row">
          <div className="col-6">
            <h2 className="text-center display-3">
              <i
                className="fas fa-compress-alt"
                style={{ fontSize: "50px" }}
              ></i>{" "}
              Bit-Sized URL
            </h2>
            <div className="d-flex justify-content-center align-items-center mt-5">
              <img
                className="img-fluid rounded"
                src={registerImg}
                alt="..."
                style={{ width: "90%" }}
              ></img>
            </div>
            <div className="mt-4">
              <h3 className="text-center">
                Start for free and get your url shortend!!!
              </h3>
            </div>
          </div>

          <div className="col-6">
            <h3>Create your account.</h3>
            <p>
              Already have an account?
              <Link
                to="/login"
                style={{ textDecoration: "none", color: "#E50914" }}
              >
                {" "}
                Log in
              </Link>
            </p>
            <Form onSubmit={handleSubmit}>
              <FormGroup>
                <Label>Username</Label>
                <InputGroup>
                  <InputGroupText>
                    <i className="far fa-envelope"></i>
                  </InputGroupText>
                  <Input
                    type="email"
                    name="username"
                    id="username"
                    placeholder="Enter your email"
                    onChange={handleChange}
                    required
                  />
                </InputGroup>
              </FormGroup>
              <FormGroup>
                <Label>First name</Label>
                <InputGroup>
                  <InputGroupText>
                    <i className="far fa-user"></i>
                  </InputGroupText>
                  <Input
                    type="text"
                    name="firstname"
                    id="firstname"
                    placeholder="Enter your First name"
                    onChange={handleChange}
                    required
                  />
                </InputGroup>
              </FormGroup>
              <FormGroup>
                <Label>Last name</Label>
                <InputGroup>
                  <InputGroupText>
                    <i className="far fa-user"></i>
                  </InputGroupText>
                  <Input
                    type="text"
                    name="lastname"
                    id="lastname"
                    placeholder="Enter your Last name"
                    onChange={handleChange}
                  />
                </InputGroup>
              </FormGroup>
              <FormGroup>
                <Label>Password</Label>
                <InputGroup>
                  <InputGroupText>
                    <i className="fas fa-lock"></i>
                  </InputGroupText>
                  <Input
                    type="password"
                    name="password"
                    id="password"
                    placeholder="Enter your password"
                    onChange={handleChange}
                    required
                  />
                </InputGroup>
              </FormGroup>
              <FormGroup>
                <Label>Confirm Password</Label>
                <InputGroup>
                  <InputGroupText>
                    <i className="fas fa-lock"></i>
                  </InputGroupText>
                  <Input
                    type="password"
                    name="checkpwd"
                    id="checkpwd"
                    placeholder="Re-enter your password"
                    onChange={handleChange}
                    required
                  />
                </InputGroup>
              </FormGroup>
              <FormGroup>
                <button
                  className="btn btn-inline-block"
                  style={{ width: "100%", background: "#64b9ff" }}
                >
                  Register
                </button>
              </FormGroup>
            </Form>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default Register;
