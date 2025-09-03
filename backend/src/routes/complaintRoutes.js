import express from 'express';
// Ensure these functions are correctly exported from the controller
import { getAllComplaints, submitComplaint } from '../controllers/complaintController.js';
import { authenticateToken } from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/', getAllComplaints);
router.post('/', authenticateToken, submitComplaint);

export default router;