const Groq = require("groq-sdk");
const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });
// const model = "llama3-8b-8192"; //meta
// const model = "llama3-groq-8b-8192-tool-use-preview"; // meta x groq
// const model = "gemma2-9b-it"; // google
const model = "mixtral-8x7b-32768"; // mixtral

const recipeGenerator = async (ingredients, retries = 3) => {
    for (let attempt = 0; attempt < retries; attempt++) {
        try {
            const response = await groq.chat.completions.create({
                messages: [
                    {
                        role: "user",
                        content: `{\n"name": "recipe name",\n"ingredients": [[\'ingredients dose\', 'ingredients name']],\n"guide": "guide to cooks"\n}\n\ngive me that json format for recipe that user ${ingredients}`,
                    },
                ],
                model: "llama3-8b-8192",
                temperature: 1,
                max_tokens: 1024,
                top_p: 1,
                stream: false,
                response_format: {
                    type: "json_object",
                },
                stop: null,
            });

            // If the response is successful, parse and return it
            return JSON.parse(response.choices[0].message.content);
        } catch (error) {
            console.error(`Attempt ${attempt + 1} failed:`, error);
            if (attempt === retries - 1) {
                throw new Error(
                    "Failed to generate recipe after multiple attempts."
                );
            }
        }
    }
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
