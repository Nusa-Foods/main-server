const request = require("supertest");
const app = require("../../app");
const { database } = require("../../config/mongo");

const bookmarksCollection = database.collection("bookmarks");
const recipesCollection = database.collection("recipes");

let token;
let user;

beforeAll(async () => {
    await request(app).post("/user/register").send({
        username: "testuser",
        email: "testuser@example.com",
        password: "password123",
    });

    const loginRes = await request(app).post("/user/login").send({
        email: "testuser@example.com",
        password: "password123",
    });

    token = loginRes.body.accessToken;
    user = loginRes.body.user;

    await recipesCollection.insertOne({
        title: "Test Recipe",
        slug: "test-recipe",
        description: "This is a test recipe",
        ingredients: ["test ingredient"],
    });
});

afterAll(async () => {
    await bookmarksCollection.deleteMany({});
    await recipesCollection.deleteMany({});
    await database.client.close();
});

describe("Bookmarks API tests", () => {
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

    it("GET /bookmarks - Should retrieve all bookmarks", async () => {
        const res = await request(app)
            .get("/bookmarks/")
            .set("Cookie", `Authorization=Bearer ${token}`);

        expect(res.statusCode).toBe(200);
        expect(res.body).toHaveLength(1);
        expect(res.body[0].bookmarkedRecipes[0].slug).toBe("test-recipe");
    });

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

    it("DELETE /bookmarks - Should return error for non-existent bookmark", async () => {
        const res = await request(app)
            .delete("/bookmarks/")
            .set("Cookie", `Authorization=Bearer ${token}`)
            .send({ slug: "non-existent-recipe" });

        expect(res.statusCode).toBe(404);
        expect(res.body).toHaveProperty("message", "Bookmark not found.");
    });

    it("GET /bookmarks - Should return an empty array after bookmark removal", async () => {
        const res = await request(app)
            .get("/bookmarks/")
            .set("Cookie", `Authorization=Bearer ${token}`);

        expect(res.statusCode).toBe(200);
        expect(res.body[0].bookmarks).toHaveLength(0);
    });

    // New test to verify bookmark availability
    it("POST /bookmarks - Should not add duplicate bookmark and validate bookmark existence", async () => {
        // Add a new bookmark
        const addRes = await request(app)
            .post("/bookmarks/")
            .set("Cookie", `Authorization=Bearer ${token}`)
            .send({ slug: "test-recipe" });
        expect(addRes.statusCode).toBe(200);

        // Try to add the same bookmark again
        const duplicateRes = await request(app)
            .post("/bookmarks/")
            .set("Cookie", `Authorization=Bearer ${token}`)
            .send({ slug: "test-recipe" });

        // Check that it returns the correct error for already bookmarked
        expect(duplicateRes.statusCode).toBe(400);
        expect(duplicateRes.body).toHaveProperty(
            "message",
            "Recipe is already bookmarked."
        );
    });
});
