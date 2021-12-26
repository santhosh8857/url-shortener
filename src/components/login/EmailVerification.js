import React, { useEffect, useState } from "react";
import axios from "axios";
import verify from "../img/verification.png";
import error from "../img/404.png";
import { useParams } from "react-router-dom";
import Card from "../cards/Card";
import Footer from "../header-footer/Footer";

const items = {
  verified: {
    img: verify,
    title: "Thank you!",
    text: `Your email address is confirmed. You can now login into the
    bit-sized URL.`,
    width: "55%",
    margin: "10px",
  },
  error: {
    img: error,
    title: "OOPS...Invalid token!",
    text: `Please connect with registered email address or the account is already activated earlier.`,
    width: "75%",
  },
};

const EmailVerification = () => {
  const [userVerificaion, setUserVerification] = useState([]);

  let { emailToken } = useParams();

  // to update the activation status of the user
  useEffect(() => {
    axios
      .post(`${process.env.REACT_APP_apiUrl}/users/verify-email/${emailToken}`)
      .then((resp) => setUserVerification(resp))
      .catch((err) => console.log(err));
  }, [emailToken]);

  // console.log(userVerificaion);
  return (
    <>
      <nav className="navbar navbar-expand-lg"></nav>
      <div className="container">
        <div
          className="mt-4 row gx-4 gx-lg-5 row-cols-2 row-cols-md-3 row-cols-xl-4 align-items-center justify-content-center"
          style={{ height: "80vh" }}
        >
          <>
            {userVerificaion.length !== 0 ? (
              <>
                {userVerificaion.data.status ? (
                  <Card items={items.verified} />
                ) : (
                  <Card items={items.error} />
                )}
              </>
            ) : null}
          </>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default EmailVerification;
