const groqModel = require("../models/groq");

const getRecipe = async (req, res) => {
    const { ingredients } = req.body;
    try {
        const response = await groqModel.recipeGenerator(ingredients);
        res.status(200).json({ response: response });
    } catch (error) {
        console.log(error);
    }
};

const getRandomRecipe = async (req, res) => {
    try {
        const response = await groqModel.randomRecipe();
        res.status(200).json({ response: response });
    } catch (error) {
        console.log(error);
    }
};

const getIngredientDescription = async (req, res) => {
    const { ingredients } = req.body;
    try {
        const response = await groqModel.ingredientDescriptionGenerator(
            ingredients
        );
        res.status(200).json({ response: response });
    } catch (error) {
        console.log(error);
    }
};

module.exports = { getRecipe, getRandomRecipe, getIngredientDescription };
