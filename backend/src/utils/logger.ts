interface LogEntry {
  timestamp: string;
  level: 'info' | 'error';
  message: string;
}

const logs: LogEntry[] = [];
const MAX_LOGS = 1000;

/**
 * Store a log entry
 */
export const addLog = (level: 'info' | 'error', message: string): void => {
  const entry: LogEntry = {
    timestamp: new Date().toISOString(),
    level,
    message,
  };
  logs.push(entry);
  
  // Keep only the last MAX_LOGS entries
  if (logs.length > MAX_LOGS) {
    logs.shift();
  }
  
  // Also log to console
  if (level === 'error') {
    console.error(message);
  } else {
    console.log(message);
  }
};

/**
 * Get all logs
 */
export const getLogs = (): LogEntry[] => {
  return [...logs];
};

/**
 * Clear all logs
 */
export const clearLogs = (): void => {
  logs.length = 0;
};

