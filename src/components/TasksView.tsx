import React, { useState, useRef } from 'react';
import { Todo, FilterType, Priority } from '../types.ts';
import { TodoInput, TodoInputHandle } from './TodoInput.tsx';
import { TodoItem } from './TodoItem.tsx';
import { TodoFilters } from './TodoFilters.tsx';
import { EmptyState } from './EmptyState.tsx';

interface TasksViewProps {
  todos: Todo[];
  onAddTodo: (
    text: string,
    priority?: Priority,
    dueDate?: string,
    dueTime?: string
  ) => void;
  onToggleTodo: (id: string) => void;
  onEditTodo: (
    id: string,
    newText: string,
    newPriority?: Priority,
    newDueDate?: string,
    newDueTime?: string
  ) => void;
  onDeleteTodo: (id: string) => void;
  onClearCompleted: () => void;
}

export const TasksView: React.FC<TasksViewProps> = ({
  todos,
  onAddTodo,
  onToggleTodo,
  onEditTodo,
  onDeleteTodo,
  onClearCompleted,
}) => {
  const [filter, setFilter] = useState<FilterType>('all');
  const [priorityFilter, setPriorityFilter] = useState<string>('all');
  const inputRef = useRef<TodoInputHandle>(null);

  const activeCount = todos.filter((t) => !t.completed).length;
  const completedCount = todos.filter((t) => t.completed).length;
  const totalCount = todos.length;

  const filteredTodos = todos.filter((todo) => {
    // Status filter
    if (filter === 'active' && todo.completed) return false;
    if (filter === 'completed' && !todo.completed) return false;

    // Priority filter
    if (priorityFilter !== 'all') {
      if ((todo.priority || 'none') !== priorityFilter) return false;
    }

    return true;
  });

  const handleFocusComposer = () => {
    inputRef.current?.focus();
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      {/* Header */}
      <div>
        <span className="text-xs font-semibold uppercase tracking-[0.2em] text-zinc-400 dark:text-zinc-500">
          Tasks
        </span>
        <h1 className="mt-1 text-2xl sm:text-3xl font-semibold tracking-tight text-zinc-900 dark:text-zinc-50">
          All Tasks
        </h1>
        <p className="mt-1 text-xs text-zinc-500 dark:text-zinc-400">
          Capture, schedule, and organize what you need to accomplish.
        </p>
      </div>

      {/* Task Composer */}
      <TodoInput ref={inputRef} onAddTodo={onAddTodo} />

      {/* Filters Bar (Only show filter controls if there is at least 1 task) */}
      {totalCount > 0 && (
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <TodoFilters
            currentFilter={filter}
            onFilterChange={setFilter}
            activeCount={activeCount}
            completedCount={completedCount}
            totalCount={totalCount}
          />

          {/* Priority quick filter dropdown */}
          <div className="flex items-center gap-1.5 self-end sm:self-auto text-xs pb-4 sm:pb-2">
            <span className="text-zinc-400">Priority:</span>
            <select
              value={priorityFilter}
              onChange={(e) => setPriorityFilter(e.target.value)}
              aria-label="Filter by priority"
              className="rounded border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 px-2 py-1 text-xs text-zinc-700 dark:text-zinc-300 focus:outline-none"
            >
              <option value="all">All priorities</option>
              <option value="high">High only</option>
              <option value="medium">Medium only</option>
              <option value="low">Low only</option>
              <option value="none">No priority</option>
            </select>
          </div>
        </div>
      )}

      {/* Task List or Empty State */}
      <main>
        {totalCount === 0 ? (
          <EmptyState
            title="Nothing on your list yet."
            description="Add something you want to get done."
            actionLabel="Add task"
            onAction={handleFocusComposer}
          />
        ) : filteredTodos.length > 0 ? (
          <ul className="space-y-1.5" aria-label="Tasks list">
            {filteredTodos.map((todo) => (
              <TodoItem
                key={todo.id}
                todo={todo}
                onToggle={onToggleTodo}
                onEdit={onEditTodo}
                onDelete={onDeleteTodo}
              />
            ))}
          </ul>
        ) : filter === 'active' ? (
          <EmptyState
            title="You're all caught up."
            description="All your tasks have been completed."
          />
        ) : filter === 'completed' ? (
          <EmptyState
            title="No completed tasks yet."
            description="Mark a task as done to see it here."
          />
        ) : (
          <EmptyState
            title="No matching tasks."
            description="Try selecting a different filter."
          />
        )}
      </main>

      {/* Footer Info */}
      {totalCount > 0 && (
        <div className="flex items-center justify-between pt-4 border-t border-zinc-100 dark:border-zinc-800/80 text-xs text-zinc-400">
          <span>
            {activeCount} {activeCount === 1 ? 'task' : 'tasks'} remaining
          </span>

          {completedCount > 0 && (
            <button
              type="button"
              onClick={onClearCompleted}
              className="text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-200 transition-colors"
            >
              Clear completed
            </button>
          )}
        </div>
      )}
    </div>
  );
};
