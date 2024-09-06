const { database } = require("../config/mongo");
const { hashPassword } = require("../utils/bcrypt");
const db = database.collection("users");

async function createUser(userData) {
    const newUser = {
        username: userData.username,
        email: userData.email,
        password: hashPassword(userData.password),
        imageUrl: userData.imageUrl,
        event: [],
        recipe: [],
        createdAt: new Date(),
        updatedAt: new Date(),
    };
    const result = await db.insertOne(newUser);
    return result;
}

async function getUserByEmail(email) {
    const user = await db.findOne({ email: email });
    return user;
}

async function getUserById(id) {
    try {
        const users = await db
            .aggregate([
                { $match: { _id: id } },
                {
                    $lookup: {
                        from: "recipes",
                        localField: "_id",
                        foreignField: "authorId",
                        as: "user_recipes",
                    },
                },
            ])
            .toArray();

        return users.length > 0 ? users[0] : null;
    } catch (error) {
        console.error("Error while retrieving user by ID:", error.message);
        throw error;
    }
}

module.exports = { createUser, getUserByEmail, getUserById };
