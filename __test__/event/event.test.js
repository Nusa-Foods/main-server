const request = require("supertest");
const app = require("../../app");
const { database } = require("../../config/mongo");

const eventsCollection = database.collection("events");
const adminCollection = database.collection("user");

let token; // To store the admin token for authenticated requests

beforeAll(async () => {
    // Register and login as admin to get the token
    await request(app).post("/user/register").send({
        username: "admin-test",
        email: "adminuser@example.com",
        password: "password123",
    });

    const loginRes = await request(app).post("/user/login").send({
        email: "adminuser@example.com",
        password: "password123",
    });

    token = loginRes.body.accessToken; // Save the token for authenticated requests
});

afterAll(async () => {
    // Clean up the database and close the connection
    await eventsCollection.deleteMany({});
    await adminCollection.deleteMany({});
    await database.client.close();
});

describe("Event API tests", () => {
    // Test event creation
    it("POST /event - Should create a new event", async () => {
        const res = await request(app)
            .post("/event")
            .set("Cookie", `Authorization=Bearer ${token}`)
            .send({
                title: "Test Event",
                description: "This is a test event",
                imageUrl: "http://example.com/image.jpg",
                date: new Date().toISOString(),
                location: "Test Location",
                locUrl: "http://example.com/location",
                quota: 1,
            });

        expect(res.statusCode).toBe(201);
        expect(res.body).toHaveProperty(
            "message",
            "Event created successfully"
        );
    });

    // Test retrieving all events
    it("GET /event - Should retrieve all events", async () => {
        const res = await request(app)
            .get("/event")
            .set("Cookie", `Authorization=Bearer ${token}`);

        expect(res.statusCode).toBe(200);
        expect(Array.isArray(res.body)).toBe(true);
    });

    // Test retrieving an event by slug
    it("GET /event/:slug - Should retrieve an event by slug", async () => {
        const slug = "test-event"; // Adjust based on your event slug generation
        const res = await request(app)
            .get(`/event/${slug}`)
            .set("Cookie", `Authorization=Bearer ${token}`);

        expect(res.statusCode).toBe(200);
        expect(res.body).toHaveProperty("title", "Test Event".toUpperCase());
    });

    // Test event registration (assuming the user is already registered)
    it("POST /event/:slug/register - Should register for an event", async () => {
        const slug = "test-event"; // Adjust based on your event slug generation
        const res = await request(app)
            .post(`/event/${slug}/register`)
            .set("Cookie", `Authorization=Bearer ${token}`)
            .send({
                name: "Test User",
                email: "testuser@example.com",
            });
        expect(res.statusCode).toBe(201);
        expect(res.body).toHaveProperty("message");
        expect(res.body.message).toBe("Registration successful");
    });

    // Test event registration (assuming the user is already registered)
    it("POST /event/:slug/register - Should cant double register for an event", async () => {
        const slug = "test-event"; // Adjust based on your event slug generation
        const res = await request(app)
            .post(`/event/${slug}/register`)
            .set("Cookie", `Authorization=Bearer ${token}`)
            .send({
                name: "Test User",
                email: "testuser@example.com",
            });
        expect(res.statusCode).toBe(400);
        expect(res.body).toHaveProperty("message");
        expect(res.body).toHaveProperty("message");
        expect(res.body.message).toBe("No available spots");
    });

    // Test event cancellation
    it("DELETE /event/:slug/cancel - Should cancel event registration", async () => {
        const slug = "test-event"; // Adjust based on your event slug generation
        const res = await request(app)
            .delete(`/event/${slug}/cancel`)
            .set("Cookie", `Authorization=Bearer ${token}`)
            .send({
                name: "Test User",
                email: "testuser@example.com",
            });

        expect(res.statusCode).toBe(200);
        expect(res.body).toHaveProperty("message", "Cancellation successful");
    });
});
