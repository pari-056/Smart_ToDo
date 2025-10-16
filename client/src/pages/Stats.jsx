import React, { useEffect, useState } from "react";
import axios from "../api/axiosInstance";

import {
  PieChart,
  Pie,
  Cell,
  Legend,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

// Pie chart color palette
const COLORS = ["#4F46E5", "#22C55E", "#F59E42", "#EF4444"];

export default function Stats() {
  const [chartData, setChartData] = useState([]);
  const [summary, setSummary] = useState({
    total: 0,
    completed: 0,
    pending: 0,
    overdue: 0,
  });

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const res = await axios.get("/api/tasks");
        const tasks = res.data;
        const now = new Date();

        const completedCount = tasks.filter((t) => t.completed).length;
        const overdueCount = tasks.filter(
          (t) => !t.completed && new Date(t.deadline) < now
        ).length;
        const pendingCount =
          tasks.length - completedCount - overdueCount;

        setSummary({
          total: tasks.length,
          completed: completedCount,
          pending: pendingCount,
          overdue: overdueCount,
        });

        setChartData([
          { name: "Completed", value: completedCount },
          { name: "Pending", value: pendingCount },
          { name: "Overdue", value: overdueCount },
        ]);
      } catch (err) {
        console.error("Error fetching tasks:", err);
      }
    };
    fetchTasks();
  }, []);

  return (
    <section className="px-6 py-10 md:px-16 text-gray-800 dark:text-gray-200">
      <h1 className="text-3xl font-bold mb-6 text-indigo-600 dark:text-indigo-400">
        Task Analytics
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
        <div>
          <div className="mb-6 rounded-lg shadow bg-white dark:bg-gray-800 p-6">
            <h2 className="text-xl font-semibold text-gray-700 dark:text-gray-100 mb-3">
              Task Summary
            </h2>
            <ul className="space-y-2 text-md">
              <li>
                <span className="font-semibold">Total Tasks:</span>{" "}
                <span className="text-indigo-600 dark:text-indigo-400">{summary.total}</span>
              </li>
              <li>
                <span className="font-semibold">Completed:</span>{" "}
                <span className="text-green-600">{summary.completed}</span>
              </li>
              <li>
                <span className="font-semibold">Pending:</span>{" "}
                <span className="text-yellow-500">{summary.pending}</span>
              </li>
              <li>
                <span className="font-semibold">Overdue:</span>{" "}
                <span className="text-rose-600">{summary.overdue}</span>
              </li>
            </ul>
          </div>
          <div className="mt-6 text-md">
            {summary.completed > 0 && (
              <p className="text-green-700">
                {`You've completed ${summary.completed} task${summary.completed > 1 ? "s" : ""}. Great job!`}
              </p>
            )}
            {summary.overdue > 0 && (
              <p className="text-rose-700">
                {`${summary.overdue} task${summary.overdue > 1 ? "s are" : " is"} overdue!`}
              </p>
            )}
          </div>
        </div>

        <div style={{ width: "100%", height: 300 }}>
          <ResponsiveContainer>
            <PieChart>
              <Pie
                data={chartData}
                cx="50%"
                cy="50%"
                labelLine={false}
                outerRadius={100}
                dataKey="value"
                label={({ name, value }) => `${name} (${value})`}
              >
                {chartData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>
    </section>
  );
}
