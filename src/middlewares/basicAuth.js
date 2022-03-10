"use strict";
require("dotenv").config();
const base64 = require("base-64");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { Users } = require("../models/index");

const SECRET = process.env.SECRET;

const basicAuth = async (req, res, next) => {
  if (req.headers.authorization) {
    let basicHeeaderParts = req.headers.authorization.split(" ");
    let encoded = basicHeeaderParts.pop();
    let decoded = base64.decode(encoded);
    let [username, password] = decoded.split(":");
    try {
      const User = await Users.findOne({ where: { username: username } });
      const valid = await bcrypt.compare(password, User.password);
      if (valid) {
        let newToken = jwt.sign({ username: User.username }, SECRET, {
          expiresIn: "900s",
        });
        User.token = newToken;
        req.User = User;

        next();
      } else {
        res.status(403).send("invalid password");
      }
    } catch {
      res.status(403).send("invalid username");
    }
  }
};
module.exports = basicAuth;
