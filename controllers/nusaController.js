const nusaModel = require("../models/nusaModel");

// Controller for creating a new recipe
async function createNusaHandler(req, res) {
    const recipeData = req.body;

    try {
        const result = await nusaModel.createNusa(recipeData);
        res.status(201).json({
            message: "Recipe created successfully.",
            data: result,
        });
    } catch (error) {
        res.status(500).json({
            message: "Failed to create recipe.",
            error: error.message,
        });
    }
}

async function getAllNusaHandler(req, res) {
    try {
        const recipes = await nusaModel.getAllNusa();
        res.status(200).json(recipes);
    } catch (error) {
        res.status(500).json({
            message: "Failed to retrieve recipes.",
            error: error.message,
        });
    }
}

async function getNusaBySlugHandler(req, res) {
    const { slug } = req.params;

    try {
        const recipe = await nusaModel.getNusaBySlug(slug);
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

async function deleteNusaHandler(req, res) {
    const { slug } = req.params;

    try {
        const result = await nusaModel.deleteNusa(slug);
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
    createNusaHandler,
    getAllNusaHandler,
    getNusaBySlugHandler,
    deleteNusaHandler,
};
