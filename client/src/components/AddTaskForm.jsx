import React, { useState } from "react";

const categories = ["Work", "Personal", "Study", "Health", "Shopping", "Other"];
const priorities = ["Low", "Medium", "High", "Critical"];

const initialForm = {
  title: "",
  description: "",
  category: "Work",
  priority: "Medium",
  deadline: ""
};

export default function AddTaskForm({ onAdd }) {
  const [form, setForm] = useState(initialForm);
  const [error, setError] = useState("");

  const handleChange = e => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = e => {
    e.preventDefault();
    if (!form.title.trim() || !form.category || !form.priority || !form.deadline) {
      setError("Please fill in all required fields.");
      return;
    }
    const deadlineDate = new Date(form.deadline);
    if (isNaN(deadlineDate.getTime()) || deadlineDate <= new Date()) {
      setError("Give a valid future deadline for the task.");
      return;
    }
    setError("");
    onAdd(form);
    setForm(initialForm);
  };

  return (
    <form className="mx-6 my-4 p-4 bg-white dark:bg-gray-800 rounded shadow md:mx-16 grid gap-3"
      onSubmit={handleSubmit}
    >
      <h2 className="text-xl font-bold text-gray-800 dark:text-gray-200 mb-2">
        Add New Task
      </h2>
      {error && <div className="text-red-500 font-medium">{error}</div>}
      <input
        className="border p-2 bg-gray-50 rounded dark:bg-gray-900 dark:text-white"
        name="title"
        type="text"
        placeholder="Title *"
        value={form.title}
        onChange={handleChange}
        required
      />
      <textarea
        className="border p-2 bg-gray-50 rounded dark:bg-gray-900 dark:text-white"
        name="description"
        rows="2"
        placeholder="Description"
        value={form.description}
        onChange={handleChange}
      />
      <div className="flex gap-4">
        <select
          className="form-select border p-2 rounded dark:bg-gray-900 dark:text-white"
          name="category"
          value={form.category}
          onChange={handleChange}
          required
        >
          {categories.map(opt => (
            <option key={opt}>{opt}</option>
          ))}
        </select>
        <select
          className="form-select border p-2 rounded dark:bg-gray-900 dark:text-white"
          name="priority"
          value={form.priority}
          onChange={handleChange}
          required
        >
          {priorities.map(opt => (
            <option key={opt}>{opt}</option>
          ))}
        </select>
      </div>
      <input
        className="border p-2 rounded dark:bg-gray-900 dark:text-white"
        name="deadline"
        type="datetime-local"
        value={form.deadline}
        onChange={handleChange}
        required
      />
      <button
        className="mt-2 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded shadow font-semibold transition"
        type="submit"
      >
        Add Task
      </button>
    </form>
  );
}
