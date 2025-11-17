import { Task } from '../types/Task';

const API_BASE_URL = 'http://localhost:3000';

/**
 * Checks server health
 */
export const checkHealth = async (): Promise<boolean> => {
  try {
    const response = await fetch(`${API_BASE_URL}/health`);
    if (!response.ok) return false;
    const data = await response.json();
    return data.ok === true;
  } catch {
    return false;
  }
};

/**
 * Fetches all tasks from the API
 */
export const fetchTasks = async (): Promise<Task[]> => {
  try {
    const response = await fetch(`${API_BASE_URL}/tasks`);
    if (!response.ok) {
      throw new Error(`Failed to fetch tasks: ${response.statusText}`);
    }
    return await response.json();
  } catch (error) {
    throw new Error('Unable to connect to the server. Please make sure the backend is running.');
  }
};

/**
 * Creates a new task via the API
 */
export const createTask = async (title: string): Promise<Task> => {
  try {
    const response = await fetch(`${API_BASE_URL}/tasks`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ title }),
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({ error: response.statusText }));
      throw new Error(error.error || 'Failed to create task');
    }

    return await response.json();
  } catch (error) {
    if (error instanceof Error) {
      throw error;
    }
    throw new Error('Unable to connect to the server. Please make sure the backend is running.');
  }
};

/**
 * Updates a task via the API
 */
export const updateTask = async (id: string, updates: { title?: string; completed?: boolean }): Promise<Task> => {
  try {
    const response = await fetch(`${API_BASE_URL}/tasks/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(updates),
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({ error: response.statusText }));
      throw new Error(error.error || 'Failed to update task');
    }

    return await response.json();
  } catch (error) {
    if (error instanceof Error) {
      throw error;
    }
    throw new Error('Unable to connect to the server. Please make sure the backend is running.');
  }
};

/**
 * Deletes a task via the API
 */
export const deleteTask = async (id: string): Promise<void> => {
  try {
    const response = await fetch(`${API_BASE_URL}/tasks/${id}`, {
      method: 'DELETE',
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({ error: response.statusText }));
      throw new Error(error.error || 'Failed to delete task');
    }
  } catch (error) {
    if (error instanceof Error) {
      throw error;
    }
    throw new Error('Unable to connect to the server. Please make sure the backend is running.');
  }
};
