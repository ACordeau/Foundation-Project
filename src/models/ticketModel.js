class Ticket {
  constructor(amount, description, status = "pending") {
    this.amount = amount;
    this.description = description;
    this.status = status;
  }
}

module.exports = Ticket;
