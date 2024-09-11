const userModel = require("../models/user");
const { validateUserData } = require("../utils/validation");
const { comparePassword } = require("../utils/bcrypt");
const { generateToken } = require("../utils/jsonwebtoken");
const { ObjectId } = require("mongodb");
const { OAuth2Client } = require("google-auth-library");
const { sendMail } = require("../utils/email");
const client = new OAuth2Client();

const createUser = async (req, res) => {
    const { username, email, password } = req.body;

    const emailExist = await userModel.getUserByEmail(email);

    if (emailExist)
        return res.status(400).json({ message: "Email Already Exist" });

    const errors = validateUserData({ username, email, password });

    if (errors.length > 0)
        return res.status(400).json({ message: errors, errors });

    try {
        userModel.createUser({ username, email, password });
        sendMail(email);
        res.status(201).json({ message: "Successfully Created User" });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

const login = async (req, res) => {
    try {
        const { email, password } = req.body;
        console.log(req.body);
        const user = await userModel.getUserByEmail(email);

        if (!user) throw { message: "unAuthenticated" };

        const isValidPassword = comparePassword(password, user.password);

        if (!isValidPassword) throw { message: "unAuthenticated" };

        const token = generateToken({
            email: user.email,
            _id: String(user._id),
        });

        res.status(200)
            .cookie("Authorization", `Bearer ${token}`)
            .json({ accessToken: token });
    } catch (error) {
        console.log(error);
        if (error.message === "unAuthenticated")
            return res
                .status(404)
                .json({ message: "Invalid Email or Password" });
        res.status(500).json({ message: "internal sever error" });
    }
};

const googleLogin = async (req, res, next) => {
    const { googleToken } = req.body;
    try {
        const ticket = await client.verifyIdToken({
            idToken: googleToken,
            audience: process.env.GOOGLE_AUDIENCE,
        });
        const { email, name: username } = ticket.getPayload();
        const password = Math.random().toString();

        let user = await userModel.getUserByEmail(email);
        if (!user) user = userModel.createUser({ username, email, password });
        const accessToken = generateToken({
            email: user.email,
            _id: String(user._id),
        });
        res.status(200).json({
            accessToken,
        });
    } catch (error) {
        next(error);
    }
};

const logout = async (req, res) => {
    try {
        res.cookie("Authorization", "", {
            setTimeout: new Date(),
        }).json({ message: "Logout Success" });
    } catch (error) {
        res.status(500).json({ message: "internal server error" });
    }
};

const getUserByIdHandler = async (req, res) => {
    const { id } = req.params;

    try {
        const user = await userModel.getUserById(new ObjectId(id));

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        res.status(200).json(user);
    } catch (error) {
        res.status(500).json({
            message: "Failed to retrieve user",
            error: error.message,
        });
    }
};

const updateUser = async (req, res) => {
    const email = req.user.email;
    const { username, bio, imageUrl } = req.body;

    if (!username && !bio && !imageUrl) {
        return res.status(400).json({
            message:
                "At least one field (username, bio, imageUrl) must be provided for update.",
        });
    }

    const updateData = {};
    if (username) updateData.username = username;
    if (bio) updateData.bio = bio;
    if (imageUrl) updateData.imageUrl = imageUrl;

    try {
        const result = await userModel.updateUserByEmail(email, updateData);

        res.status(200).json({ message: "User updated successfully" });
    } catch (error) {
        res.status(500).json({
            message: "Failed to update user",
            error: error.message,
        });
    }
};

module.exports = {
    createUser,
    login,
    googleLogin,
    logout,
    getUserByIdHandler,
    updateUser,
};
