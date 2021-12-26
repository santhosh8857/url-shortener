import React from "react";

const Footer = () => {
  // let copy = React.string({js|\u00a9|js});
  return (
    <footer>
      <p
        className="text-light text-center fixed-bottom"
        style={{ fontSize: "0.9rem" }}
      >
        Bit Sized URL &copy; 2021 All Rights Reversed
      </p>
    </footer>
  );
};

export default Footer;
