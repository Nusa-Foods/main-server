const bcrypt = require("bcryptjs");

const hashPassword = (password) => {
    const hashedPassword = bcrypt.hashSync(password, 10);
    return hashedPassword;
};

const comparePassword = (password, hashedPassword) =>
    bcrypt.compareSync(password, hashedPassword);

module.exports = {
    hashPassword,
    comparePassword,
};
