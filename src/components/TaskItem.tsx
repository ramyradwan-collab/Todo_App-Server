import { Task } from '../types/Task';

interface TaskItemProps {
  task: Task;
  onToggle: (id: string) => void;
  onDelete: (id: string) => void;
}

export const TaskItem = ({ task, onToggle, onDelete }: TaskItemProps) => {
  return (
    <div 
      className={`task-item ${task.completed ? 'task-item--completed' : ''}`}
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
        <span className="task-item__title" data-testid={`task-title-${task.id}`}>
          {task.title}
        </span>
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

