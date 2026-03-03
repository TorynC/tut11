const request = require("supertest");
const app = require("src/index");

describe("GET /hello", () => {
    test('It should respond with "Hello World!"', async () => {
        await request(app)
            .get("/hello")
            .then((response) => {
                expect(response.statusCode).toBe(200);
                expect(response.text).toBe("Hello World!");
            });
    });
});