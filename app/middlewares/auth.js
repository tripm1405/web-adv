const jwt = require("jsonwebtoken");
const blacklistUserModel = require("../models/blacklist.model");

const noPermissionRoutes = [
  "/login",
  "/register",
  "/reset-password",
  "/forgot-password",
];

const firstLoginRoutes = ["/change-password", "/logout"];

const userAuth = (req, res, next) => {
  const token = req.cookies["auth-token"];
  if (!token) {
    if (req.path.match(/\/reset-password\/*/g)) {
      return next();
    }
    if (!noPermissionRoutes.includes(req.path)) {
      return res.redirect(303, "/login");
    }
    next();
  }
  if (token) {
    const firstLogin = req.cookies["first-login"];
    if (firstLogin === "true") {
      if (!firstLoginRoutes.includes(req.path)) {
        return res.redirect(303, "/change-password");
      }
    }
    if (noPermissionRoutes.includes(req.path)) {
      return res.redirect(303, "/");
    }
    jwt.verify(token, process.env.TOKEN_SECERT, (err, decoded) => {
      if (err) {
        res.clearCookie("auth-token");
        res.clearCookie("first-login");
        return res.redirect(303, "/login");
      }
      req.user = decoded;
      if (req.user.role === "Admin") {
        if (req.path == "/logout") {
          return next();
        }
        if (!req.path.match(/\/admin*/g)) {
          return res.redirect(303, "/admin");
        }
      }
      next();
    });
  }
};

module.exports = {
  userAuth: userAuth,
};
