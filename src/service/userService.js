const UserDao = require("../dao/userDAO");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { logger } = require("../utils/logger");
const secret = process.env.JWT_SECRET;

async function registerUser(username, password) {
  if (!username || !password) {
    logger.info(`Failed register attempt: Invalid credentials`);
    return {
      success: false,
      message: "Username and password must be provided",
    };
  }

  const existingUser = await UserDao.getUserByUsername(username);

  if (existingUser) {
    logger.info(`Failed register attempt: Username taken`);
    return { success: false, message: "Username is already taken" };
  }

  const hashedPassword = await bcrypt.hash(password, 10);
  const newUser = {
    username,
    password: hashedPassword,
    role: "employee",
  };

  await UserDao.registerUser(newUser);
  logger.info(`User registered: ${newUser}`);
  return {
    success: true,
    message: "User successfully registered",
    user: { username, role: newUser.role },
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

  const user = await UserDao.getUserByUsername(username);
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

async function updateUserRole(username, role) {
  if (role !== "employee" && role !== "manager") {
    logger.info(`Failed role change attempt: Invalid role`);
    return {
      success: false,
      message: "Role must be employee or manager",
    };
  }

  if (role !== "manager") {
    logger.info(`Failed role change attempt: Invalid role change permissions`);
    return {
      success: false,
      message: "Managers cannot demote managers",
    };
  }

  const user = await UserDao.getUserByUsername(username);

  if (!user) {
    logger.info(
      `Failed role change attempt: User not found with username: ${username}`
    );
    return {
      success: false,
      message: "User not found",
    };
  }

  if (user.role === role) {
    logger.info(`Failed processing attempt: User already in current role`);
    return {
      success: false,
      message: "User role not changed",
    };
  }

  user.role = role;

  await UserDao.updateUserRole(user);
  logger.info(`User role successfully changed: ${user}`);
  return {
    success: true,
    messaged: "User role successfully changed",
    user,
  };
}

module.exports = {
  registerUser,
  loginUser,
  updateUserRole,
};
