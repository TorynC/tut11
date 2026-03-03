const express = require("express");
const basicAuth = require("../middleware/basicAuth");

// import controllers
const { helloWorldController } = require("./controllers/hello");
const { createUserController } = require("./controllers/users");
const {
    listNotesController,
    retrieveNoteController,
    createNoteController,
    updateNoteController,
} = require("./controllers/notes");

const router = express.Router();

// define routes
router.get("/hello", helloWorldController);
router.post("/users", createUserController);
router.get("/notes", listNotesController);
router.post("/notes", basicAuth, createNoteController);
router.get("/notes/:noteId", basicAuth, retrieveNoteController);
router.patch("/notes/:noteId", basicAuth, updateNoteController);

module.exports = router;
