const request = require("supertest");
const app = require("src/index");
const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

const TEST_USERNAME = "testuser1" + Date.now();
const TEST_PASSWORD = "password123";

function basicAuthHeader(username, password) {
    return "Basic " + Buffer.from(`${username}:${password}`).toString("base64");
}

let testUser;
let testNote;

beforeAll(async () => {
    testUser = await prisma.user.create({
        data: { username: TEST_USERNAME, password: TEST_PASSWORD },
    });

    testNote = await prisma.note.create({
        data: {
            title: "Public Note",
            description: "Visible to all",
            completed: false,
            public: true,
            userId: testUser.id,
        },
    });
});

afterAll(async () => {
    await prisma.note.deleteMany({ where: { userId: testUser.id } });
    await prisma.user.delete({ where: { id: testUser.id } });
    await prisma.$disconnect();
});

describe("GET /notes", () => {
    test("Should respond with an array of public notes", async () => {
        await request(app)
            .get("/notes")
            .then((response) => {
                expect(Array.isArray(response.body)).toBe(true);
                expect(response.statusCode).toBe(200);
                
                const found = response.body.find((n) => n.id === testNote.id);
                expect(found).toBeDefined();
                expect(found.public).toBe(true);
            });
    });
});

describe("POST /notes", () => {
    test("Should create a note and respond with 201", async () => {
        await request(app)
            .post("/notes")
            .set("Authorization", basicAuthHeader(TEST_USERNAME, TEST_PASSWORD))
            .send({
                title: "New Note",
                description: "test",
                completed: false,
                public: true,
            })
            .then((response) => {
                expect(response.statusCode).toBe(201);
                expect(response.body).toMatchObject({
                    title: "New Note",
                    description: "test",
                    completed: false,
                    public: true,
                    userId: testUser.id,
                });
                expect(response.body.id).toBeDefined();
            });
    });
});

describe("GET /notes/:noteId", () => {
    test("It should return the note owned by the authenticated user", async () => {
        await request(app)
            .get(`/notes/${testNote.id}`)
            .set("Authorization", basicAuthHeader(TEST_USERNAME, TEST_PASSWORD))
            .then((response) => {
                expect(response.statusCode).toBe(200);
                expect(response.body).toMatchObject({
                    id: testNote.id,
                    title: testNote.title,
                    userId: testUser.id,
                });
            });
    });
});

describe("PATCH /notes/:noteId", () => {
    test("Should update the note and respond with the updated note", async () => {
        await request(app)
            .patch(`/notes/${testNote.id}`)
            .set("Authorization", basicAuthHeader(TEST_USERNAME, TEST_PASSWORD))
            .send({ title: "Updated Title" })
            .then((response) => {
                expect(response.statusCode).toBe(200);
                expect(response.body).toMatchObject({
                    id: testNote.id,
                    title: "Updated Title",
                    userId: testUser.id,
                });
            });
    });

    test("400 should be returned when the request body has no valid fields", async () => {
        await request(app)
            .patch(`/notes/${testNote.id}`)
            .set("Authorization", basicAuthHeader(TEST_USERNAME, TEST_PASSWORD))
            .send({})
            .then((response) => {
                expect(response.statusCode).toBe(400);
                expect(response.body).toMatchObject({ message: "Invalid payload" });
            });
    });

    test("401 should be returned when invalid credentials are provided", async () => {
        await request(app)
            .patch(`/notes/${testNote.id}`)
            .set("Authorization", basicAuthHeader(TEST_USERNAME, "wrongpassword"))
            .send({ title: "Should Fail" })
            .then((response) => {
                expect(response.statusCode).toBe(401);
            });
    });

    test("403 should be returned when the note belongs to a different user", async () => {
        const otherUser = await prisma.user.create({
            data: { username: "otherUser" + Date.now(), password: "pass" },
        });
        const otherNote = await prisma.note.create({
            data: {
                title: "Other Note",
                description: "other",
                completed: false,
                public: false,
                userId: otherUser.id,
            },
        });

        await request(app)
            .patch(`/notes/${otherNote.id}`)
            .set("Authorization", basicAuthHeader(TEST_USERNAME, TEST_PASSWORD))
            .send({ title: "Hijacked" })
            .then((response) => {
                expect(response.statusCode).toBe(404);
            });

        await prisma.note.delete({ where: { id: otherNote.id } });
        await prisma.user.delete({ where: { id: otherUser.id } });
    });

});
