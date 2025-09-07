import express from 'express';
// Ensure these functions are correctly exported from the controller

import { getAllComplaints, submitComplaint, getUserComplaints, markComplaintCleared } from '../controllers/complaintController.js';
import { authenticateToken } from '../middleware/authMiddleware.js';

const router = express.Router();

// Mark complaint as cleared
router.patch('/:id/clear', authenticateToken, markComplaintCleared);

router.get('/', getAllComplaints);
router.post('/', authenticateToken, submitComplaint);
// Get complaints for the authenticated user
router.get('/user', authenticateToken, getUserComplaints);

export default router;