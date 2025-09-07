// src/controllers/userController.js
import { ddbDocClient } from '../config/dynamodbClient.js';
import { PutCommand, GetCommand, ScanCommand } from '@aws-sdk/lib-dynamodb';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { v4 as uuidv4 } from 'uuid';

const USERS_TABLE = 'users';
const JWT_SECRET = process.env.JWT_SECRET || 'changeme';

// Register a new user (email/password)
export const signUp = async (req, res) => {
  const { email, password, name } = req.body;
  if (!email || !password || !name) {
    return res.status(400).json({ error: 'Email, password, and name are required.' });
  }
  // Check if user exists by scanning for email
  const existing = await ddbDocClient.send(new ScanCommand({
    TableName: USERS_TABLE,
    FilterExpression: 'email = :e',
    ExpressionAttributeValues: { ':e': email },
  }));
  if (existing.Items && existing.Items.length > 0) {
    return res.status(409).json({ error: 'User already exists.' });
  }
  // Hash password
  const passwordHash = await bcrypt.hash(password, 10);
  // Create user record with only user_id
  const user_id = uuidv4();
  const user = {
    user_id,
    email,
    passwordHash,
    name,
    role: 'feedback_user',
    created_at: new Date().toISOString(),
  };
  await ddbDocClient.send(new PutCommand({ TableName: USERS_TABLE, Item: user }));
  // Return user info (no password)
  res.status(201).json({ user: { user_id: user.user_id, email: user.email, name: user.name, role: user.role } });
};

// Login: verify password, issue JWT
export const signIn = async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ error: 'Email and password are required.' });
  }
  // Lookup user by scanning for email
  const data = await ddbDocClient.send(new ScanCommand({
    TableName: USERS_TABLE,
    FilterExpression: 'email = :e',
    ExpressionAttributeValues: { ':e': email },
  }));
  const user = data.Items && data.Items[0];
  if (!user) {
    return res.status(401).json({ error: 'Invalid credentials.' });
  }
  // Compare password
  const valid = await bcrypt.compare(password, user.passwordHash);
  if (!valid) {
    return res.status(401).json({ error: 'Invalid credentials.' });
  }
  // Issue JWT with user info
  const token = jwt.sign({ user_id: user.user_id, email: user.email, role: user.role }, JWT_SECRET, { expiresIn: '7d' });
  res.status(200).json({ access_token: token, user: { user_id: user.user_id, email: user.email, name: user.name, role: user.role } });
};

// Get user profile (protected route, uses JWT)
export const getProfile = async (req, res) => {
  // req.user is set by JWT middleware
  const userId = req.params.id;
  if (!userId) return res.status(400).json({ error: 'User ID required.' });
  // Only allow user to fetch their own profile or if management
  if (req.user.user_id !== userId && req.user.role !== 'management_user') {
    return res.status(403).json({ error: 'Forbidden.' });
  }
  const data = await ddbDocClient.send(new GetCommand({ TableName: USERS_TABLE, Key: { user_id: userId } }));
  if (!data.Item) return res.status(404).json({ error: 'User not found.' });
  const { passwordHash, ...profile } = data.Item;
  res.status(200).json(profile);
};
