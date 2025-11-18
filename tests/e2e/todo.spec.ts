import { test, expect } from '../fixtures/backend';

test.describe('Todo App E2E', () => {
  test.beforeEach(async ({ page, resetBackendData }) => {
    // Wait a bit for data reset to complete
    await page.waitForTimeout(200);
    // Navigate to the app
    await page.goto('http://localhost:5173');
    // Wait for the app to load
    await page.waitForSelector('[data-testid="app"]', { timeout: 10000 });
    // Wait for initial tasks to load (or empty state)
    await page.waitForSelector('[data-testid="tasks-list"]', { timeout: 10000 });
    // Wait a bit more to ensure backend has processed the empty state
    await page.waitForTimeout(500);
  });

  test('should add a task', async ({ page, resetBackendData }) => {
    // Arrange: App is loaded with empty state
    const taskTitle = 'Test Task from E2E';
    
    // Act: Add a new task
    await page.getByTestId('task-input-field').fill(taskTitle);
    await page.getByTestId('task-input-submit').click();
    
    // Assert: Task should appear in the list
    await page.waitForSelector('[data-testid^="task-item-"]');
    const taskItem = page.locator(`[data-testid^="task-item-"]`).filter({
      hasText: taskTitle,
    });
    await expect(taskItem).toBeVisible();
    await expect(taskItem.getByTestId(/task-title-/)).toHaveText(taskTitle);
  });

  test('should toggle task completion', async ({ page, resetBackendData }) => {
    // Arrange: Add a task first
    const taskTitle = 'Task to Toggle';
    await page.getByTestId('task-input-field').fill(taskTitle);
    await page.getByTestId('task-input-submit').click();
    await page.waitForSelector('[data-testid^="task-item-"]', { timeout: 10000 });
    await page.waitForTimeout(500); // Wait for state update
    
    const taskItem = page.locator(`[data-testid^="task-item-"]`).filter({
      hasText: taskTitle,
    });
    await expect(taskItem).toBeVisible();
    const taskId = await taskItem.getAttribute('data-testid');
    const checkboxId = taskId!.replace('task-item-', 'task-checkbox-');
    
    // Act: Toggle the checkbox
    const checkbox = page.getByTestId(checkboxId);
    await expect(checkbox).not.toBeChecked({ timeout: 5000 });
    await checkbox.click({ timeout: 5000 });
    await page.waitForTimeout(500); // Wait for state update
    
    // Assert: Task should be marked as completed
    await expect(checkbox).toBeChecked({ timeout: 5000 });
    await expect(taskItem).toHaveClass(/task-item--completed/, { timeout: 5000 });
  });

  test('should delete a task', async ({ page, resetBackendData }) => {
    // Arrange: Add a task first
    const taskTitle = 'Task to Delete';
    await page.getByTestId('task-input-field').fill(taskTitle);
    await page.getByTestId('task-input-submit').click();
    await page.waitForSelector('[data-testid^="task-item-"]', { timeout: 10000 });
    await page.waitForTimeout(500); // Wait for state update
    
    const taskItem = page.locator(`[data-testid^="task-item-"]`).filter({
      hasText: taskTitle,
    });
    await expect(taskItem).toBeVisible({ timeout: 5000 });
    
    // Act: Delete the task
    const taskId = await taskItem.getAttribute('data-testid');
    const deleteButtonId = taskId!.replace('task-item-', 'task-delete-');
    await page.getByTestId(deleteButtonId).click({ timeout: 5000 });
    await page.waitForTimeout(500); // Wait for state update
    
    // Assert: Task should be removed
    await expect(taskItem).not.toBeVisible({ timeout: 5000 });
  });

  test('should persist tasks after page refresh', async ({ page, resetBackendData }) => {
    // Arrange: Add a task
    const taskTitle = 'Persistent Task';
    await page.getByTestId('task-input-field').fill(taskTitle);
    await page.getByTestId('task-input-submit').click();
    await page.waitForSelector('[data-testid^="task-item-"]', { timeout: 10000 });
    await page.waitForTimeout(500); // Wait for backend to save
    
    // Verify task is visible
    const taskItem = page.locator(`[data-testid^="task-item-"]`).filter({
      hasText: taskTitle,
    });
    await expect(taskItem).toBeVisible({ timeout: 5000 });
    
    // Act: Refresh the page
    await page.reload();
    await page.waitForSelector('[data-testid="app"]', { timeout: 10000 });
    await page.waitForSelector('[data-testid="tasks-list"]', { timeout: 10000 });
    await page.waitForTimeout(1000); // Wait for tasks to load from backend
    
    // Assert: Task should still be visible after refresh
    const taskItemAfterRefresh = page.locator(`[data-testid^="task-item-"]`).filter({
      hasText: taskTitle,
    });
    await expect(taskItemAfterRefresh).toBeVisible({ timeout: 10000 });
  });

  test('should verify filter counts for All/Active/Completed', async ({ page, resetBackendData }) => {
    // Arrange: Add multiple tasks
    await page.getByTestId('task-input-field').fill('Active Task 1');
    await page.getByTestId('task-input-submit').click();
    await page.waitForSelector('[data-testid^="task-item-"]', { timeout: 10000 });
    
    await page.getByTestId('task-input-field').fill('Active Task 2');
    await page.getByTestId('task-input-submit').click();
    await page.waitForTimeout(500); // Wait for state update
    
    await page.getByTestId('task-input-field').fill('Completed Task');
    await page.getByTestId('task-input-submit').click();
    await page.waitForTimeout(500); // Wait for state update
    
    // Wait for all tasks to appear
    await page.waitForSelector('[data-testid^="task-item-"]', { timeout: 10000 });
    const taskItems = await page.locator('[data-testid^="task-item-"]').count();
    expect(taskItems).toBe(3);
    
    // Complete one task
    const completedTask = page.locator('[data-testid^="task-item-"]').filter({
      hasText: 'Completed Task',
    });
    const completedTaskId = await completedTask.getAttribute('data-testid');
    const completedCheckboxId = completedTaskId!.replace('task-item-', 'task-checkbox-');
    await page.getByTestId(completedCheckboxId).click();
    await page.waitForTimeout(500); // Wait for state update
    
    // Act & Assert: Verify filter counts match actual task states
    await expect(page.getByTestId('filter-all')).toContainText('All (3)', { timeout: 5000 });
    await expect(page.getByTestId('filter-active')).toContainText('Active (2)', { timeout: 5000 });
    await expect(page.getByTestId('filter-completed')).toContainText('Completed (1)', { timeout: 5000 });
    
    // Verify counts match displayed tasks
    const activeTasks = await page.locator('[data-testid^="task-item-"]:not(.task-item--completed)').count();
    const completedTasks = await page.locator('[data-testid^="task-item-"].task-item--completed').count();
    expect(activeTasks).toBe(2);
    expect(completedTasks).toBe(1);
  });

  test('should filter tasks by Active', async ({ page, resetBackendData }) => {
    // Arrange: Add multiple tasks
    await page.getByTestId('task-input-field').fill('Active Task 1');
    await page.getByTestId('task-input-submit').click();
    await page.waitForSelector('[data-testid^="task-item-"]', { timeout: 10000 });
    await page.waitForTimeout(500);
    
    await page.getByTestId('task-input-field').fill('Active Task 2');
    await page.getByTestId('task-input-submit').click();
    await page.waitForTimeout(500);
    
    await page.getByTestId('task-input-field').fill('Completed Task');
    await page.getByTestId('task-input-submit').click();
    await page.waitForSelector('[data-testid^="task-item-"]', { timeout: 10000 });
    await page.waitForTimeout(500);
    
    // Complete the last task
    const completedTask = page.locator('[data-testid^="task-item-"]').filter({
      hasText: 'Completed Task',
    });
    await expect(completedTask).toBeVisible({ timeout: 10000 });
    const completedTaskId = await completedTask.getAttribute('data-testid');
    const completedCheckboxId = completedTaskId!.replace('task-item-', 'task-checkbox-');
    await page.getByTestId(completedCheckboxId).click({ timeout: 5000 });
    await page.waitForTimeout(500);
    
    // Act: Filter by active
    await page.getByTestId('filter-active').click();
    await page.waitForTimeout(500);
    
    // Assert: Only active tasks should be visible
    await expect(page.getByText('Active Task 1')).toBeVisible({ timeout: 5000 });
    await expect(page.getByText('Active Task 2')).toBeVisible({ timeout: 5000 });
    await expect(page.getByText('Completed Task')).not.toBeVisible({ timeout: 5000 });
  });

  test('should filter tasks by Completed', async ({ page, resetBackendData }) => {
    // Arrange: Add and complete a task
    await page.getByTestId('task-input-field').fill('Task to Complete');
    await page.getByTestId('task-input-submit').click();
    await page.waitForSelector('[data-testid^="task-item-"]');
    
    const taskItem = page.locator('[data-testid^="task-item-"]').filter({
      hasText: 'Task to Complete',
    });
    
    const taskId = await taskItem.getAttribute('data-testid');
    const checkboxId = taskId!.replace('task-item-', 'task-checkbox-');
    await page.getByTestId(checkboxId).click();
    
    // Act: Filter by completed
    await page.getByTestId('filter-completed').click();
    
    // Assert: Completed task should be visible
    await expect(page.getByText('Task to Complete')).toBeVisible();
  });

  test('should complete full workflow: add, toggle, delete, refresh', async ({ page, resetBackendData }) => {
    // Arrange: Start with empty state
    const taskTitle = 'Workflow Test Task';
    
    // Act & Assert: Add task
    await page.getByTestId('task-input-field').fill(taskTitle);
    await page.getByTestId('task-input-submit').click();
    await page.waitForSelector('[data-testid^="task-item-"]', { timeout: 10000 });
    await page.waitForTimeout(500);
    
    const taskItem = page.locator(`[data-testid^="task-item-"]`).filter({
      hasText: taskTitle,
    });
    await expect(taskItem).toBeVisible({ timeout: 5000 });
    
    // Act & Assert: Toggle completion
    const taskId = await taskItem.getAttribute('data-testid');
    const checkboxId = taskId!.replace('task-item-', 'task-checkbox-');
    await page.getByTestId(checkboxId).click({ timeout: 5000 });
    await page.waitForTimeout(500);
    await expect(page.getByTestId(checkboxId)).toBeChecked({ timeout: 5000 });
    
    // Act & Assert: Delete task
    const deleteButtonId = taskId!.replace('task-item-', 'task-delete-');
    await page.getByTestId(deleteButtonId).click({ timeout: 5000 });
    await page.waitForTimeout(500);
    await expect(taskItem).not.toBeVisible({ timeout: 5000 });
    
    // Act & Assert: Refresh and verify task is gone
    await page.reload();
    await page.waitForSelector('[data-testid="app"]', { timeout: 10000 });
    await page.waitForSelector('[data-testid="tasks-list"]', { timeout: 10000 });
    await page.waitForTimeout(1000);
    
    const taskItemAfterRefresh = page.locator(`[data-testid^="task-item-"]`).filter({
      hasText: taskTitle,
    });
    await expect(taskItemAfterRefresh).not.toBeVisible({ timeout: 5000 });
    
    // Verify empty state
    await expect(page.getByTestId('empty-message')).toBeVisible({ timeout: 5000 });
    await expect(page.getByTestId('empty-message')).toHaveText('No tasks found', { timeout: 5000 });
  });

  test('should display system health banner', async ({ page, resetBackendData }) => {
    // Arrange: App is loaded
    await page.goto('http://localhost:5173');
    await page.waitForSelector('[data-testid="app"]');
    
    // Assert: Health banner should be visible
    const healthBanner = page.getByTestId('health-banner');
    await expect(healthBanner).toBeVisible();
    await expect(healthBanner).toContainText('System health:');
    
    // Verify it shows OK when backend is running
    const bannerText = await healthBanner.textContent();
    expect(bannerText).toMatch(/System health: (OK|ERROR)/);
  });

  test('should update filter counts after operations', async ({ page, resetBackendData }) => {
    // Arrange: Add tasks
    await page.getByTestId('task-input-field').fill('Task 1');
    await page.getByTestId('task-input-submit').click();
    await page.waitForSelector('[data-testid^="task-item-"]', { timeout: 10000 });
    await page.waitForTimeout(500); // Wait for state update
    
    await page.getByTestId('task-input-field').fill('Task 2');
    await page.getByTestId('task-input-submit').click();
    await page.waitForTimeout(500); // Wait for state update
    
    // Verify initial counts match actual tasks
    await expect(page.getByTestId('filter-all')).toContainText('All (2)', { timeout: 5000 });
    await expect(page.getByTestId('filter-active')).toContainText('Active (2)', { timeout: 5000 });
    await expect(page.getByTestId('filter-completed')).toContainText('Completed (0)', { timeout: 5000 });
    
    // Verify actual task count
    const initialTaskCount = await page.locator('[data-testid^="task-item-"]').count();
    expect(initialTaskCount).toBe(2);
    
    // Act: Complete one task
    const taskItem = page.locator('[data-testid^="task-item-"]').first();
    const taskId = await taskItem.getAttribute('data-testid');
    const checkboxId = taskId!.replace('task-item-', 'task-checkbox-');
    await page.getByTestId(checkboxId).click();
    await page.waitForTimeout(500); // Wait for state update
    
    // Assert: Counts should update and match actual task states
    await expect(page.getByTestId('filter-all')).toContainText('All (2)', { timeout: 5000 });
    await expect(page.getByTestId('filter-active')).toContainText('Active (1)', { timeout: 5000 });
    await expect(page.getByTestId('filter-completed')).toContainText('Completed (1)', { timeout: 5000 });
    
    // Verify actual task states match counts
    const activeCount = await page.locator('[data-testid^="task-item-"]:not(.task-item--completed)').count();
    const completedCount = await page.locator('[data-testid^="task-item-"].task-item--completed').count();
    expect(activeCount).toBe(1);
    expect(completedCount).toBe(1);
    
    // Act: Delete a task
    const deleteButtonId = taskId!.replace('task-item-', 'task-delete-');
    await page.getByTestId(deleteButtonId).click();
    await page.waitForTimeout(500); // Wait for state update
    
    // Assert: Counts should update again and match actual task states
    await expect(page.getByTestId('filter-all')).toContainText('All (1)', { timeout: 5000 });
    await expect(page.getByTestId('filter-active')).toContainText('Active (1)', { timeout: 5000 });
    await expect(page.getByTestId('filter-completed')).toContainText('Completed (0)', { timeout: 5000 });
    
    // Verify final task count
    const finalTaskCount = await page.locator('[data-testid^="task-item-"]').count();
    expect(finalTaskCount).toBe(1);
  });
});
