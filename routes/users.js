var express = require("express");
var router = express.Router();
const { mongodb, MongoClient, dbUrl } = require("../dbConfig");
const {
  hashing,
  hashCompare,
  createToken,
  authenticate,
} = require("../library/auth"); // importing for authentication

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

    // ---- //
    // email to activate the account //
    // ---- //

    res.send({ message: "Account created", data: data });
  } catch (err) {
    console.log(err);
    res.send({ message: "Error in connection", data: err });
  } finally {
    client.close();
  }
});

router.post("/login", async (req, res) => {
  const client = await MongoClient.connect(dbUrl);

  try {
    const db = client.db("url-shortener");

    const user = await db
      .collection("users")
      .findOne({ username: req.body.username }); // to get the user details.

    // verify user
    if (user) {
      // verify activation
      if (user.activation) {
        // calling compare function to validate
        const compare = await hashCompare(req.body.password, user.password);

        // verify compare
        if (compare) {
          res.send({ message: "Login successfull!!!" });
        } else {
          res.send({ message: "Invalid username or password" });
        }
      } else {
        console.log(user.activation);
        res.send({ message: "Activate Account!!!" });
      }
    } else {
      res.send({ message: "No user available" });
    }
  } catch (err) {
    console.log(err);
    res.send({ message: "Error in connection", data: err });
  } finally {
    client.close();
  }
});

router.post("/forget-password", async (req, res) => {
  const client = await MongoClient.connect(dbUrl);

  try {
    const db = client.db("url-shortener");

    // fetching user details
    const user = await db
      .collection("users")
      .findOne({ username: req.body.username });

    // verify user
    if (user) {
      const token = await createToken(user.username, user.firstname);

      // ----- //
      // email with reset link includes token //
      // ----- //

      res.send({ token, message: "Reset link has been sent successfully!!!" });
    } else {
      res.send({ message: "Invalid username!!!" });
    }
  } catch (err) {
    console.log(err);
    res.send({ message: "Error in connection" });
  }
});

// reset-password.  takes new password
router.post("/reset-password/:token", async (req, res) => {
  const client = await MongoClient.connect(dbUrl);

  // ----- //
  // should be navigated from the email
  // ----- //

  // call the authenticate func to validate the token and extract the email.
  const tokenVerifiedUsername = await authenticate(req.params.token);
  try {
    // check token.
    if (tokenVerifiedUsername) {
      const db = client.db("url-shortener");

      // password encryption
      const hash = await hashing(req.body.password);
      req.body.password = hash;

      // updating new password
      const data = await db
        .collection("users")
        .updateOne(
          { username: tokenVerifiedUsername },
          { $set: { password: req.body.password } }
        );

      res.send({ message: "Password updated successfully!!!" });
    } else {
      res.send({ message: "Link expired!!!" });
    }
  } catch (err) {
    console.log(err);
    res.send({ message: "Error in connection" });
  } finally {
    client.close();
  }
});

module.exports = router;
