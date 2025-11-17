import { Task } from '../types/Task';
import { readFileSync, writeFileSync, existsSync, mkdirSync } from 'fs';
import { join } from 'path';

const isTest = process.env.NODE_ENV === 'test';
const DATA_FILE = join(process.cwd(), 'data', isTest ? 'tasks.test.json' : 'tasks.json');

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
    return JSON.parse(data);
  } catch (error) {
    console.error('Error loading tasks:', error);
    return [];
  }
};

/**
 * Saves tasks to the JSON file
 */
export const saveTasks = (tasks: Task[]): void => {
  try {
    const filePath = ensureDataDirectory();
    writeFileSync(filePath, JSON.stringify(tasks, null, 2), 'utf-8');
  } catch (error) {
    console.error('Error saving tasks:', error);
    throw new Error('Failed to save tasks');
  }
};

