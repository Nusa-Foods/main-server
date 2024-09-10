const { database } = require("../config/mongo");
const db = database.collection("events");
const usersDb = database.collection("users");

// Function to generate slug from title
function generateSlug(title) {
    return title.toLowerCase().replace(/\s+/g, "-");
}

async function createEvent(eventData) {
    const newEvent = {
        title: eventData.title.toUpperCase(),
        slug: generateSlug(eventData.title),
        description: eventData.description,
        imageUrl: eventData.imageUrl,
        quota: eventData.quota,
        date: eventData.date,
        location: eventData.location,
        locUrl: eventData.locUrl,
        attendance: [],
        createdAt: new Date(),
        updatedAt: new Date(),
    };

    const result = await db.insertOne(newEvent);
    return result;
}

// Get all events
async function getAllEvents() {
    const events = await db.find().toArray();
    return events;
}

async function getEventBySlug(slug) {
    const event = await db.findOne({ slug: slug });
    return event;
}

async function registerAttendance(slug, userData) {
    const event = await db.findOne({ slug: slug });

    if (
        event.attendance.some((attendee) => attendee.email === userData.email)
    ) {
        return { success: false, message: "User already registered" };
    }

    if (event.quota <= 0) {
        return { success: false, message: "No available spots" };
    }

    const result = await db.updateOne(
        { slug: slug },
        {
            $push: { attendance: userData },
            $set: { updatedAt: new Date(), quota: event.quota - 1 },
        }
    );

    if (result.modifiedCount > 0) {
        const userUpdateResult = await usersDb.updateOne(
            { email: userData.email },
            { $push: { event: event._id } }
        );

        if (userUpdateResult.modifiedCount > 0) {
            return { success: true, message: "Registration successful" };
        } else {
            return {
                success: false,
                message: "Failed to update user's event list",
            };
        }
    }
    return { success: false, message: "Failed to register for the event" };
}

async function cancelAttendance(slug, userData) {
    // Find the event by its slug
    const event = await db.findOne({ slug: slug });

    if (!event) {
        return { success: false, message: "Event not found" };
    }

    // Check if the user is registered for the event
    const isUserRegistered = event.attendance.some(
        (attendee) => attendee.email === userData.email
    );

    if (!isUserRegistered) {
        return {
            success: false,
            message: "User is not registered for this event",
        };
    }

    const result = await db.updateOne(
        { slug: slug },
        {
            $pull: { attendance: { email: userData.email } },
            $set: { updatedAt: new Date(), quota: event.quota + 1 },
        }
    );

    if (result.modifiedCount > 0) {
        // Remove the event reference from the user's list of events
        const userUpdateResult = await usersDb.updateOne(
            { email: userData.email },
            { $pull: { event: event._id } }
        );

        if (userUpdateResult.modifiedCount > 0) {
            return { success: true, message: "Cancellation successful" };
        } else {
            return {
                success: false,
                message: "Failed to update user's event list",
            };
        }
    }
    return {
        success: false,
        message: "Failed to cancel attendance for the event",
    };
}
module.exports = {
    createEvent,
    getAllEvents,
    getEventBySlug,
    registerAttendance,
    cancelAttendance,
};
