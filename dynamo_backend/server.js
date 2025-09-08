// server.js
import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';

import complaintRoutes from './src/routes/complaintRoutes.js';
import authRoutes from './src/routes/authRoutes.js';
import clusterRoutes from './src/routes/clusterRoutes.js';

dotenv.config();
const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors({ origin: 'http://localhost:5173', credentials: true }));
app.use(express.json());

// API Routes

app.use('/api/auth', authRoutes);
app.use('/api/complaints', complaintRoutes);
app.use('/api/clusters', clusterRoutes);

app.get('/', (req, res) => {
    res.send('DynamoDB Backend is running! 🚀');
});

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
