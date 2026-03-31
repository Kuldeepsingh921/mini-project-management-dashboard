const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const cookieParser = require('cookie-parser');
require('dotenv').config();

const authRoutes = require('./routes/authRoutes');
const taskRoutes = require('./routes/taskRoutes');

const app = express();

// Middleware
const allowedOrigins = [
  'http://localhost:5173',
  'http://localhost:5174',
  'https://mini-project-management-dashboard.vercel.app',
  /\.vercel\.app$/, // Allow all vercel preview/prod domains
];

// Manual aggressive CORS middleware
app.use((req, res, next) => {
  const origin = req.headers.origin;
  
  // If the origin is from vercel.app or localhost, allow it specifically to support credentials
  if (origin && (origin.endsWith('.vercel.app') || origin.includes('localhost'))) {
    res.setHeader('Access-Control-Allow-Origin', origin);
  } else {
    // Fallback for other origins
    res.setHeader('Access-Control-Allow-Origin', '*');
  }

  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS, PATCH');
  res.setHeader('Access-Control-Allow-Headers', 'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version, Authorization');
  res.setHeader('Access-Control-Allow-Credentials', 'true');

  // Handle Chrome/Safari preflight (OPTIONS) requests immediately
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }
  
  next();
});

app.use(express.json());
app.use(cookieParser());

// Simple Health Check
app.get('/api/health', (req, res) => res.status(200).send('API is running'));

// MongoDB Connection (Managed for Serverless/Render)
let cachedDb = null;

const connectDB = async () => {
  if (cachedDb) return cachedDb;
  
  const MONGO_URI = process.env.MONGO_URI;
  if (!MONGO_URI) throw new Error('MONGO_URI is missing in environment variables');

  const connection = await mongoose.connect(MONGO_URI);
  cachedDb = connection;
  console.log('Connected to MongoDB');
  return connection;
};

// Middleware to ensure DB is connected before processing requests
app.use(async (req, res, next) => {
  try {
    await connectDB();
    next();
  } catch (err) {
    res.status(500).json({ message: 'Database connection failed', error: err.message });
  }
});

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/tasks', taskRoutes);

// Export the app for Vercel Serverless Functions
module.exports = app;

// Start the server if run directly (e.g. Render, Local)
if (require.main === module) {
  const PORT = process.env.PORT || 5000;
  app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
}
