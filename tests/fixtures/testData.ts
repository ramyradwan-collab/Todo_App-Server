/**
 * Test data fixtures for E2E tests
 * This file contains sample data that can be used in tests
 */

export const testTasks = {
  single: {
    title: 'Test Task',
  },
  multiple: [
    { title: 'First Task' },
    { title: 'Second Task' },
    { title: 'Third Task' },
  ],
  longTitle: {
    title: 'This is a very long task title that should be handled properly by the UI',
  },
  specialChars: {
    title: 'Task with special chars: !@#$%^&*()',
  },
};

export const testFilters = {
  all: 'all',
  active: 'active',
  completed: 'completed',
};

