import React from "react";

export default function About() {
  return (
    <section className="px-6 py-10 md:px-16 text-gray-800 dark:text-gray-200">
      <h1 className="text-3xl font-bold mb-4 text-indigo-600 dark:text-indigo-400">
        About Smart To‑Do List
      </h1>
      <p className="text-lg mb-4 leading-relaxed">
        Smart To‑Do List helps you stay productive with clean UI, dark mode support, 
        filtered task management, and real‑time progress tracking.
      </p>
      <p className="text-md mb-3">
        This web app was built using the MERN stack:
      </p>
      <ul className="list-disc ml-6 space-y-2">
        <li>
          <span className="font-semibold text-indigo-500">MongoDB</span> — stores all your tasks securely.
        </li>
        <li>
          <span className="font-semibold text-indigo-500">Express.js</span> — handles backend APIs and routing.
        </li>
        <li>
          <span className="font-semibold text-indigo-500">React</span> — builds the responsive, modern interface.
        </li>
        <li>
          <span className="font-semibold text-indigo-500">Node.js</span> — connects the system together efficiently.
        </li>
      </ul>
      <p className="mt-6 text-md">
        Future updates will include user authentication, cloud sync, and productivity chart analytics.
      </p>
    </section>
  );
}
