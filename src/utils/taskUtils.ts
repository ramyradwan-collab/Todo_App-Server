import { Task } from '../types/Task';

/**
 * Creates a new task with a trimmed title and unique ID
 */
export const createTask = (title: string): Task => {
  return {
    id: crypto.randomUUID(),
    title: title.trim(),
    completed: false,
    createdAt: Date.now(),
  };
};

/**
 * Loads tasks from localStorage
 */
export const loadTasksFromStorage = (): Task[] => {
  try {
    const stored = localStorage.getItem('tasks');
    if (!stored) return [];
    return JSON.parse(stored);
  } catch {
    return [];
  }
};

/**
 * Saves tasks to localStorage
 */
export const saveTasksToStorage = (tasks: Task[]): void => {
  try {
    localStorage.setItem('tasks', JSON.stringify(tasks));
  } catch (error) {
    console.error('Failed to save tasks to localStorage:', error);
  }
};

