const User = require("../models/userModel");
const uuid = require("uuid");

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

const TableName = "Employees";

class UserDao {
  static async getAllUsers() {
    const command = {
      TableName,
    };

    try {
      const data = await documentClient.send(command);
      return data.Items || [];
    } catch (err) {
      console.error(err);
    }
  }

  static async findUserByUsername(username) {
    const command = new GetCommand({
      TableName,
      Key: { username },
    });

    const data = await documentClient.send(command);
    return data.Item || null;
  }

  static async registerUser(user) {
    const command = new PutCommand({
      TableName,
      Item: user,
    });

    await documentClient.send(command);
  }
}

module.exports = UserDao;
