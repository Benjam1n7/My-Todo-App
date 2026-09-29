import React from 'react';
import { CheckCircle, ClipboardList, ListFilter } from 'lucide-react';
import { FilterType } from '../types.ts';

interface EmptyStateProps {
  filter: FilterType;
  hasAnyTodos: boolean;
}

export const EmptyState: React.FC<EmptyStateProps> = ({ filter, hasAnyTodos }) => {
  if (!hasAnyTodos) {
    return (
      <div className="flex flex-col items-center justify-center rounded-lg border border-dashed border-zinc-200 py-12 px-4 text-center">
        <div className="flex h-11 w-11 items-center justify-center rounded-full bg-zinc-100 text-zinc-400 mb-3">
          <ClipboardList className="h-5 w-5" />
        </div>
        <h3 className="text-sm font-semibold text-zinc-900">No tasks yet</h3>
        <p className="mt-1 text-xs text-zinc-500 max-w-xs">
          Your todo list is empty. Type a task above and press "Add task" to get started.
        </p>
      </div>
    );
  }

  if (filter === 'active') {
    return (
      <div className="flex flex-col items-center justify-center rounded-lg border border-dashed border-zinc-200 py-10 px-4 text-center">
        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-emerald-50 text-emerald-600 mb-3">
          <CheckCircle className="h-5 w-5" />
        </div>
        <h3 className="text-sm font-semibold text-zinc-900">All caught up!</h3>
        <p className="mt-1 text-xs text-zinc-500 max-w-xs">
          You don't have any pending active tasks right now.
        </p>
      </div>
    );
  }

  if (filter === 'completed') {
    return (
      <div className="flex flex-col items-center justify-center rounded-lg border border-dashed border-zinc-200 py-10 px-4 text-center">
        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-zinc-100 text-zinc-400 mb-3">
          <ListFilter className="h-5 w-5" />
        </div>
        <h3 className="text-sm font-semibold text-zinc-900">No completed tasks</h3>
        <p className="mt-1 text-xs text-zinc-500 max-w-xs">
          Mark any active task as completed to view it here.
        </p>
      </div>
    );
  }

  return null;
};
