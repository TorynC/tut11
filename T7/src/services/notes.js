const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

class NoteService {
    static async list(condition) {
        const where = { public: true };

        if (condition !== undefined) {
            if (condition.completed !== undefined) {
                where.completed = condition.completed;
            }
        }

        return await prisma.note.findMany({ where });
    }

    static async retrieve(noteId, userId) {
        const note = await prisma.note.findUnique({
            where: { id: noteId },
        });

        if (!note || note.userId !== userId) {
            return null;
        }

        return note;
    }

    static async create(newNote) {
        return await prisma.note.create({ data: newNote });
    }

    static async update(noteId, userId, newNote) {
        const note = await prisma.note.findUnique({
            where: { id: noteId },
        });

        if (!note || note.userId !== userId) {
            return null;
        }

        return await prisma.note.update({
            where: { id: noteId },
            data: newNote,
        });
    }
}

module.exports = { NoteService };
