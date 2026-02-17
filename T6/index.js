#!/usr/bin/env node
'use strict';

const express = require("express");
const app = express();
app.use(express.json());

const basicAuth = require('./middleware/basicAuth');
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const port = (() => {
    const args = process.argv;

    if (args.length !== 3) {
        console.error("usage: node index.js port");
        process.exit(1);
    }

    const num = parseInt(args[2], 10);
    if (isNaN(num)) {
        console.error("error: argument must be an integer.");
        process.exit(1);
    }

    return num;
})();

const data = [
  {
    title: "Buy groceries",
    description: "Milk, Bread, Eggs, Butter",
    completed: false
  },
  {
    title: "Walk the dog",
    description: "Take Bella for a walk in the park",
    completed: true
  },
  {
    title: "Read a book",
    description: "Finish reading 'The Great Gatsby'",
    completed: false
  }
]


app.get("/", (req, res) => {
    res.send("Hello World!");
});

// ADD YOUR WORK HERE

app.get("/notes", async (req, res) => {
    const doneParam = req.query.done;

    if (doneParam !== undefined && doneParam !== "true" && doneParam !== "false") {
        return res.status(400).send("Bad request");
    }

    const filter = {isPublic: true};

    if (doneParam === "true") {
        filter.completed = true;
    } else if (doneParam === "false") {
        filter.completed = false;
    };

    const notes = await prisma.note.findMany({
        where: filter
    });

    res.json(notes);

});

app.get("/notes/:noteId", basicAuth, async(req, res) => {

    if (!req.user) {
        return res.status(401).json({message: "Unauthenticated"});
    }

    const noteId = parseInt(req.params.noteId, 10);

    if (isNaN(noteId)) {
        return res.status(404).json({ message: 'Not found' });
    }

    const note = await prisma.note.findUnique({
        where: {id: noteId}
    });

    if (!note) {
        return res.status(404).json({message: 'not found'});
    }

    if (note.userId !== req.user.id) {
        return res.status(403).json({ message: 'Not permitted' });
    }
    res.json(note);
});

app.post("/notes", basicAuth, async (req, res) => {
    if (!req.user) {
        return res.status(401).json({message: "Not Authenticated"});
    }

    const {title, description, completed, public: isPublic} = req.body;

    if (title === undefined || description === undefined || completed === undefined || isPublic === undefined) {
        return res.status(400).json({ message: 'Invalid payload' });
    }

    if (typeof title !== 'string' || typeof description !== 'string' || 
        typeof completed !== 'boolean' || typeof isPublic !== 'boolean') {
        return res.status(400).json({ message: 'Invalid payload' });
    }

    if (title.trim() === '' || description.trim() === '') {
        return res.status(400).json({ message: 'Invalid payload' });
    }

    const newNote = await prisma.note.create({
        data: {
            title, 
            description,
            completed,
            isPublic,
            userId: req.user.id
        }
    });
    
    res.status(201).json(newNote);

});

app.patch("/notes/:noteId", basicAuth, async (req, res) => {
    if (!req.user) {
        return res.status(401).json({ message: 'Not authenticated' });
    }

    const noteId = parseInt(req.params.noteId, 10);

    if (isNaN(noteId)) {
        return res.status(404).json({ message: 'Not found' });
    }

    const note = await prisma.note.findUnique({
        where: { id: noteId }
    });

    if (!note) {
        return res.status(404).json({ message: 'Not found' });
    }

    if (note.userId !== req.user.id) {
        return res.status(403).json({ message: 'Not permitted' });
    }

    const { title, description, completed, public: isPublic } = req.body;

    const updateData = {};

    if (title !== undefined) {
        if (typeof title !== 'string' || title.trim() === '') {
            return res.status(400).json({ message: 'Invalid payload' });
        }
        updateData.title = title;
    }

    if (description !== undefined) {
        if (typeof description !== 'string' || description.trim() === '') {
            return res.status(400).json({ message: 'Invalid payload' });
        }
        updateData.description = description;
    }

    if (completed !== undefined) {
        if (typeof completed !== 'boolean') {
            return res.status(400).json({ message: 'Invalid payload' });
        }
        updateData.completed = completed;
    }

    if (isPublic !== undefined) {
        if (typeof isPublic !== 'boolean') {
            return res.status(400).json({ message: 'Invalid payload' });
        }
        updateData.isPublic = isPublic;
    }

    const updatedNote = await prisma.note.update({
        where: { id: noteId },
        data: updateData
    });

    res.json(updatedNote);
});

app.post('/users', async (req, res) => {
    const { username, password } = req.body;
    if (!username || !password || username.trim() === '' || password.trim() === '' ) {
        return res.status(400).json({message: "Invalid Payload"});
    }

    const existingUser = await prisma.user.findUnique({
        where: {username}
    });

    if (existingUser) {
        return res.status(409).json({
            message: 'Username already exists'
        });
    }

    const newUser = await prisma.user.create({
        data: {
            username, 
            password
        }
    });

    return res.status(201).json(newUser);

})

app.get('/hello', basicAuth, (req, res) => {
  if (req.user) {
    res.json(req.user);
  } else {
    res.status(401).json({ message: 'Unauthorized' });
  }
});

// ==================

const server = app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});

server.on('error', (err) => {
    console.error(`cannot start server: ${err.message}`);
    process.exit(1);
});