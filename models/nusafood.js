const { ObjectId } = require("mongodb");
const { database } = require("../config/mongo");
const db = database.collection("nusafood");

// Function to generate a slug from the title
function generateSlug(title) {
    return title.toLowerCase().replace(/\s+/g, "-");
}

// Create a new recipe
async function createNusa(recipeData) {
    const newRecipe = {
        title: recipeData.title,
        description: recipeData.description,
        imgUrl: recipeData.imgUrl,
        bannerUrl: recipeData.bannerUrl,
        slug: generateSlug(recipeData.title),
        category: recipeData.category,
        createdAt: new Date(),
        updatedAt: new Date(),
    };

    const result = await db.insertOne(newRecipe);
    return result;
}

// Get all recipes
async function getAllNusa() {
    const recipes = await db.find().toArray();
    return recipes;
}

// Get a recipe by its slug
async function getNusaBySlug(slug) {
    const recipe = await db.findOne({ slug: slug });
    return recipe;
}

// Delete a recipe by its slug
async function deleteNusa(slug) {
    const result = await db.deleteOne({ slug: slug });
    return result;
}

module.exports = {
    createNusa,
    getAllNusa,
    getNusaBySlug,
    deleteNusa,
    generateSlug,
};
