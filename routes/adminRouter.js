const express = require("express");
const adminRouter = express.Router();
const AdController = require("../controllers/adminController");
const nusaController = require("../controllers/nusaController");
const eventController = require("../controllers/eventController");

adminRouter.post("/login", AdController.login);
adminRouter.post("/register", AdController.register);
adminRouter.get("/nusa", nusaController.getAllNusaHandler);
adminRouter.post("/nusa", nusaController.createNusaHandler);
adminRouter.get("/event", eventController.getAllEventsHandler);
adminRouter.post("/event", eventController.createEventHandler);

module.exports = adminRouter;
