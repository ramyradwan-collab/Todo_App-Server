import { useState, FormEvent } from 'react';

interface TaskInputProps {
  onAddTask: (title: string, dueDate?: number) => void;
}

export const TaskInput = ({ onAddTask }: TaskInputProps) => {
  const [inputValue, setInputValue] = useState('');
  const [isTimeSensitive, setIsTimeSensitive] = useState(false);
  const [dueDate, setDueDate] = useState('');
  const [dueTime, setDueTime] = useState('');

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const trimmed = inputValue.trim();
    if (trimmed) {
      let dueDateTimestamp: number | undefined;
      
      if (isTimeSensitive && dueDate && dueTime) {
        // Combine date and time into a timestamp
        const dateTimeString = `${dueDate}T${dueTime}`;
        dueDateTimestamp = new Date(dateTimeString).getTime();
      }
      
      onAddTask(trimmed, dueDateTimestamp);
      setInputValue('');
      setIsTimeSensitive(false);
      setDueDate('');
      setDueTime('');
    }
  };

  // Get minimum date (today) - allow past times if date is today
  const now = new Date();
  const minDate = now.toISOString().split('T')[0];

  return (
    <form onSubmit={handleSubmit} className="task-input" data-testid="task-input-form">
      <input
        type="text"
        value={inputValue}
        onChange={(e) => setInputValue(e.target.value)}
        placeholder="Add a new task..."
        className="task-input__field"
        data-testid="task-input-field"
      />
      <button type="submit" className="task-input__button" data-testid="task-input-submit">
        Add
      </button>
      <div className="task-input__time-sensitive">
        <label className="task-input__toggle-label" data-testid="time-sensitive-toggle-label">
          <input
            type="checkbox"
            checked={isTimeSensitive}
            onChange={(e) => setIsTimeSensitive(e.target.checked)}
            className="task-input__toggle"
            data-testid="time-sensitive-toggle"
          />
          <span>Time sensitive</span>
        </label>
        {isTimeSensitive && (
          <div className="task-input__datetime" data-testid="datetime-picker">
            <input
              type="date"
              value={dueDate}
              onChange={(e) => setDueDate(e.target.value)}
              min={minDate}
              className="task-input__date"
              data-testid="due-date-picker"
              required={isTimeSensitive}
            />
            <input
              type="time"
              value={dueTime}
              onChange={(e) => setDueTime(e.target.value)}
              className="task-input__time"
              data-testid="due-time-picker"
              required={isTimeSensitive}
            />
          </div>
        )}
      </div>
    </form>
  );
};

