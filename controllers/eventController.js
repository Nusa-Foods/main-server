const {
    createEvent,
    getAllEvents,
    getEventBySlug,
    registerAttendance,
    cancelAttendance,
} = require("../models/event");

// Create a new event
async function createEventHandler(req, res) {
    try {
        const eventData = {
            title: req.body.title,
            description: req.body.description,
            imageUrl: req.body.imageUrl,
            date: req.body.date,
            location: req.body.location,
            locUrl: req.body.locUrl,
            quota: req.body.quota,
        };

        const result = await createEvent(eventData);
        res.status(201).json({
            message: "Event created successfully",
            eventId: result.insertedId,
        });
    } catch (error) {
        res.status(500).json({
            message: "Failed to create event",
            error: error.message,
        });
    }
}

// Get all events
async function getAllEventsHandler(req, res) {
    try {
        const events = await getAllEvents();
        res.status(200).json(events);
    } catch (error) {
        res.status(500).json({
            message: "Failed to retrieve events",
            error: error.message,
        });
    }
}

// Get event by slug
async function getEventBySlugHandler(req, res) {
    try {
        const slug = req.params.slug;
        const event = await getEventBySlug(slug);

        if (event) {
            res.status(200).json(event);
        } else {
            res.status(404).json({ message: "Event not found" });
        }
    } catch (error) {
        res.status(500).json({
            message: "Failed to get event",
            error: error.message,
        });
    }
}

// Register for an event
async function registerAttendanceHandler(req, res) {
    try {
        const slug = req.params.slug;
        const userData = {
            name: req.user.name,
            email: req.user.email,
            registeredAt: new Date(),
        };

        const result = await registerAttendance(slug, userData);

        if (result.success) {
            res.status(201).json({ message: result.message });
        } else {
            res.status(400).json({ message: result.message });
        }
    } catch (error) {
        res.status(500).json({
            message: "Failed to register for event",
            error: error.message,
        });
    }
}

async function cancelAttendanceHandler(req, res) {
    try {
        const slug = req.params.slug;
        const userData = {
            name: req.user.name,
            email: req.user.email,
        };

        const result = await cancelAttendance(slug, userData);

        if (result.success) {
            res.status(200).json({ message: result.message });
        } else {
            res.status(400).json({ message: result.message });
        }
    } catch (error) {
        res.status(500).json({
            message: "Failed to cancel attendance",
            error: error.message,
        });
    }
}

module.exports = {
    createEventHandler,
    getAllEventsHandler,
    getEventBySlugHandler,
    registerAttendanceHandler,
    cancelAttendanceHandler,
};
