import { useState, createContext, useContext, useEffect } from "react";
import { v4 as uuidv4 } from "uuid";

const TaskContext = createContext();

const TaskProvider = ({ children }) => {
  const [tasks, setTasks] = useState(() => {
    const saved = localStorage.getItem("tasks");
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => {
    localStorage.setItem("tasks", JSON.stringify(tasks));
  }, [tasks]);

  const addTask = (text) => {
    setTasks([...tasks, { id: uuidv4(), text, status: "todo" }]);
  };

  const updateTaskStatus = (id, status) => {
    setTasks(
      tasks.map((task) => (task.id === id ? { ...task, status } : task))
    );
  };

  const removeTask = (id) => {
    setTasks(tasks.filter((task) => task.id !== id));
  };

  return (
    <TaskContext.Provider
      value={{ tasks, addTask, updateTaskStatus, removeTask }}
    >
      {children}
    </TaskContext.Provider>
  );
};

const useTasks = () => useContext(TaskContext);

const TodoList = () => {
  const { tasks, addTask, removeTask, updateTaskStatus } = useTasks();
  const [input, setInput] = useState("");

  const handleAdd = () => {
    if (input.trim()) {
      addTask(input.trim());
      setInput("");
    }
  };

  return (
    <div className="p-4">
      <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-100 mb-4">
        To-Do List
      </h2>
      <div className="flex gap-2 mb-4">
        <input
          className="flex-1 p-2 border rounded shadow-inner bg-transparent text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Add a task..."
        />
        <button
          onClick={handleAdd}
          className="px-3 py-2 rounded shadow bg-transparent text-gray-900 dark:text-gray-100 border border-gray-300 dark:border-gray-600 hover:shadow-md"
        >
          Add
        </button>
      </div>
      <ul className="space-y-2">
        {tasks
          .filter((t) => t.status === "todo")
          .map((task) => (
            <li
              key={task.id}
              className="flex justify-between items-center p-3 rounded shadow-md bg-transparent border border-gray-200 dark:border-gray-700 text-gray-800 dark:text-gray-100"
            >
              <span>{task.text}</span>
              <div className="flex gap-2">
                <button
                  onClick={() => updateTaskStatus(task.id, "in-progress")}
                  className="text-sm text-blue-600 dark:text-blue-400 hover:underline"
                >
                  In Progress
                </button>
                <button
                  onClick={() => removeTask(task.id)}
                  className="text-sm text-red-600 dark:text-red-400 hover:underline"
                >
                  Delete
                </button>
              </div>
            </li>
          ))}
      </ul>
    </div>
  );
};

const KanbanBoard = () => {
  const { tasks, updateTaskStatus } = useTasks();
  const columns = ["todo", "in-progress", "done"];

  const getTitle = (status) => {
    switch (status) {
      case "todo":
        return "To Do";
      case "in-progress":
        return "In Progress";
      case "done":
        return "Done";
    }
  };

  return (
    <div className="p-4 grid grid-cols-3 gap-4">
      {columns.map((status) => (
        <div
          key={status}
          className="rounded border border-gray-300 dark:border-gray-600 p-3 shadow-md bg-transparent"
        >
          <h3 className="font-semibold text-gray-900 dark:text-gray-100 mb-2">
            {getTitle(status)}
          </h3>
          <div className="space-y-2">
            {tasks
              .filter((t) => t.status === status)
              .map((task) => (
                <div
                  key={task.id}
                  className="p-2 rounded shadow-md bg-transparent border border-gray-200 dark:border-gray-700 text-gray-800 dark:text-gray-100"
                >
                  <p>{task.text}</p>
                  <div className="flex gap-2 mt-1 text-sm">
                    {columns
                      .filter((col) => col !== status)
                      .map((targetStatus) => (
                        <button
                          key={targetStatus}
                          onClick={() =>
                            updateTaskStatus(task.id, targetStatus)
                          }
                          className="text-blue-600 dark:text-blue-400 hover:underline"
                        >
                          {getTitle(targetStatus)}
                        </button>
                      ))}
                  </div>
                </div>
              ))}
          </div>
        </div>
      ))}
    </div>
  );
};

const TaskPanel = () => {
  const [tab, setTab] = useState("todo");

  return (
    <TaskProvider>
      <div className="h-full w-full">
        <div className="flex border-b border-gray-300 dark:border-gray-600">
          <button
            onClick={() => setTab("todo")}
            className={`px-4 py-2 transition border-r border-gray-300 dark:border-gray-600 ${
              tab === "todo"
                ? "font-semibold text-gray-900 dark:text-gray-100"
                : "text-gray-600 dark:text-gray-400"
            }`}
          >
            To-Do List
          </button>
          <button
            onClick={() => setTab("kanban")}
            className={`px-4 py-2 transition ${
              tab === "kanban"
                ? "font-semibold text-gray-900 dark:text-gray-100"
                : "text-gray-600 dark:text-gray-400"
            }`}
          >
            Kanban Board
          </button>
        </div>
        {tab === "todo" ? <TodoList /> : <KanbanBoard />}
      </div>
    </TaskProvider>
  );
};

export default TaskPanel;
