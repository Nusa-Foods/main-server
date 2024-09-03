const express = require("express");
const ingeRouter = express.Router();
const ingredientController = require("../controllers/ingredientsController");

ingeRouter.post("/ingredient", ingredientController.addIngredient);
ingeRouter.get("/ingredient", ingredientController.getAllIngredients);
ingeRouter.get("/ingredient/:slug", ingredientController.getIngredientSlug);

module.exports = ingeRouter;
