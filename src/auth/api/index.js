const { Router } = require("express");

const routes = Router();

require("./routes/auth")(routes);

module.exports = routes;
