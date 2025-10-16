import React, { useState } from "react";
import useCountdown from "../hooks/useCountdown";

const categoryColors = {
  Work: "bg-blue-100 text-blue-800",
  Personal: "bg-green-100 text-green-800",
  Study: "bg-violet-100 text-violet-800",
  Health: "bg-red-100 text-red-800",
  Shopping: "bg-yellow-100 text-yellow-800",
  Other: "bg-gray-200 text-gray-800"
};

const priorityColors = {
  Low: "text-green-500",
  Medium: "text-yellow-500",
  High: "text-red-500",
  Critical: "text-rose-700"
};

export default function TaskCard({ task, onUpdate, onDelete }) {
  const { timeStr, urgency, overdue } = useCountdown(task.deadline, task.completed);

  const [isEditing, setIsEditing] = useState(false);
  const [editableTitle, setEditableTitle] = useState(task.title);

  const handleComplete = () => {
    onUpdate(task._id || task.id, { ...task, completed: !task.completed });
  };

  const handleDelete = () => {
    if (window.confirm("Are you sure to delete this task?")) {
      onDelete(task._id || task.id);
    }
  };

  const handleEditSubmit = (e) => {
    e.preventDefault();
    if (editableTitle.trim()) {
      onUpdate(task._id || task.id, { ...task, title: editableTitle.trim() });
      setIsEditing(false);
    }
  };

  // URGENCY border color and animation
  let borderColor =
    urgency === "safe" ? "border-green-400" :
    urgency === "warning" ? "border-yellow-400" :
    urgency === "urgent" ? "border-red-600 animate-pulse" :
    overdue ? "border-rose-900" :
    task.completed ? "border-gray-400" :
    "border-gray-300";

  let cardBg =
    task.completed ? "bg-gray-100 dark:bg-gray-700" :
    overdue ? "bg-rose-100 dark:bg-rose-950" :
    "bg-white dark:bg-gray-800";

  return (
    <div className={`rounded-lg shadow border-2 ${borderColor} ${cardBg} flex flex-col gap-3 p-4 transition`}>
      <div className="flex items-center justify-between gap-2">
        <span className={`px-2 py-1 rounded font-bold ${categoryColors[task.category]}`}>
          {task.category}
        </span>
        <span className={`px-2 py-1 text-xs font-bold ${priorityColors[task.priority]}`}>
          {task.priority}
        </span>
      </div>
      <div>
        {isEditing ? (
          <form onSubmit={handleEditSubmit} className="flex gap-2">
            <input
              type="text"
              className="border rounded w-full px-2 dark:bg-gray-900 dark:text-white"
              value={editableTitle}
              onChange={e => setEditableTitle(e.target.value)}
              autoFocus
            />
            <button type="submit" className="bg-blue-500 px-2 rounded text-white font-medium">Save</button>
          </form>
        ) : (
          <h3
            className={`font-semibold text-lg ${task.completed ? "line-through text-gray-500" : ""} cursor-pointer`}
            onClick={() => setIsEditing(true)}
            title="Click to edit"
          >
            {task.title}
          </h3>
        )}
        {task.description && (
          <div className="text-gray-600 text-sm dark:text-gray-200">{task.description}</div>
        )}
      </div>
      <div className="flex justify-between items-center text-xs mt-2 gap-2">
        <span className="text-gray-500 dark:text-gray-300">
          Deadline: {new Date(task.deadline).toLocaleString()}
        </span>
        <span className={`font-bold ${overdue ? "text-rose-800" : 
          urgency === "urgent" ? "text-red-600 animate-pulse" :
          urgency === "warning" ? "text-yellow-600" :
          urgency === "safe" ? "text-green-600" :
          task.completed ? "text-gray-400" : ""
        }`}>
          {overdue ? "OVERDUE" : timeStr}
        </span>
      </div>
      <div className="flex gap-2 justify-end items-center pt-1">
        <label className="flex items-center gap-1 cursor-pointer select-none">
          <input
            type="checkbox"
            checked={task.completed}
            onChange={handleComplete}
            className="accent-green-600 scale-125"
          />
          <span className="text-gray-700 text-sm dark:text-gray-100">
            {task.completed ? "Done" : "Mark as done"}
          </span>
        </label>
        <button
          className="bg-rose-600 hover:bg-rose-800 text-white px-2 py-1 rounded text-xs"
          onClick={handleDelete}
        >
          Delete
        </button>
      </div>
    </div>
  );
}
