import React, { useState } from "react";
import {
  Form,
  FormGroup,
  Input,
  InputGroup,
  InputGroupText,
  Label,
} from "reactstrap";
import password from "../img/password.png";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Link, useParams } from "react-router-dom";
import axios from "axios";
import Footer from "../header-footer/Footer";

const ResetPassword = () => {
  let { token } = useParams();

  const [passwordDetails, setPasswordDetails] = useState({
    newPassword: "",
    checkPassword: "",
  });

  const { newPassword, checkPassword } = passwordDetails;

  // to store the values of the form input
  const handleChange = (e) => {
    setPasswordDetails({ ...passwordDetails, [e.target.name]: e.target.value });
    e.preventDefault();
  };

  // verify password
  const handleSubmit = (e) => {
    if (newPassword === checkPassword) {
      axios
        .post(`${process.env.REACT_APP_apiUrl}/users/reset-password/${token}`, {
          password: newPassword,
        })
        .then((resp) => checkPwd(resp))
        .catch((err) => console.log(err));
    } else {
      toast("Please check your re-entered password", { type: "warning" });
    }
    e.preventDefault();
  };

  // toast
  const checkPwd = (details) => {
    if (details.data.status) {
      toast(`${details.data.message}`, { type: "success" });
    } else {
      toast(`${details.data.message}`, { type: "error" });
    }
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
      <div className="text-light mx-4">
        <div className="row">
          <div className="col-6">
            <div className="d-flex justify-content-center align-items-center mt-5">
              <img
                className="img-fluid rounded"
                src={password}
                alt="..."
                style={{ width: "90%" }}
              ></img>
            </div>
          </div>

          <div className="col-6" style={{ marginTop: "120px" }}>
            <h3>Reset your password!</h3>
            <Form onSubmit={handleSubmit}>
              <FormGroup>
                <Label>New password</Label>
                <InputGroup>
                  <InputGroupText>
                    <i className="fas fa-lock"></i>
                  </InputGroupText>
                  <Input
                    type="password"
                    name="newPassword"
                    id="newPassword"
                    placeholder="Enter your new password"
                    onChange={handleChange}
                    required
                  />
                </InputGroup>
              </FormGroup>
              <FormGroup>
                <Label>Confirm password</Label>
                <InputGroup>
                  <InputGroupText>
                    <i className="fas fa-lock"></i>
                  </InputGroupText>
                  <Input
                    type="password"
                    name="checkPassword"
                    id="checkPassword"
                    placeholder="Re-enter your new password"
                    onChange={handleChange}
                  />
                </InputGroup>
              </FormGroup>
              <FormGroup>
                <button
                  className="btn btn-inline-block"
                  style={{ width: "100%", background: "#64b9ff" }}
                >
                  Update Password
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

export default ResetPassword;
