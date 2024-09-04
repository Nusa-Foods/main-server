const {
    createIngredient,
    getIngredients,
    getIngredientBySlug,
    getIngredientByName,
} = require("../models/ingredients");

function validateIngredientInput(data) {
    if (!data.name) {
        return "Ingredient name is required.";
    }
    return null;
}

async function addIngredient(req, res) {
    const errorMessage = validateIngredientInput(req.body);
    const ingredient = req.body;

    const alreadyExistIngredient = await getIngredientByName(ingredient.name);

    if (alreadyExistIngredient) {
        return res.status(400).json({ message: "ingredients already exist" });
    }

    if (errorMessage) {
        return res.status(400).json({ message: errorMessage });
    }

    try {
        const result = await createIngredient(req.body);
        res.status(201).json({
            message: "Ingredient created successfully.",
        });
    } catch (error) {
        res.status(500).json({
            message: "Failed to create ingredient.",
            error: error.message,
        });
    }
}

async function getAllIngredients(req, res) {
    try {
        const ingredients = await getIngredients();
        res.status(200).json(ingredients);
    } catch (error) {
        res.status(500).json({
            message: "Failed to retrieve ingredients.",
            error: error.message,
        });
    }
}

async function getIngredientSlug(req, res) {
    const { slug } = req.params;

    try {
        const ingredient = await getIngredientBySlug(slug);
        if (ingredient) {
            res.status(200).json(ingredient);
        } else {
            res.status(404).json({ message: "Ingredient not found." });
        }
    } catch (error) {
        res.status(500).json({
            message: "Failed to retrieve ingredient.",
            error: error.message,
        });
    }
}

module.exports = { addIngredient, getAllIngredients, getIngredientSlug };
