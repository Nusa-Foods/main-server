const Groq = require("groq-sdk");
const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });
const { imgSearch } = require("../utils/pexel");

const recipeGenerator = async (ingredients, retries = 50) => {
    for (let attempt = 0; attempt < retries; attempt++) {
        try {
            let response = await groq.chat.completions.create({
                messages: [
                    {
                        role: "user",
                        content: `
                            {
                                \n"title": "recipe name", 
                                \n"description": "short recipe description", 
                                \n"imgUrl": "fill with empty string", 
                                \n"ingredients": [[\'how much\', 'ingredients name']], 
                                \n"nutriens": [[\'how much\', 'nutriens name']],
                                \n"guide": "Step-by-step cooking instructions formatted in Markdown for better readability"\n
                            }
                            \n\ngive me json format for recipe that use this ingredients. ${ingredients}`,
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
};
