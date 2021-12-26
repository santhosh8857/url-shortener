const express = require("express");
const router = express.Router();
const { mongodb, MongoClient, dbUrl } = require("../dbConfig");
const { ObjectId } = require("mongodb");

// to get the details
router.get("/", async (req, res) => {
  const client = await MongoClient.connect(dbUrl);
  try {
    const db = client.db("url-shortener");

    const data = await db.collection("contact").find().toArray();
    res.send({ message: "Success", data: data });
  } catch (err) {
    console.log(err);
    res.send({ message: "Error in connection!", status: false });
  } finally {
    client.close();
  }
});

// to add the details
router.post("/", async (req, res) => {
  const client = await MongoClient.connect(dbUrl);

  try {
    const db = client.db("url-shortener");

    const user = await db
      .collection("users")
      .findOne({ username: req.body.email });

    if (user) {
      const data = await db.collection("contact").insertOne(req.body);
      res.send({ message: "Success", status: true });
    } else {
      res.send({ message: "Invalid User!", status: false });
    }
  } catch (err) {
    console.log(err);
    res.send({ message: "Error in connection!", status: false });
  } finally {
    client.close();
  }
});

module.exports = router;
