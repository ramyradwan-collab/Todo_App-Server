import { useState, FormEvent } from 'react';

interface TaskInputProps {
  onAddTask: (title: string) => void;
}

export const TaskInput = ({ onAddTask }: TaskInputProps) => {
  const [inputValue, setInputValue] = useState('');

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const trimmed = inputValue.trim();
    if (trimmed) {
      onAddTask(trimmed);
      setInputValue('');
    }
  };

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
    </form>
  );
};

