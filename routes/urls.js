var express = require("express");
var router = express.Router();
const { mongodb, MongoClient, dbUrl } = require("../dbConfig");
const tinyUrl = require("node-url-shortener");
const { ObjectId } = require("mongodb");

// get urls
router.get("/", async (req, res) => {
  const client = await MongoClient.connect(dbUrl);

  try {
    const db = client.db("url-shortener");
    const urls = await db.collection("urls").find().toArray();

    res.send({ message: "Success", data: urls });
  } catch (err) {
    console.log(err);
    res.send({ message: "Error in connection!", error: err });
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
      req.body.count = 0;

      const data = await db.collection("urls").insertOne(req.body);
      res.send({ message: "Success", data: data });
    } catch (err) {
      console.log(err);
      res.send({ message: "Error in connection!", error: err });
    } finally {
      client.close();
    }
  });
});

// to count the clicks
router.post("/:id", async (req, res) => {
  const client = await MongoClient.connect(dbUrl);

  try {
    const db = client.db("url-shortener");
    const updateClick = await db
      .collection("urls")
      .updateOne({ _id: ObjectId(req.params.id) }, { $inc: { count: 1 } });

    res.send({ message: "Success!", status: true });
  } catch (err) {
    consoele.log(err);
    res.send({ message: "Error in connection", status: false });
  } finally {
    client.close();
  }
});

// to detele a url
router.delete("/:id", async (req, res) => {
  const client = await MongoClient.connect(dbUrl);

  try {
    const db = client.db("url-shortener");
    const deleteUrl = await db
      .collection("urls")
      .deleteOne({ _id: ObjectId(req.params.id) });

    res.send({ message: "Success!", status: true });
  } catch (err) {
    console.log(err);
    res.send({ message: "Error in connection", status: false, error: err });
  } finally {
    client.close();
  }
});

module.exports = router;
