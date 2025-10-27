import React from "react";

const categories = ["All", "Work", "Personal", "Study", "Health", "Shopping", "Other"];
const priorities = ["All", "Low", "Medium", "High", "Critical"];
const statuses = ["All", "Pending", "Completed", "Overdue"];
const sortOptions = [
  { value: "deadline", label: "Deadline" },
  { value: "priority", label: "Priority" },
  { value: "alphabetical", label: "Alphabetical" } // Rename for clarity
];

export default function FilterBar({ filter, setFilter, sortBy, setSortBy }) {
  return (
    <div className="flex flex-wrap gap-4 px-6 py-3 bg-white dark:bg-gray-800 border-b dark:border-gray-700 justify-between md:px-16">
      <div className="flex gap-2 items-center">
        <select
          className="form-select rounded border p-1 dark:bg-gray-900 dark:text-white"
          value={filter.category}
          onChange={e => setFilter(f => ({ ...f, category: e.target.value }))}
        >
          {categories.map(opt => (
            <option key={opt}>{opt}</option>
          ))}
        </select>
        <select
          className="form-select rounded border p-1 dark:bg-gray-900 dark:text-white"
          value={filter.priority}
          onChange={e => setFilter(f => ({ ...f, priority: e.target.value }))}
        >
          {priorities.map(opt => (
            <option key={opt}>{opt}</option>
          ))}
        </select>
        <select
          className="form-select rounded border p-1 dark:bg-gray-900 dark:text-white"
          value={filter.status}
          onChange={e => setFilter(f => ({ ...f, status: e.target.value }))}
        >
          {statuses.map(opt => (
            <option key={opt}>{opt}</option>
          ))}
        </select>
      </div>
      <div className="flex gap-2 items-center">
        <label className="text-gray-700 dark:text-gray-300 font-medium pr-2">
          Sort By:
        </label>
        <select
          className="form-select rounded border p-1 dark:bg-gray-900 dark:text-white"
          value={sortBy}
          onChange={e => setSortBy(e.target.value)}
        >
          {sortOptions.map(opt => (
            <option key={opt.value} value={opt.value}>{opt.label}</option>
          ))}
        </select>
      </div>
    </div>
  );
}
