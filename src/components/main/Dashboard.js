import React, { useEffect, useState } from "react";
import { Form, FormGroup, Input, InputGroup, Table } from "reactstrap";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "../login/LoginPage.css";
import Navbar from "../header-footer/Navbar";
import Footer from "../header-footer/Footer";

const Dashboard = () => {
  const [urls, setUrls] = useState([]);
  const [longurl, setLongUrl] = useState("");

  const handleSubmit = (e) => {
    axios
      .post(`${process.env.REACT_APP_apiUrl}/urls/add-url`, {
        url: longurl,
      })
      .then((resp) => {
        toast(`${resp.data.message}! url has been shortened.`, {
          type: "success",
        });
        getUrls();
        setLongUrl("");
      })
      .catch((err) => {
        console.log(err);
      });

    e.preventDefault();
  };

  const getUrls = () => {
    axios
      .get(`${process.env.REACT_APP_apiUrl}/urls`)
      .then((resp) => setUrls(resp.data.data))
      .catch((err) => console.log(err));
  };

  const handleClick = (id, shortenUrl) => {
    axios
      .post(`${process.env.REACT_APP_apiUrl}/urls/${id}`)
      .then((resp) => {
        if (resp.data.status) {
          getUrls();
          window.open(shortenUrl, "_blank");
        }
      })
      .catch((err) => console.log(err));
  };

  const deleteUrl = (id) => {
    axios
      .delete(`${process.env.REACT_APP_apiUrl}/urls/${id}`)
      .then((resp) => {
        if (resp.data.status) {
          getUrls();
        }
      })
      .catch((err) => console.log(err));
  };

  useEffect(() => {
    getUrls();
  }, [longurl]);

  return (
    <>
      <ToastContainer />
      <Navbar btn="Logout" />
      <div className="container mt-4">
        <Form onSubmit={handleSubmit}>
          <FormGroup>
            <InputGroup style={{ height: "50px", fontFamily: "sans-serif" }}>
              <Input
                type="name"
                name="name"
                id="name"
                value={longurl}
                placeholder="Paste long url and shorten it"
                onChange={(e) => {
                  setLongUrl(e.target.value);
                }}
                required
              />

              <span>
                <button
                  className="btn"
                  style={{
                    color: "#111",
                    fontWeight: "700",
                    height: "100%",
                    width: "100%",
                    background: "#64b9ff",
                    borderBottomLeftRadius: "0px",
                    borderTopLeftRadius: "0px",
                  }}
                >
                  Simplify <i className="fas fa-angle-double-right"></i>
                </button>
              </span>
            </InputGroup>
          </FormGroup>
        </Form>
      </div>
      <div className="container">
        <h3 className="text-light my-4">
          <i className="fas fa-link"></i> Recent URLs
        </h3>
        <div>
          <Table hover className="table-light table-hover table-borderless">
            <thead className="table-warning">
              <tr>
                <th className="p-2">Long Url</th>
                <th className="p-2">Short Url</th>
                <th className="p-2">Clicks</th>
                <th className="p-2">Delete</th>
              </tr>
            </thead>
            <tbody>
              {urls?.map((item, key) => {
                return (
                  <tr key={key}>
                    <td
                      style={{ cursor: "pointer" }}
                      onClick={(e) => {
                        e.preventDefault();
                        window.open(`${item.url}`, "_blank");
                      }}
                    >
                      {item.url}
                    </td>
                    <td
                      style={{
                        width: "25%",
                        cursor: "pointer",
                        color: "#0000ff",
                      }}
                      onClick={(e) => {
                        e.preventDefault();
                        handleClick(item._id, item.shortenUrl);
                      }}
                    >
                      <i className="fas fa-link d-inline"></i> {item.shortenUrl}
                    </td>
                    <td className="text-center">{item.count}</td>
                    <td className="text-center text-danger">
                      <i
                        className="far fa-trash-alt"
                        onClick={(e) => {
                          e.preventDefault();
                          deleteUrl(item._id);
                        }}
                      ></i>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </Table>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default Dashboard;
