const { ObjectId } = require("mongodb");
const { database } = require("../config/mongo");
const db = database.collection("recipes");
const usersDb = database.collection("users");

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
        slug: generateSlug(recipeData.title),
        authorId: new ObjectId(recipeData.authorId),
        likes: [],
        comments: [],
        createdAt: new Date(),
        updatedAt: new Date(),
    };

    // Insert the new recipe
    const result = await db.insertOne(newRecipe);

    if (result.insertedId) {
        try {
            const authorObjectId = new ObjectId(recipeData.authorId);
            console.log("Attempting to update user with ID:", authorObjectId);

            const user = await usersDb.findOne({
                _id: new ObjectId(recipeData.authorId),
            });
            console.log(user);

            const updateResult = await usersDb.updateOne(
                { _id: authorObjectId },
                { $push: { recipe: result.insertedId } }
            );

            if (updateResult.modifiedCount === 0) {
                console.error(
                    `Failed to update user with ID ${authorObjectId}. User may not exist.`
                );
            } else {
                console.log(
                    `Successfully added recipe ID ${result.insertedId} to user ${authorObjectId}.`
                );
            }
        } catch (error) {
            console.error(
                "Error while updating user's recipe array:",
                error.message
            );
        }
    }
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
    const recipes = await db.find({ authorId: new ObjectId(userId) }).toArray();
    return recipes;
}

async function getRecipesByNusaFood() {
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

async function addCommentToRecipe(slug, commentData) {
    const newComment = {
        _id: new ObjectId(),
        username: commentData.username,
        text: commentData.text,
        createdAt: new Date(),
    };

    const result = await db.updateOne(
        { slug: slug },
        { $push: { comments: newComment } }
    );

    return result;
}

async function addLikeToRecipe(slug, likeData) {
    const { userEmail } = likeData;

    const recipe = await db.findOne({ slug: slug });

    if (!recipe) {
        console.log("Recipe not found.");
        return { recipeNotFound: true };
    }

    if (recipe.likes.some((like) => like.userEmail === userEmail)) {
        return { alreadyLiked: true };
    }

    const newLike = {
        userEmail: userEmail,
        createdAt: new Date(),
    };

    const result = await db.updateOne(
        { slug: slug },
        { $push: { likes: newLike } }
    );

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
    addCommentToRecipe,
    addLikeToRecipe,
};
