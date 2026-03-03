const { UserService } = require("../services/users");

async function createUserController(req, res) {
    const { username, password } = req.body;

    if (!username || !password || username.trim() === "" || password.trim() === "") {
        return res.status(400).json({ message: "Invalid payload" });
    }

    const result = await UserService.create({ username, password });

    if (result.conflict) {
        return res.status(409).json({ message: "A user with that username already exists" });
    }

    return res.status(201).json(result.user);
}

module.exports = { createUserController };
