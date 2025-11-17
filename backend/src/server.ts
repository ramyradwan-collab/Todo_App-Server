import express, { Request, Response } from 'express';
import cors from 'cors';
import { Task } from './types/Task';
import { loadTasks, saveTasks, cleanupDataFile } from './utils/storage';
import { addLog, getLogs, clearLogs } from './utils/logger';
import { parseQAReport } from './utils/qaReportReader';

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(
  cors({
    origin: 'http://localhost:5173',
    credentials: true,
  })
);
app.use(express.json());

// Request logging middleware
app.use((req: Request, _res: Response, next) => {
  const timestamp = new Date().toISOString();
  const logMessage = `[${timestamp}] ${req.method} ${req.path}`;
  addLog('info', logMessage);
  next();
});

// Health check endpoint
app.get('/health', (_req: Request, res: Response) => {
  addLog('info', 'Health check requested');
  res.json({ ok: true });
});

// GET /logs - Get all logs
app.get('/logs', (_req: Request, res: Response) => {
  res.json(getLogs());
});

// GET /stats - Get task statistics
app.get('/stats', (_req: Request, res: Response) => {
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

// DELETE /logs - Clear all logs
app.delete('/logs', (_req: Request, res: Response) => {
  clearLogs();
  addLog('info', 'Logs cleared');
  res.status(204).send();
});

// GET /test-results - Get test results from QA report
app.get('/test-results', (_req: Request, res: Response) => {
  const testResults = parseQAReport();
  res.json(testResults || { summary: null, sections: [] });
});

// Root endpoint - Serve logs page
app.get('/', (_req: Request, res: Response) => {
  const testResults = parseQAReport();
  res.send(`
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Todo API - Server Logs</title>
  <style>
    * {
      margin: 0;
      padding: 0;
      box-sizing: border-box;
    }
    body {
      font-family: 'Monaco', 'Menlo', 'Courier New', monospace;
      background: #000;
      color: #0f0;
      padding: 20px;
      line-height: 1.6;
    }
    .header {
      background: #1a1a1a;
      padding: 20px;
      border-bottom: 2px solid #FF6B35;
      margin-bottom: 20px;
      display: flex;
      justify-content: space-between;
      align-items: center;
    }
    h1 {
      color: #FF6B35;
      font-size: 24px;
    }
    .controls {
      display: flex;
      gap: 10px;
    }
    button {
      background: #FF6B35;
      color: #000;
      border: none;
      padding: 8px 16px;
      border-radius: 4px;
      cursor: pointer;
      font-weight: bold;
      font-size: 12px;
    }
    button:hover {
      background: #FF4500;
    }
    .status {
      color: #0f0;
      font-size: 14px;
    }
    .main-content {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 20px;
    }
    .logs-container {
      background: #1a1a1a;
      border: 1px solid #333;
      border-radius: 4px;
      padding: 20px;
      max-height: calc(100vh - 200px);
      overflow-y: auto;
    }
    .tests-container {
      background: #1a1a1a;
      border: 1px solid #333;
      border-radius: 4px;
      padding: 20px;
      max-height: calc(100vh - 200px);
      overflow-y: auto;
    }
    .test-section {
      margin-bottom: 20px;
      padding-bottom: 15px;
      border-bottom: 1px solid #333;
    }
    .test-section:last-child {
      border-bottom: none;
    }
    .test-section-title {
      color: #FF6B35;
      font-size: 16px;
      font-weight: bold;
      margin-bottom: 10px;
      display: flex;
      justify-content: space-between;
      align-items: center;
    }
    .test-section-stats {
      font-size: 12px;
      color: #666;
    }
    .test-item {
      padding: 6px 0;
      font-size: 12px;
      display: flex;
      align-items: center;
      gap: 8px;
    }
    .test-status {
      width: 12px;
      height: 12px;
      border-radius: 50%;
      flex-shrink: 0;
    }
    .test-status.passed {
      background: #0f0;
    }
    .test-status.failed {
      background: #f00;
    }
    .test-status.skipped {
      background: #666;
    }
    .test-summary {
      background: #1a1a1a;
      border: 1px solid #333;
      border-radius: 4px;
      padding: 15px;
      margin-bottom: 20px;
    }
    .test-summary-item {
      display: flex;
      justify-content: space-between;
      margin-bottom: 8px;
      font-size: 13px;
    }
    .test-summary-item:last-child {
      margin-bottom: 0;
    }
    .test-summary-label {
      color: #666;
    }
    .test-summary-value {
      color: #0f0;
      font-weight: bold;
    }
    @media (max-width: 1200px) {
      .main-content {
        grid-template-columns: 1fr;
      }
    }
    .log-entry {
      margin-bottom: 8px;
      padding: 4px 0;
      border-bottom: 1px solid #222;
    }
    .log-entry:last-child {
      border-bottom: none;
    }
    .log-timestamp {
      color: #666;
      font-size: 11px;
      margin-right: 10px;
    }
    .log-level-info {
      color: #0f0;
    }
    .log-level-error {
      color: #f00;
    }
    .log-message {
      color: #0f0;
      word-break: break-word;
    }
    .log-entry.error .log-message {
      color: #f00;
    }
    .empty {
      text-align: center;
      color: #666;
      padding: 40px;
    }
    ::-webkit-scrollbar {
      width: 8px;
    }
    ::-webkit-scrollbar-track {
      background: #1a1a1a;
    }
    ::-webkit-scrollbar-thumb {
      background: #FF6B35;
      border-radius: 4px;
    }
  </style>
</head>
<body>
  <div class="header">
    <div>
      <h1>🚀 Todo API Server Logs</h1>
      <div class="status" id="status">Loading...</div>
    </div>
    <div class="controls">
      <button onclick="clearLogs()">Clear Logs</button>
      <button onclick="location.reload()">Refresh</button>
    </div>
  </div>
  <div class="main-content">
    <div class="logs-container" id="logsContainer">
      <div class="empty">Loading logs...</div>
    </div>
    <div class="tests-container" id="testsContainer">
      <div class="empty">Loading test results...</div>
    </div>
  </div>
  <script>
    let autoRefresh = true;
    
    async function loadLogs() {
      try {
        const response = await fetch('/logs');
        const logs = await response.json();
        displayLogs(logs);
        document.getElementById('status').textContent = \`\${logs.length} log entries | Auto-refresh: \${autoRefresh ? 'ON' : 'OFF'}\`;
      } catch (error) {
        document.getElementById('status').textContent = 'Error loading logs';
        console.error('Error loading logs:', error);
      }
    }
    
    function displayLogs(logs) {
      const container = document.getElementById('logsContainer');
      if (logs.length === 0) {
        container.innerHTML = '<div class="empty">No logs yet. Make some API requests to see logs here.</div>';
        return;
      }
      
      container.innerHTML = logs.map(log => \`
        <div class="log-entry \${log.level}">
          <span class="log-timestamp">\${new Date(log.timestamp).toLocaleString()}</span>
          <span class="log-level-\${log.level}">[\${log.level.toUpperCase()}]</span>
          <span class="log-message">\${escapeHtml(log.message)}</span>
        </div>
      \`).join('');
      
      // Auto-scroll to bottom
      container.scrollTop = container.scrollHeight;
    }
    
    function escapeHtml(text) {
      const div = document.createElement('div');
      div.textContent = text;
      return div.innerHTML;
    }
    
    async function clearLogs() {
      if (confirm('Are you sure you want to clear all logs?')) {
        try {
          await fetch('/logs', { method: 'DELETE' });
          loadLogs();
        } catch (error) {
          console.error('Error clearing logs:', error);
        }
      }
    }
    
    async function loadTestResults() {
      try {
        const response = await fetch('/test-results');
        const data = await response.json();
        displayTestResults(data);
      } catch (error) {
        document.getElementById('testsContainer').innerHTML = '<div class="empty">Error loading test results</div>';
        console.error('Error loading test results:', error);
      }
    }
    
    function displayTestResults(data) {
      const container = document.getElementById('testsContainer');
      if (!data.summary || data.sections.length === 0) {
        container.innerHTML = '<div class="empty">No test results available. Run tests to see results here.</div>';
        return;
      }
      
      const { summary, sections } = data;
      
      let html = \`<div class="test-summary">
        <div class="test-summary-item">
          <span class="test-summary-label">Total Tests:</span>
          <span class="test-summary-value">\${summary.total}</span>
        </div>
        <div class="test-summary-item">
          <span class="test-summary-label">Passed:</span>
          <span class="test-summary-value" style="color: #0f0">\${summary.passed} ✅</span>
        </div>
        <div class="test-summary-item">
          <span class="test-summary-label">Failed:</span>
          <span class="test-summary-value" style="color: #f00">\${summary.failed} ❌</span>
        </div>
        <div class="test-summary-item">
          <span class="test-summary-label">Skipped:</span>
          <span class="test-summary-value" style="color: #666">\${summary.skipped} ⏭️</span>
        </div>
        <div class="test-summary-item">
          <span class="test-summary-label">Pass Rate:</span>
          <span class="test-summary-value">\${summary.passRate}%</span>
        </div>
      </div>\`;
      
      sections.forEach(section => {
        html += \`<div class="test-section">
          <div class="test-section-title">
            <span>\${section.name}</span>
            <span class="test-section-stats">✅ \${section.passed} | ❌ \${section.failed} | ⏭️ \${section.skipped}</span>
          </div>\`;
        
        // Group tests by status
        const passedTests = section.tests.filter(t => t.status === 'passed');
        const failedTests = section.tests.filter(t => t.status === 'failed');
        const skippedTests = section.tests.filter(t => t.status === 'skipped');
        
        if (failedTests.length > 0) {
          failedTests.forEach(test => {
            html += \`<div class="test-item">
              <span class="test-status failed"></span>
              <span style="color: #f00">\${escapeHtml(test.name)}</span>
            </div>\`;
          });
        }
        
        if (passedTests.length > 0) {
          passedTests.slice(0, 10).forEach(test => {
            html += \`<div class="test-item">
              <span class="test-status passed"></span>
              <span style="color: #0f0">\${escapeHtml(test.name)}</span>
            </div>\`;
          });
          if (passedTests.length > 10) {
            html += \`<div class="test-item" style="color: #666; font-style: italic;">... and \${passedTests.length - 10} more passed tests</div>\`;
          }
        }
        
        if (skippedTests.length > 0) {
          skippedTests.forEach(test => {
            html += \`<div class="test-item">
              <span class="test-status skipped"></span>
              <span style="color: #666">\${escapeHtml(test.name)}</span>
            </div>\`;
          });
        }
        
        html += \`</div>\`;
      });
      
      container.innerHTML = html;
    }
    
    // Load logs and test results immediately
    loadLogs();
    loadTestResults();
    
    // Auto-refresh every 2 seconds
    setInterval(() => {
      if (autoRefresh) {
        loadLogs();
        loadTestResults();
      }
    }, 2000);
  </script>
</body>
</html>
  `);
});

// GET /tasks - Get all tasks, sorted newest first
app.get('/tasks', (_req: Request, res: Response) => {
  try {
    const tasks = loadTasks();
    // Sort by createdAt descending (newest first)
    const sortedTasks = [...tasks].sort((a, b) => b.createdAt - a.createdAt);
    addLog('info', `GET /tasks - Returning ${sortedTasks.length} tasks`);
    res.json(sortedTasks);
  } catch (error) {
    addLog('error', `GET /tasks - Error: ${error instanceof Error ? error.message : String(error)}`);
    res.status(500).json({ error: 'Failed to load tasks' });
  }
});

// POST /tasks - Create a new task
app.post('/tasks', (req: Request, res: Response) => {
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

      // Validate that dueDate is in the future
      const now = Date.now();
      if (dueDate <= now) {
        addLog('info', 'POST /tasks - Invalid request: dueDate is in the past');
        return res.status(400).json({ 
          error: 'Due date must be in the future. Please select a future date and time.',
          code: 'DUE_DATE_IN_PAST'
        });
      }

      // Validate that dueDate is not too far in the future (max 1 year)
      const oneYearFromNow = now + (365 * 24 * 60 * 60 * 1000);
      if (dueDate > oneYearFromNow) {
        addLog('info', 'POST /tasks - Invalid request: dueDate is too far in the future');
        return res.status(400).json({ 
          error: 'Due date cannot be more than 1 year in the future. Please select a date within the next year.',
          code: 'DUE_DATE_TOO_FAR'
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

// PUT /tasks/:id - Update a task (toggle completed or update title)
app.put('/tasks/:id', (req: Request, res: Response) => {
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

    // Update title if provided
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
        // Allow past dates - they will be marked as overdue
        task.dueDate = dueDate;
      }
    }

    // Update completed status if provided
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

// DELETE /tasks/:id - Delete a task
app.delete('/tasks/:id', (req: Request, res: Response) => {
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

// Start server
app.listen(PORT, () => {
  // Clean up and validate data on startup
  cleanupDataFile();
  
  const startupMessage = '='.repeat(50) + '\n' +
    '🚀 Todo API Server started\n' +
    `📍 Server running on http://localhost:${PORT}\n` +
    '📝 Logging enabled - all requests will be logged\n' +
    '📊 View logs at http://localhost:3000/\n' +
    '='.repeat(50);
  console.log(startupMessage);
  addLog('info', 'Server started successfully');
  addLog('info', `Server running on http://localhost:${PORT}`);
  addLog('info', 'View logs at http://localhost:3000/');
});

