import React from "react";

export default function Footer({ completed, total }) {
  const percentage = total === 0 ? 0 : Math.round((completed / total) * 100);
  return (
    <footer className="px-6 py-4 md:px-16 bg-white dark:bg-gray-800 border-t dark:border-gray-700">
      <div className="text-gray-700 dark:text-gray-200 font-semibold mb-2">
        {completed} / {total} tasks completed ({percentage}%)
      </div>
      <div className="relative h-3 w-full rounded-full bg-gray-300 dark:bg-gray-700">
        <div
          className="h-3 rounded-full bg-green-500 transition-all duration-300"
          style={{ width: `${percentage}%` }}
        />
      </div>
    </footer>
  );
}
