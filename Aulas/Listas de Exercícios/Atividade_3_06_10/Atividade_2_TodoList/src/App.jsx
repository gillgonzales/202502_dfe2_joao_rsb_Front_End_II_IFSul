import { useState, useEffect } from "react";
import TaskList from "./TaskList";

export default function App() {
  const [tasks, setTasks] = useState([]);//Ler o localStorage na inicialização do state.

  // carregar tarefas do localStorage
  useEffect(() => {
    const savedTasks = JSON.parse(localStorage.getItem("tasks")) || [];
    setTasks(savedTasks);
  }, []);

  // salvar tarefas no localStorage
  useEffect(() => {
    //resolve mas não é o ideal, o ideal é passar uma função ao useState que retorne
    //  o conteúdo do localStorage ou um array vazio se não houver nada
   tasks.length && localStorage.setItem("tasks", JSON.stringify(tasks));
  }, [tasks]);

  const addTask = () => {
    const title = prompt("Digite o título da tarefa:");
    if (title) {
      setTasks([...tasks, { id: Date.now(), title, steps: [] }]);
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
      <h1 className="text-3xl font-bold mb-6">📋 TodoList de Lista de Tarefas</h1>
      <br></br>
      <button
        onClick={addTask}
        className="px-4 py-2 bg-blue-600 rounded hover:bg-blue-800 mb-6"
      >
        ➕ Adicionar Tarefa
      </button>
      <TaskList tasks={tasks} removeTask={removeTask} updateTask={updateTask} />
    </div>
  );
}
