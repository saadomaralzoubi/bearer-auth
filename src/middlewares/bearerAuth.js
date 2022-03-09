"use strict";
require("dotenv").config();
const { Users } = require("../models/index");

const jwt = require("jsonwebtoken");

const SECRET = process.env.SECRET;

const bearerAuth = async (req, res, next) => {
  if (req.headers["authorization"]) {
    let bearerHeaderParts = req.headers.authorization.split(" ");
    let token = bearerHeaderParts.pop();
    console.log(token);

    try {
      const verifiedToken = jwt.verify(token, SECRET);
      const User = await Users.findOne({
        where: { username: verifiedToken.username },
      });
      if (User) {
        req.value = User.username;
        next();
      } else {
        res.status(403).send("invalid token");
      }
    } catch {
      res.status(403).send("invalid username");
    }
  }
};

module.exports = bearerAuth;
