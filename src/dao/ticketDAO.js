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

module.exports = {
  createTicket,
};
