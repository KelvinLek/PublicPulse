// src/controllers/complaintController.js
import { ddbDocClient } from '../config/dynamodbClient.js';
import { PutCommand, ScanCommand, QueryCommand, UpdateCommand } from '@aws-sdk/lib-dynamodb';
import { v4 as uuidv4 } from 'uuid';
import bcrypt from 'bcryptjs';
import { analyzeComplaint } from '../services/analysisService.js';

const TABLE_NAME = 'complaints';

export const getAllComplaints = async (req, res) => {
  try {
    const data = await ddbDocClient.send(new ScanCommand({ TableName: TABLE_NAME }));
    res.status(200).json(data.Items);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const submitComplaint = async (req, res) => {
  const { description, postcode, password } = req.body;
  // Autogenerate user_id if not present
  let user_id = req.user && req.user.user_id ? req.user.user_id : uuidv4();
  if (!description || typeof postcode !== 'number') {
    return res.status(400).json({ error: 'description (string) and postcode (number) are required.' });
  }
  // Hash password if provided (for demonstration, not typical for complaints)
  let passwordHash = undefined;
  if (password) {
    passwordHash = await bcrypt.hash(password, 10);
  }
  const analysis = await analyzeComplaint(description, postcode);
  const complaint = {
    id: uuidv4(),
    description,
    postcode,
    user_id,
    urgency: analysis.urgency,
    is_cleared: false,
    is_clustered: false,
    created_at: new Date().toISOString(),
    ...(passwordHash ? { passwordHash } : {}),
  };
  try {
    await ddbDocClient.send(new PutCommand({ TableName: TABLE_NAME, Item: complaint }));
    res.status(201).json([complaint]);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const getUserComplaints = async (req, res) => {
  const user_id = req.user.user_id;
  if (!user_id) {
    return res.status(401).json({ error: 'Unauthorized: user not found in token.' });
  }
  try {
    const data = await ddbDocClient.send(new ScanCommand({
      TableName: TABLE_NAME,
      FilterExpression: 'user_id = :uid',
      ExpressionAttributeValues: { ':uid': user_id },
    }));
    res.status(200).json(data.Items);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const markComplaintCleared = async (req, res) => {
  // Only allow management users
  if (!req.user || req.user.role !== 'management_user') {
    return res.status(403).json({ error: 'Forbidden: Only management users can clear complaints.' });
  }
  const complaintId = req.params.id;
  if (!complaintId) {
    return res.status(400).json({ error: 'Complaint ID is required.' });
  }
  try {
    await ddbDocClient.send(new UpdateCommand({
      TableName: TABLE_NAME,
      Key: { id: complaintId },
      UpdateExpression: 'set is_cleared = :c',
      ExpressionAttributeValues: { ':c': true },
      ReturnValues: 'ALL_NEW',
    }));
    res.status(200).json({ id: complaintId, cleared: true });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
