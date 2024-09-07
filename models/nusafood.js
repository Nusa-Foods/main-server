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

    try {
        const result = await db.insertOne(newRecipe);
        return result;
    } catch (error) {
        console.error("Error while creating a recipe:", error.message);
        throw error;
    }
}

// Get all recipes
async function getAllNusa() {
    try {
        const recipes = await db.find().toArray();
        return recipes;
    } catch (error) {
        console.error("Error while retrieving all recipes:", error.message);
        throw error;
    }
}

// Get a recipe by its slug
async function getNusaBySlug(slug) {
    try {
        const recipe = await db.findOne({ slug: slug });
        return recipe;
    } catch (error) {
        console.error("Error while retrieving recipe by slug:", error.message);
        throw error;
    }
}

// Delete a recipe by its slug
async function deleteNusa(slug) {
    try {
        const result = await db.deleteOne({ slug: slug });
        return result;
    } catch (error) {
        console.error("Error while deleting recipe:", error.message);
        throw error;
    }
}

module.exports = {
    createNusa,
    getAllNusa,
    getNusaBySlug,
    deleteNusa,
    generateSlug,
};
