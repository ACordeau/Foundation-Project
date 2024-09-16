const express = require("express");
const router = express.Router();
const TicketController = require("../controllers/ticketController");

// Registration route
router.post("/submit", TicketController.submit);

// View route
router.get("/view", TicketController.view);

module.exports = router;
