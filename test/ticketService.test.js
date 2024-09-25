const ticketService = require("../src/service/ticketService");
const UserDao = require("../src/dao/userDAO");
const TicketDao = require("../src/dao/ticketDAO");
const uuid = require("uuid");
const jwt = require("jsonwebtoken");

// Mock the dependencies
jest.mock("../src/dao/userDAO");
jest.mock("../src/dao/ticketDAO");
jest.mock("jsonwebtoken");

describe("TicketService", () => {
  afterEach(() => {
    jest.clearAllMocks(); // Clear mocks after each test
  });

  describe("submitTicket", () => {
    it("should submit a ticket successfully", async () => {
      const username = "testUser";
      const amount = 100;
      const description = "Travel reimbursement";
      UserDao.findUserByUsername.mockResolvedValue({ username });

      TicketDao.createTicket.mockResolvedValue();

      const result = await ticketService.submitTicket(
        username,
        amount,
        description
      );

      expect(result.success).toBe(true);
      expect(TicketDao.createTicket).toHaveBeenCalledWith(
        expect.objectContaining({
          username,
          amount,
          description,
          status: "pending",
        })
      );
    });

    it("should return an error if the user does not exist", async () => {
      UserDao.findUserByUsername.mockResolvedValue(null);

      const result = await ticketService.submitTicket(
        "invalidUser",
        100,
        "Travel reimbursement"
      );

      expect(result.success).toBe(false);
      expect(result.message).toBe("User does not exist");
    });

    it("should return an error if amount is invalid", async () => {
      UserDao.findUserByUsername.mockResolvedValue({ username: "testUser" });

      const result = await ticketService.submitTicket(
        "testUser",
        -100,
        "Travel reimbursement"
      );

      expect(result.success).toBe(false);
      expect(result.message).toBe(
        "Must provide a valid monetary amount above zero"
      );
    });
  });

  describe("viewPreviousTickets", () => {
    it("should return tickets successfully for a user", async () => {
      UserDao.findUserByUsername.mockResolvedValue({ username: "testUser" });
      TicketDao.findTicketsByUsername.mockResolvedValue([
        { ticketId: "1", amount: 100, status: "pending" },
      ]);

      const result = await ticketService.viewPreviousTickets("testUser");

      expect(result.success).toBe(true);
      expect(result.tickets).toHaveLength(1);
    });

    it("should return an error if no tickets found", async () => {
      UserDao.findUserByUsername.mockResolvedValue({ username: "testUser" });
      TicketDao.findTicketsByUsername.mockResolvedValue([]);

      const result = await ticketService.viewPreviousTickets("testUser");

      expect(result.success).toBe(false);
      expect(result.message).toBe("No tickets found for this user");
    });
  });

  describe("getPendingTickets", () => {
    it("should return pending tickets successfully", async () => {
      TicketDao.getTicketsByStatus.mockResolvedValue([
        { ticketId: "1", status: "pending" },
      ]);

      const result = await ticketService.getPendingTickets();

      expect(result.success).toBe(true);
      expect(result.tickets).toHaveLength(1);
    });

    it("should return an error if no pending tickets are found", async () => {
      TicketDao.getTicketsByStatus.mockResolvedValue([]);

      const result = await ticketService.getPendingTickets();

      expect(result.success).toBe(false);
      expect(result.message).toBe("No pending tickets");
    });
  });

  describe("processTicket", () => {
    it("should process a ticket successfully (approve)", async () => {
      const ticketId = "123";
      const ticket = { ticketId, status: "pending" };

      TicketDao.findTicketById.mockResolvedValue(ticket);
      TicketDao.updateTicketStatus.mockResolvedValue();

      const result = await ticketService.processTicket(ticketId, "approved");

      expect(result.success).toBe(true);
      expect(TicketDao.updateTicketStatus).toHaveBeenCalledWith(
        expect.objectContaining({
          ticketId,
          status: "approved",
        })
      );
    });

    it("should return an error if the ticket has already been processed", async () => {
      TicketDao.findTicketById.mockResolvedValue({
        ticketId: "123",
        status: "approved",
      });

      const result = await ticketService.processTicket("123", "denied");

      expect(result.success).toBe(false);
      expect(result.message).toBe("Ticket already processed");
    });

    it("should return an error if the status is invalid", async () => {
      const result = await ticketService.processTicket("123", "invalid_status");

      expect(result.success).toBe(false);
      expect(result.message).toBe("Status must be approved or denied");
    });
  });
});

// describe("Ticket Service", () => {
//   describe("submitTicket", () => {
//     it("should successfully submit a ticket with valid data", async () => {
//       // Arrange
//       const mockUsername = "validUser";
//       const mockAmount = 100;
//       const mockDescription = "Reimbursement for office supplies";
//       const mockUser = { username: mockUsername };

//       UserDao.findUserByUsername.mockResolvedValue(mockUser);
//       TicketDao.createTicket.mockResolvedValue();

//       // Act
//       const result = await ticketService.submitTicket(
//         mockUsername,
//         mockAmount,
//         mockDescription
//       );

//       // Assert
//       expect(result.success).toBe(true);
//       expect(TicketDao.createTicket).toHaveBeenCalledWith({
//         ticketId: "mock-ticket-id",
//         username: mockUsername,
//         amount: mockAmount,
//         description: mockDescription,
//         status: "pending",
//         submittedAt: expect.any(String),
//       });
//     });

//     it("should fail if amount is invalid", async () => {
//       // Act
//       const result = await ticketService.submitTicket(
//         "validUser",
//         -50,
//         "Invalid amount"
//       );

//       // Assert
//       expect(result.success).toBe(false);
//       expect(result.message).toBe(
//         "Must provide a valid monetary amount above zero"
//       );
//     });
//   });

//   describe("viewPreviousTickets", () => {
//     it("should return tickets for a valid user", async () => {
//       // Arrange
//       const mockUsername = "validUser";
//       const mockUser = { username: mockUsername };
//       const mockTickets = [
//         { ticketId: "mock-ticket-id", amount: 100, description: "Test" },
//       ];

//       UserDao.findUserByUsername.mockResolvedValue(mockUser);
//       TicketDao.findTicketsByUsername.mockResolvedValue(mockTickets);

//       // Act
//       const result = await ticketService.viewPreviousTickets(mockUsername);

//       // Assert
//       expect(result.success).toBe(true);
//       expect(result.tickets).toEqual(mockTickets);
//     });

//     it("should return error if no user is found", async () => {
//       // Arrange
//       UserDao.findUserByUsername.mockResolvedValue(null);

//       // Act
//       const result = await ticketService.viewPreviousTickets("invalidUser");

//       // Assert
//       expect(result.success).toBe(false);
//       expect(result.message).toBe("User does not exist");
//     });
//   });
// });
