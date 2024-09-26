const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const userService = require("../src/service/userService");
const UserDao = require("../src/dao/userDAO");
// const { logger } = require("../src/utils/logger");

// Mock the dependencies
jest.mock("../src/dao/userDAO");
jest.mock("bcrypt");
jest.mock("jsonwebtoken");

describe("User Service", () => {
  describe("registerUser", () => {
    it("should successfully register a user when username and password are provided and username is not taken", async () => {
      // Arrange
      const mockUsername = "newUser";
      const mockPassword = "password123";
      UserDao.getUserByUsername.mockResolvedValue(null); // No existing user
      bcrypt.hash.mockResolvedValue("hashedPassword");
      UserDao.registerUser.mockResolvedValue();

      // Act
      const result = await userService.registerUser(mockUsername, mockPassword);

      // Assert
      expect(result.success).toBe(true);
      expect(UserDao.registerUser).toHaveBeenCalledWith({
        username: mockUsername,
        password: "hashedPassword",
        role: "employee",
      });
    });

    it("should fail to register if username is already taken", async () => {
      // Arrange
      const mockUsername = "existingUser";
      UserDao.getUserByUsername.mockResolvedValue({ username: mockUsername });

      // Act
      const result = await userService.registerUser(
        mockUsername,
        "password123"
      );

      // Assert
      expect(result.success).toBe(false);
      expect(result.message).toBe("Username is already taken");
      //   expect(UserDao.registerUser).not.toHaveBeenCalled();
    });
  });

  describe("loginUser", () => {
    it("should successfully login a user with correct credentials", async () => {
      // Arrange
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

      // Act
      const result = await userService.loginUser(mockUsername, mockPassword);

      // Assert
      expect(result.success).toBe(true);
      expect(result.token).toBe("fakeToken");
    });

    it("should fail to login if password is incorrect", async () => {
      // Arrange
      const mockUsername = "validUser";
      const mockPassword = "wrongPassword";
      const mockUser = {
        username: mockUsername,
        password: "hashedPassword",
        role: "employee",
      };

      UserDao.getUserByUsername.mockResolvedValue(mockUser);
      bcrypt.compare.mockResolvedValue(false); // Passwords do not match

      // Act
      const result = await userService.loginUser(mockUsername, mockPassword);

      // Assert
      expect(result.success).toBe(false);
      expect(result.message).toBe("Invalid username or password");
    });
  });
});
