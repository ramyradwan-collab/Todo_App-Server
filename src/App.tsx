import { useState, useEffect, useMemo } from 'react';
import { Task, FilterType } from './types/Task';
import { fetchTasks, createTask, updateTask, deleteTask } from './utils/api';
import { TaskInput } from './components/TaskInput';
import { TaskItem } from './components/TaskItem';
import { FilterButtons } from './components/FilterButtons';
import { HealthBanner } from './components/HealthBanner';
import './App.css';

function App() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [filter, setFilter] = useState<FilterType>('all');
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Load tasks from API on mount
  useEffect(() => {
    const loadTasks = async () => {
      try {
        setIsLoading(true);
        setError(null);
        const loadedTasks = await fetchTasks();
        setTasks(loadedTasks);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load tasks');
      } finally {
        setIsLoading(false);
      }
    };

    loadTasks();
  }, []);

  const handleAddTask = async (title: string, dueDate?: number) => {
    try {
      setError(null);
      const newTask = await createTask(title, dueDate);
      setTasks((prev) => [newTask, ...prev]);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create task');
    }
  };

  const handleToggleTask = async (id: string) => {
    try {
      setError(null);
      const task = tasks.find((t) => t.id === id);
      if (!task) return;

      const updatedTask = await updateTask(id, { completed: !task.completed });
      setTasks((prev) =>
        prev.map((t) => (t.id === id ? updatedTask : t))
      );
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update task');
    }
  };

  const handleDeleteTask = async (id: string) => {
    try {
      setError(null);
      await deleteTask(id);
      setTasks((prev) => prev.filter((task) => task.id !== id));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete task');
    }
  };

  // Filter and sort tasks (newest first)
  const filteredTasks = useMemo(() => {
    let filtered = tasks;
    if (filter === 'active') {
      filtered = tasks.filter((task) => !task.completed);
    } else if (filter === 'completed') {
      filtered = tasks.filter((task) => task.completed);
    }
    return [...filtered].sort((a, b) => b.createdAt - a.createdAt);
  }, [tasks, filter]);

  // Calculate counts
  const counts = useMemo(() => {
    return {
      all: tasks.length,
      active: tasks.filter((task) => !task.completed).length,
      completed: tasks.filter((task) => task.completed).length,
    };
  }, [tasks]);

  return (
    <div className="app" data-testid="app">
      <HealthBanner />
      <div className="todo-card" data-testid="todo-card">
        <h1 className="todo-card__title" data-testid="app-title">Todo App</h1>
        {error && (
          <div className="todo-card__error" data-testid="error-message">
            <p>{error}</p>
            <button
              onClick={() => window.location.reload()}
              className="todo-card__error-button"
              data-testid="error-retry-button"
            >
              Retry
            </button>
          </div>
        )}
        <TaskInput onAddTask={handleAddTask} />
        <FilterButtons
          currentFilter={filter}
          onFilterChange={setFilter}
          counts={counts}
        />
        <div className="todo-card__tasks" data-testid="tasks-list">
          {isLoading ? (
            <p className="todo-card__empty" data-testid="loading-message">Loading tasks...</p>
          ) : filteredTasks.length === 0 ? (
            <p className="todo-card__empty" data-testid="empty-message">No tasks found</p>
          ) : (
            filteredTasks.map((task) => (
              <TaskItem
                key={task.id}
                task={task}
                onToggle={handleToggleTask}
                onDelete={handleDeleteTask}
              />
            ))
          )}
        </div>
      </div>
    </div>
  );
}

export default App;

