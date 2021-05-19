const { Router } = require("express");

const router = Router();

module.exports = (routes) => {
  routes.use("/auth", router);

  router.get("/", (req, res) => {
    res.status(200).json({ status: "success", message: "get /auth" });
  });
};
