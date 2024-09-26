const ticketService = require("../src/service/ticketService");
const UserDao = require("../src/dao/userDAO");
const TicketDao = require("../src/dao/ticketDAO");
const uuid = require("uuid");
const jwt = require("jsonwebtoken");
// const { logger } = require("../src/utils/logger");

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
      UserDao.getUserByUsername.mockResolvedValue({ username });

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
      UserDao.getUserByUsername.mockResolvedValue(null);

      const result = await ticketService.submitTicket(
        "invalidUser",
        100,
        "Travel reimbursement"
      );

      expect(result.success).toBe(false);
      expect(result.message).toBe("User does not exist");
    });

    it("should return an error if amount is invalid", async () => {
      UserDao.getUserByUsername.mockResolvedValue({ username: "testUser" });

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
      UserDao.getUserByUsername.mockResolvedValue({ username: "testUser" });
      TicketDao.getTicketsByUsername.mockResolvedValue([
        { ticketId: "1", amount: 100, status: "pending" },
      ]);

      const result = await ticketService.viewPreviousTickets("testUser");

      expect(result.success).toBe(true);
      expect(result.tickets).toHaveLength(1);
    });

    it("should return an error if no tickets found", async () => {
      UserDao.getUserByUsername.mockResolvedValue({ username: "testUser" });
      TicketDao.getTicketsByUsername.mockResolvedValue([]);

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

      TicketDao.getTicketById.mockResolvedValue(ticket);
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
      TicketDao.getTicketById.mockResolvedValue({
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

  describe("viewPreviousTicketsByType", () => {
    it("should return tickets successfully for a user and filtered by type", async () => {
      UserDao.getUserByUsername.mockResolvedValue({ username: "testUser" });
      TicketDao.getTicketsByUsernameAndType.mockResolvedValue([
        { ticketId: "1", amount: 100, status: "pending", type: "Travel" },
      ]);
      const result = await ticketService.viewPreviousTicketByType(
        "testUser",
        "Travel"
      );

      expect(result.success).toBe(true);
      expect(result.tickets).toHaveLength(1);
    });
  });

  it("should return an error if no tickets found", async () => {
    UserDao.getUserByUsername.mockResolvedValue({ username: "testUser" });
    TicketDao.getTicketsByUsernameAndType.mockResolvedValue([]);

    const result = await ticketService.viewPreviousTicketByType(
      "testUser",
      "Travel"
    );

    expect(result.success).toBe(false);
    expect(result.message).toBe("No tickets found for this user");
  });
});
