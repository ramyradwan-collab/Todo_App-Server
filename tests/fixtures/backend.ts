import { test as base } from '@playwright/test';
import { existsSync, writeFileSync, unlinkSync, mkdirSync } from 'fs';
import { join } from 'path';

const DATA_DIR = join(process.cwd(), 'backend', 'data');
const TEST_DATA_FILE = join(DATA_DIR, 'tasks.test.json');
const DEV_DATA_FILE = join(DATA_DIR, 'tasks.json');

/**
 * Fixture to reset backend test data before each test
 * Clears both test and dev data files since the server may be running in dev mode
 */
export const test = base.extend({
  resetBackendData: async ({}, use) => {
    // Setup: Clear both test and dev data files before test
    // The backend server may be running in dev mode, so we need to clear tasks.json
    if (!existsSync(DATA_DIR)) {
      mkdirSync(DATA_DIR, { recursive: true });
    }
    
    // Clear test data file
    if (existsSync(TEST_DATA_FILE)) {
      unlinkSync(TEST_DATA_FILE);
    }
    
    // Clear dev data file (server may be running in dev mode)
    if (existsSync(DEV_DATA_FILE)) {
      unlinkSync(DEV_DATA_FILE);
    }
    
    // Write empty array to ensure clean state
    writeFileSync(DEV_DATA_FILE, '[]', 'utf-8');
    
    // Small delay to ensure file system operations complete
    await new Promise(resolve => setTimeout(resolve, 100));

    await use();

    // Teardown: Clean up test data after test
    if (existsSync(TEST_DATA_FILE)) {
      unlinkSync(TEST_DATA_FILE);
    }
    // Also clear dev data file after test
    if (existsSync(DEV_DATA_FILE)) {
      writeFileSync(DEV_DATA_FILE, '[]', 'utf-8');
    }
  },
});

export { expect } from '@playwright/test';

