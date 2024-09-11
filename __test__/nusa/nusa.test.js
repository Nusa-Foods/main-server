const request = require("supertest");
const app = require("../../app");
const { database } = require("../../config/mongo");

const nusaCollection = database.collection("nusafood");
const userCollection = database.collection("users");

let token; // To store the token for authenticated requests

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

    // Add a dummy Nusa recipe for testing purposes
    await nusaCollection.insertOne({
        title: "Test Nusa Recipe",
        slug: "test-nusa-recipe",
        description: "This is a test Nusa recipe",
        imgUrl: "http://example.com/image.jpg",
        bannerUrl: "http://example.com/banner.jpg",
        category: "Test Category",
    });
});

afterAll(async () => {
    // Clean up the database and close the connection
    await nusaCollection.deleteMany({});
    await userCollection.deleteMany({});
    await database.client.close();
});

describe("Nusa Routes", () => {
    // Test POST /nusa
    it("should create a new Nusa recipe", async () => {
        const res = await request(app)
            .post("/nusa")
            .set("Cookie", `token=${token}`)
            .send({
                title: "Another Test Nusa Recipe",
                description: "This is another test Nusa recipe",
                imgUrl: "http://example.com/image2.jpg",
                bannerUrl: "http://example.com/banner2.jpg",
                category: "Another Test Category",
            });

        expect(res.status).toBe(201);
        expect(res.body.message).toBe("Recipe created successfully.");
    });

    // Test GET /nusa
    it("should retrieve all Nusa recipes", async () => {
        const res = await request(app)
            .get("/nusa")
            .set("Cookie", `token=${token}`);

        expect(res.status).toBe(200);
        expect(res.body).toBeInstanceOf(Array);
        expect(res.body.length).toBeGreaterThan(0);
    });

    // // Test GET /nusa/:slug
    it("should retrieve a Nusa recipe by slug", async () => {
        const res = await request(app)
            .get("/nusa/test-nusa-recipe")
            .set("Cookie", `token=${token}`);

        expect(res.status).toBe(200);
        expect(res.body).toHaveProperty("title", "Test Nusa Recipe");
    });

    // Test DELETE /nusa
    it("should delete a Nusa recipe by slug", async () => {
        const res = await request(app)
            .delete("/nusa/test-nusa-recipe")
            .set("Cookie", `token=${token}`);
        console.log("ini adalah status", res.body);
        expect(res.status).toBe(200);
        expect(res.body.message).toBe("Recipe deleted successfully.");
    });

    // Test DELETE /nusa with non-existent slug
    it("should return 404 for deleting a non-existent Nusa recipe", async () => {
        const res = await request(app)
            .delete("/nusa/non-existent-recipe")
            .set("Cookie", `token=${token}`);

        expect(res.status).toBe(404);
        expect(res.body.message).toBe("Recipe not found.");
    });
});
