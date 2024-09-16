const UserDao = require("../dao/userDAO");

class UserController {
  static register(req, res) {
    const { username, password } = req.body;
    if (!username || !password) {
      return res.status(400).json({
        success: false,
        message: "Username and password are required",
      });
    }
    const result = UserDao.registerUser(username, password);
    return res.status(result.success ? 201 : 400).json(result);
  }
}

module.exports = UserController;
