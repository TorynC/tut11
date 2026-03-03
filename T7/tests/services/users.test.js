const { UserService } = require("src/services/users");
const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

describe("UserService", () => {
    const testUsername = "svc_test_user_" + Date.now();

    afterAll(async () => {
        await prisma.user.deleteMany({ where: { username: { startsWith: "svc_test_user_" } } });
        await prisma.$disconnect();
    });

    test(".create(): it should create a new user and return it", async () => {
        const result = await UserService.create({ username: testUsername, password: "pass123" });
        expect(result.conflict).toBeUndefined();
        expect(result.user).toMatchObject({ username: testUsername });
        expect(result.user.id).toBeDefined();
    });

    test(".create(): it should return { conflict: true } when username already exists", async () => {
        const result = await UserService.create({ username: testUsername, password: "pass123" });
        expect(result).toEqual({ conflict: true });
    });
});
