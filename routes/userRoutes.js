const express = require("express");
const userRouter = express.Router();
const UserController = require("../controllers/userController");

userRouter.post("/register", UserController.createUser);
userRouter.post("/login", UserController.login);
userRouter.post("/logout", UserController.logout);

module.exports = userRouter;
