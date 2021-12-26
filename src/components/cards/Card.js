import React from "react";
import { Link } from "react-router-dom";
import { Form, FormGroup } from "reactstrap";

const Card = ({ items }) => {
  return (
    <>
      <div className="card" style={{ width: "33%", background: "#FAFAFA" }}>
        <div className="text-center">
          <img
            src={items.img}
            alt="email"
            style={{ width: `${items.width}`, marginTop: `${items.margin}` }}
          ></img>
        </div>
        <div className="card-body p-4">
          <h5 className="card-title text-center mb-3">{items.title}</h5>
          <p className="card-text text-center mb-4">{items.text}</p>
          <Form>
            <FormGroup>
              <Link to="/" style={{ textDecoration: "none" }}>
                <button
                  className="btn btn-inline-block btn-dark"
                  style={{ width: "100%" }}
                >
                  <i className="fas fa-arrow-circle-left"></i> Back to home
                </button>
              </Link>
            </FormGroup>
          </Form>
        </div>
      </div>
    </>
  );
};
export default Card;
