const { getDB } = require("../db");
const { ObjectId } = require("mongodb");

function validateUserData(userData) {
  const errors = [];
  if (!userData.name) {
    errors.push("Name is required");
  }
  if (!userData.email) {
    errors.push("Email is required");
  } else if (!/^\S+@\S+\.\S+$/.test(userData.email)) {
    errors.push("Email is not valid");
  }
  if (!userData.password) {
    errors.push("Password is required");
  } else if (userData.password.length < 6) {
    errors.push("Password must be at least 6 characters long");
  }
  return errors;
}

async function getUserByEmail(email) {
  const db = getDB();
  return await db.collection("users").findOne({ email: email });
}

async function createUser(userData) {
  const db = getDB();
  const newUser = {
    name: userData.name,
    email: userData.email,
    password: userData.password,
    profilePicture: userData.profilePicture,
    bio: userData.bio,
    createdAt: new Date(),
    updatedAt: new Date(),
  };
  const result = await db.collection("users").insertOne(newUser);
  return result.ops[0];
}

async function getAllUsers() {
  const db = getDB();
  return await db.collection("users").find().toArray();
}

async function getUserById(id) {
  const db = getDB();
  return await db.collection("users").findOne({ _id: new ObjectId(id) });
}

async function updateUser(id, updateData) {
  const db = getDB();
  const updatedUser = await db
    .collection("users")
    .findOneAndUpdate(
      { _id: new ObjectId(id) },
      { $set: { ...updateData, updatedAt: new Date() } },
      { returnDocument: "after" }
    );
  return updatedUser.value;
}

async function deleteUser(id) {
  const db = getDB();
  const result = await db
    .collection("users")
    .deleteOne({ _id: new ObjectId(id) });
  return result.deletedCount > 0;
}

module.exports = {
  validateUserData,
  createUser,
  getAllUsers,
  getUserById,
  getUserByEmail,
  updateUser,
  deleteUser,
};
