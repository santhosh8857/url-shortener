var express = require("express");
var router = express.Router();
const { mongodb, MongoClient, dbUrl } = require("../dbConfig");
const { hashing } = require("../library/auth"); // importing for authentication

/* GET users */
router.get("/", async (req, res) => {
  const client = await MongoClient.connect(dbUrl);

  try {
    const db = client.db("url-shortener");
    const data = await db.collection("users").find().toArray();

    res.send({ message: "success", data: data });
  } catch (err) {
    console.log(err);
    res.send({ message: "Error in connection" });
  } finally {
    client.close();
  }
});

// to create/register a new user
router.post("/", async (req, res) => {
  const client = await MongoClient.connect(dbUrl);

  try {
    // password-encryption
    const hash = await hashing(req.body.password); // calling hashing fnc to encrypt the user password.
    req.body.password = hash; // assigning the encrypted password.

    const db = client.db("url-shortener");

    // adding user with encrypted password and activation status.
    req.body.activation = false;
    const data = await db.collection("users").insertOne(req.body);

    res.send({ message: "Account created", data: data });
  } catch (err) {
    console.log(err);
    res.send({ message: "Error in connection", data: err });
  } finally {
    client.close();
  }
});

module.exports = router;
