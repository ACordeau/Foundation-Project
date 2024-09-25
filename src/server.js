require("dotenv").config();
const express = require("express");
const app = express();
const userController = require("./controllers/userController");
const ticketController = require("./controllers/ticketController");

app.use(express.json());

app.use("/api/users", userController);
app.use("/api/tickets", ticketController);

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
