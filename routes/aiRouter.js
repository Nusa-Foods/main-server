const express = require("express");
const aiRouter = express.Router();
const AiController = require("../controllers/aiController");

aiRouter.post("/recipe", AiController.getRecipe);

module.exports = aiRouter;
