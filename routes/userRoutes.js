const express = require("express");
const { createUser, login, logout } = require("../controllers/userController");
const userRouter = express.Router();

userRouter.post("/register", createUser);
userRouter.post("/login", login);
userRouter.post("/logout", logout);

module.exports = userRouter;
