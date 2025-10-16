import React, { useState, useEffect } from "react";
import axios from "axios";
import AddTaskForm from "../components/AddTaskForm";
import FilterBar from "../components/FilterBar";
import TaskList from "../components/TaskList";

export default function Home() {
  const [tasks, setTasks] = useState([]);
  const [filter, setFilter] = useState({ category: "All", priority: "All", status: "All" });
  const [sortBy, setSortBy] = useState("deadline");

  const fetchTasks = async () => {
    try {
      const res = await axios.get(`/api/tasks?sortBy=${sortBy}`);
      setTasks(res.data);
    } catch (err) {
      console.error("Error fetching tasks:", err);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, [sortBy]);

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

  return (
    <div className="px-6 py-4 md:px-16">
      <AddTaskForm onAdd={addTask} />
      <FilterBar filter={filter} setFilter={setFilter} sortBy={sortBy} setSortBy={setSortBy} />
      <TaskList tasks={tasks} onUpdate={updateTask} onDelete={deleteTask} />
    </div>
  );
}
