const request = require("supertest");
const app = require("../../app");
const { database } = require("../../config/mongo");

const db = database.collection("admin");

afterAll(async () => {
    // Clean up the database and close the connection
    await db.deleteMany({});
    await db.client.close();
});

describe("Admin API tests", () => {
    let token;

    // Test admin registration
    it("POST /admin/register - Should create a new admin", async () => {
        const res = await request(app).post("/admin/register").send({
            email: "adminuser@example.com",
            password: "password123",
        });

        expect(res.statusCode).toBe(201);
        expect(res.body).toHaveProperty("message", "User Successfully Created");
    });

    // Test registration with duplicate email
    it("POST /admin/register - Should return error for duplicate email", async () => {
        const res = await request(app).post("/admin/register").send({
            email: "adminuser@example.com", // Same email as previous test
            password: "password123",
        });

        expect(res.statusCode).toBe(400);
        expect(res.body).toHaveProperty("message", "Email Already Exists");
    });

    // Test admin login
    it("POST /admin/login - Should login admin and return token", async () => {
        const res = await request(app).post("/admin/login").send({
            email: "adminuser@example.com",
            password: "password123",
        });

        expect(res.statusCode).toBe(200);
        expect(res.body).toHaveProperty("accessToken");
        token = res.body.accessToken; // Save token for future use
    });

    // Test login with wrong password
    it("POST /admin/login - Should return error for wrong password", async () => {
        const res = await request(app).post("/admin/login").send({
            email: "adminuser@example.com",
            password: "wrongpassword",
        });

        expect(res.statusCode).toBe(404);
        expect(res.body).toHaveProperty("message", "Invalid Email or Password");
    });

    // Test login with non-existent email
    it("POST /admin/login - Should return error for non-existent email", async () => {
        const res = await request(app).post("/admin/login").send({
            email: "nonexistentadmin@example.com",
            password: "password123",
        });

        expect(res.statusCode).toBe(404);
        expect(res.body).toHaveProperty("message", "Invalid Email or Password");
    });
});
