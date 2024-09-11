const request = require("supertest");
const app = require("../../app"); // Adjust the path to your app file

describe("AI API tests", () => {
    let validIngredients = ["tomato", "onion", "garlic"];

    // Test recipe generation with valid ingredients
    it("POST /ai/recipe - Should generate a recipe with valid ingredients", async () => {
        const res = await request(app)
            .post("/ai/recipe")
            .send({ ingredients: validIngredients })
            .expect("Content-Type", /json/)
            .expect(200);
        expect(res.body).toHaveProperty("response");
        expect(res.body.response).toHaveProperty("title");
        expect(res.body.response).toHaveProperty("description");
    });

    // Test recipe generation for random recipe
    it("POST /ai/recipe - Should generate a recipe with valid ingredients", async () => {
        const res = await request(app)
            .post("/ai/recipe")
            .expect("Content-Type", /json/)
            .expect(200);
        expect(res.body).toHaveProperty("response");
        expect(res.body.response).toHaveProperty("title");
        expect(res.body.response).toHaveProperty("description");
    });
});
