export interface Task {
  id: string;
  title: string;
  completed: boolean;
  createdAt: number;
  dueDate?: number; // Timestamp in milliseconds (optional)
}

export type FilterType = 'all' | 'active' | 'completed';

