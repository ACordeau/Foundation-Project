require("dotenv").config();
const express = require("express");
const app = express();
const userController = require("./controllers/userController");
const ticketController = require("./controllers/ticketController");
const { logger } = require("./utils/logger");

app.use(express.json());

app.use("/api/users", userController);
app.use("/api/tickets", ticketController);

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  logger.info(`Server is running on port ${PORT}`);
});
