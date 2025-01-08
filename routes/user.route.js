const express = require("express");
const {
  registerUser,
  loginUser,
  logOutUser,
} = require("../controller/user.controller");
const route = express.Router();

route.post("/signup", registerUser);
route.post("/login", loginUser);
route.get("/logout", logOutUser);

module.exports = route;
