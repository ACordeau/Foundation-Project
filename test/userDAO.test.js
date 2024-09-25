// const fs = require("fs");
// const UserDao = require("../src/dao/userDAO");

// jest.mock("fs");

// const mockUsers = [
//   { username: "manager1", password: "password123", role: "manager" },
//   { username: "employee1", password: "password456", role: "employee" },
// ];

// // Mock file system operations
// beforeEach(() => {
//   fs.readFileSync.mockReturnValue(JSON.stringify(mockUsers));
//   //   fs.writeFileSync.mockClear();
// });

// describe("UserDao", () => {
//   test("findUserByUsername should return the correct user", () => {
//     // fs.readFileSync.mockReturnValue(JSON.stringify(mockUsers));
//     const user = UserDao.findUserByUsername("manager1");
//     console.log(user);
//     expect(user).toEqual({
//       username: "manager1",
//       password: "password123",
//       role: "manager",
//     });
//   });
// });
