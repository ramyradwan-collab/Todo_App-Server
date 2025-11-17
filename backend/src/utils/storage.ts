import { Task } from '../types/Task';
import { readFileSync, writeFileSync, existsSync, mkdirSync } from 'fs';
import { join } from 'path';

const isTest = process.env.NODE_ENV === 'test';
const DATA_FILE = join(process.cwd(), 'data', isTest ? 'tasks.test.json' : 'tasks.json');

/**
 * Cleans up and validates existing data file on startup
 * This helps fix any corrupted data
 */
export const cleanupDataFile = (): void => {
  try {
    const tasks = loadTasks();
    if (tasks.length > 0) {
      // Re-save to ensure all tasks are properly sanitized
      saveTasks(tasks);
      console.log(`Data cleanup: Validated and sanitized ${tasks.length} tasks`);
    }
  } catch (error) {
    console.error('Error during data cleanup:', error);
  }
};

/**
 * Ensures the data directory exists and returns the file path
 */
const ensureDataDirectory = (): string => {
  const dataDir = join(process.cwd(), 'data');
  if (!existsSync(dataDir)) {
    mkdirSync(dataDir, { recursive: true });
  }
  return DATA_FILE;
};

/**
 * Loads tasks from the JSON file
 */
export const loadTasks = (): Task[] => {
  try {
    const filePath = ensureDataDirectory();
    if (!existsSync(filePath)) {
      return [];
    }
    const data = readFileSync(filePath, 'utf-8');
    
    // Handle empty file
    if (!data || data.trim().length === 0) {
      return [];
    }
    
    const parsed = JSON.parse(data);
    
    // Validate that parsed data is an array
    if (!Array.isArray(parsed)) {
      console.error('Error loading tasks: Data is not an array, resetting to empty array');
      return [];
    }
    
    // Validate and sanitize each task
    const validatedTasks: Task[] = [];
    for (const task of parsed) {
      // Ensure required fields exist and are valid
      if (
        task &&
        typeof task === 'object' &&
        typeof task.id === 'string' &&
        typeof task.title === 'string' &&
        typeof task.completed === 'boolean' &&
        typeof task.createdAt === 'number'
      ) {
        // Sanitize title: ensure it's a string and trim it
        const sanitizedTitle = String(task.title).trim();
        if (sanitizedTitle.length > 0) {
          validatedTasks.push({
            id: task.id,
            title: sanitizedTitle,
            completed: task.completed,
            createdAt: task.createdAt,
            ...(task.dueDate && typeof task.dueDate === 'number' ? { dueDate: task.dueDate } : {}),
          });
        } else {
          console.warn(`Skipping task with empty title (ID: ${task.id})`);
        }
      } else {
        console.warn('Skipping invalid task:', task);
      }
    }
    
    return validatedTasks;
  } catch (error) {
    console.error('Error loading tasks:', error);
    // If JSON is corrupted, return empty array
    return [];
  }
};

/**
 * Saves tasks to the JSON file
 */
export const saveTasks = (tasks: Task[]): void => {
  try {
    // Validate input
    if (!Array.isArray(tasks)) {
      throw new Error('Tasks must be an array');
    }
    
    // Validate and sanitize each task before saving
    const sanitizedTasks: Task[] = tasks.map((task) => {
      if (!task || typeof task !== 'object') {
        throw new Error('Invalid task object');
      }
      
      // Ensure all required fields exist
      if (typeof task.id !== 'string' || task.id.length === 0) {
        throw new Error('Task must have a valid id');
      }
      if (typeof task.title !== 'string') {
        throw new Error('Task title must be a string');
      }
      if (typeof task.completed !== 'boolean') {
        throw new Error('Task completed must be a boolean');
      }
      if (typeof task.createdAt !== 'number') {
        throw new Error('Task createdAt must be a number');
      }
      
      // Sanitize title: trim and ensure it's not empty
      const sanitizedTitle = String(task.title).trim();
      if (sanitizedTitle.length === 0) {
        throw new Error(`Task with id ${task.id} has an empty title`);
      }
      
      return {
        id: task.id,
        title: sanitizedTitle,
        completed: task.completed,
        createdAt: task.createdAt,
        ...(task.dueDate && typeof task.dueDate === 'number' ? { dueDate: task.dueDate } : {}),
      };
    });
    
    const filePath = ensureDataDirectory();
    const jsonData = JSON.stringify(sanitizedTasks, null, 2);
    writeFileSync(filePath, jsonData, 'utf-8');
  } catch (error) {
    console.error('Error saving tasks:', error);
    throw new Error(`Failed to save tasks: ${error instanceof Error ? error.message : String(error)}`);
  }
};

