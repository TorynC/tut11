
const express = require("express");
const routes = require("./routes");
const app = express();

app.use(express.json());
app.use("", routes);

module.exports = app; // we will talk about why we need this for part 3
