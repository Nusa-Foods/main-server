function validateUserData(userData) {
    const errors = [];
    if (!userData.username) {
        errors.push("Username is required");
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

module.exports = { validateUserData };
