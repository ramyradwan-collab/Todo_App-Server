import { Page } from '@playwright/test';

/**
 * Helper functions for interacting with the Todo app in tests
 */

export const addTask = async (page: Page, taskTitle: string): Promise<void> => {
  await page.getByTestId('task-input-field').fill(taskTitle);
  await page.getByTestId('task-input-submit').click();
  // Wait for task to appear
  await page.waitForSelector('[data-testid^="task-item-"]');
};

export const toggleTask = async (page: Page, taskId: string): Promise<void> => {
  const checkboxId = `task-checkbox-${taskId}`;
  await page.getByTestId(checkboxId).click();
};

export const deleteTask = async (page: Page, taskId: string): Promise<void> => {
  const deleteButtonId = `task-delete-${taskId}`;
  await page.getByTestId(deleteButtonId).click();
};

export const filterTasks = async (page: Page, filter: 'all' | 'active' | 'completed'): Promise<void> => {
  const filterMap = {
    all: 'filter-all',
    active: 'filter-active',
    completed: 'filter-completed',
  };
  await page.getByTestId(filterMap[filter]).click();
};

export const getTaskId = async (page: Page, taskTitle: string): Promise<string | null> => {
  const taskItem = page.locator(`[data-testid^="task-item-"]`).filter({
    hasText: taskTitle,
  });
  const dataTestId = await taskItem.getAttribute('data-testid');
  return dataTestId ? dataTestId.replace('task-item-', '') : null;
};

