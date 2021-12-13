var express = require("express");
var router = express.Router();
const { mongodb, MongoClient, dbUrl } = require("../dbConfig");
const tinyUrl = require("node-url-shortener");

// get urls
router.get("/", async (req, res) => {
  const client = await MongoClient.connect(dbUrl);

  try {
    const db = client.db("url-shortener");
    const urls = await db.collection("urls").find().toArray();

    res.send({ message: "Success!", data: urls });
  } catch (err) {
    console.log(err);
    res.send({ error: "Error in connection!", details: err });
  } finally {
    client.close();
  }
});

// add url
router.post("/add-url", async (req, res) => {
  // to reduce the length of the url
  tinyUrl.short(`${req.body.url}`, async (err, url) => {
    const client = await MongoClient.connect(dbUrl);
    try {
      const db = client.db("url-shortener");
      req.body.shortenUrl = url;

      const data = await db.collection("urls").insertOne(req.body);
      res.send({ message: "Success!", data: data });
    } catch (err) {
      console.log(err);
      res.send({ error: "Error in connection!", details: err });
    } finally {
      client.close();
    }
  });
});

module.exports = router;
