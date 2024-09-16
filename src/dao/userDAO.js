const fs = require("fs");
const path = require("path");
const User = require("../models/userModel");

const usersFilePath = path.join(__dirname, "../data/employees.json");

class UserDao {
  static getAllUsers() {
    if (fs.existsSync(usersFilePath)) {
      const users = fs.readFileSync(usersFilePath);
      return JSON.parse(users);
    }
    return [];
  }

  static findUserByUsername(username) {
    const users = this.getAllUsers();
    return users.find((user) => user.username === username);
  }

  static saveAllUsers(users) {
    fs.writeFileSync(usersFilePath, JSON.stringify(users, null, 2));
  }

  static registerUser(username, password, role = "employee") {
    const users = this.getAllUsers();
    if (this.findUserByUsername(username)) {
      return { success: false, message: "Username is already taken" };
    }
    const newUser = new User(username, password, role);
    users.push(newUser);
    this.saveAllUsers(users);
    return { success: true, message: "Registration successful" };
  }

  static loginUser(username, password, role) {
    const currentUser = this.findUserByUsername(username);
    if (!currentUser) {
      return { success: false, message: "User not found" };
    }
    if (currentUser.password !== password) {
      return { success: false, message: "Invalid password" };
    }
    return { success: true, message: "Login successful", currentUser };
  }
}

module.exports = UserDao;
