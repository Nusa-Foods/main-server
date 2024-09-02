const express = require("express");
const {
    getRecipe,
    getRandomRecipe,
    getIngredientDescription,
} = require("../controllers/aiController");
const aiRouter = express.Router();

aiRouter.post("/recipe", getRecipe);
aiRouter.get("/recipe/random", getRandomRecipe);
aiRouter.post("/ingredient-description", getIngredientDescription);

module.exports = aiRouter;
