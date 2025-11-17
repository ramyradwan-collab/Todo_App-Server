/**
 * Formats remaining time until due date
 */
export const formatRemainingTime = (dueDate: number): string => {
  const now = Date.now();
  const diff = dueDate - now;

  if (diff < 0) {
    return 'Overdue';
  }

  const seconds = Math.floor(diff / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);

  if (days > 0) {
    return `${days}d ${hours % 24}h remaining`;
  } else if (hours > 0) {
    return `${hours}h ${minutes % 60}m remaining`;
  } else if (minutes > 0) {
    return `${minutes}m remaining`;
  } else {
    return `${seconds}s remaining`;
  }
};

/**
 * Checks if a task is overdue
 */
export const isOverdue = (dueDate: number | undefined, completed: boolean): boolean => {
  if (!dueDate || completed) return false;
  return Date.now() > dueDate;
};

/**
 * Formats date and time for display
 */
export const formatDueDate = (dueDate: number): string => {
  const date = new Date(dueDate);
  return date.toLocaleString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
  });
};

