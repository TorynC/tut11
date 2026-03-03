const request = require("supertest");
const app = require("src/index");
const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

describe("POST /users", () => {
    const testUsername = "route_test_user_" + Date.now();

    afterAll(async () => {
        await prisma.user.deleteMany({ where: { username: { startsWith: "route_test_user_" } } });
        await prisma.$disconnect();
    });

    test("It should create a new user and respond with 201", async () => {
        await request(app)
            .post("/users")
            .send({ username: testUsername, password: "securepass" })
            .then((response) => {
                expect(response.statusCode).toBe(201);
                expect(response.body).toMatchObject({ username: testUsername });
                expect(response.body.id).toBeDefined();
            });
    });
});
