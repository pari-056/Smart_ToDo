const express = require("express");
const taskRouter = express.Router();
const Task = require("../models/Task");
const { authMiddleware } = require("./authRoutes");
const mongoose = require("mongoose");


// Protect all task routes with auth
taskRouter.use(authMiddleware);

// GET all tasks for logged-in user, with filters and sorting
taskRouter.get("/", async (req, res) => {
  try {
    const userId = req.userId;
    const { category, priority, status, sortBy } = req.query;

    let filter = { userId };

    if (category && category !== "All") filter.category = category;
    if (priority && priority !== "All") filter.priority = priority;

    if (status && status !== "All") {
      if (status.toLowerCase() === "completed") filter.completed = true;
      else if (status.toLowerCase() === "pending") filter.completed = false;
    }

    let query = Task.find(filter);

    if (sortBy === "deadline") {
      query = query.sort({ deadline: 1 });
    } else if (sortBy === "priority") {
      // Sorting by priority string directly is not ideal
      // You can add a numeric field 'priorityValue' to the schema for better sorting if needed
    }

    const tasks = await query.exec();
    res.json(tasks);
  } catch (err) {
    res.status(500).json({ error: "Failed to get tasks" });
  }
});

// POST create task associated with user
taskRouter.post("/", async (req, res) => {
  try {
    const taskData = req.body;
    taskData.userId = req.userId;
    const task = new Task(taskData);
    await task.save();
    res.status(201).json(task);
  } catch (err) {
    res.status(500).json({ error: "Failed to create task" });
  }
});

// PUT update task only if owned by user
taskRouter.put("/:id", async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);
    if (!task) return res.status(404).json({ error: "Task not found" });
    if (task.userId.toString() !== req.userId) {
      return res.status(403).json({ error: "Unauthorized" });
    }
    Object.assign(task, req.body);
    await task.save();
    res.json(task);
  } catch (err) {
    res.status(500).json({ error: "Failed to update task" });
  }
});

// DELETE task only if owned by user
taskRouter.delete("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ error: "Invalid task ID" });
    }

    const task = await Task.findById(id);
    if (!task) return res.status(404).json({ error: "Task not found" });
    if (!task.userId || task.userId.toString() !== req.userId) {
      return res.status(403).json({ error: "Unauthorized" });
    }

    await Task.findByIdAndDelete(id);
    res.json({ message: "Task deleted" });
  } catch (err) {
    console.error("Error deleting task:", err);
    res.status(500).json({ error: "Failed to delete task" });
  }
});


// DELETE all tasks of logged-in user
taskRouter.delete("/", async (req, res) => {
  try {
    await Task.deleteMany({ userId: req.userId });
    res.json({ message: "All tasks deleted" });
  } catch (err) {
    res.status(500).json({ error: "Failed to delete tasks" });
  }
});

module.exports = taskRouter;
