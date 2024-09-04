const express = require("express");
const eventRouter = express.Router();
const EventController = require("../controllers/eventController");

// Define routes for event operations
eventRouter.post("/", EventController.createEventHandler); // POST /event - Create a new event
eventRouter.get("/", EventController.getAllEventsHandler); // GET /event - Get all events
eventRouter.get("/:slug", EventController.getEventBySlugHandler); // GET /event/:slug - Get event by slug
eventRouter.post("/:slug/register", EventController.registerAttendanceHandler); // POST /event/:slug/register - Register for an event

module.exports = eventRouter;
