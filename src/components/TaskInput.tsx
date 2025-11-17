import { useState, FormEvent, useMemo } from 'react';

interface TaskInputProps {
  onAddTask: (title: string, dueDate?: number) => void;
}

export const TaskInput = ({ onAddTask }: TaskInputProps) => {
  const [inputValue, setInputValue] = useState('');
  const [isTimeSensitive, setIsTimeSensitive] = useState(false);
  const [dueDate, setDueDate] = useState('');
  const [dueTime, setDueTime] = useState('');
  const [dateError, setDateError] = useState<string | null>(null);

  // Calculate min/max dates and min time
  const { minDate, maxDate } = useMemo(() => {
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const oneYearFromNow = new Date(today);
    oneYearFromNow.setFullYear(oneYearFromNow.getFullYear() + 1);
    
    return {
      minDate: today.toISOString().split('T')[0],
      maxDate: oneYearFromNow.toISOString().split('T')[0],
    };
  }, []);

  // Calculate min time based on selected date
  const minTime = useMemo(() => {
    if (!dueDate) return '00:00';
    
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const selectedDate = new Date(dueDate);
    const isToday = selectedDate.getTime() === today.getTime();
    
    if (isToday) {
      // If today, require time to be at least 1 minute in the future
      const nextMinute = new Date(now);
      nextMinute.setMinutes(nextMinute.getMinutes() + 1);
      return `${String(nextMinute.getHours()).padStart(2, '0')}:${String(nextMinute.getMinutes()).padStart(2, '0')}`;
    }
    
    return '00:00';
  }, [dueDate]);

  // Validate date and time
  const validateDateTime = (date: string, time: string): string | null => {
    if (!date || !time) return null;

    const dateTimeString = `${date}T${time}`;
    const selectedDateTime = new Date(dateTimeString);
    const now = new Date();

    // Check if date is in the past
    if (selectedDateTime <= now) {
      return 'Due date and time must be in the future';
    }

    // Check if date is too far in the future (more than 1 year)
    const oneYearFromNow = new Date();
    oneYearFromNow.setFullYear(oneYearFromNow.getFullYear() + 1);
    if (selectedDateTime > oneYearFromNow) {
      return 'Due date cannot be more than 1 year in the future';
    }

    return null;
  };

  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newDate = e.target.value;
    setDueDate(newDate);
    setDateError(null);
    
    // If time is already set, validate the combination
    if (dueTime && newDate) {
      const error = validateDateTime(newDate, dueTime);
      if (error) {
        setDateError(error);
      }
    }
  };

  const handleTimeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newTime = e.target.value;
    setDueTime(newTime);
    setDateError(null);
    
    // If date is already set, validate the combination
    if (dueDate && newTime) {
      const error = validateDateTime(dueDate, newTime);
      if (error) {
        setDateError(error);
      }
    }
  };

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const trimmed = inputValue.trim();
    if (!trimmed) return;

    if (isTimeSensitive) {
      if (!dueDate || !dueTime) {
        setDateError('Please select both date and time');
        return;
      }

      // Final validation before submitting
      const error = validateDateTime(dueDate, dueTime);
      if (error) {
        setDateError(error);
        return;
      }

      // Combine date and time into a timestamp
      const dateTimeString = `${dueDate}T${dueTime}`;
      const dueDateTimestamp = new Date(dateTimeString).getTime();
      
      onAddTask(trimmed, dueDateTimestamp);
    } else {
      onAddTask(trimmed);
    }

    // Reset form
    setInputValue('');
    setIsTimeSensitive(false);
    setDueDate('');
    setDueTime('');
    setDateError(null);
  };

  return (
    <form onSubmit={handleSubmit} className="task-input" data-testid="task-input-form">
      <div className="task-input__main-row">
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
      </div>
      <div className="task-input__time-sensitive">
        <label className="task-input__toggle-label" data-testid="time-sensitive-toggle-label">
          <input
            type="checkbox"
            checked={isTimeSensitive}
            onChange={(e) => setIsTimeSensitive(e.target.checked)}
            className="task-input__toggle"
            data-testid="time-sensitive-toggle"
          />
          <span>⏰ Time sensitive</span>
        </label>
        {isTimeSensitive && (
          <div className="task-input__datetime" data-testid="datetime-picker">
            <div className="task-input__datetime-group">
              <label className="task-input__datetime-label">
                <span className="task-input__datetime-icon">📅</span>
                <span className="task-input__datetime-label-text">Date</span>
              </label>
              <input
                type="date"
                value={dueDate}
                onChange={handleDateChange}
                min={minDate}
                max={maxDate}
                className="task-input__date"
                data-testid="due-date-picker"
                required={isTimeSensitive}
                aria-invalid={dateError ? 'true' : 'false'}
              />
            </div>
            <div className="task-input__datetime-group">
              <label className="task-input__datetime-label">
                <span className="task-input__datetime-icon">🕐</span>
                <span className="task-input__datetime-label-text">Time</span>
              </label>
              <input
                type="time"
                value={dueTime}
                onChange={handleTimeChange}
                min={minTime}
                className="task-input__time"
                data-testid="due-time-picker"
                required={isTimeSensitive}
                aria-invalid={dateError ? 'true' : 'false'}
              />
            </div>
            {dateError && (
              <div className="task-input__error" data-testid="date-error-message" role="alert">
                <span className="task-input__error-icon">⚠️</span>
                <span className="task-input__error-text">{dateError}</span>
              </div>
            )}
          </div>
        )}
      </div>
    </form>
  );
};

