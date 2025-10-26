const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const authRouter = express.Router();

const JWT_SECRET = "your_jwt_secret"; // Replace with env var in production

// Simple validation functions
function validateEmail(email) {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(email);
}

function validatePassword(password) {
  return password && password.length >= 6 && /\d/.test(password);
}

// Register route
authRouter.post('/register', async (req, res) => {
  const { email, password } = req.body;

  // Basic validation
  if (!validateEmail(email)) {
    return res.status(400).json({ error: "Invalid email format." });
  }
  if (!validatePassword(password)) {
    return res.status(400).json({ error: "Password must be at least 6 characters and contain a number." });
  }

  try {
    const existing = await User.findOne({ email });
    if (existing) return res.status(400).json({ error: "Email already registered." });

    const hash = await bcrypt.hash(password, 10);
    const user = new User({ email, password: hash });
    await user.save();

    res.json({ message: "User registered" });
  } catch {
    res.status(500).json({ error: "Server error during registration." });
  }
});

// Login route
authRouter.post('/login', async (req, res) => {
  const { email, password } = req.body;

  // Basic validation
  if (!validateEmail(email)) {
    return res.status(400).json({ error: "Invalid email format." });
  }
  if (!password) {
    return res.status(400).json({ error: "Password is required." });
  }

  try {
    const user = await User.findOne({ email });
    if (!user) {
      // Email not found in the database
      return res.status(401).json({ error: "Email does not exist in the database" });
    }
    const passwordMatches = await bcrypt.compare(password, user.password);
    if (!passwordMatches) {
      // Password exists, but it's incorrect
      return res.status(401).json({ error: "Invalid credentials!!" });
    }

    const token = jwt.sign({ userId: user._id }, JWT_SECRET, { expiresIn: "2d" });
    res.json({ token });
  } catch {
    res.status(500).json({ error: "Server error during login." });
  }
});

// Auth middleware
function authMiddleware(req, res, next) {
  const token = req.headers["authorization"];
  if (!token) return res.status(401).json({ error: "No token provided" });
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.userId = decoded.userId;
    next();
  } catch {
    res.status(401).json({ error: "Invalid token" });
  }
}

module.exports = { router: authRouter, authMiddleware };
