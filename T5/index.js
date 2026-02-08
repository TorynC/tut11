#!/usr/bin/env node
'use strict';

const express = require("express");
const app = express();
app.use(express.json());

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

app.get("/notes", (req, res) => {
    const doneParam = req.query.done;

    if (doneParam !== undefined && doneParam !== "true" && doneParam !== "false") {
        return res.status(400).send("Bad request");
    }

    if (doneParam === "true") {
        const filtered =  data.filter(note => note.completed === true);
        res.json(filtered);
    } else if (doneParam === "false") {
        const filtered =  data.filter(note => note.completed === false);
        res.json(filtered);
    } else {
        res.json(data);
    }

});

app.get("/notes/:noteId", (req, res) => {
    const noteId = parseInt(req.params.noteId, 10);

    if (isNaN(noteId)) {
        return res.status(400).send("Bad request");
    }

    if (noteId < 0 || noteId >= data.length) {
        res.status(404).send("Not found");
    } 

    console.log(req.params);
    res.json(data[noteId]);
});

app.post("/notes", (req, res) => {
    console.log(req.body);
    
    data.push(req.body);
    
    const newNote = structuredClone(req.body);
    
    newNote.id = data.length - 1;
    
    res.status(201).json(newNote);

});

app.patch("/notes/:noteId", (req, res) => {
    const noteId = parseInt(req.params.noteId);
    if (noteId < 0 || noteId >= data.length) {
        return res.status(404).send("Not found");
    }

    const doneParam = req.query.done;

    if (doneParam !== "true" && doneParam !== "false") {
        return res.status(400).send("Bad request");
    }

    if (isNaN(noteId)) {
        return res.status(400).send("Bad request");
    }
    
    data[noteId].completed = doneParam === "true";

    res.status(200).json({
        title: data[noteId].title,
        description: data[noteId].description,
        completed: data[noteId].completed
    })

})

// ==================

const server = app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});

server.on('error', (err) => {
    console.error(`cannot start server: ${err.message}`);
    process.exit(1);
});