import React from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useTheme } from "../context/ThemeContext";

export default function Header({ onAdd, showAddForm, taskCount, isAuthenticated, setIsAuthenticated }) {
  const { darkMode, setDarkMode } = useTheme();
  const location = useLocation();
  const navigate = useNavigate();

  const toggleDarkMode = () => setDarkMode(!darkMode);

  const handleLogout = () => {
    localStorage.removeItem("token");
    setIsAuthenticated(false);
    navigate("/login");
  };

  return (
    <header className="flex flex-wrap items-center justify-between px-6 py-4 bg-white dark:bg-gray-800 shadow md:px-16">
      <div className="flex items-center gap-3">
        <img src="/logo.svg" alt="Logo" className="h-8 w-8" />
        <h1 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-gray-100">
          Smart To‑Do List
        </h1>
        {location.pathname === "/" && (
          <span className="ml-2 text-xs font-semibold px-2 py-1 rounded bg-indigo-100 text-indigo-700 dark:bg-indigo-900 dark:text-indigo-100">
            {taskCount} tasks
          </span>
        )}
      </div>

      <div className="flex items-center gap-4">
        <nav className="flex items-center gap-4 text-gray-700 dark:text-gray-200 font-medium">
          {isAuthenticated ? (
            <>
              <Link
                to="/"
                className={`hover:text-indigo-600 ${
                  location.pathname === "/" ? "text-indigo-600" : ""
                }`}
              >
                Home
              </Link>
              <Link
                to="/about"
                className={`hover:text-indigo-600 ${
                  location.pathname === "/about" ? "text-indigo-600" : ""
                }`}
              >
                About
              </Link>
              <Link
                to="/stats"
                className={`hover:text-indigo-600 ${
                  location.pathname === "/stats" ? "text-indigo-600" : ""
                }`}
              >
                Stats
              </Link>
              <button
                onClick={handleLogout}
                className="ml-4 text-red-600 hover:underline"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="hover:text-indigo-600">Login</Link>
              <Link to="/register" className="hover:text-indigo-600">Register</Link>
            </>
          )}
        </nav>

        {isAuthenticated && location.pathname === "/" && (
          <button
            className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded transition font-medium"
            onClick={onAdd}
          >
            {showAddForm ? "Close" : "Add Task"}
          </button>
        )}

        <button
          onClick={toggleDarkMode}
          aria-label="Toggle Dark Mode"
          className="bg-gray-200 dark:bg-gray-700 p-2 rounded"
        >
          {darkMode ? (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6 text-yellow-400"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M12 3v1m0 16v1m8.364-9H21M3 12h1m16.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 12.728l-.707-.707M6.343 17.657l-.707-.707M12 7a5 5 0 000 10 5 5 0 000-10z"
              />
            </svg>
          ) : (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6 text-gray-800"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M21 12.79A9 9 0 1111.21 3 7 7 0 0021 12.79z"
              />
            </svg>
          )}
        </button>
      </div>
    </header>
  );
}
