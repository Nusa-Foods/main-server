// src/controllers/userController.js
const { createUser, getUserByEmail } = require("../models/admin");
const { comparePassword } = require("../utils/bcrypt");
const { generateToken } = require("../utils/jsonwebtoken");

const register = async (req, res) => {
    const { email, password } = req.body;

    try {
        // Check if the email already exists
        const emailExist = await getUserByEmail(email);

        if (emailExist) {
            return res.status(400).json({ message: "Email Already Exists" });
        }

        await createUser({ email, password });

        res.status(201).json({ message: "User Successfully Created" });
    } catch (err) {
        res.status(500).json({
            message: "Internal Server Error",
            error: err.message,
        });
    }
};

const login = async (req, res) => {
    try {
        const { email, password } = req.body;

        const user = await getUserByEmail(email);

        if (!user) {
            return res
                .status(404)
                .json({ message: "Invalid Email or Password" });
        }

        const isValidPassword = comparePassword(password, user.password);

        if (!isValidPassword) {
            return res
                .status(404)
                .json({ message: "Invalid Email or Password" });
        }

        const token = generateToken({
            email: user.email,
            _id: String(user._id),
        });
        res.status(200).json({ accessToken: token });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            message: "Internal Server Error",
            error: error.message,
        });
    }
};

module.exports = { register, login };
