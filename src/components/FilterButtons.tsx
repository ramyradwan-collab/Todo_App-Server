import { FilterType } from '../types/Task';

interface FilterButtonsProps {
  currentFilter: FilterType;
  onFilterChange: (filter: FilterType) => void;
  counts: {
    all: number;
    active: number;
    completed: number;
  };
}

export const FilterButtons = ({
  currentFilter,
  onFilterChange,
  counts,
}: FilterButtonsProps) => {
  return (
    <div className="filter-buttons" data-testid="filter-buttons">
      <button
        onClick={() => onFilterChange('all')}
        className={`filter-buttons__button ${
          currentFilter === 'all' ? 'filter-buttons__button--active' : ''
        }`}
        data-testid="filter-all"
      >
        All ({counts.all})
      </button>
      <button
        onClick={() => onFilterChange('active')}
        className={`filter-buttons__button ${
          currentFilter === 'active' ? 'filter-buttons__button--active' : ''
        }`}
        data-testid="filter-active"
      >
        Active ({counts.active})
      </button>
      <button
        onClick={() => onFilterChange('completed')}
        className={`filter-buttons__button ${
          currentFilter === 'completed' ? 'filter-buttons__button--active' : ''
        }`}
        data-testid="filter-completed"
      >
        Completed ({counts.completed})
      </button>
    </div>
  );
};

