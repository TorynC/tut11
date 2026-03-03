const { NoteService } = require("src/services/notes");
const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

let testUser;
let testNote;

beforeAll(async () => {
    testUser = await prisma.user.create({
        data: { username: "notesUser" + Date.now(), password: "pass" },
    });

    testNote = await prisma.note.create({
        data: {
            title: "Service Test Note",
            description: "For tests",
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

describe("NoteService", () => {
    test(".list(): it should return an array containing only public notes", async () => {
        const notes = await NoteService.list();
        expect(Array.isArray(notes)).toBe(true);
        notes.forEach((note) => expect(note.public).toBe(true));
        const found = notes.find((n) => n.id === testNote.id);
        expect(found).toBeDefined();
    });

    test(".list(): it should filter notes by completed status when a condition is provided", async () => {
        const notes = await NoteService.list({ completed: false });
        expect(Array.isArray(notes)).toBe(true);
        notes.forEach((note) => {
            expect(note.public).toBe(true);
            expect(note.completed).toBe(false);
        });
    });

    test(".retrieve(): it should return the note when the noteId and userId match", async () => {
        const note = await NoteService.retrieve(testNote.id, testUser.id);
        expect(note).toMatchObject({
            id: testNote.id,
            title: testNote.title,
            userId: testUser.id,
        });
    });

    test(".retrieve(): it should return null when the note belongs to a different user", async () => {
        const note = await NoteService.retrieve(testNote.id, testUser.id + 9999);
        expect(note).toBeNull();
    });

    test(".create(): it should create a note and return it", async () => {
        const newNote = await NoteService.create({
            title: "Created Note",
            description: "Via service",
            completed: true,
            public: false,
            userId: testUser.id,
        });
        expect(newNote).toMatchObject({
            title: "Created Note",
            description: "Via service",
            completed: true,
            public: false,
            userId: testUser.id,
        });
        
    });

    test(".update(): it should update a note and return the updated note", async () => {
        const updated = await NoteService.update(testNote.id, testUser.id, { title: "Updated Title" });
        expect(updated).toMatchObject({
            id: testNote.id,
            title: "Updated Title",
            userId: testUser.id,
        });
    });

    test(".update(): it should return null when the note belongs to a different user", async () => {
        const result = await NoteService.update(testNote.id, testUser.id + 9999, { title: "Fail" });
        expect(result).toBeNull();
    });
});
