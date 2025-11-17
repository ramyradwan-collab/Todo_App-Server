import { useState, useEffect } from 'react';
import { Task } from '../types/Task';
import { formatRemainingTime, isOverdue, formatDueDate } from '../utils/timeUtils';

interface TaskItemProps {
  task: Task;
  onToggle: (id: string) => void;
  onDelete: (id: string) => void;
}

export const TaskItem = ({ task, onToggle, onDelete }: TaskItemProps) => {
  const [, setCurrentTime] = useState(Date.now());
  const overdue = isOverdue(task.dueDate, task.completed);
  
  // Update time every minute to refresh remaining time display
  useEffect(() => {
    if (!task.dueDate || task.completed) return;
    
    const interval = setInterval(() => {
      setCurrentTime(Date.now()); // Force re-render to update remaining time
    }, 60000); // Update every minute
    
    return () => clearInterval(interval);
  }, [task.dueDate, task.completed]);
  
  return (
    <div 
      className={`task-item ${task.completed ? 'task-item--completed' : ''} ${overdue ? 'task-item--overdue' : ''}`}
      data-testid={`task-item-${task.id}`}
    >
      <label className="task-item__checkbox-label">
        <input
          type="checkbox"
          checked={task.completed}
          onChange={() => onToggle(task.id)}
          className="task-item__checkbox"
          data-testid={`task-checkbox-${task.id}`}
        />
        <div className="task-item__content">
          <span className="task-item__title" data-testid={`task-title-${task.id}`}>
            {task.title}
          </span>
          {task.dueDate && !task.completed && (
            <div className="task-item__due-info" data-testid={`task-due-info-${task.id}`}>
              <span className={`task-item__due-time ${overdue ? 'task-item__due-time--overdue' : ''}`}>
                {overdue ? '⚠️ ' : ''}{formatRemainingTime(task.dueDate)}
              </span>
              <span className="task-item__due-date">
                {formatDueDate(task.dueDate)}
              </span>
            </div>
          )}
        </div>
      </label>
      <button
        onClick={() => onDelete(task.id)}
        className="task-item__delete"
        aria-label="Delete task"
        data-testid={`task-delete-${task.id}`}
      >
        ×
      </button>
    </div>
  );
};

