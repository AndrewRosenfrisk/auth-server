const { Router } = require("express");
const { User } = require("../../models");
const { AuthService } = require("../../services");

const router = Router();
const authService = new AuthService(User);

module.exports = (routes) => {
  routes.use("/auth", router);

  router.get("/", (req, res) => {
    res.status(200).json({ status: "success", message: "get /auth" });
  });

  router.post("/register", async (req, res, next) => {
    try {
      res.status(201).json({
        status: "success",
        message: "User registered!",
        data: {
          user: await authService.register(req.body),
        },
      });
    } catch (err) {
      next(err);
    }
  });
};
