import { existsSync, copyFileSync, writeFileSync, readFileSync, unlinkSync } from 'fs';
import { join } from 'path';
import { Task } from '../../src/types/Task';

const DATA_DIR = join(process.cwd(), 'data');
const PROD_DATA_FILE = join(DATA_DIR, 'tasks.json');
const TEST_DATA_FILE = join(DATA_DIR, 'tasks.test.json');
const BACKUP_DATA_FILE = join(DATA_DIR, 'tasks.test.backup.json');

/**
 * Seeds test data by creating a test data file with sample tasks
 */
export const seedTestData = (tasks: Task[] = []): void => {
  // Ensure data directory exists
  if (!existsSync(DATA_DIR)) {
    const { mkdirSync } = require('fs');
    mkdirSync(DATA_DIR, { recursive: true });
  }

  // Write test data
  writeFileSync(TEST_DATA_FILE, JSON.stringify(tasks, null, 2), 'utf-8');
};

/**
 * Resets test data by backing up current test file and restoring it after
 */
export const resetTestData = (): void => {
  // Backup current test data if it exists
  if (existsSync(TEST_DATA_FILE)) {
    copyFileSync(TEST_DATA_FILE, BACKUP_DATA_FILE);
  }

  // Clean up test data file
  if (existsSync(TEST_DATA_FILE)) {
    unlinkSync(TEST_DATA_FILE);
  }
};

/**
 * Restores test data from backup
 */
export const restoreTestData = (): void => {
  // Remove current test data
  if (existsSync(TEST_DATA_FILE)) {
    unlinkSync(TEST_DATA_FILE);
  }

  // Restore from backup if it exists
  if (existsSync(BACKUP_DATA_FILE)) {
    copyFileSync(BACKUP_DATA_FILE, TEST_DATA_FILE);
    unlinkSync(BACKUP_DATA_FILE);
  }
};

/**
 * Creates a sample task for testing
 */
export const createSampleTask = (overrides: Partial<Task> = {}): Task => {
  return {
    id: crypto.randomUUID(),
    title: 'Sample Task',
    completed: false,
    createdAt: Date.now(),
    ...overrides,
  };
};

