"use strict";
const express = require("express");

const bcrypt = require("bcrypt");

const basicAuth = require("../middlewares/basicAuth");
const bearerAuth = require("../middlewares/bearerAuth");

const { Users } = require("../models/index.js");
const routers = express.Router();

routers.post("/signup", signupFunc);
routers.post("/signin", basicAuth, (req, res) => {
  res.status(200).json(req.User);
});
routers.get("/users", bearerAuth, (req, res) => {
  res.status(200).json(req.value);
});

routers.get("/", (req, res) => {
  res.send("home");
});

async function signupFunc(req, res) {
  let { username, password } = req.body;
  try {
    let hashedPassword = await bcrypt.hash(password, 5);
    const newUser = await Users.create({
      username: username,
      password: hashedPassword,
    });
    res.status(201).json(newUser);
  } catch (error) {
    console.log(error);
  }
}

// async function signinFunc(req, res) {
//   if (req.headers["authorization"]) {
//     let basicHeaderParts = req.headers.authorization.split(" ");
//     let encodedPart = basicHeaderParts.pop();

//     let decoded = base64.decode(encodedPart);

//     let [username, password] = decoded.split(":");

//     try {
//       const user = await Users.findOne({ where: { username: username } });
//       const valid = await bcrypt.compare(password, user.password);
//       if (valid) {
//         res.status(200).json({ username: username });
//       } else {
//         res.send("user is not valid");
//       }
//     } catch (error) {
//       res.send(error);
//     }
//   }
// }

module.exports = routers;
