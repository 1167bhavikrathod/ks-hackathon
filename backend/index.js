const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 4000;

// Middleware
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:5173'
}));
app.use(express.json());

// Routes
app.get('/', (req, res) => {
  res.json({ message: 'Resume Builder API is running!', status: 'OK' });
});

// Import suggestion routes
const suggestRoutes = require('./routes/suggest');
app.use('/api/suggest', suggestRoutes);
app.use('/api', require('./routes/parse'));

app.listen(PORT, () => {
  console.log(`🚀 Backend server running on http://localhost:${PORT}`);
  console.log(`📝 API endpoints available at http://localhost:${PORT}/api`);
});
