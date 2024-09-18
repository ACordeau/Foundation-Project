const UserDao = require("../dao/userDAO");

class UserController {
  static async register(req, res) {
    const { username, password } = req.body;
    if (!username || !password) {
      return res.status(400).json({
        success: false,
        message: "Username and password are required",
      });
    }

    try {
      const result = await UserDao.registerUser(username, password);
      return res.status(result.success ? 201 : 400).json(result);
    } catch (err) {
      return res
        .status(500)
        .json({ success: false, message: "Error registering user" });
    }
  }

  static async login(req, res) {
    const { username, password } = req.body;
    if (!username || !password) {
      return res.status(400).json({
        success: false,
        message: "Username and password are required",
      });
    }

    try {
      const result = await UserDao.loginUser(username, password);
      return res.status(result.success ? 200 : 401).json(result);
    } catch (err) {
      return res
        .status(500)
        .json({ success: false, message: "Error during login" });
    }
  }
}

module.exports = UserController;
