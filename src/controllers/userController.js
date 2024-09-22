// const UserDao = require("../dao/userDAO");
const UserService = require("../service/userService");
const express = require("express");
const router = express.Router();

router.post("/register", async (req, res) => {
  const { username, password, role } = req.body;
  const newUser = await UserService.registerUser(username, password, role);

  if (newUser.success) {
    res.status(201).json(newUser);
  } else {
    res.status(400).json({ message: newUser.message });
  }
});

router.post("/login", async (req, res) => {
  const { username, password } = req.body;

  const token = await UserService.loginUser(username, password);

  console.log(token);

  if (token.success) {
    res.status(200).json({ token });
  } else {
    res.status(400).json({ message: token.message });
  }
});

module.exports = router;
