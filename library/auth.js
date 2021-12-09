// bcryptjs is pureJS and bcrypt has dependencies with c++
const bcrypt = require("bcryptjs"); // for encrypting passwords

const secret = "akslnfklenjpoerjqpd[jqwdif"; //random
const JWT = require("jsonwebtoken"); // to create a token

const JWTD = require("jwt-decode"); // to decode the token

// this function will take the password from the client (req.body.password) and encrypt it.
const hashing = async (value) => {
  try {
    // generating salt
    const salt = await bcrypt.genSalt(10);

    // hasing with generated salt and value.
    const hash = await bcrypt.hash(value, salt);
    return hash;
  } catch (err) {
    console.log("Bcrypt hash error", err);
  }
};

// this function will take the provided password and encryted password from the DB and compare it.
const hashCompare = async (currentPwd, hashedPwd) => {
  try {
    // this is return true or false.
    return await bcrypt.compare(currentPwd, hashedPwd);
  } catch (err) {
    console.log("bcrypt compare error", err);
  }
};

// this function will accept the username(email) and name(firstname) from the DB and create token.
const createToken = async (username, name) => {
  try {
    // sign ("data", secret code, expiration time)
    return JWT.sign(
      {
        username,
        name,
      },
      secret,
      {
        expiresIn: "15m",
      }
    );
  } catch (err) {
    console.log("token creation error", err);
  }
};

// this function will accept the token from the user and authenticate it. for this we are using jwt-decode package.
const authenticate = async (token) => {
  // calling JWTD to decode
  const decode = JWTD(token);

  // verfiy expiration time
  if (Math.round(new Date() / 1000) <= decode.exp) {
    return decode.username;
  } else {
    return false;
  }
};

module.exports = { hashing, hashCompare, createToken, authenticate };
