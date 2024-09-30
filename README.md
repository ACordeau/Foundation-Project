# Employee Ticketing System API

An API built using JavaScript, NodeJS, AWS DynamoDB, ExpressJS, Jest, and Postman; capable of receiving and managing workplace reimbursement request tickets.

## Installation

1. Clone this repository
2. Install dependencies with NodeJS, this project was created using v18.17.0
   ```shell
   npm install
   ```
3. Create a file in the root folder titled ".env" and write a secure JWT secret in the file, structured as such:JWT_SECRET='your_secret'
4. Setup AWS environment by defining required environment variables:

   - AWS_ACCESS_KEY_ID
   - AWS_DEFAULT_REASON
   - AWS_SECRET_ACCESS_KEY

5. Run the program, by default will operate on http://localhost:3000
   ```shell
   npm start
   ```

## Main Features

### User Login and Registration

- Users are able to register and given the default role of employee
- Managers have increased permissions, allowing them to manage the status of Employee tickets

### Ticket Submission

- Both Managers and Employees are able to submit tickets
- An amount and description are required fields for valid ticket submission
- All tickets have their initial status set to "pending"

### Ticket Management

- Only Managers are able to approve or deny ticket requests
- Managers cannot approve/deny their own tickets
- Ticket status cannot be changed after having their status changed from pending

### Ticket Querying

- Managers can filter pending tickets, this will show all tickets of status pending from all users sorted from oldest to newest
- Employees can view all of their previous ticket submissions, regardless of status

### Role Updating

- Managers can update the roles of employees to managers
- Managers do not have the authority to change the role of manager to employee

### Reimbursement Types

- Tickets can be submitted with a type to allow for better filtering and processing
- Tickets have a default type of "Misc" if no type is given
- Employees can view previous requests filtered by type
