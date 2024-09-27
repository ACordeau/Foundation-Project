// const UserDao = require("../dao/userDAO");
const { verifyToken, isManager } = require("../middleware/authMiddleware");
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

router.put("/roles", verifyToken, isManager, async (req, res) => {
  const { username, role, manager } = req.body;

  const updatedUser = await UserService.updateUserRole(username, manager, role);

  if (updatedUser.success) {
    res.status(200).json(updatedUser);
  } else {
    res.status(400).json({ message: updatedUser.message });
  }
});

module.exports = router;
