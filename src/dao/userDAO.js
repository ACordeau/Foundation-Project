const fs = require("fs");
const path = require("path");
const User = require("../models/userModel");
// const dynamodb = require("../data/dynamoClient");
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
      const data = await dynamodb.scan(command);
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

    try {
      const data = await documentClient.send(command);
      return data.Item || null;
    } catch (err) {
      console.error(err);
    }
  }

  static async registerUser(username, password, role = "employee") {
    const searchUser = await this.findUserByUsername(username);

    if (searchUser) {
      return { success: false, message: "Username is already taken" };
    }

    const newUser = new User(username, password, role);

    const command = new PutCommand({
      TableName,
      Item: newUser,
    });

    try {
      await documentClient.send(command);
      return { success: true, message: "Registration successful" };
    } catch (err) {
      console.error(err);
    }
  }

  static async loginUser(username, password) {
    const currentUser = await this.findUserByUsername(username);

    if (!currentUser) {
      return { success: false, message: "User not found" };
    }

    if (currentUser.password !== password) {
      return { success: false, message: "Invalid password" };
    }

    return { success: true, message: "Login successful", currentUser };
  }
}

module.exports = UserDao;
