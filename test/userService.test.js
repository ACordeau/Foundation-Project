const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const userService = require("../src/service/userService");
const UserDao = require("../src/dao/userDAO");

jest.mock("../src/dao/userDAO");
jest.mock("bcrypt");
jest.mock("jsonwebtoken");

describe("User Service", () => {
  describe("registerUser", () => {
    it("should successfully register a user when username and password are provided and username is not taken", async () => {
      const mockUsername = "newUser";
      const mockPassword = "password123";
      UserDao.getUserByUsername.mockResolvedValue(null);
      bcrypt.hash.mockResolvedValue("hashedPassword");
      UserDao.registerUser.mockResolvedValue();

      const result = await userService.registerUser(mockUsername, mockPassword);

      expect(result.success).toBe(true);
      expect(UserDao.registerUser).toHaveBeenCalledWith({
        username: mockUsername,
        password: "hashedPassword",
        role: "employee",
      });
    });

    it("should fail to register if username is already taken", async () => {
      const mockUsername = "existingUser";
      UserDao.getUserByUsername.mockResolvedValue({ username: mockUsername });

      const result = await userService.registerUser(
        mockUsername,
        "password123"
      );

      expect(result.success).toBe(false);
      expect(result.message).toBe("Username is already taken");
    });
  });

  describe("loginUser", () => {
    it("should successfully login a user with correct credentials", async () => {
      const mockUsername = "validUser";
      const mockPassword = "password123";
      const mockUser = {
        username: mockUsername,
        password: "hashedPassword",
        role: "employee",
      };

      UserDao.getUserByUsername.mockResolvedValue(mockUser);
      bcrypt.compare.mockResolvedValue(true);
      jwt.sign.mockReturnValue("fakeToken");

      const result = await userService.loginUser(mockUsername, mockPassword);

      expect(result.success).toBe(true);
      expect(result.token).toBe("fakeToken");
    });

    it("should fail to login if password is incorrect", async () => {
      const mockUsername = "validUser";
      const mockPassword = "wrongPassword";
      const mockUser = {
        username: mockUsername,
        password: "hashedPassword",
        role: "employee",
      };

      UserDao.getUserByUsername.mockResolvedValue(mockUser);
      bcrypt.compare.mockResolvedValue(false);

      const result = await userService.loginUser(mockUsername, mockPassword);

      expect(result.success).toBe(false);
      expect(result.message).toBe("Invalid username or password");
    });
  });

  describe("updateUserRole", () => {
    it("should change the role of a user if manager is authorized", async () => {
      const mockManager = {
        username: "managerUser",
        role: "manager",
      };
      const username = "employeeUser";
      const role = "manager";
      const mockUser = {
        username,
        role: "employee",
      };

      UserDao.getUserByUsername.mockResolvedValue(mockUser);
      UserDao.updateUserRole.mockResolvedValue();

      const result = await userService.updateUserRole(username, role);

      expect(result).toEqual({
        success: true,
        messaged: "User role successfully changed",
        user: {
          username,
          role,
        },
      });

      expect(UserDao.getUserByUsername).toHaveBeenCalledWith(username);
      expect(UserDao.updateUserRole).toHaveBeenCalledWith({
        ...mockUser,
        role,
      });
    });
  });
});
