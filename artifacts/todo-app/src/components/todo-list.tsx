import { useState, type KeyboardEvent } from 'react';
import { Trash2, Plus, Edit2, Check, X } from 'lucide-react';

interface Task {
  id: string;
  title: string;
  completed: boolean;
  createdAt: Date;
}

export default function TodoList() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [input, setInput] = useState('');
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editValue, setEditValue] = useState('');

  const addTask = () => {
    if (input.trim()) {
      setTasks([
        ...tasks,
        {
          id: Date.now().toString(),
          title: input,
          completed: false,
          createdAt: new Date(),
        },
      ]);
      setInput('');
    }
  };

  const deleteTask = (id: string) => {
    setTasks(tasks.filter((task) => task.id !== id));
  };

  const toggleComplete = (id: string) => {
    setTasks(
      tasks.map((task) =>
        task.id === id ? { ...task, completed: !task.completed } : task
      )
    );
  };

  const startEdit = (id: string, title: string) => {
    setEditingId(id);
    setEditValue(title);
  };

  const saveEdit = (id: string) => {
    if (editValue.trim()) {
      setTasks(
        tasks.map((task) =>
          task.id === id ? { ...task, title: editValue } : task
        )
      );
    }
    setEditingId(null);
    setEditValue('');
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditValue('');
  };

  const handleKeyPress = (e: KeyboardEvent<HTMLInputElement>, callback: () => void) => {
    if (e.key === 'Enter') {
      callback();
    } else if (e.key === 'Escape') {
      cancelEdit();
    }
  };

  const completedCount = tasks.filter((task) => task.completed).length;

  return (
    <div className="flex min-h-[100dvh] flex-col bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-950 dark:to-slate-900">
      {/* Header */}
      <header className="border-b border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm">
        <div className="max-w-3xl mx-auto px-6 py-6">
          <h1 className="text-3xl font-bold text-slate-900 dark:text-white">
            Mis tareas
          </h1>
          <p className="text-sm text-slate-600 dark:text-slate-400 mt-2">
            {completedCount} de {tasks.length} completadas
          </p>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto">
        <div className="max-w-3xl mx-auto px-6 py-8">
          {/* Input Section */}
          <div className="mb-8 flex flex-col gap-2 sm:flex-row">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.nativeEvent.isComposing || e.keyCode === 229) return;
                if (e.key === 'Enter') {
                  addTask();
                }
              }}
              placeholder="Añade una nueva tarea..."
              className="min-w-0 flex-1 rounded-lg border border-slate-300 bg-white px-4 py-3 text-slate-900 placeholder-slate-500 transition-all focus:border-transparent focus:outline-none focus:ring-2 focus:ring-blue-500 dark:border-slate-600 dark:bg-slate-800 dark:text-white dark:placeholder-slate-400"
            />
            <button
              onClick={addTask}
              className="flex w-full items-center justify-center gap-2 rounded-lg bg-blue-600 px-6 py-3 font-medium text-white transition-colors hover:bg-blue-700 sm:w-auto"
            >
              <Plus size={20} />
              Añadir
            </button>
          </div>

          {/* Tasks List */}
          {tasks.length === 0 ? (
            <div className="text-center py-16">
              <p className="text-slate-500 dark:text-slate-400 text-lg">
                Aún no hay tareas. ¡Crea una para empezar!
              </p>
            </div>
          ) : (
            <div className="space-y-2">
              {tasks.map((task) => (
                <div
                  key={task.id}
                  className="flex items-center gap-3 p-4 bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 hover:shadow-md transition-shadow"
                >
                  {/* Checkbox */}
                  <input
                    type="checkbox"
                    checked={task.completed}
                    onChange={() => toggleComplete(task.id)}
                    className="w-5 h-5 rounded border-slate-300 dark:border-slate-600 text-blue-600 cursor-pointer"
                  />

                  {/* Task Content */}
                  {editingId === task.id ? (
                    <input
                      type="text"
                      value={editValue}
                      onChange={(e) => setEditValue(e.target.value)}
                      onKeyDown={(e) => handleKeyPress(e, () => saveEdit(task.id))}
                      autoFocus
                      className="flex-1 px-3 py-2 rounded border border-blue-500 dark:border-blue-400 bg-white dark:bg-slate-700 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  ) : (
                    <span
                      className={`flex-1 text-base ${
                        task.completed
                          ? 'line-through text-slate-400 dark:text-slate-500'
                          : 'text-slate-900 dark:text-white'
                      }`}
                    >
                      {task.title}
                    </span>
                  )}

                  {/* Actions */}
                  <div className="flex items-center gap-2">
                    {editingId === task.id ? (
                      <>
                        <button
                          onClick={() => saveEdit(task.id)}
                          className="p-2 text-green-600 hover:bg-green-50 dark:hover:bg-slate-700 rounded transition-colors"
                          title="Guardar"
                        >
                          <Check size={18} />
                        </button>
                        <button
                          onClick={cancelEdit}
                          className="p-2 text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700 rounded transition-colors"
                          title="Cancelar"
                        >
                          <X size={18} />
                        </button>
                      </>
                    ) : (
                      <>
                        <button
                          onClick={() => startEdit(task.id, task.title)}
                          className="p-2 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 rounded transition-colors"
                          title="Editar"
                        >
                          <Edit2 size={18} />
                        </button>
                        <button
                          onClick={() => deleteTask(task.id)}
                          className="p-2 text-red-500 hover:bg-red-50 dark:hover:bg-slate-700 rounded transition-colors"
                          title="Eliminar"
                        >
                          <Trash2 size={18} />
                        </button>
                      </>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900">
        <div className="max-w-3xl mx-auto px-6 py-4 text-center text-sm text-slate-600 dark:text-slate-400">
          <p>
            {tasks.length > 0
              ? `${tasks.length} tarea${tasks.length !== 1 ? 's' : ''} en total`
              : 'Empieza añadiendo tu primera tarea'}
          </p>
        </div>
      </footer>
    </div>
  );
}
