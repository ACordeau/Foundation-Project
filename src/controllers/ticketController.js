const express = require("express");
const router = express.Router();
const ticketService = require("../service/ticketService");

router.post("/submit", async (req, res) => {
  const { username, amount, description } = req.body;
  const newTicket = await ticketService.submitTicket(
    username,
    amount,
    description
  );

  if (newTicket.success) {
    res.status(201).json(newTicket);
  } else {
    res.status(400).json({ message: newTicket.message });
  }
});

router.get("/:username/tickets", async (req, res) => {
  const { username } = req.params;
  const tickets = await ticketService.viewPreviousTickets(username);

  if (tickets.success) {
    res.status(200).json(tickets);
  } else {
    res.status(400).json({ message: tickets.message });
  }
});

router.get("/pending", async (req, res) => {
  const tickets = await ticketService.getPendingTickets();

  if (tickets.success) {
    res.status(200).json(tickets);
  } else {
    res.status(400).json({ message: tickets.message });
  }
});

router.post("/:ticketId/process", async (req, res) => {
  const ticketId = req.params;
  const { status } = req.body;

  console.log(status);

  const updatedTicket = await ticketService.processTicket(ticketId, status);

  console.log(updatedTicket);

  if (updatedTicket.success) {
    res.status(200).json(updatedTicket);
  } else {
    res.status(400).json({ message: updatedTicket.message });
  }
});

module.exports = router;
