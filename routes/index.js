const express = require("express");
const userRouter = require("./userRoutes");
const routes = express.Router();

routes.use("/users", userRouter);

module.exports = routes;
