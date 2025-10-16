require("dotenv").config();
const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
const connectDB = require("./config/database");
const errorHandler = require("./middleware/errorHandler");

// Import routers and middleware once
const { router: authRouter, authMiddleware } = require('./routes/authRoutes');
const taskRouter = require('./routes/taskRoutes');

const app = express();  // Declare app before usage

// Middleware should be declared before routes
app.use(cors());
app.use(express.json());
app.use(morgan("dev"));

// Connect to DB
connectDB();

// Route mounting - only once per path
app.use('/api/auth', authRouter);
app.use('/api/tasks', authMiddleware, taskRouter);

app.get("/", (req, res) => res.send("✅ Smart To-Do List API is running!"));

// Error Handling
app.use(errorHandler);

const PORT = process.env.PORT || 8080;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
