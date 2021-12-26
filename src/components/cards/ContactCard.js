import React from "react";

const ContactCard = ({ item }) => {
  return (
    <>
      <div
        className="card"
        style={{
          width: "33.33%",
          background: "#0e2a47",
          border: "none",
          fontFamily: "sans-serif",
        }}
      >
        <div className="card-body text-light">
          <h1 className="card-title text-center mb-3">
            <i className={`fas ${item.icon}`}></i>
          </h1>
          <p className="card-text text-center mb-2">{item.title}</p>
          <p className="card-text text-center mb-2">{item.text}</p>
        </div>
      </div>
    </>
  );
};

export default ContactCard;
