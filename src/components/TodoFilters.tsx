import React from 'react';
import { FilterType } from '../types.ts';

interface TodoFiltersProps {
  currentFilter: FilterType;
  onFilterChange: (filter: FilterType) => void;
  activeCount: number;
  completedCount: number;
  totalCount: number;
  onClearCompleted: () => void;
}

export const TodoFilters: React.FC<TodoFiltersProps> = ({
  currentFilter,
  onFilterChange,
  activeCount,
  completedCount,
  totalCount,
  onClearCompleted,
}) => {
  const filters: { key: FilterType; label: string; count: number }[] = [
    { key: 'all', label: 'All', count: totalCount },
    { key: 'active', label: 'Active', count: activeCount },
    { key: 'completed', label: 'Completed', count: completedCount },
  ];

  return (
    <div className="mt-4 flex flex-col gap-3 pt-3 border-t border-zinc-100 sm:flex-row sm:items-center sm:justify-between text-xs text-zinc-500">
      <div className="font-medium text-zinc-600">
        <span>
          {activeCount} {activeCount === 1 ? 'task' : 'tasks'} remaining
        </span>
      </div>

      <div className="flex items-center gap-1 rounded-lg bg-zinc-100/80 p-1 self-start sm:self-auto">
        {filters.map(({ key, label, count }) => {
          const isActive = currentFilter === key;
          return (
            <button
              key={key}
              onClick={() => onFilterChange(key)}
              className={`rounded-md px-2.5 py-1 font-medium transition-all ${
                isActive
                  ? 'bg-white text-zinc-900 shadow-xs'
                  : 'text-zinc-600 hover:text-zinc-900'
              }`}
            >
              {label}{' '}
              <span className={`ml-0.5 text-[10px] ${isActive ? 'text-zinc-500' : 'text-zinc-400'}`}>
                ({count})
              </span>
            </button>
          );
        })}
      </div>

      <div className="flex items-center justify-end min-h-[24px]">
        {completedCount > 0 ? (
          <button
            onClick={onClearCompleted}
            className="text-zinc-400 hover:text-red-600 transition-colors underline-offset-4 hover:underline"
          >
            Clear completed
          </button>
        ) : (
          <span className="invisible select-none">Clear</span>
        )}
      </div>
    </div>
  );
};
