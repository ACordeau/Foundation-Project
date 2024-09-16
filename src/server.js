/*
Title: Foundations Project
Author: Aaron Cordeau
Version: 1.0
*/

// Server and Setup
const express = require("express");
const bodyParser = require("body-parser");
const userRoutes = require("./routes/userRoutes");
const ticketRoutes = require("./routes/ticketRoutes");

const app = express();
app.use(bodyParser.json());

app.use("/api/users", userRoutes);

app.use("/api/tickets", ticketRoutes);

app.listen(3000, () => {
  console.log("Server is running on port 3000");
});

// Entity Plan

// EMPLOYEE
/*

    Login
    Add reimbursement request
    View updated status

 */

// Finance Manager
/*

    Login
    View pending request
    Approve/Deny

*/

// Available to all roles
const login = ({ username, password }) => {
  // This is where we do some verification with
  // the database to check for a few things
  // DONE Checking for successful login
  // DONE Checking for failed login (invalid credentials)
  // DONE Checking for failed login (invalid user)
  // DONE Checking for role
};

// Available to all roles
const register = ({ username, password }) => {
  // This is where we do some verification with
  // the database to check for a few things
  // DONE Checking for successful registration
  // DONE Checking for failed registration (user already exists)
  // DONE Checking for failed registration (missing username or password)
  // DONE Gives employee default role
};

// Available to all roles
const submitTicket = ({ amount, description, status = "pending" }) => {
  // This is where we will do some preliminary
  // checking to ensure the ticket was properly submitted
  // DONE Checking for amount (must have amount, amount must be numerical)
  // DONE Checking for description (must have description)
  // DONE Automatically give default status of pending
  // DONE Success if all checks pass (ticket added to process list)
};

// Available to manager only
const processTicket = () => {
  // Checking to see if ticket has already been processed
  // Checking to ensure correct role
  // Success (approval/denail and removal from process list)
};

// Available to all roles
const viewPreviousTickets = (user) => {
  // Retrieve all successfully submitted/pendiing/settled tickets
};
