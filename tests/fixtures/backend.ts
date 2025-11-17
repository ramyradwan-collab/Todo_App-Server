import { test as base } from '@playwright/test';
import { existsSync, writeFileSync, unlinkSync, mkdirSync } from 'fs';
import { join } from 'path';

const DATA_DIR = join(process.cwd(), 'backend', 'data');
const TEST_DATA_FILE = join(DATA_DIR, 'tasks.test.json');

/**
 * Fixture to reset backend test data before each test
 */
export const test = base.extend({
  resetBackendData: async ({}, use) => {
    // Setup: Clear test data before test
    if (existsSync(TEST_DATA_FILE)) {
      unlinkSync(TEST_DATA_FILE);
    } else {
      // Ensure data directory exists
      if (!existsSync(DATA_DIR)) {
        mkdirSync(DATA_DIR, { recursive: true });
      }
    }

    await use();

    // Teardown: Clean up test data after test
    if (existsSync(TEST_DATA_FILE)) {
      unlinkSync(TEST_DATA_FILE);
    }
  },
});

export { expect } from '@playwright/test';

