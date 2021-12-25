import React, { useEffect, useState } from "react";
import { Form, FormGroup, Input, InputGroup, Table } from "reactstrap";
import Navbar from "./Navbar";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Dashboard = () => {
  const [urls, setUrls] = useState([]);
  const [longurl, setLongUrl] = useState("");

  const handleSubmit = (e) => {
    axios
      .post(`${process.env.REACT_APP_apiUrl}urls/add-url`, {
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
      .get(`${process.env.REACT_APP_apiUrl}urls`)
      .then((resp) => setUrls(resp.data.data))
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
                  Simplify <i class="fas fa-angle-double-right"></i>
                </button>
              </span>
            </InputGroup>
          </FormGroup>
        </Form>
      </div>
      <div className="container">
        <h3 className="text-light my-4">
          <i class="fas fa-link"></i> Recent URLs
        </h3>
        <div style={{ background: "#f5e6c8" }}>
          <Table
            stripped
            hover
            className="table-light table-hover table-borderless"
          >
            <thead>
              <th className="p-2">Long Url</th>
              <th className="p-2">Short Url</th>
              <th className="p-2">Clicks</th>
            </thead>
            <tbody>
              {urls?.map((item, key) => {
                return (
                  <tr key={key}>
                    <td>{item.url}</td>
                    <td style={{ width: "25%" }}>
                      <i class="fas fa-link"></i> {item.shortenUrl}
                    </td>
                    <td className="text-center">
                      {/* <span
                        className="text-center p-1 border text-dark"
                        style={{ background: "#64b9ff", borderRadius: "45%" }}
                      > */}
                      {item.count}
                      {/* </span> */}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </Table>
        </div>
      </div>
    </>
  );
};

export default Dashboard;
