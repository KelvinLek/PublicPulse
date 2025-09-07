// src/routes/authRoutes.js
import express from 'express';
import { signUp, signIn, getProfile } from '../controllers/userController.js';
import { authenticateToken } from '../middleware/jwtMiddleware.js';

const router = express.Router();

router.post('/signup', signUp);
router.post('/signin', signIn);
router.get('/profiles/:id', authenticateToken, getProfile);

export default router;
