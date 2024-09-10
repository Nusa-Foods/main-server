const express = require("express");
const userRouter = express.Router();
const UserController = require("../controllers/userController");
const authentication = require("../middleware/authentication");

userRouter.post("/register", UserController.createUser);
userRouter.post("/login", UserController.login);
userRouter.post("/googleLogin", UserController.googleLogin);
userRouter.post("/logout", UserController.logout);
userRouter.get("/:id", UserController.getUserByIdHandler);
userRouter.put("/update", authentication, UserController.updateUser);

module.exports = userRouter;
