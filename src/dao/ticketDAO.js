const {
  DynamoDBClient,
  QueryCommand,
  ScanCommand,
} = require("@aws-sdk/client-dynamodb");
const {
  DynamoDBDocumentClient,
  GetCommand,
  PutCommand,
  UpdateCommand,
  DeleteCommand,
} = require("@aws-sdk/lib-dynamodb");

const client = new DynamoDBClient({ region: "us-east-1" });

const documentClient = DynamoDBDocumentClient.from(client);

const TableName = "Tickets";

async function createTicket(ticket) {
  const command = new PutCommand({
    TableName,
    Item: ticket,
  });
  await documentClient.send(command);
}

async function findTicketsByUsername(username) {
  const command = new QueryCommand({
    TableName,
    IndexName: "username-index",
    KeyConditionExpression: "#username = :username",
    ExpressionAttributeNames: {
      "#username": "username",
    },
    ExpressionAttributeValues: {
      ":username": { S: username },
    },
  });

  const data = await documentClient.send(command);

  const tickets = (data.Items || []).map((item) => ({
    ticketId: item.ticketId.S,
    amount: item.amount.N,
    description: item.description.S,
    submittedAt: item.submittedAt.S,
    username: item.username.S,
  }));

  return { tickets } || null;
}

module.exports = {
  createTicket,
  findTicketsByUsername,
};
