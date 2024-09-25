const TicketDao = require("../dao/ticketDAO");
const UserDao = require("../dao/userDAO");
const uuid = require("uuid");
const { logger } = require("../utils/logger");

async function submitTicket(username, amount, description) {
  const user = await UserDao.findUserByUsername(username);

  if (!user) {
    logger.info(`Failed submission attempt: Invalid user`);
    return {
      success: false,
      message: "User does not exist",
    };
  }

  if (!amount || amount <= 0 || isNaN(amount)) {
    logger.info(`Failed submission attempt: Invalid amount`);
    return {
      success: false,
      message: "Must provide a valid monetary amount above zero",
    };
  }

  if (!description || description.trim() === "") {
    logger.info(`Failed submission attempt: Invalid description`);
    return {
      success: false,
      message: "Must provide a relevant description for reimbursement",
    };
  }

  const newTicket = {
    ticketId: uuid.v4(),
    username,
    amount,
    description,
    status: "pending",
    submittedAt: new Date().toISOString(),
  };

  await TicketDao.createTicket(newTicket);
  logger.info(`${user.username} successfully submitted a ticket: ${newTicket}`);
  return {
    success: true,
    message: "Ticket submitted successfully",
    ticket: newTicket,
  };
}

async function viewPreviousTickets(username) {
  const user = await UserDao.findUserByUsername(username);

  if (!user) {
    logger.info(`Failed view attempt: Invalid user`);
    return {
      success: false,
      message: "User does not exist",
    };
  }

  const tickets = await TicketDao.findTicketsByUsername(username);

  if (tickets.length < 1) {
    logger.info(`Failed view attempt: No previous tickets`);
    return {
      success: false,
      message: "No tickets found for this user",
    };
  }

  logger.info(`Successful ticket history inquiry by: ${user.username}`);
  return {
    success: true,
    messaged: "Tickets successfully retrieved",
    tickets,
  };
}

async function getPendingTickets() {
  const tickets = await TicketDao.getTicketsByStatus("pending");
  if (tickets.length < 1) {
    logger.info(`Failed view attempt: No pending tickets`);
    return {
      success: false,
      message: "No pending tickets",
    };
  }

  logger.info(`Successful pending ticket inquiry`);
  return {
    success: true,
    messaged: "Pending tickets successfully retrieved",
    tickets,
  };
}

async function processTicket(ticketId, status) {
  if (status !== "approved" && status !== "denied") {
    logger.info(`Failed processing attempt: Invalid status`);
    return {
      success: false,
      message: "Status must be approved or denied",
    };
  }

  const ticket = await TicketDao.findTicketById(ticketId);
  console.log(ticket);

  if (!ticket) {
    logger.info(
      `Failed processing attempt: Ticket not found with ticket id: ${ticketId}`
    );
    return {
      success: false,
      message: "Ticket not found",
    };
  }

  if (ticket.status !== "pending") {
    logger.info(`Failed processing attempt: Ticket already processed`);
    return {
      success: false,
      message: "Ticket already processed",
    };
  }

  ticket.status = status;

  await TicketDao.updateTicketStatus(ticket);
  logger.info(`Ticket successfully processed: ${ticket}`);
  return {
    success: true,
    messaged: "Tickets successfully processed",
    ticket,
  };
}

module.exports = {
  submitTicket,
  viewPreviousTickets,
  getPendingTickets,
  processTicket,
};
