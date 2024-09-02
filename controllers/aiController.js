const {
    recipeGenerator,
    ingredientDescriptionGenerator,
} = require("../models/groq");

const getRecipe = async (req, res) => {
    const { ingredients } = req.body;
    try {
        const response = await recipeGenerator(ingredients);
        res.status(200).json({ response: response });
    } catch (error) {
        console.log(error);
    }
};
const getRandomRecipe = async (req, res) => {
    try {
        const response = await recipeGenerator(ingredients);
        res.status(200).json({ response: response });
    } catch (error) {
        console.log(error);
    }
};
const getIngredientDescription = async (req, res) => {
    const { ingredients } = req.body;
    try {
        const response = await ingredientDescriptionGenerator(ingredients);
        res.status(200).json({ response: response });
    } catch (error) {
        console.log(error);
    }
};

const AiController = { getRecipe, getRandomRecipe, getIngredientDescription };

module.exports = AiController;
