const express = require("express");
const recipeRouter = express.Router();
const RecipeController = require("../controllers/recipeController");

// Define routes for recipe operations
recipeRouter.get("/", RecipeController.getAllRecipesHandler);
recipeRouter.get("/owned", RecipeController.getRecipesByUserIdHandler);
recipeRouter.get("/nusafood", RecipeController.getRecipesByNusaFoodHandler);
recipeRouter.get("/:slug", RecipeController.getRecipeBySlugHandler);
recipeRouter.post("/", RecipeController.addRecipeHandler);
recipeRouter.put("/:slug", RecipeController.updateRecipeHandler);
recipeRouter.delete("/:slug", RecipeController.deleteRecipeHandler);
recipeRouter.post(
    "/:slug/comments",
    RecipeController.addCommentToRecipeHandler
);
recipeRouter.post("/:slug/like", RecipeController.addLikeToRecipeHandler);

module.exports = recipeRouter;
