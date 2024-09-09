const express = require("express");
const eventRouter = express.Router();
const EventController = require("../controllers/eventController");

// Define routes for event operations
eventRouter.post("/", EventController.createEventHandler);
eventRouter.get("/", EventController.getAllEventsHandler);
eventRouter.get("/:slug", EventController.getEventBySlugHandler);
eventRouter.delete("/:slug/cancel", EventController.cancelAttendanceHandler);
eventRouter.post("/:slug/register", EventController.registerAttendanceHandler);

module.exports = eventRouter;
