import express from 'express';
import dotenv from 'dotenv';
// Ensure this path is correct and the file exports a default
import complaintRoutes from './src/routes/complaintRoutes.js';
import authRoutes from './src/routes/authRoutes.js';

dotenv.config();
const app = express();
const PORT = process.env.PORT || 3001;

app.use(express.json());

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/complaints', complaintRoutes); // <-- This is likely line 18

app.get('/', (req, res) => {
    res.send('Public Feedback Analysis Agent Backend is running! 🚀');
});

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});