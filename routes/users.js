var express = require("express");
var router = express.Router();

/* GET users */
router.get("/", (req, res) => {
  res.send({ message: "Users" });
});

module.exports = router;
