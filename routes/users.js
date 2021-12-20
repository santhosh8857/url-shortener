var express = require("express");
var router = express.Router();
const nodemailer = require("nodemailer");
const env = require("dotenv").config();
const crypto = require("crypto");
const app = require("../app");
const { mongodb, MongoClient, dbUrl } = require("../dbConfig");
const {
  hashing,
  hashCompare,
  createToken,
  authenticate,
} = require("../library/auth"); // importing for authentication
const { ObjectId } = require("mongodb");

// sender email details
var transpoter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: "urlshortener66@gmail.com",
    pass: process.env.PWD,
  },
  tls: {
    rejectUnauthorized: false,
  },
});

/* GET users */
router.get("/", async (req, res) => {
  const client = await MongoClient.connect(dbUrl);

  try {
    const db = client.db("url-shortener");
    const data = await db.collection("users").find().toArray();

    res.send({ message: "success", data: data });
  } catch (err) {
    console.log(err);
    res.send({ message: "Error in connection!", error: err });
  } finally {
    client.close();
  }
});

// to create/register a new user
router.post("/register", async (req, res) => {
  const client = await MongoClient.connect(dbUrl);

  try {
    // password-encryption
    const hash = await hashing(req.body.password); // calling hashing fnc to encrypt the user password.
    req.body.password = hash; // assigning the encrypted password.

    const db = client.db("url-shortener");

    // adding user with encrypted password, activation status and random string
    req.body.activation = false;
    req.body.emailToken = crypto.randomBytes(64).toString("hex");
    const data = await db.collection("users").insertOne(req.body);

    // verification email to user
    var mailOptions = {
      from: ' "Verfiy your email" <urlshortener66@gmail.com>',
      to: req.body.username,
      subject: "url-shortener : Verify your email",
      html: `<h2>${req.body.firstname}! Thank you for registering to our application </h2>
        <h4>Please click on the below link to verify your email...</h4?
        <a href='http://${req.headers.host}/users/verify-email/${req.body.emailToken}'>link to verify your email</a>`,
    };

    // sending email
    transpoter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.log("email error: ", error);
      } else {
        console.log("Verification email sent!");
      }
    });

    res.send({ message: "Account created", data: data, status: true });
  } catch (err) {
    console.log(err);
    res.send({ message: "Error in connection!", error: err, status: false });
  } finally {
    client.close();
  }
});

router.get("/verify-email/:emailToken", async (req, res) => {
  const client = await MongoClient.connect(dbUrl);

  try {
    const db = client.db("url-shortener");

    const user = await db
      .collection("users")
      .updateOne(
        { emailToken: req.params.emailToken },
        { $set: { emailToken: null, activation: true } }
      );

    res.send({ message: "Account activated!" });
  } catch (err) {
    console.log(err);
    res.send({ message: "Error in connection!", error: err });
  } finally {
    client.close();
  }
});

// username & password
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
          res.send({ message: "Login successfull!", status: true });
        } else {
          res.send({ message: "Invalid username or password", status: false });
        }
      } else {
        console.log(user.activation);
        res.send({ message: "Activate Account!" });
      }
    } else {
      res.send({ message: "No user available" });
    }
  } catch (err) {
    console.log(err);
    res.send({ message: "Error in connection!", error: err });
  } finally {
    client.close();
  }
});

app.post("/forget-password", cors(), async (req, res) => {
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

      // send reset email to user
      var mailOptions = {
        from: ' "Reset your password" <urlshortener66@gmail.com>',
        to: user.username,
        subject: "url-shortener : Reset your password",
        html: `<h2>${user.firstname}! Thanks for using our application </h2>
        <h4>Please click on the below link to reset your password...</h4?
        <a href='http://${req.headers.host}/users/reset-password/${token}'>Reset link</a>`,
      };

      // sending email
      transpoter.sendMail(mailOptions, (error, info) => {
        if (error) {
          console.log("email error: ", error);
        } else {
          res.send({
            token,
            message: "Reset link has been sent successfully!",
          });
        }
      });
    } else {
      res.send({ message: "Invalid username!" });
    }
  } catch (err) {
    console.log(err);
    res.send({ message: "Error in connection", error: err });
  }
});

// after clicking the reset password link
router.get("/reset-password/:token", async (req, res) => {
  res.render("index", { title: "Get from email" });
});

// reset-password.  takes new password
router.post("/reset-password/:token", async (req, res) => {
  const client = await MongoClient.connect(dbUrl);

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

      res.send({ message: "Password updated successfully!" });
    } else {
      res.send({ message: "Link expired!" });
    }
  } catch (err) {
    console.log(err);
    res.send({ message: "Error in connection", error: err });
  } finally {
    client.close();
  }
});

module.exports = router;
