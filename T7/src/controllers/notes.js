const { NoteService } = require("../services/notes");

async function listNotesController(req, res) {
    const doneParam = req.query.done;

    if (doneParam !== undefined && doneParam !== "true" && doneParam !== "false") {
        return res.status(400).json({ message: "Invalid payload" });
    }

    let condition;
    if (doneParam === "true") {
        condition = { completed: true };
    } else if (doneParam === "false") {
        condition = { completed: false };
    }

    const notes = await NoteService.list(condition);
    return res.json(notes);
}

async function retrieveNoteController(req, res) {
    if (!req.user) {
        return res.status(401).json({ message: "Not authenticated" });
    }

    const noteId = parseInt(req.params.noteId, 10);
    if (isNaN(noteId)) {
        return res.status(404).json({ message: "Not found" });
    }

    const note = await NoteService.retrieve(noteId, req.user.id);
    if (!note) {
        return res.status(404).json({ message: "Not found" });
    }

    return res.json(note);
}

async function createNoteController(req, res) {
    if (!req.user) {
        return res.status(401).json({ message: "Not authenticated" });
    }

    const { title, description, completed, public: isPublic } = req.body;

    if (title === undefined || description === undefined || completed === undefined || isPublic === undefined) {
        return res.status(400).json({ message: "Invalid payload" });
    }

    if (
        typeof title !== "string" ||
        typeof description !== "string" ||
        typeof completed !== "boolean" ||
        typeof isPublic !== "boolean"
    ) {
        return res.status(400).json({ message: "Invalid payload" });
    }

    if (title.trim() === "" || description.trim() === "") {
        return res.status(400).json({ message: "Invalid payload" });
    }

    const newNote = await NoteService.create({
        title,
        description,
        completed,
        public: isPublic,
        userId: req.user.id,
    });

    return res.status(201).json(newNote);
}

async function updateNoteController(req, res) {
    if (!req.user) {
        return res.status(401).json({ message: "Not authenticated" });
    }

    const noteId = parseInt(req.params.noteId, 10);
    if (isNaN(noteId)) {
        return res.status(404).json({ message: "Not found" });
    }

    const { title, description, completed, public: isPublic } = req.body;

    const updateData = {};

    if (title !== undefined) {
        if (typeof title !== "string" || title.trim() === "") {
            return res.status(400).json({ message: "Invalid payload" });
        }
        updateData.title = title;
    }

    if (description !== undefined) {
        if (typeof description !== "string" || description.trim() === "") {
            return res.status(400).json({ message: "Invalid payload" });
        }
        updateData.description = description;
    }

    if (completed !== undefined) {
        if (typeof completed !== "boolean") {
            return res.status(400).json({ message: "Invalid payload" });
        }
        updateData.completed = completed;
    }

    if (isPublic !== undefined) {
        if (typeof isPublic !== "boolean") {
            return res.status(400).json({ message: "Invalid payload" });
        }
        updateData.public = isPublic;
    }

    if (Object.keys(updateData).length === 0) {
        return res.status(400).json({ message: "Invalid payload" });
    }

    const updatedNote = await NoteService.update(noteId, req.user.id, updateData);
    if (!updatedNote) {
        return res.status(404).json({ message: "Not found" });
    }

    return res.json(updatedNote);
}

module.exports = { listNotesController, retrieveNoteController, createNoteController, updateNoteController };
