import React from 'react';
import { FilterType } from '../types.ts';

interface TodoFiltersProps {
  currentFilter: FilterType;
  onFilterChange: (filter: FilterType) => void;
  activeCount: number;
  completedCount: number;
  totalCount: number;
}

export const TodoFilters: React.FC<TodoFiltersProps> = ({
  currentFilter,
  onFilterChange,
  activeCount,
  completedCount,
  totalCount,
}) => {
  const filters: { key: FilterType; label: string; count: number }[] = [
    { key: 'all', label: 'All', count: totalCount },
    { key: 'active', label: 'Active', count: activeCount },
    { key: 'completed', label: 'Completed', count: completedCount },
  ];

  return (
    <nav
      className="flex items-center gap-1 border-b border-zinc-200/70 dark:border-zinc-800/80 pb-2 mb-4"
      aria-label="Filter tasks"
      role="tablist"
    >
      {filters.map(({ key, label, count }) => {
        const isActive = currentFilter === key;
        return (
          <button
            key={key}
            role="tab"
            aria-selected={isActive}
            onClick={() => onFilterChange(key)}
            className={`relative flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium transition-colors rounded-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-zinc-900/20 dark:focus-visible:ring-zinc-100/20 ${
              isActive
                ? 'text-zinc-950 dark:text-zinc-100 font-semibold bg-zinc-100/90 dark:bg-zinc-800'
                : 'text-zinc-500 dark:text-zinc-400 hover:text-zinc-800 dark:hover:text-zinc-200 hover:bg-zinc-50 dark:hover:bg-zinc-800/50'
            }`}
          >
            <span>{label}</span>
            <span
              className={`rounded-full px-1.5 py-0.2 text-[10px] tabular-nums transition-colors ${
                isActive
                  ? 'bg-zinc-200 dark:bg-zinc-700 text-zinc-900 dark:text-zinc-200 font-medium'
                  : 'bg-zinc-100 dark:bg-zinc-800/80 text-zinc-400 dark:text-zinc-500'
              }`}
            >
              {count}
            </span>
          </button>
        );
      })}
    </nav>
  );
};
