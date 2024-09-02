const express = require("express");
const aiRouter = express.Router();
const AiController = require("../controllers/aiController");

aiRouter.post("/recipe", AiController.getRecipe);
aiRouter.get("/recipe/random", AiController.getRandomRecipe);
aiRouter.post("/ingredient-description", AiController.getIngredientDescription);

module.exports = aiRouter;
