const express = require("express");
const userRouter = require("./userRoutes");
const aiRouter = require("./aiRouter");
const ingeRouter = require("./ingreRouter");
const recipeRouter = require("./recipeRouter");
const routes = express.Router();

routes.use("/user", userRouter);
routes.use("/ai", aiRouter);
routes.use("/inge", ingeRouter);
routes.use("/recipe", recipeRouter);

module.exports = routes;
