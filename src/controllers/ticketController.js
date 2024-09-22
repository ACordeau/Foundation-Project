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

module.exports = router;
