/*
Title: Foundations Project
Author: Aaron Cordeau
Version: 1.0
*/

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
  // Checking for successful login
  // Checking for failed login (invalid credentials)
  // Checking for failed login (invalid user)
  // Checking for role
};

// Available to all roles
const register = ({ username, password }) => {
  // This is where we do some verification with
  // the database to check for a few things
  // Checking for successful registration
  // Checking for failed registration (user already exists)
  // Checking for failed registration (missing username or password)
  // Gives employee default role
};

// Available to all roles
const submitTicket = ({ amount, description, status = "pending" }) => {
  // This is where we will do some preliminary
  // checking to ensure the ticket was properly submitted
  // Checking for amount (must have amount, amount must be numerical)
  // Checking for description (must have description)
  // Automatically give default status of pending
  // Success if all checks pass (ticket added to process list)
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
