import { useState, useEffect, useRef } from "react";
import TaskList from "./TaskList";

export default function App() {
  const [tasks, setTasks] = useState([]); //Ler o localStorage
  const taskInputRef = useRef(); // referência para o input de tarefa

  // carregar tarefas do localStorage
  useEffect(() => {
    const savedTasks = JSON.parse(localStorage.getItem("tasks")) || [];
    setTasks(savedTasks);
  }, []);

  // salvar tarefas no localStorage
  useEffect(() => {
    localStorage.setItem("tasks", JSON.stringify(tasks));
  }, [tasks]);

  const addTask = () => {
    const title = taskInputRef.current.value.trim();
    if (title) {
      setTasks([...tasks, { id: Date.now(), title, steps: [] }]);
      taskInputRef.current.value = ""; // limpa input
    }
  };

  const removeTask = (id) => {
    setTasks(tasks.filter((task) => task.id !== id));
  };

  const updateTask = (updatedTask) => {
    setTasks(tasks.map((task) => (task.id === updatedTask.id ? updatedTask : task)));
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white p-6">
      <h1 className="text-3xl font-bold mb-6">📋 TodoList de Lista de Tarefas com useRef</h1>

      {/* Campo de entrada da tarefa */}
      <div className="mb-6 flex gap-2">
        <input
          type="text"
          ref={taskInputRef}
          placeholder="Digite o título da tarefa..."
          className="px-4 py-2 rounded bg-gray-800 text-white w-full outline-none border border-gray-600"
        />
        <button
          onClick={addTask}
          className="add-task"
        >
          ➕ Adicionar Tarefa
        </button>
      </div>

      <TaskList tasks={tasks} removeTask={removeTask} updateTask={updateTask} />
    </div>
  );
}
