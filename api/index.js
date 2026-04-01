const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const cookieParser = require('cookie-parser');
require('dotenv').config();

const authRoutes = require('./routes/authRoutes');
const taskRoutes = require('./routes/taskRoutes');

const app = express();

// CORS Configuration
const allowedOrigins = [
  'http://localhost:5173',
  'http://localhost:5174',
  'https://mini-project-management-dashboard.vercel.app',
  process.env.FRONTEND_URL, // Allow for custom frontend URL
].filter(Boolean);

app.use(cors({
  origin: function(origin, callback) {
    // Allow requests with no origin (like mobile apps or curl requests)
    if (!origin) return callback(null, true);
    
    // Check if origin is allowed or is a vercel preview deployment
    const isAllowed = allowedOrigins.includes(origin) || origin.endsWith('.vercel.app');
    
    if (isAllowed) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'PATCH'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With', 'Accept']
}));

app.use(express.json());
app.use(cookieParser());

// Simple Health Check
app.get('/api/health', (req, res) => res.status(200).send('API is running on Render'));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/tasks', taskRoutes);

// MongoDB Connection & Server Start
const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGO_URI;

if (!MONGO_URI) {
  console.error('MONGO_URI is missing in environment variables');
  process.exit(1);
}

mongoose.connect(MONGO_URI)
  .then(() => {
    console.log('Successfully connected to MongoDB');
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.error('MongoDB connection error:', err);
    process.exit(1);
  });

module.exports = app; // Still export for flexibility
