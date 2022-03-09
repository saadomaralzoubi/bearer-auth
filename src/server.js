"use strict";

const express = require("express");

const usersrouter = require("./routes/Users");
const errorHandler = require("./error-handler/500.js");
const notFoundHandler = require("./error-handler/404.js");

const app = express();

app.use(express.json());

app.use(usersrouter);


app.use("*", notFoundHandler);
app.use(errorHandler);

function start(PORT) {
  app.listen(PORT, () => {
    console.log(`you in port ${PORT}`);
  });
}

module.exports = {
  app: app,
  start: start,
};
