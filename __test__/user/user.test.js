const request = require("supertest");
const app = require("../../app");
const { database } = require("../../config/mongo");

const db = database.collection("users");

beforeAll(async () => {
    await db.deleteMany({});
});

afterAll(async () => {
    // Clean up the database and close the connection
    await db.deleteMany({});
    await db.client.close();
});

describe("User API tests", () => {
    let token;

    // Test registration with missing fields
    it("POST /register - Should return error if username is missing", async () => {
        const res = await request(app).post("/user/register").send({
            email: "testuser@example.com",
            password: "password123",
        });

        expect(res.statusCode).toBe(400);
        expect(res.body).toHaveProperty("message", ["Username is required"]);
    });

    it("POST /register - Should return error if email is missing", async () => {
        const res = await request(app).post("/user/register").send({
            username: "testuser",
            password: "password123",
        });

        expect(res.statusCode).toBe(400);
        expect(res.body).toHaveProperty("message", ["Email is required"]);
    });

    it("POST /register - Should return error if email is invalid", async () => {
        const res = await request(app).post("/user/register").send({
            username: "testuser",
            email: "invalid-email",
            password: "password123",
        });

        expect(res.statusCode).toBe(400);
        expect(res.body).toHaveProperty("message", ["Email is not valid"]);
    });

    it("POST /register - Should return error if password is missing", async () => {
        const res = await request(app).post("/user/register").send({
            username: "testuser",
            email: "testuser@example.com",
        });

        expect(res.statusCode).toBe(400);
        expect(res.body).toHaveProperty("message", ["Password is required"]);
    });

    it("POST /register - Should return error if password is too short", async () => {
        const res = await request(app).post("/user/register").send({
            username: "testuser",
            email: "testuser@example.com",
            password: "short",
        });

        expect(res.statusCode).toBe(400);
        expect(res.body).toHaveProperty("message", [
            "Password must be at least 6 characters long",
        ]);
    });

    // Test registration
    it("POST /register - Should create a new user", async () => {
        const res = await request(app).post("/user/register").send({
            username: "testuser",
            email: "testuser@example.com",
            password: "password123",
        });

        console.log("this is response", res.body);
        expect(res.statusCode).toBe(201);
        expect(res.body).toHaveProperty("message", "Successfully Created User");
    });

    // Test registration with duplicate email
    it("POST /register - Should return error for duplicate email", async () => {
        const res = await request(app).post("/user/register").send({
            username: "duplicateuser",
            email: "testuser@example.com", // Same email as previous test
            password: "password123",
        });

        expect(res.statusCode).toBe(400);
        expect(res.body).toHaveProperty("message", "Email Already Exist");
    });

    // Test login
    it("POST /login - Should login user and return token", async () => {
        const res = await request(app).post("/user/login").send({
            email: "testuser@example.com",
            password: "password123",
        });

        expect(res.statusCode).toBe(200);
        expect(res.body).toHaveProperty("accessToken");
        token = res.body.accessToken; // Save token for future use
    });

    // Test login with wrong password
    it("POST /login - Should return error for wrong password", async () => {
        const res = await request(app).post("/user/login").send({
            email: "testuser@example.com",
            password: "wrongpassword",
        });

        expect(res.statusCode).toBe(404);
        expect(res.body).toHaveProperty("message", "Invalid Email or Password");
    });

    // Test fetching user by ID
    it("GET /:id - Should fetch user by ID", async () => {
        const user = await db.findOne({ email: "testuser@example.com" });
        const res = await request(app).get(`/user/${user._id}`);

        expect(res.statusCode).toBe(200);
        expect(res.body).toHaveProperty("username", "testuser");
    });

    // Test fetching user by ID (not found)
    it("GET /:id - Should fetch user by ID", async () => {
        const res = await request(app).get(`/user/9`);

        expect(res.statusCode).toBe(500);
        expect(res.body).toHaveProperty("message", "Failed to retrieve user");
    });

    // Test updating user (with authentication)
    it("PUT /update - Should update user profile", async () => {
        const res = await request(app)
            .put("/user/update")
            .set("Cookie", `Authorization=Bearer ${token}`)
            .send({
                username: "updateduser",
                bio: "This is my updated bio.",
            });
        expect(res.statusCode).toBe(200);
        expect(res.body).toHaveProperty("message", "User updated successfully");

        // Verify the changes
        const updatedUser = await db.findOne({ email: "testuser@example.com" });
        expect(updatedUser.username).toBe("updateduser");
        expect(updatedUser.bio).toBe("This is my updated bio.");
    });

    // Test updating user (with authentication)
    it("PUT /update - Should update user profile", async () => {
        const res = await request(app)
            .put("/user/update")
            .set("Cookie", `Authorization=Bearer ${token}`)
            .send({});
        expect(res.statusCode).toBe(400);
        expect(res.body).toHaveProperty(
            "message",
            "At least one field (username, bio, imageUrl) must be provided for update."
        );
    });

    // Test logout
    it("POST /logout - Should log out user", async () => {
        const res = await request(app)
            .post("/user/logout")
            .set("Authorization", `Bearer ${token}`);

        expect(res.statusCode).toBe(200);
        expect(res.body).toHaveProperty("message", "Logout Success");
    });
});
