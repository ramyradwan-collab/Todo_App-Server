import express, { Express } from 'express';
import cors from 'cors';
import { Task } from '../../src/types/Task';
import { loadTasks, saveTasks } from '../../src/utils/storage';
import { addLog, getLogs, clearLogs } from '../../src/utils/logger';

/**
 * Creates a test server instance
 */
export const createTestServer = (): Express => {
  const app = express();

  app.use(cors());
  app.use(express.json());

  // Request logging middleware
  app.use((req, _res, next) => {
    const timestamp = new Date().toISOString();
    const logMessage = `[${timestamp}] ${req.method} ${req.path}`;
    addLog('info', logMessage);
    next();
  });

  // Health check
  app.get('/health', (_req, res) => {
    addLog('info', 'Health check requested');
    res.json({ ok: true });
  });

  // Logs endpoint
  app.get('/logs', (_req, res) => {
    res.json(getLogs());
  });

  app.delete('/logs', (_req, res) => {
    clearLogs();
    addLog('info', 'Logs cleared');
    res.status(204).send();
  });

  // Stats endpoint
  app.get('/stats', (_req, res) => {
    try {
      const tasks = loadTasks();
      const stats = {
        total: tasks.length,
        active: tasks.filter((task) => !task.completed).length,
        completed: tasks.filter((task) => task.completed).length,
      };
      addLog('info', `GET /stats - Total: ${stats.total}, Active: ${stats.active}, Completed: ${stats.completed}`);
      res.json(stats);
    } catch (error) {
      addLog('error', `GET /stats - Error: ${error instanceof Error ? error.message : String(error)}`);
      res.status(500).json({ error: 'Failed to load statistics' });
    }
  });

  // Tasks endpoints
  app.get('/tasks', (_req, res) => {
    try {
      const tasks = loadTasks();
      const sortedTasks = [...tasks].sort((a, b) => b.createdAt - a.createdAt);
      addLog('info', `GET /tasks - Returning ${sortedTasks.length} tasks`);
      res.json(sortedTasks);
    } catch (error) {
      addLog('error', `GET /tasks - Error: ${error instanceof Error ? error.message : String(error)}`);
      res.status(500).json({ error: 'Failed to load tasks' });
    }
  });

  app.post('/tasks', (req, res) => {
    try {
      const { title, dueDate } = req.body;

      if (title === undefined || title === null || typeof title !== 'string') {
        addLog('info', 'POST /tasks - Invalid request: title missing or not a string');
        return res.status(400).json({ 
          error: 'Title is required and must be a string',
          code: 'INVALID_TITLE_TYPE'
        });
      }

      const trimmedTitle = title.trim();
      if (trimmedTitle.length === 0) {
        addLog('info', 'POST /tasks - Invalid request: title is empty');
        return res.status(400).json({ 
          error: 'Title cannot be empty. Please provide a non-empty task title.',
          code: 'EMPTY_TITLE'
        });
      }

      const MAX_TITLE_LENGTH = 500;
      if (trimmedTitle.length > MAX_TITLE_LENGTH) {
        addLog('info', `POST /tasks - Invalid request: title too long (${trimmedTitle.length} chars)`);
        return res.status(400).json({ 
          error: `Title is too long. Maximum length is ${MAX_TITLE_LENGTH} characters. Current length: ${trimmedTitle.length}`,
          code: 'TITLE_TOO_LONG',
          maxLength: MAX_TITLE_LENGTH,
          currentLength: trimmedTitle.length
        });
      }

      // Validate dueDate if provided
      if (dueDate !== undefined && dueDate !== null) {
        if (typeof dueDate !== 'number' || isNaN(dueDate)) {
          addLog('info', 'POST /tasks - Invalid request: dueDate must be a valid number');
          return res.status(400).json({ 
            error: 'dueDate must be a valid timestamp (number)',
            code: 'INVALID_DUE_DATE_TYPE'
          });
        }
      }

      const tasks = loadTasks();
      const newTask: Task = {
        id: crypto.randomUUID(),
        title: trimmedTitle,
        completed: false,
        createdAt: Date.now(),
        ...(dueDate && { dueDate }),
      };

      tasks.push(newTask);
      saveTasks(tasks);

      addLog('info', `POST /tasks - Created task: "${trimmedTitle}" (ID: ${newTask.id})${dueDate ? ` with due date` : ''}`);
      res.status(201).json(newTask);
    } catch (error) {
      addLog('error', `POST /tasks - Error: ${error instanceof Error ? error.message : String(error)}`);
      res.status(500).json({ error: 'Failed to create task' });
    }
  });

  app.put('/tasks/:id', (req, res) => {
    try {
      const { id } = req.params;
      const { title, completed, dueDate } = req.body;

      const tasks = loadTasks();
      const taskIndex = tasks.findIndex((task) => task.id === id);

      if (taskIndex === -1) {
        addLog('info', `PUT /tasks/${id} - Task not found`);
        return res.status(404).json({ error: `Task with id ${id} not found` });
      }

      const task = tasks[taskIndex];

      if (title !== undefined) {
        if (typeof title !== 'string') {
          addLog('info', `PUT /tasks/${id} - Invalid request: title must be a string`);
          return res.status(400).json({ 
            error: 'Title must be a string',
            code: 'INVALID_TITLE_TYPE'
          });
        }
        const trimmedTitle = title.trim();
        if (trimmedTitle.length === 0) {
          addLog('info', `PUT /tasks/${id} - Invalid request: title is empty`);
          return res.status(400).json({ 
            error: 'Title cannot be empty. Please provide a non-empty task title.',
            code: 'EMPTY_TITLE'
          });
        }
        const MAX_TITLE_LENGTH = 500;
        if (trimmedTitle.length > MAX_TITLE_LENGTH) {
          addLog('info', `PUT /tasks/${id} - Invalid request: title too long (${trimmedTitle.length} chars)`);
          return res.status(400).json({ 
            error: `Title is too long. Maximum length is ${MAX_TITLE_LENGTH} characters. Current length: ${trimmedTitle.length}`,
            code: 'TITLE_TOO_LONG',
            maxLength: MAX_TITLE_LENGTH,
            currentLength: trimmedTitle.length
          });
        }
        task.title = trimmedTitle;
      }

      // Update dueDate if provided
      if (dueDate !== undefined) {
        if (dueDate === null) {
          // Allow clearing dueDate by setting it to null
          delete task.dueDate;
        } else {
          if (typeof dueDate !== 'number' || isNaN(dueDate)) {
            addLog('info', `PUT /tasks/${id} - Invalid request: dueDate must be a valid number`);
            return res.status(400).json({ 
              error: 'dueDate must be a valid timestamp (number)',
              code: 'INVALID_DUE_DATE_TYPE'
            });
          }
          task.dueDate = dueDate;
        }
      }

      if (completed !== undefined) {
        if (typeof completed !== 'boolean') {
          addLog('info', `PUT /tasks/${id} - Invalid request: completed must be a boolean`);
          return res.status(400).json({ error: 'Completed must be a boolean' });
        }
        task.completed = completed;
      }

      saveTasks(tasks);
      addLog('info', `PUT /tasks/${id} - Updated task: "${task.title}" (completed: ${task.completed})`);
      res.json(task);
    } catch (error) {
      addLog('error', `PUT /tasks/${req.params.id} - Error: ${error instanceof Error ? error.message : String(error)}`);
      res.status(500).json({ error: 'Failed to update task' });
    }
  });

  app.delete('/tasks/:id', (req, res) => {
    try {
      const { id } = req.params;

      const tasks = loadTasks();
      const taskIndex = tasks.findIndex((task) => task.id === id);

      if (taskIndex === -1) {
        addLog('info', `DELETE /tasks/${id} - Task not found`);
        return res.status(404).json({ error: `Task with id ${id} not found` });
      }

      const deletedTask = tasks[taskIndex];
      tasks.splice(taskIndex, 1);
      saveTasks(tasks);

      addLog('info', `DELETE /tasks/${id} - Deleted task: "${deletedTask.title}"`);
      res.status(204).send();
    } catch (error) {
      addLog('error', `DELETE /tasks/${req.params.id} - Error: ${error instanceof Error ? error.message : String(error)}`);
      res.status(500).json({ error: 'Failed to delete task' });
    }
  });

  return app;
};

