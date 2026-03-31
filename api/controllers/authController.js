const jwt = require('jsonwebtoken');
const User = require('../models/User');

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '7d' });
};

const setCookieAndRespond = (res, statusCode, user, token) => {
  res.cookie('jwt', token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
  });

  res.status(statusCode).json({
    _id: user._id,
    email: user.email,
  });
};

// POST /api/auth/signup
const signup = async (req, res) => {
  const { email, password } = req.body;
  console.log(req.body, 'req.body')
  if (!email || !password) {
    return res.status(400).json({ message: 'Email and password are required' });
  }

  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists' });
    }

    const user = await User.create({ email, password });
    const token = generateToken(user._id);
    setCookieAndRespond(res, 201, user, token);
  } catch (error) {
    console.error('Signup Error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// POST /api/auth/login
const login = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: 'Email and password are required' });
  }

  try {
    const user = await User.findOne({ email });
    
    if (!user || !(await user.matchPassword(password))) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    const token = generateToken(user._id);
    setCookieAndRespond(res, 200, user, token);
  } catch (error) {
    console.error('Login Error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// POST /api/auth/logout
const logout = (req, res) => {
  res.cookie('jwt', '', { httpOnly: true, maxAge: 0 });
  res.status(200).json({ message: 'Logged out successfully' });
};

// GET /api/auth/me
const getMe = (req, res) => {
  res.status(200).json({
    _id: req.user._id,
    email: req.user.email,
  });
};

module.exports = { signup, login, logout, getMe };
