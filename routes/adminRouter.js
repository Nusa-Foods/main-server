const express = require("express");
const adminRouter = express.Router();
const AdController = require("../controllers/adminController");

adminRouter.post("/login", AdController.login);
adminRouter.post("/register", AdController.register);

module.exports = adminRouter;
