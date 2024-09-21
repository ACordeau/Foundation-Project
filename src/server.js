const express = require("express");
const app = express();
const userController = require("./controllers/userController");

app.use(express.json());

app.use("/api/users", userController);

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
