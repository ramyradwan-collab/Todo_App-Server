import { describe, it, expect, beforeEach, afterEach, afterAll } from 'vitest';
import request from 'supertest';
import { createTestServer } from '../helpers/testServer';
import { seedTestData, resetTestData, restoreTestData, createSampleTask } from '../helpers/testData';
import { qaReporter } from '../reporters/qaReporter';

const app = createTestServer();

describe('Tasks API', () => {
  beforeEach(() => {
    // Arrange: Reset test data before each test
    resetTestData();
  });

  afterEach(() => {
    // Cleanup: Restore test data after each test
    restoreTestData();
  });

  describe('GET /health', () => {
    it('should return { ok: true }', async () => {
      const startTime = Date.now();
      try {
        // Act: Make request to health endpoint
        const response = await request(app).get('/health');

        // Assert: Verify response
        expect(response.status).toBe(200);
        expect(response.body).toEqual({ ok: true });
        
        qaReporter.addTest('GET /health - should return { ok: true }', 'passed', Date.now() - startTime);
      } catch (error) {
        qaReporter.addTest('GET /health - should return { ok: true }', 'failed', Date.now() - startTime, error);
        throw error;
      }
    });
  });

  describe('GET /tasks', () => {
    it('should return empty array when no tasks exist', async () => {
      const startTime = Date.now();
      try {
        // Arrange: No tasks seeded
        seedTestData([]);

        // Act: Get all tasks
        const response = await request(app).get('/tasks');

        // Assert: Should return empty array
        expect(response.status).toBe(200);
        expect(response.body).toEqual([]);
        
        qaReporter.addTest('GET /tasks - should return empty array when no tasks exist', 'passed', Date.now() - startTime);
      } catch (error) {
        qaReporter.addTest('GET /tasks - should return empty array when no tasks exist', 'failed', Date.now() - startTime, error);
        throw error;
      }
    });

    it('should return all tasks sorted newest first', async () => {
      const startTime = Date.now();
      try {
        // Arrange: Seed tasks with different timestamps
        const oldTask = createSampleTask({
          title: 'Oldest Task',
          createdAt: Date.now() - 3000,
        });
        const middleTask = createSampleTask({
          title: 'Middle Task',
          createdAt: Date.now() - 2000,
        });
        const newestTask = createSampleTask({
          title: 'Newest Task',
          createdAt: Date.now() - 1000,
        });
        seedTestData([oldTask, middleTask, newestTask]);

        // Act: Get all tasks
        const response = await request(app).get('/tasks');

        // Assert: Tasks should be sorted newest first
        expect(response.status).toBe(200);
        expect(response.body).toHaveLength(3);
        expect(response.body[0].title).toBe('Newest Task');
        expect(response.body[1].title).toBe('Middle Task');
        expect(response.body[2].title).toBe('Oldest Task');
        
        qaReporter.addTest('GET /tasks - should return all tasks sorted newest first', 'passed', Date.now() - startTime);
      } catch (error) {
        qaReporter.addTest('GET /tasks - should return all tasks sorted newest first', 'failed', Date.now() - startTime, error);
        throw error;
      }
    });

    it('should return tasks with all required fields', async () => {
      const startTime = Date.now();
      try {
        // Arrange: Seed a task
        const task = createSampleTask({ title: 'Test Task' });
        seedTestData([task]);

        // Act: Get all tasks
        const response = await request(app).get('/tasks');

        // Assert: Task should have all required fields
        expect(response.status).toBe(200);
        expect(response.body).toHaveLength(1);
        expect(response.body[0]).toHaveProperty('id');
        expect(response.body[0]).toHaveProperty('title', 'Test Task');
        expect(response.body[0]).toHaveProperty('completed', false);
        expect(response.body[0]).toHaveProperty('createdAt');
        
        qaReporter.addTest('GET /tasks - should return tasks with all required fields', 'passed', Date.now() - startTime);
      } catch (error) {
        qaReporter.addTest('GET /tasks - should return tasks with all required fields', 'failed', Date.now() - startTime, error);
        throw error;
      }
    });
  });

  describe('POST /tasks', () => {
    it('should create a new task with valid title', async () => {
      const startTime = Date.now();
      try {
        // Arrange: Empty task list
        seedTestData([]);

        // Act: Create a new task
        const response = await request(app)
          .post('/tasks')
          .send({ title: 'New Task' });

        // Assert: Task should be created successfully
        expect(response.status).toBe(201);
        expect(response.body).toHaveProperty('id');
        expect(response.body.title).toBe('New Task');
        expect(response.body.completed).toBe(false);
        expect(response.body).toHaveProperty('createdAt');
        expect(typeof response.body.createdAt).toBe('number');
        
        qaReporter.addTest('POST /tasks - should create a new task with valid title', 'passed', Date.now() - startTime);
      } catch (error) {
        qaReporter.addTest('POST /tasks - should create a new task with valid title', 'failed', Date.now() - startTime, error);
        throw error;
      }
    });

    it('should trim whitespace from task title', async () => {
      const startTime = Date.now();
      try {
        // Arrange: Empty task list
        seedTestData([]);

        // Act: Create task with whitespace
        const response = await request(app)
          .post('/tasks')
          .send({ title: '  Trimmed Task  ' });

        // Assert: Title should be trimmed
        expect(response.status).toBe(201);
        expect(response.body.title).toBe('Trimmed Task');
        
        qaReporter.addTest('POST /tasks - should trim whitespace from task title', 'passed', Date.now() - startTime);
      } catch (error) {
        qaReporter.addTest('POST /tasks - should trim whitespace from task title', 'failed', Date.now() - startTime, error);
        throw error;
      }
    });

    it('should reject empty title', async () => {
      const startTime = Date.now();
      try {
        // Arrange: Empty task list
        seedTestData([]);

        // Act: Try to create task with empty title
        const response = await request(app)
          .post('/tasks')
          .send({ title: '' });

        // Assert: Should return 400 error with clear message and code
        expect(response.status).toBe(400);
        expect(response.body.error).toContain('Title cannot be empty');
        expect(response.body.code).toBe('EMPTY_TITLE');
        
        qaReporter.addTest('POST /tasks - should reject empty title', 'passed', Date.now() - startTime);
      } catch (error) {
        qaReporter.addTest('POST /tasks - should reject empty title', 'failed', Date.now() - startTime, error);
        throw error;
      }
    });

    it('should reject whitespace-only title', async () => {
      const startTime = Date.now();
      try {
        // Arrange: Empty task list
        seedTestData([]);

        // Act: Try to create task with only whitespace
        const response = await request(app)
          .post('/tasks')
          .send({ title: '   ' });

        // Assert: Should return 400 error
        expect(response.status).toBe(400);
        expect(response.body.error).toContain('Title cannot be empty');
        expect(response.body.code).toBe('EMPTY_TITLE');
        
        qaReporter.addTest('POST /tasks - should reject whitespace-only title', 'passed', Date.now() - startTime);
      } catch (error) {
        qaReporter.addTest('POST /tasks - should reject whitespace-only title', 'failed', Date.now() - startTime, error);
        throw error;
      }
    });

    it('should reject very long title', async () => {
      const startTime = Date.now();
      try {
        // Arrange: Empty task list
        seedTestData([]);
        const longTitle = 'a'.repeat(501); // 501 characters

        // Act: Try to create task with very long title
        const response = await request(app)
          .post('/tasks')
          .send({ title: longTitle });

        // Assert: Should return 400 error with clear message
        expect(response.status).toBe(400);
        expect(response.body.error).toContain('too long');
        expect(response.body.code).toBe('TITLE_TOO_LONG');
        expect(response.body.maxLength).toBe(500);
        expect(response.body.currentLength).toBe(501);
        
        qaReporter.addTest('POST /tasks - should reject very long title', 'passed', Date.now() - startTime);
      } catch (error) {
        qaReporter.addTest('POST /tasks - should reject very long title', 'failed', Date.now() - startTime, error);
        throw error;
      }
    });

    it('should reject missing title field', async () => {
      const startTime = Date.now();
      try {
        // Arrange: Empty task list
        seedTestData([]);

        // Act: Try to create task without title
        const response = await request(app)
          .post('/tasks')
          .send({});

        // Assert: Should return 400 error
        expect(response.status).toBe(400);
        expect(response.body.error).toContain('Title is required');
        
        qaReporter.addTest('POST /tasks - should reject missing title field', 'passed', Date.now() - startTime);
      } catch (error) {
        qaReporter.addTest('POST /tasks - should reject missing title field', 'failed', Date.now() - startTime, error);
        throw error;
      }
    });

    it('should reject non-string title', async () => {
      const startTime = Date.now();
      try {
        // Arrange: Empty task list
        seedTestData([]);

        // Act: Try to create task with non-string title
        const response = await request(app)
          .post('/tasks')
          .send({ title: 123 });

        // Assert: Should return 400 error
        expect(response.status).toBe(400);
        expect(response.body.error).toContain('Title is required and must be a string');
        
        qaReporter.addTest('POST /tasks - should reject non-string title', 'passed', Date.now() - startTime);
      } catch (error) {
        qaReporter.addTest('POST /tasks - should reject non-string title', 'failed', Date.now() - startTime, error);
        throw error;
      }
    });

    it('should persist created task to data file', async () => {
      const startTime = Date.now();
      try {
        // Arrange: Empty task list
        seedTestData([]);

        // Act: Create a task
        const createResponse = await request(app)
          .post('/tasks')
          .send({ title: 'Persisted Task' });

        const taskId = createResponse.body.id;

        // Assert: Task should be retrievable
        const getResponse = await request(app).get('/tasks');
        expect(getResponse.body).toHaveLength(1);
        expect(getResponse.body[0].id).toBe(taskId);
        expect(getResponse.body[0].title).toBe('Persisted Task');
        
        qaReporter.addTest('POST /tasks - should persist created task to data file', 'passed', Date.now() - startTime);
      } catch (error) {
        qaReporter.addTest('POST /tasks - should persist created task to data file', 'failed', Date.now() - startTime, error);
        throw error;
      }
    });
  });

  describe('PUT /tasks/:id (toggle completed)', () => {
    it('should toggle task completion status', async () => {
      const startTime = Date.now();
      try {
        // Arrange: Seed a task
        const task = createSampleTask({ title: 'Task to Toggle', completed: false });
        seedTestData([task]);

        // Act: Toggle task completion
        const response = await request(app)
          .put(`/tasks/${task.id}`)
          .send({ completed: true });

        // Assert: Task should be marked as completed
        expect(response.status).toBe(200);
        expect(response.body.completed).toBe(true);
        expect(response.body.id).toBe(task.id);
        expect(response.body.title).toBe('Task to Toggle');
        
        qaReporter.addTest('PUT /tasks/:id - should toggle task completion status', 'passed', Date.now() - startTime);
      } catch (error) {
        qaReporter.addTest('PUT /tasks/:id - should toggle task completion status', 'failed', Date.now() - startTime, error);
        throw error;
      }
    });

    it('should toggle from completed to active', async () => {
      const startTime = Date.now();
      try {
        // Arrange: Seed a completed task
        const task = createSampleTask({ title: 'Completed Task', completed: true });
        seedTestData([task]);

        // Act: Toggle task to active
        const response = await request(app)
          .put(`/tasks/${task.id}`)
          .send({ completed: false });

        // Assert: Task should be marked as active
        expect(response.status).toBe(200);
        expect(response.body.completed).toBe(false);
        
        qaReporter.addTest('PUT /tasks/:id - should toggle from completed to active', 'passed', Date.now() - startTime);
      } catch (error) {
        qaReporter.addTest('PUT /tasks/:id - should toggle from completed to active', 'failed', Date.now() - startTime, error);
        throw error;
      }
    });

    it('should return 404 when task does not exist', async () => {
      const startTime = Date.now();
      try {
        // Arrange: Empty task list
        seedTestData([]);

        // Act: Try to toggle non-existent task
        const response = await request(app)
          .put('/tasks/non-existent-id')
          .send({ completed: true });

        // Assert: Should return 404 error
        expect(response.status).toBe(404);
        expect(response.body.error).toContain('not found');
        
        qaReporter.addTest('PUT /tasks/:id - should return 404 when task does not exist', 'passed', Date.now() - startTime);
      } catch (error) {
        qaReporter.addTest('PUT /tasks/:id - should return 404 when task does not exist', 'failed', Date.now() - startTime, error);
        throw error;
      }
    });

    it('should reject non-boolean completed value', async () => {
      const startTime = Date.now();
      try {
        // Arrange: Seed a task
        const task = createSampleTask({ title: 'Test Task' });
        seedTestData([task]);

        // Act: Try to update with non-boolean
        const response = await request(app)
          .put(`/tasks/${task.id}`)
          .send({ completed: 'true' });

        // Assert: Should return 400 error
        expect(response.status).toBe(400);
        expect(response.body.error).toContain('Completed must be a boolean');
        
        qaReporter.addTest('PUT /tasks/:id - should reject non-boolean completed value', 'passed', Date.now() - startTime);
      } catch (error) {
        qaReporter.addTest('PUT /tasks/:id - should reject non-boolean completed value', 'failed', Date.now() - startTime, error);
        throw error;
      }
    });

    it('should reject very long title on update', async () => {
      const startTime = Date.now();
      try {
        // Arrange: Seed a task
        const task = createSampleTask({ title: 'Test Task' });
        seedTestData([task]);
        const longTitle = 'a'.repeat(501); // 501 characters

        // Act: Try to update with very long title
        const response = await request(app)
          .put(`/tasks/${task.id}`)
          .send({ title: longTitle });

        // Assert: Should return 400 error with clear message
        expect(response.status).toBe(400);
        expect(response.body.error).toContain('too long');
        expect(response.body.code).toBe('TITLE_TOO_LONG');
        expect(response.body.maxLength).toBe(500);
        expect(response.body.currentLength).toBe(501);
        
        qaReporter.addTest('PUT /tasks/:id - should reject very long title on update', 'passed', Date.now() - startTime);
      } catch (error) {
        qaReporter.addTest('PUT /tasks/:id - should reject very long title on update', 'failed', Date.now() - startTime, error);
        throw error;
      }
    });

    it('should persist completion status change', async () => {
      const startTime = Date.now();
      try {
        // Arrange: Seed a task
        const task = createSampleTask({ title: 'Task to Complete', completed: false });
        seedTestData([task]);

        // Act: Toggle completion
        await request(app)
          .put(`/tasks/${task.id}`)
          .send({ completed: true });

        // Assert: Status should be persisted
        const getResponse = await request(app).get('/tasks');
        const updatedTask = getResponse.body.find((t: any) => t.id === task.id);
        expect(updatedTask.completed).toBe(true);
        
        qaReporter.addTest('PUT /tasks/:id - should persist completion status change', 'passed', Date.now() - startTime);
      } catch (error) {
        qaReporter.addTest('PUT /tasks/:id - should persist completion status change', 'failed', Date.now() - startTime, error);
        throw error;
      }
    });
  });

  describe('DELETE /tasks/:id', () => {
    it('should delete an existing task', async () => {
      const startTime = Date.now();
      try {
        // Arrange: Seed tasks
        const task1 = createSampleTask({ title: 'Task 1' });
        const task2 = createSampleTask({ title: 'Task 2' });
        seedTestData([task1, task2]);

        // Act: Delete a task
        const response = await request(app)
          .delete(`/tasks/${task1.id}`);

        // Assert: Should return 204 and task should be removed
        expect(response.status).toBe(204);
        const getResponse = await request(app).get('/tasks');
        expect(getResponse.body).toHaveLength(1);
        expect(getResponse.body[0].id).toBe(task2.id);
        
        qaReporter.addTest('DELETE /tasks/:id - should delete an existing task', 'passed', Date.now() - startTime);
      } catch (error) {
        qaReporter.addTest('DELETE /tasks/:id - should delete an existing task', 'failed', Date.now() - startTime, error);
        throw error;
      }
    });

    it('should return 404 when task does not exist', async () => {
      const startTime = Date.now();
      try {
        // Arrange: Empty task list
        seedTestData([]);

        // Act: Try to delete non-existent task
        const response = await request(app)
          .delete('/tasks/non-existent-id');

        // Assert: Should return 404 error
        expect(response.status).toBe(404);
        expect(response.body.error).toContain('not found');
        
        qaReporter.addTest('DELETE /tasks/:id - should return 404 when task does not exist', 'passed', Date.now() - startTime);
      } catch (error) {
        qaReporter.addTest('DELETE /tasks/:id - should return 404 when task does not exist', 'failed', Date.now() - startTime, error);
        throw error;
      }
    });

    it('should persist deletion to data file', async () => {
      const startTime = Date.now();
      try {
        // Arrange: Seed tasks
        const task1 = createSampleTask({ title: 'Task 1' });
        const task2 = createSampleTask({ title: 'Task 2' });
        seedTestData([task1, task2]);

        // Act: Delete a task
        await request(app).delete(`/tasks/${task1.id}`);

        // Assert: Deletion should be persisted
        const getResponse = await request(app).get('/tasks');
        expect(getResponse.body).toHaveLength(1);
        expect(getResponse.body[0].id).toBe(task2.id);
        
        qaReporter.addTest('DELETE /tasks/:id - should persist deletion to data file', 'passed', Date.now() - startTime);
      } catch (error) {
        qaReporter.addTest('DELETE /tasks/:id - should persist deletion to data file', 'failed', Date.now() - startTime, error);
        throw error;
      }
    });
  });

  describe('GET /stats', () => {
    it('should return task statistics', async () => {
      const startTime = Date.now();
      try {
        // Arrange: Seed tasks with different statuses
        const task1 = createSampleTask({ title: 'Active Task 1', completed: false });
        const task2 = createSampleTask({ title: 'Active Task 2', completed: false });
        const task3 = createSampleTask({ title: 'Completed Task', completed: true });
        seedTestData([task1, task2, task3]);

        // Act: Get statistics
        const response = await request(app).get('/stats');

        // Assert: Should return correct counts
        expect(response.status).toBe(200);
        expect(response.body).toEqual({
          total: 3,
          active: 2,
          completed: 1,
        });
        
        qaReporter.addTest('GET /stats - should return task statistics', 'passed', Date.now() - startTime);
      } catch (error) {
        qaReporter.addTest('GET /stats - should return task statistics', 'failed', Date.now() - startTime, error);
        throw error;
      }
    });

    it('should return zero counts when no tasks exist', async () => {
      const startTime = Date.now();
      try {
        // Arrange: Empty task list
        seedTestData([]);

        // Act: Get statistics
        const response = await request(app).get('/stats');

        // Assert: Should return zero counts
        expect(response.status).toBe(200);
        expect(response.body).toEqual({
          total: 0,
          active: 0,
          completed: 0,
        });
        
        qaReporter.addTest('GET /stats - should return zero counts when no tasks exist', 'passed', Date.now() - startTime);
      } catch (error) {
        qaReporter.addTest('GET /stats - should return zero counts when no tasks exist', 'failed', Date.now() - startTime, error);
        throw error;
      }
    });
  });

  describe('Integration: Full workflow', () => {
    it('should handle complete task lifecycle', async () => {
      const startTime = Date.now();
      try {
        // Arrange: Empty task list
        seedTestData([]);

        // Act & Assert: Create task
        const createResponse = await request(app)
          .post('/tasks')
          .send({ title: 'Lifecycle Task' });
        expect(createResponse.status).toBe(201);
        const taskId = createResponse.body.id;

        // Act & Assert: Get task
        const getResponse = await request(app).get('/tasks');
        expect(getResponse.body).toHaveLength(1);
        expect(getResponse.body[0].completed).toBe(false);

        // Act & Assert: Toggle completion
        const toggleResponse = await request(app)
          .put(`/tasks/${taskId}`)
          .send({ completed: true });
        expect(toggleResponse.status).toBe(200);
        expect(toggleResponse.body.completed).toBe(true);

        // Act & Assert: Delete task
        const deleteResponse = await request(app).delete(`/tasks/${taskId}`);
        expect(deleteResponse.status).toBe(204);

        // Act & Assert: Verify deletion
        const finalGetResponse = await request(app).get('/tasks');
        expect(finalGetResponse.body).toHaveLength(0);
        
        qaReporter.addTest('Integration - should handle complete task lifecycle', 'passed', Date.now() - startTime);
      } catch (error) {
        qaReporter.addTest('Integration - should handle complete task lifecycle', 'failed', Date.now() - startTime, error);
        throw error;
      }
    });
  });
});

// Generate report after all tests
afterAll(() => {
  qaReporter.generateReport();
});
