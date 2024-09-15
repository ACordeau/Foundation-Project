class User {
  constructor(username, password, role = "employee") {
    this.username = username;
    this.password = password;
    this.role = role;
  }
}

module.exports = User;
