// src/routes/clusterRoutes.js
import express from 'express';
import { getAllClusters } from '../controllers/clusterController.js';

const router = express.Router();

router.get('/', getAllClusters);

export default router;
