const {
    createRecipe,
    getAllRecipes,
    getRecipeBySlug,
    getRecipesByUserId,
    getRecipesByNusaFood,
    updateRecipe,
    deleteRecipe,
} = require("../models/recipe");

function validateRecipeInput(data) {
    if (!data.title) {
        return "Recipe title is required.";
    }
    if (!data.description) {
        return "Recipe description is required.";
    }
    if (!data.imgUrl) {
        return "Recipe image URL is required.";
    }
    if (!data.bannerUrl) {
        return "Recipe banner URL is required.";
    }
    return null;
}

// GET /recipe
async function getAllRecipesHandler(req, res) {
    try {
        const recipes = await getAllRecipes();
        res.status(200).json(recipes);
    } catch (error) {
        res.status(500).json({
            message: "Failed to retrieve recipes.",
            error: error.message,
        });
    }
}

async function getRecipesByUserIdHandler(req, res) {
    const userId = req.user.id;
    try {
        const recipes = await getRecipesByUserId(userId);
        res.status(200).json(recipes);
    } catch (error) {
        res.status(500).json({
            message: "Failed to retrieve user's recipes.",
            error: error.message,
        });
    }
}

async function getRecipesByNusaFoodHandler(req, res) {
    try {
        const recipes = await getRecipesByNusaFood();
        res.status(200).json(recipes);
    } catch (error) {
        res.status(500).json({
            message: "Failed to retrieve NusaFood recipes.",
            error: error.message,
        });
    }
}

async function getRecipeBySlugHandler(req, res) {
    const { slug } = req.params;
    try {
        const recipe = await getRecipeBySlug(slug);
        if (recipe) {
            res.status(200).json(recipe);
        } else {
            res.status(404).json({ message: "Recipe not found." });
        }
    } catch (error) {
        res.status(500).json({
            message: "Failed to retrieve recipe.",
            error: error.message,
        });
    }
}

async function addRecipeHandler(req, res) {
    const errorMessage = validateRecipeInput(req.body);

    if (errorMessage) {
        return res.status(400).json({ message: errorMessage });
    }

    const user = req.user;

    const recipeData = {
        title: req.body.title,
        description: req.body.description,
        imgUrl: req.body.imgUrl,
        bannerUrl: req.body.bannerUrl,
        authorId: user.userId,
    };

    try {
        const result = await createRecipe(recipeData);
        res.status(201).json({
            message: "Recipe created successfully.",
            recipeId: result.insertedId,
        });
    } catch (error) {
        res.status(500).json({
            message: "Failed to create recipe.",
            error: error.message,
        });
    }
}

async function updateRecipeHandler(req, res) {
    const { slug } = req.params;
    const errorMessage = validateRecipeInput(req.body);
    if (errorMessage) {
        return res.status(400).json({ message: errorMessage });
    }

    try {
        const result = await updateRecipe(slug, req.body);
        if (result.modifiedCount === 1) {
            res.status(200).json({ message: "Recipe updated successfully." });
        } else {
            res.status(404).json({ message: "Recipe not found." });
        }
    } catch (error) {
        res.status(500).json({
            message: "Failed to update recipe.",
            error: error.message,
        });
    }
}

async function deleteRecipeHandler(req, res) {
    const { slug } = req.params;
    try {
        const result = await deleteRecipe(slug);
        if (result.deletedCount === 1) {
            res.status(200).json({ message: "Recipe deleted successfully." });
        } else {
            res.status(404).json({ message: "Recipe not found." });
        }
    } catch (error) {
        res.status(500).json({
            message: "Failed to delete recipe.",
            error: error.message,
        });
    }
}

module.exports = {
    getAllRecipesHandler,
    getRecipesByUserIdHandler,
    getRecipesByNusaFoodHandler,
    getRecipeBySlugHandler,
    addRecipeHandler,
    updateRecipeHandler,
    deleteRecipeHandler,
};
