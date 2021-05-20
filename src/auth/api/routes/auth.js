const { Router } = require("express");
const { User } = require("../../models");
const config = require("../../../config");
const { AuthService } = require("../../services");
const { authenticate } = require("../../middleware");

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

  router.post("/login", async (req, res, next) => {
    try {
      const { accessToken, refreshToken } = await authService.login(req.body);

      res.cookie(
        "refreshToken",
        refreshToken,
        config.auth.refreshToken.cookie.options
      );

      res.status(200).json({
        status: "success",
        message: "User Logged In!",
        accessToken,
      });
    } catch (err) {
      next(err);
    }
  });

  router.post("/refresh", (req, res, next) => {
    try {
      const { refreshToken } = req.cookies;

      if (!refreshToken) {
        const err = new Error("Unauthorized!");
        err.status = 401;
        throw err;
      }

      res.status(200).json({
        status: "success",
        message: "Token Generated!",
        accessToken: AuthService.refresh(refreshToken),
      });
    } catch (err) {
      next(err);
    }
  });

  router.post("/logout", authenticate, (req, res) => {
    res.clearCookie("refreshToken");

    res.status(200).json({
      status: "success",
      message: "Logged Out!",
    });
  });
};
