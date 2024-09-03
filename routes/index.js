const express = require("express");
const userRouter = require("./userRoutes");
const aiRouter = require("./aiRouter");
const routes = express.Router();

routes.use("/user", userRouter);
routes.use("/ai", aiRouter);

module.exports = routes;
