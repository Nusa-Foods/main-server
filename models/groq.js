const Groq = require("groq-sdk");
const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });
// const model = "llama3-8b-8192"; //meta
// const model = "llama3-groq-8b-8192-tool-use-preview"; // meta x groq
// const model = "gemma2-9b-it"; // google
const model = "mixtral-8x7b-32768"; // mixtral

const recipeGenerator = async (ingredients) => {
    const response = await groq.chat.completions.create({
        messages: [
            {
                role: "user",
                content: `buatkan saya satu resep makanan yang menggunakan bahan bahan ini, bahan makanan = ${ingredients}. gunakan bahasa indonesia`,
            },
        ],
        model: model,
    });
    return response.choices[0].message.content;
};

const ingredientDescriptionGenerator = async (ingredients) => {
    const response = await groq.chat.completions.create({
        messages: [
            {
                role: "user",
                content: `berikan saya penjelasan deskripsi dari bahan makanan ini. bahan makanan = ${ingredients}. gunakan bahasa indonesia`,
            },
        ],
        model: model,
    });
    return response.choices[0].message.content;
};

const randomRecipe = async () => {
    const response = await groq.chat.completions.create({
        messages: [
            {
                role: "user",
                content: `berikan saya resep secara asak untuk di masak sekarang juga, berikan juga penjelasan tentang menariknya resep yang di sarankan untuk dimasak. gunakan bahasa indonesia`,
            },
        ],
        model: model,
    });
    return response.choices[0].message.content;
};

module.exports = {
    recipeGenerator,
    randomRecipe,
    ingredientDescriptionGenerator,
};
