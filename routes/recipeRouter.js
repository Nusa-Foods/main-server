const express = require("express");
const recipeRouter = express.Router();
const RecipeController = require("../controllers/recipeController");

// Define routes for recipe operations
recipeRouter.get("/", RecipeController.getAllRecipesHandler); // GET /recipe
recipeRouter.get("/owned", RecipeController.getRecipesByUserIdHandler); // GET /recipe/owned (requires user ID from token)
recipeRouter.get("/nusafood", RecipeController.getRecipesByNusaFoodHandler); // GET /recipe/nusafood
recipeRouter.get("/:slug", RecipeController.getRecipeBySlugHandler); // GET /recipe/:slug
recipeRouter.post("/", RecipeController.addRecipeHandler); // POST /recipe
recipeRouter.put("/:slug", RecipeController.updateRecipeHandler); // PUT /recipe/:slug
recipeRouter.delete("/:slug", RecipeController.deleteRecipeHandler); // DELETE /recipe/:slug

module.exports = recipeRouter;
