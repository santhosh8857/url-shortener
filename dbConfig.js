const mongodb = require("mongodb");
const MongoClient = mongodb.MongoClient;
const dbUrl =
  "mongodb+srv://Santhosh:Snowbell%40@30@cluster0.uqg9j.mongodb.net/myFirstDatabase?retryWrites=true&w=majority";

module.exports = { mongodb, MongoClient, dbUrl };
