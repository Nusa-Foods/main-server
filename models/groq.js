const Groq = require("groq-sdk");
const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });
// const model = "llama3-8b-8192"; //meta
// const model = "llama3-groq-8b-8192-tool-use-preview"; // meta x groq
// const model = "gemma2-9b-it"; // google
const model = "mixtral-8x7b-32768"; // mixtral
const { imgSearch } = require("../utils/pexel");

const recipeGenerator = async (ingredients, retries = 5) => {
    for (let attempt = 0; attempt < retries; attempt++) {
        try {
            let response = await groq.chat.completions.create({
                messages: [
                    {
                        role: "user",
                        content: `{\n"title": "recipe name", \n"description": "short recipe description", \n"imgUrl": "fill with empty string", \n"ingredients": [[\'how much\', 'ingredients name']],\n"guide": "in markdown format"\n}\n\ngive me json format for recipe that use this ingredients. ${ingredients}`,
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
            response = JSON.parse(response.choices[0].message.content);
            let img = await imgSearch(response.title);
            img = img.photos[0].src.large;
            response.imgUrl = img;
            return response;
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
                content: `Give me some of description about this ingredients ${ingredients}. outpus is in markdown format`,
            },
        ],
        model: model,
    });
    return response.choices[0].message.content;
};

const randomRecipe = async () => {
    const retries = 5;
    for (let attempt = 0; attempt < retries; attempt++) {
        try {
            const response = await groq.chat.completions.create({
                messages: [
                    {
                        role: "user",
                        content: `{\n"name": "recipe name", \n"imgUrl": "google image search for this name", \n"ingredients": [[\'how much\', 'ingredients name']],\n"guide": "in markdown format"\n}\n\ngive me json format for random recipe`,
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

module.exports = {
    recipeGenerator,
    randomRecipe,
    ingredientDescriptionGenerator,
};
