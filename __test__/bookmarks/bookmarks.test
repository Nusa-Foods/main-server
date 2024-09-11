const request = require("supertest");
const app = require("../../app");
const { database } = require("../../config/mongo");

const bookmarksCollection = database.collection("bookmarks");
const recipesCollection = database.collection("recipes");

let token; // To store the token for authenticated requests
let user; // To store user details for setting ownerEmail in bookmarks

beforeAll(async () => {
    // Register a new user before running the tests
    await request(app).post("/user/register").send({
        username: "testuser",
        email: "testuser@example.com",
        password: "password123",
    });

    // Login to retrieve the token
    const loginRes = await request(app).post("/user/login").send({
        email: "testuser@example.com",
        password: "password123",
    });

    token = loginRes.body.accessToken; // Save the token
    user = loginRes.body.user; // Save user data if you need it

    // Add a dummy recipe for testing purposes
    await recipesCollection.insertOne({
        title: "Test Recipe",
        slug: "test-recipe",
        description: "This is a test recipe",
        ingredients: ["test ingredient"],
    });
});

afterAll(async () => {
    // Clean up the database and close the connection
    await bookmarksCollection.deleteMany({});
    await recipesCollection.deleteMany({});
    await database.client.close();
});

describe("Bookmarks API tests", () => {
    // Test adding a bookmark
    it("POST /bookmarks - Should add a bookmark", async () => {
        const res = await request(app)
            .post("/bookmarks/")
            .set("Cookie", `Authorization=Bearer ${token}`)
            .send({ slug: "test-recipe" });
        expect(res.statusCode).toBe(200);
        expect(res.body).toHaveProperty(
            "message",
            "Bookmark added successfully."
        );
    });

    // Test adding a duplicate bookmark
    it("POST /bookmarks - Should return error for already bookmarked recipe", async () => {
        const res = await request(app)
            .post("/bookmarks/")
            .set("Cookie", `Authorization=Bearer ${token}`)
            .send({ slug: "test-recipe" });

        expect(res.statusCode).toBe(400);
        expect(res.body).toHaveProperty(
            "message",
            "Recipe is already bookmarked."
        );
    });

    // Test getting bookmarks
    it("GET /bookmarks - Should retrieve all bookmarks", async () => {
        const res = await request(app)
            .get("/bookmarks/")
            .set("Cookie", `Authorization=Bearer ${token}`);

        expect(res.statusCode).toBe(200);
        expect(res.body).toHaveLength(1); // There should be one bookmark
        expect(res.body[0].bookmarkedRecipes[0].slug).toBe("test-recipe");
    });

    // Test removing a bookmark
    it("DELETE /bookmarks - Should remove a bookmark", async () => {
        const res = await request(app)
            .delete("/bookmarks/")
            .set("Cookie", `Authorization=Bearer ${token}`)
            .send({ slug: "test-recipe" });

        expect(res.statusCode).toBe(200);
        expect(res.body).toHaveProperty(
            "message",
            "Bookmark removed successfully."
        );
    });

    // Test removing a non-existent bookmark
    it("DELETE /bookmarks - Should return error for non-existent bookmark", async () => {
        const res = await request(app)
            .delete("/bookmarks/")
            .set("Cookie", `Authorization=Bearer ${token}`)
            .send({ slug: "non-existent-recipe" });

        expect(res.statusCode).toBe(404);
        expect(res.body).toHaveProperty("message", "Bookmark not found.");
    });

    // Test getting bookmarks after removal
    it("GET /bookmarks - Should return an empty array after bookmark removal", async () => {
        const res = await request(app)
            .get("/bookmarks/")
            .set("Cookie", `Authorization=Bearer ${token}`);

        expect(res.statusCode).toBe(200);
        expect(res.body[0].bookmarks).toHaveLength(0); // No bookmarks should be found
    });
});
