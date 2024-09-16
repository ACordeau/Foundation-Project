const fs = require("fs");
const path = require("path");
const Ticket = require("../models/ticketModel");

const ticketsFilePath = path.join(__dirname, "../data/tickets.json");

class TicketDao {
  static getAllTickets() {
    if (fs.existsSync(ticketsFilePath)) {
      const tickets = fs.readFileSync(ticketsFilePath);
      return JSON.parse(tickets);
    }
    return [];
  }

  static saveAllTickets(tickets) {
    fs.writeFileSync(ticketsFilePath, JSON.stringify(tickets, null, 2));
  }

  static submitTicket(amount, description, status = "pending") {
    const tickets = this.getAllTickets();
    const newTicket = new Ticket(amount, description, status);
    tickets.push(newTicket);
    this.saveAllTickets(tickets);
    return { success: true, message: "Ticket Submission successful" };
  }
}

module.exports = TicketDao;
