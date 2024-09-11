const request = require("supertest");
const app = require("../../app");
const { database } = require("../../config/mongo");

const bookmarksCollection = database.collection("bookmarks");
const recipesCollection = database.collection("recipes");
const userDb = database.collection("users");

let token; // To store the token for authenticated requests
let user; // To store user details for setting ownerEmail in bookmarks
let cookie; // To store the authentication cookie

beforeAll(async () => {
    // Register a new user before running the tests
    await request(app).post("/user/register").send({
        username: "testuser",
        email: "testuser@example.com",
        password: "password123",
    });

    // Login to retrieve the token and set the cookie
    const loginRes = await request(app).post("/user/login").send({
        email: "testuser@example.com",
        password: "password123",
    });

    token = loginRes.body.accessToken; // Save the token
    user = loginRes.body.user; // Save user data if needed
    cookie = loginRes.headers["set-cookie"]; // Capture the authentication cookie

    // Add a dummy recipe for testing purposes
    await recipesCollection.insertOne({
        title: "Test Recipe",
        slug: "test-recipe",
        description: "This is a test recipe",
        ingredients: ["test ingredient"],
        likes: [],
        comments: [],
    });
});

afterAll(async () => {
    // Clean up the database and close the connection
    await bookmarksCollection.deleteMany({});
    await recipesCollection.deleteMany({});
    await userDb.deleteMany({});
    await database.client.close();
});

describe("Recipe Tests", () => {
    it("should retrieve all recipes", async () => {
        const res = await request(app)
            .get("/recipe")
            .set("Cookie", cookie) // Include the cookie for authentication
            .expect(200);

        expect(res.body).toBeInstanceOf(Array);
        expect(res.body[0].title).toBe("Test Recipe");
    });

    it("should retrieve all nusafood recipes", async () => {
        const res = await request(app)
            .get("/recipe/nusafood")
            .set("Cookie", cookie) // Include the cookie for authentication
            .expect(200);

        expect(res.body).toBeInstanceOf(Array);
    });

    it("should retrieve a recipe by userId", async () => {
        const user = await database
            .collection("users")
            .findOne({ email: "testuser@example.com" });
        const userId = String(user._id);
        const res = await request(app)
            .get(`/recipe/byId/${userId}`)
            .set("Cookie", cookie) // Include the cookie for authentication
            .expect(200);
        expect(res.body).toBeInstanceOf(Array);
    });

    it("should retrieve a recipe by slug", async () => {
        const res = await request(app)
            .get("/recipe/test-recipe")
            .set("Cookie", cookie) // Include the cookie for authentication
            .expect(200);

        expect(res.body).toHaveProperty("title", "Test Recipe");
        expect(res.body).toHaveProperty("slug", "test-recipe");
    });

    it("should create a new recipe", async () => {
        const newRecipe = {
            title: "New Test Recipe",
            description: "A description for the new test recipe",
            imgUrl: "http://example.com/image.jpg",
            bannerUrl: "http://example.com/banner.jpg",
            guide: "Step by step guide",
        };

        const res = await request(app)
            .post("/recipe")
            .set("Cookie", cookie) // Include the cookie for authentication
            .send(newRecipe)
            .expect(201);

        expect(res.body).toHaveProperty(
            "message",
            "Recipe created successfully."
        );
    });

    it("should fail to create a recipe without a title", async () => {
        const invalidRecipe = {
            description: "A recipe without a title",
            imgUrl: "http://example.com/image.jpg",
            bannerUrl: "http://example.com/banner.jpg",
            guide: "Step by step guide",
        };

        const res = await request(app)
            .post("/recipe")
            .set("Cookie", cookie) // Include the cookie for authentication
            .send(invalidRecipe)
            .expect(400);

        expect(res.body).toHaveProperty("message", "Recipe title is required.");
    });

    it("should update a recipe", async () => {
        const updatedRecipe = {
            title: "Updated Test Recipe",
            description: "Updated description for the test recipe",
            imgUrl: "http://example.com/updated-image.jpg",
            bannerUrl: "http://example.com/updated-banner.jpg",
        };

        const res = await request(app)
            .put("/recipe/test-recipe")
            .set("Cookie", cookie) // Include the cookie for authentication
            .send(updatedRecipe)
            .expect(200);

        expect(res.body).toHaveProperty(
            "message",
            "Recipe updated successfully."
        );
    });

    it("should add comment", async () => {
        const newRecipe = {
            text: "halo bang",
        };

        const res = await request(app)
            .post("/recipe/test-recipe/comments")
            .set("Cookie", cookie) // Include the cookie for authentication
            .send(newRecipe)
            .expect(200);
        expect(res.body).toHaveProperty(
            "message",
            "Comment added successfully."
        );
    });

    it("should add like", async () => {
        const newRecipe = {
            text: "halo bang",
        };

        const res = await request(app)
            .post("/recipe/test-recipe/like")
            .set("Cookie", cookie) // Include the cookie for authentication
            .send(newRecipe)
            .expect(200);
        expect(res.body).toHaveProperty(
            "message",
            "Recipe liked successfully."
        );
    });

    it("should delete a recipe", async () => {
        const res = await request(app)
            .delete("/recipe/test-recipe")
            .set("Cookie", cookie) // Include the cookie for authentication
            .expect(200);

        expect(res.body).toHaveProperty(
            "message",
            "Recipe deleted successfully."
        );
    });
});
