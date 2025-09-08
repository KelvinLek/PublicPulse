// src/routes/complaintRoutes.js

import express from 'express';
import { getAllComplaints, submitComplaint, getUserComplaints, markComplaintCleared, getComplaintsByIds } from '../controllers/complaintController.js';
import { authenticateToken } from '../middleware/jwtMiddleware.js';

const router = express.Router();

// Batch fetch complaints by IDs
router.post('/batch', getComplaintsByIds);
router.patch('/:id/clear', authenticateToken, markComplaintCleared);
router.get('/', getAllComplaints);
router.post('/', authenticateToken, submitComplaint);
router.get('/user', authenticateToken, getUserComplaints);

export default router;
