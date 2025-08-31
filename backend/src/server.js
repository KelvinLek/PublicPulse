import express from 'express';
import dotenv from 'dotenv';
import feedbackRoutes from './src/routes/feedbackRoutes.js';
import authRoutes from './src/routes/authRoutes.js'; // <-- IMPORT

dotenv.config();
const app = express();
const PORT = process.env.PORT || 3001;

app.use(express.json());

// API Routes
app.use('/api/auth', authRoutes); // <-- ADD
app.use('/api/feedback', feedbackRoutes);

app.get('/', (req, res) => {
    res.send('Public Feedback Analysis Agent Backend is running! 🚀');
});

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});