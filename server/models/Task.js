const mongoose = require('mongoose');

const TaskSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, "Title is required"]
  },
  description: String,
  category: {
    type: String,
    enum: ["Work", "Personal", "Study", "Health", "Shopping", "Other"],
    required: [true, "Category is required"]
  },
  priority: {
    type: String,
    enum: ["Low", "Medium", "High", "Critical"],
    required: [true, "Priority is required"]
  },
  deadline: {
    type: Date,
    required: [true, "Deadline is required"],
    validate: {
      validator: function (v) {
        return v > new Date();
      },
      message: "Deadline must be in the future"
    }
  },
  completed: {
    type: Boolean,
    default: false
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  }
});

module.exports = mongoose.model("Task", TaskSchema);
