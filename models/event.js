const { database } = require("../config/mongo");
const db = database.collection("events");

// Function to generate slug from title
function generateSlug(title) {
    return title.toLowerCase().replace(/\s+/g, "-");
}

// Create a new event
async function createEvent(eventData) {
    const newEvent = {
        title: eventData.title.toUpperCase(), // Title in uppercase
        slug: generateSlug(eventData.title), // Generate slug from title
        description: eventData.description,
        imageUrl: eventData.imageUrl,
        createdAt: new Date(),
        updatedAt: new Date(),
        attendance: [], // Default empty array for attendees
        quota: eventData.quota, // Initial quota
    };

    const result = await db.insertOne(newEvent);
    return result;
}

// Get all events
async function getAllEvents() {
    const events = await db.find().toArray();
    return events;
}

// Get event by slug
async function getEventBySlug(slug) {
    const event = await db.findOne({ slug: slug });
    return event;
}

// Register attendance for an event
async function registerAttendance(slug, userData) {
    // Check if the user is already registered
    const event = await db.findOne({ slug: slug });
    if (
        event.attendance.some((attendee) => attendee.email === userData.email)
    ) {
        return { success: false, message: "User already registered" };
    }

    // Check if there is available quota
    if (event.quota <= 0) {
        return { success: false, message: "No available spots" };
    }

    // Register the user and decrease the quota
    const result = await db.updateOne(
        { slug: slug },
        {
            $push: { attendance: userData },
            $set: { updatedAt: new Date(), quota: event.quota - 1 },
        }
    );

    return { success: true, message: "Registration successful" };
}

module.exports = {
    createEvent,
    getAllEvents,
    getEventBySlug,
    registerAttendance,
};
