const express = require("express");
const router = express.Router();
const ticketService = require("../service/ticketService");
const { verifyToken, isManager } = require("../middleware/authMiddleware");

router.post("/submit", verifyToken, async (req, res) => {
  const { amount, description, type } = req.body;
  const newTicket = await ticketService.submitTicket(
    req.user.username,
    amount,
    description,
    type
  );

  if (newTicket.success) {
    res.status(201).json(newTicket);
  } else {
    res.status(400).json({ message: newTicket.message });
  }
});

router.get("/view", verifyToken, async (req, res) => {
  const username = req.user.username;

  const tickets = await ticketService.viewPreviousTickets(username);

  if (tickets.success) {
    res.status(200).json(tickets);
  } else {
    res.status(400).json({ message: tickets.message });
  }
});

router.get("/view/type", verifyToken, async (req, res) => {
  const username = req.user.username;
  const type = req.query.type;

  const tickets = await ticketService.viewPreviousTicketByType(username, type);

  if (tickets.success) {
    res.status(200).json(tickets);
  } else {
    res.status(400).json({ message: tickets.message });
  }
});

router.get("/pending", verifyToken, isManager, async (req, res) => {
  const tickets = await ticketService.getPendingTickets();

  if (tickets.success) {
    res.status(200).json(tickets);
  } else {
    res.status(400).json({ message: tickets.message });
  }
});

router.put("/process", verifyToken, isManager, async (req, res) => {
  const { status, ticketId } = req.body;
  const username = req.user.username;

  const id = {
    ticketId,
  };

  const updatedTicket = await ticketService.processTicket(id, status, username);

  if (updatedTicket.success) {
    res.status(200).json(updatedTicket);
  } else {
    res.status(400).json({ message: updatedTicket.message });
  }
});

module.exports = router;
