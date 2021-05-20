// Module dependencies
const cors = require("cors");
require("pkginfo")(module, "name");
const express = require("express");
const { isCelebrate } = require("celebrate");
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

// Error handler registration.

app.use((err, req, res, next) => {
  const status = isCelebrate(err) ? 400 : err.status || 500;
  const message =
    config.app.env === "production" && err.status === 500
      ? "Something Went Wrong!"
      : err.message;

  if (status === 500) console.log(err.stack);

  res.status(status).json({
    status: status >= 500 ? "error" : "fail",
    message,
  });
});

module.exports = app;
