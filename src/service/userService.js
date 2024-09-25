const UserDao = require("../dao/userDAO");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const secret = process.env.JWT_SECRET;

async function registerUser(username, password, role = "employee") {
  if (!username || !password) {
    return {
      success: false,
      message: "Username and password must be provided",
    };
  }

  const existingUser = await UserDao.findUserByUsername(username);

  if (existingUser) {
    return { success: false, message: "Username is already taken" };
  }

  const hashedPassword = await bcrypt.hash(password, 10);
  const newUser = {
    username,
    password: hashedPassword,
    role,
  };

  await UserDao.registerUser(newUser);
  return {
    success: true,
    message: "User successfully registered",
    user: { username, role },
  };
}

async function loginUser(username, password) {
  if (!username || !password) {
    return {
      success: false,
      message: "Username and password must be provided",
    };
  }

  const user = await UserDao.findUserByUsername(username);
  if (!user || !(await bcrypt.compare(password, user.password))) {
    return { success: false, message: "Invalid username or password" };
  }

  const token = jwt.sign({ username: user.username, role: user.role }, secret, {
    expiresIn: "1h",
  });

  return {
    success: true,
    message: "Login successful",
    token,
  };
}

module.exports = {
  registerUser,
  loginUser,
};
