const groqModel = require("../models/groq");

const getRecipe = async (req, res) => {
    const { ingredients } = req.body;
    try {
        const response = await groqModel.recipeGenerator(ingredients);
        res.status(200).json({ response: response });
    } catch (error) {
        // console.error(error);
        res.status(500).json({ message: "Failed to generate recipe" });
    }
};

module.exports = { getRecipe };
