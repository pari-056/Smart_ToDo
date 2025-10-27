import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import axios from "./api/axiosInstance";

import Header from "./components/Header";
import AddTaskForm from "./components/AddTaskForm";
import FilterBar from "./components/FilterBar";
import TaskList from "./components/TaskList";
import Footer from "./components/Footer";

import Login from "./pages/Login";
import Register from "./pages/Register";
import About from "./pages/About";
import Stats from "./pages/Stats";

export default function App() {
  const [tasks, setTasks] = useState([]);
  const [filter, setFilter] = useState({ category: "All", priority: "All", status: "All" });
  const [sortBy, setSortBy] = useState("deadline");
  const [showAddForm, setShowAddForm] = useState(false);

  const [isAuthenticated, setIsAuthenticated] = useState(() =>
    Boolean(localStorage.getItem("token"))
  );

  const fetchTasks = async () => {
    if (!isAuthenticated) return;
    let queryParams = [];
    if (filter.category !== "All") queryParams.push(`category=${filter.category}`);
    if (filter.priority !== "All") queryParams.push(`priority=${filter.priority}`);
    if (filter.status !== "All") queryParams.push(`status=${filter.status.toLowerCase()}`);
    // No sortBy in query params since sorting is done frontend now!
    const queryString = queryParams.length ? `?${queryParams.join("&")}` : "";

    try {
      const res = await axios.get(`/api/tasks${queryString}`);
      setTasks(res.data);
    } catch (err) {
      console.error("Error fetching tasks:", err);
      if (err.response?.status === 401) {
        setIsAuthenticated(false);
        localStorage.removeItem("token");
      }
    }
  };

  useEffect(() => {
    fetchTasks();
    // eslint-disable-next-line
  }, [filter, isAuthenticated]);

  // --- Sort tasks array on frontend based on sortBy selection
  const getSortedTasks = () => {
    let sorted = [...tasks];
    if (sortBy === "priority") {
      // Map priorities to numbers; lower is higher priority
      const priorityOrder = { High: 1, Medium: 2, Low: 3, Critical: 0 };
      sorted.sort((a, b) => {
        const aVal = priorityOrder[a.priority] ?? 99;
        const bVal = priorityOrder[b.priority] ?? 99;
        return aVal - bVal;
      });
    } else if (sortBy === "alphabetical") {
      sorted.sort((a, b) => (a.title || "").localeCompare(b.title || ""));
    } else if (sortBy === "deadline") {
      sorted.sort((a, b) => new Date(a.deadline) - new Date(b.deadline));
    }
    return sorted;
  };

  const addTask = async (task) => {
    try {
      await axios.post("/api/tasks", task);
      fetchTasks();
    } catch (err) {
      console.error("Error adding task:", err);
    }
  };

  const updateTask = async (id, updatedTask) => {
    try {
      await axios.put(`/api/tasks/${id}`, updatedTask);
      fetchTasks();
    } catch (err) {
      console.error("Error updating task:", err);
    }
  };

  const deleteTask = async (id) => {
    try {
      await axios.delete(`/api/tasks/${id}`);
      fetchTasks();
    } catch (err) {
      console.error("Error deleting task:", err);
    }
  };

  const deleteAllTasks = async () => {
    if (!window.confirm("Are you sure you want to delete all your tasks?")) return;
    try {
      await axios.delete("/api/tasks");
      fetchTasks();
    } catch (err) {
      console.error("Error deleting all tasks:", err);
    }
  };

  return (
    <Router>
      <div className="min-h-screen flex flex-col bg-gray-100 dark:bg-gray-900 transition-colors duration-300">
        <Header
          onAdd={() => setShowAddForm(!showAddForm)}
          showAddForm={showAddForm}
          taskCount={tasks.length}
          isAuthenticated={isAuthenticated}
          setIsAuthenticated={setIsAuthenticated}
        />

        <main className="flex-grow">
          <Routes>
            {!isAuthenticated ? (
              <>
                <Route path="/login" element={<Login setAuth={setIsAuthenticated} />} />
                <Route path="/register" element={<Register />} />
                <Route path="*" element={<Navigate to="/login" replace />} />
              </>
            ) : (
              <>
                <Route
                  path="/"
                  element={
                    <>
                      {showAddForm && <AddTaskForm onAdd={addTask} />}
                      <FilterBar
                        filter={filter}
                        setFilter={setFilter}
                        sortBy={sortBy}
                        setSortBy={setSortBy}
                      />
                      <TaskList
                        tasks={getSortedTasks()}
                        onUpdate={updateTask}
                        onDelete={deleteTask}
                        onDeleteAll={deleteAllTasks}
                      />
                    </>
                  }
                />
                <Route path="/about" element={<About />} />
                <Route path="/stats" element={<Stats />} />
                <Route path="*" element={<Navigate to="/" replace />} />
              </>
            )}
          </Routes>
        </main>
        {isAuthenticated && <Footer completed={tasks.filter(t => t.completed).length} total={tasks.length} />}
      </div>
    </Router>
  );
}
