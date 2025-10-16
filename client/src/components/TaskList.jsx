import React from "react";
import TaskCard from "./TaskCard";

export default function TaskList({ tasks, onUpdate, onDelete, onDeleteAll }) {
  if (!tasks.length)
    return (
      <div className="mx-6 my-8 text-center text-gray-500 dark:text-gray-400 md:mx-16">
        No tasks to show. Try adding or changing filters!
      </div>
    );

  return (
    <>
      <div className="mx-6 md:mx-16 grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5 py-6">
        {tasks.map((task) => (
          <TaskCard
            key={task._id || task.id}
            task={task}
            onUpdate={onUpdate}
            onDelete={onDelete}
          />
        ))}
      </div>

      <div className="mx-6 md:mx-16 py-4 text-center">
        <button
          onClick={onDeleteAll}
          className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded transition font-semibold"
        >
          Delete All Tasks
        </button>
      </div>
    </>
  );
}
