const userModel = require("../models/user");
const { validateUserData } = require("../utils/validation");
const { comparePassword } = require("../utils/bcrypt");
const { generateToken } = require("../utils/jsonwebtoken");

const createUser = async (req, res) => {
    const { username, email, password } = req.body;

    const errors = validateUserData({ username, email, password });
    if (errors.length > 0)
        return res.status(400).json({ message: "Validation failed", errors });

    try {
        userModel.createUser({ username, email, password });
        res.status(201).json({ message: "user created" });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

const login = async (req, res) => {
    try {
        const { email, password } = req.body;

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
        if (error.message === "unAuthenticated")
            return res
                .status(404)
                .json({ message: "Invalid Email or Password" });
        res.status(500).json({ message: "internal sever error" });
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

const UserController = { createUser, login, logout };
module.exports = UserController;
