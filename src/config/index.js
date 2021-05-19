require("dotenv").config();

module.exports = {
  app: require("./app"),
  db: require("./db"),
  auth: require("./auth"),
};
