const User = require("../models/user");
const { verifyToken } = require("../utils/jsonwebtoken");

module.exports = async function auth(req, res, next) {
    try {
        const access_token = req.headers.authorization;

        if (!access_token) throw { name: "unAuthenticated" };

        const [type, token] = access_token.split(" ");

        if (type !== `Bearer`) throw { name: `unAuthenticated` };

        const payload = verifyToken(token);

        const user = await User.getUserByEmail(payload.email);
        if (!user) throw { name: `unAuthenticated` };

        req.user = user;

        next();
    } catch (error) {
        console.log(error);
        if (error.name === "unAuthenticated")
            return res.status(404).json({ message: "You are not authorized" });
        res.status(500).json({ message: "internal sever error" });
    }
};
