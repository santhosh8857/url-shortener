import React, { useState } from "react";
import ContactCard from "../cards/ContactCard";
import { Form, FormGroup, Input, InputGroup, Label } from "reactstrap";
import { Link } from "react-router-dom";
import contact from "../img/contact.png";

import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import axios from "axios";
import Footer from "../header-footer/Footer";

const contactInfo = {
  location: {
    icon: `fa-map-marker-alt`,
    title: "Location",
    text: "50, Main St, Guindy, Chennai",
  },
  phone: {
    icon: `fa-phone`,
    title: "Phone Number",
    text: "+91 866-780-2699",
  },
  emailId: {
    icon: `fa-paper-plane`,
    title: "Email Address",
    text: "santhosh8857@gmail.com",
  },
};

const Contact = () => {
  const [contactDetails, setContactDetails] = useState({
    name: "",
    email: "",
    feedback: "",
  });

  const { name, email, feedback } = contactDetails;

  const handleSubmit = (e) => {
    axios
      .post(`${process.env.REACT_APP_apiUrl}/contacts`, {
        name: name,
        email: email,
        feedback: feedback,
      })
      .then((resp) => checkUser(resp))
      .catch((err) => console.log(err));

    e.preventDefault();
  };

  const checkUser = (details) => {
    if (details.data.status) {
      toast.success("Thank you for reaching out to us!");
    } else {
      toast.error("Invalid User!");
    }
  };

  const handleChange = (e) => {
    setContactDetails({ ...contactDetails, [e.target.name]: e.target.value });
    e.preventDefault();
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
      <div className="mt-2 text-light mx-4">
        <div className="row">
          <div className="col-6">
            <div className="d-flex justify-content-center align-items-center mt-4">
              <img
                className="img-fluid rounded"
                src={contact}
                alt="..."
                style={{ width: "95%" }}
              ></img>
            </div>
          </div>
          <div className="col-6">
            <h4>Provide your information!</h4>
            <Form onSubmit={handleSubmit}>
              <FormGroup>
                <Label>Name</Label>
                <InputGroup>
                  <Input
                    type="text"
                    name="name"
                    id="name"
                    placeholder="Enter your name"
                    onChange={handleChange}
                    required
                  />
                </InputGroup>
              </FormGroup>
              <FormGroup>
                <Label>Email</Label>
                <InputGroup>
                  <Input
                    type="email"
                    name="email"
                    id="email"
                    placeholder="Enter your email"
                    onChange={handleChange}
                    required
                  />
                </InputGroup>
              </FormGroup>
              <FormGroup>
                <Label>Message</Label>
                <InputGroup>
                  <Input
                    type="textarea"
                    name="feedback"
                    id="feedback"
                    placeholder="Provide details about the issue or your feedback"
                    onChange={handleChange}
                  />
                </InputGroup>
              </FormGroup>
              <FormGroup>
                <button
                  className="btn btn-inline-block"
                  style={{ width: "100%", background: "#64b9ff" }}
                >
                  Submit
                </button>
              </FormGroup>
            </Form>
          </div>
        </div>
      </div>
      <div className="mt-4">
        <div className="container d-flex">
          <ContactCard item={contactInfo.location} />
          <ContactCard item={contactInfo.phone} />
          <ContactCard item={contactInfo.emailId} />
        </div>
      </div>
      <Footer />
    </>
  );
};

export default Contact;
