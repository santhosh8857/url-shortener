var express = require("express");
var router = express.Router();

/* GET home. */

// req - request from the client to server
// res - response to the client from server

router.get("/", (req, res) => {
  res.send({ message: "Home" });
});

module.exports = router;
