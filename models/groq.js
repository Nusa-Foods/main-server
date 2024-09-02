const Groq = require("groq-sdk");

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

const recipeGenerator = async (ingredients) => {
    const response = await groq.chat.completions.create({
        messages: [
            {
                role: "user",
                content: `give me food recipe that use ${ingredients}`,
            },
        ],
        model: "llama3-8b-8192",
    });
    return response.choices[0].message.content;
};
const ingredientDescriptionGenerator = async (ingredients) => {
    const response = await groq.chat.completions.create({
        messages: [
            {
                role: "user",
                content: `give me description about this ingredients. ingredients = ${ingredients}`,
            },
        ],
        model: "llama3-8b-8192",
    });
    return response.choices[0].message.content;
};

const randomRecipe = async () => {
    const response = await groq.chat.completions.create({
        messages: [
            {
                role: "user",
                content: `give me one random recipe that looks interesting to cook, first give me reason why i should cook this recipe and explain about the `,
            },
        ],
        model: "llama3-8b-8192",
    });
    return response.choices[0].message.content;
};

module.exports = {
    recipeGenerator,
    randomRecipe,
    ingredientDescriptionGenerator,
};
