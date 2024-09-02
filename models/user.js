const { database } = require("../config/mongo");
const { hashPassword } = require("../utils/bcrypt");
const db = database.collection("users");

async function createUser(userData) {
    const newUser = {
        username: userData.username,
        email: userData.email,
        password: hashPassword(userData.password),
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

module.exports = { createUser, getUserByEmail };
