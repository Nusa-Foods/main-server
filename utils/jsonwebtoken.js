const jwt = require("jsonwebtoken");
const secretKey = process.env.JWT;

const generateToken = (payload) => jwt.sign(payload, secretKey);
const verifyToken = (token) => jwt.verify(token, secretKey);
const decodeToken = (token) => jwt.decode(token);

module.exports = {
    generateToken,
    verifyToken,
    decodeToken,
};
