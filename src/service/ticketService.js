const TicketDao = require("../dao/ticketDAO");
const UserDao = require("../dao/userDAO");
const uuid = require("uuid");

async function submitTicket(username, amount, description) {
  const user = await UserDao.findUserByUsername(username);

  if (!user) {
    return {
      success: false,
      message: "User does not exist",
    };
  }

  if (!amount || amount <= 0 || isNaN(amount)) {
    return {
      success: false,
      message: "Must provide a valid monetary amount above zero",
    };
  }

  if (!description || description.trim() === "") {
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
  return {
    success: true,
    message: "Ticket submitted successfully",
    ticket: newTicket,
  };
}

module.exports = {
  submitTicket,
};
