const TicketDao = require("../dao/ticketDAO");

class TicketController {
  static submit(req, res) {
    const { amount, description } = req.body;
    if (!amount) {
      return res.status(400).json({
        success: false,
        message: "Ticket submission requires a dollar amount",
      });
    }
    if (!description) {
      return res.status(400).json({
        success: false,
        message: "Ticket submission requires a description",
      });
    }
    const result = TicketDao.submitTicket(amount, description);
    return res.status(result.success ? 201 : 400).json(result);
  }
}

module.exports = TicketController;
