// Module dependencies
const cors = require("cors");
require("pkginfo")(module, "name");
const express = require("express");
const cookieParser = require("cookie-parser");

// App initialization
const app = express();

// Middleware registration
app.use(express.json());
app.use(cors());
app.use(cookieParser());

// Route registration
require("./routes")(app);

// 404 handler
app.use((req, res, next) => {
  const err = new Error("Not Found!");
  err.status = 404;
  next(err);
});

module.exports = app;
