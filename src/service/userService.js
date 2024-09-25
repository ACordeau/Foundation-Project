const UserDao = require("../dao/userDAO");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { logger } = require("../utils/logger");
const secret = process.env.JWT_SECRET;

async function registerUser(username, password, role = "employee") {
  if (!username || !password) {
    logger.info(`Failed register attempt: Invalid credentials`);
    return {
      success: false,
      message: "Username and password must be provided",
    };
  }

  const existingUser = await UserDao.findUserByUsername(username);

  if (existingUser) {
    logger.info(`Failed register attempt: Username taken`);
    return { success: false, message: "Username is already taken" };
  }

  const hashedPassword = await bcrypt.hash(password, 10);
  const newUser = {
    username,
    password: hashedPassword,
    role,
  };

  await UserDao.registerUser(newUser);
  logger.info(`User registered: ${newUser}`);
  return {
    success: true,
    message: "User successfully registered",
    user: { username, role },
  };
}

async function loginUser(username, password) {
  if (!username || !password) {
    logger.info(`Failed login attempt: Invalid credentials`);
    return {
      success: false,
      message: "Username and password must be provided",
    };
  }

  const user = await UserDao.findUserByUsername(username);
  if (!user || !(await bcrypt.compare(password, user.password))) {
    logger.info(`Failed login attempt: Invalid credentials`);
    return { success: false, message: "Invalid username or password" };
  }

  const token = jwt.sign({ username: user.username, role: user.role }, secret, {
    expiresIn: "1h",
  });
  logger.info(`Successful login by ${user.username}`);
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
