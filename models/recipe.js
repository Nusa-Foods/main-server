const { database } = require("../config/mongo");
const db = database.collection("recipes");

// Function to generate a slug from the title
function generateSlug(title) {
    return title.toLowerCase().replace(/\s+/g, "-");
}

async function createRecipe(recipeData) {
    const newRecipe = {
        title: recipeData.title,
        description: recipeData.description,
        imgUrl: recipeData.imgUrl,
        bannerUrl: recipeData.bannerUrl,
        slug: generateSlug(recipeData.title), // Automatically generate a slug from the title
        likes: [], // Default to empty array
        comments: [], // Default to empty array
        createdAt: new Date(),
        updatedAt: new Date(),
    };

    const result = await db.insertOne(newRecipe);
    return result;
}

async function getAllRecipes() {
    const recipes = await db.find().toArray();
    return recipes;
}

async function getRecipeBySlug(slug) {
    const recipe = await db.findOne({ slug: slug });
    return recipe;
}

async function getRecipesByUserId(userId) {
    const recipes = await db.find({ authorId: userId }).toArray();
    return recipes;
}

async function getRecipesByNusaFood() {
    // Implement logic to get recipes specific to NusaFood
    const recipes = await db.find({ source: "NusaFood" }).toArray();
    return recipes;
}

async function updateRecipe(slug, recipeData) {
    const result = await db.updateOne(
        { slug: slug },
        {
            $set: {
                title: recipeData.title,
                description: recipeData.description,
                imgUrl: recipeData.imgUrl,
                bannerUrl: recipeData.bannerUrl,
                updatedAt: new Date(),
            },
        }
    );
    return result;
}

async function deleteRecipe(slug) {
    const result = await db.deleteOne({ slug: slug });
    return result;
}

module.exports = {
    createRecipe,
    getAllRecipes,
    getRecipeBySlug,
    getRecipesByUserId,
    getRecipesByNusaFood,
    updateRecipe,
    deleteRecipe,
};
