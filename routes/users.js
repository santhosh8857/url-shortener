var express = require("express");
var router = express.Router();
// nodemailer
const nodemailer = require("nodemailer");
const sgTransport = require("nodemailer-sendgrid-transport");
const env = require("dotenv").config();
// crypto
const crypto = require("crypto");
// mongodb
const { mongodb, MongoClient, dbUrl } = require("../dbConfig");
const { ObjectId } = require("mongodb");
// password hashing
const {
  hashing,
  hashCompare,
  createToken,
  authenticate,
} = require("../library/auth"); // importing for authentication

// sender email details
const transporter = nodemailer.createTransport(
  sgTransport({
    auth: {
      api_key: process.env.Api_key,
    },
  })
);

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

    const user = await db
      .collection("users")
      .findOne({ username: req.body.username });

    // verification email to user
    const mailOptions = {
      from: "santhosh8857@hotmail.com",
      replyTo: "noreply8857@gmail.com",
      to: user.username,
      subject: "url-shortener : Verify your email",
      html: `<h2>Hi ${user.firstname}! <br> Thank you for registering to our application </h2>
        <h4>Please click on the below link to verify your email...</h4?
        <a href='${process.env.URL}/verify-email/${user.emailToken}'>link</a>`,
    };

    // sending email
    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        // res.send({ message: "Error in email", error: error });
        console.log("email error: ", error);
      } else {
        res.send({ message: "Account created", data: data, status: true });
        console.log("Verification email sent!");
      }
    });
  } catch (err) {
    console.log(err);
    res.send({ message: "Error in connection!", error: err, status: false });
  } finally {
    client.close();
  }
});

// email verification
router.post("/verify-email/:emailToken", async (req, res) => {
  const client = await MongoClient.connect(dbUrl);

  let urlToken = req.params.emailToken;
  try {
    const db = client.db("url-shortener");

    const user = await db.collection("users").findOne({
      emailToken: urlToken,
    });
    if (user.emailToken === urlToken) {
      const userData = await db
        .collection("users")
        .updateOne(
          { emailToken: req.params.emailToken },
          { $set: { emailToken: null, activation: true } }
        );

      res.send({ message: "Account activated!", status: true });
    } else {
      res.send({ message: "Invalid token!", status: false });
    }
    // res.send({ message: "Account activated!", status: true });
  } catch (err) {
    console.log(err);
    res.send({ message: "Error in connection!", status: false, error: err });
  } finally {
    client.close();
  }
});

// username & password.
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

// forget password.
router.post("/forget-password", async (req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  );
  res.header("Access-Control-Allow-Credentials", true);
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
        from: "santhosh8857@hotmail.com",
        replyTo: "noreply8857@gmail.com",
        to: user.username,
        subject: "url-shortener : Reset your password",
        html: `<h2>Hi ${user.firstname}! <br> Thanks for using our application </h2>
        <h4>Please click on the below link to reset your password...</h4><br>
        <a href='${process.env.URL}/reset-password/${token}'>Reset link</a>`,
      };

      // sending email
      transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
          console.log("email error: ", error);
        } else {
          res.send({
            token,
            message: "Reset link has been sent successfully!",
            status: true,
          });
        }
      });
    } else {
      res.send({ message: "Invalid username!", status: false });
    }
  } catch (err) {
    console.log(err);
    res.send({ message: "Error in connection", error: err, status: false });
  }
});

// reset-password.
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

      res.send({ message: "Password updated successfully!", status: true });
    } else {
      res.send({ message: "Link expired!", status: false });
    }
  } catch (err) {
    console.log(err);
    res.send({ message: "Error in connection", error: err, status: false });
  } finally {
    client.close();
  }
});

// after clicking the reset password link (testing from backend!!!) no action for production
router.get("/reset-password/:token", async (req, res) => {
  res.render("index", { title: "Get from email" });
});

module.exports = router;
