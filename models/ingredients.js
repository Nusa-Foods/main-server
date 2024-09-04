const { database } = require("../config/mongo");
const db = database.collection("ingredients");

function generateSlug(name) {
    return name.toLowerCase().replace(/\s+/g, "-");
}

async function createIngredient(ingredientData) {
    const newIngredient = {
        name: ingredientData.name,
        slug: generateSlug(ingredientData.name),
        createdAt: new Date(),
        updatedAt: new Date(),
    };

    const result = await db.insertOne(newIngredient);
    return result;
}

async function getIngredientByName(name) {
    const ingredient = await db.findOne({
        name: { $regex: new RegExp(`^${name}$`, "i") },
    });
    return ingredient;
}

async function getIngredients() {
    const ingredients = await db.find().toArray();
    return ingredients;
}

async function getIngredientBySlug(slug) {
    const ingredient = await db.findOne({ slug: slug });
    return ingredient;
}

module.exports = {
    getIngredientByName,
    createIngredient,
    getIngredients,
    getIngredientBySlug,
};
