const express = require("express");
const userRouter = require("./userRoutes");
const aiRouter = require("./aiRouter");
const ingeRouter = require("./ingreRouter");
const recipeRouter = require("./recipeRouter");
const forumRouter = require("./forumRouter");
const eventRouter = require("./eventRouter");
const authentication = require("../middleware/authentication");
const routes = express.Router();

routes.use("/user", userRouter);
routes.use("/ai", authentication, aiRouter);
routes.use("/inge", authentication, ingeRouter);
routes.use("/recipe", authentication, recipeRouter);
routes.use("/forum", authentication, forumRouter);
routes.use("/event", authentication, eventRouter);

module.exports = routes;
