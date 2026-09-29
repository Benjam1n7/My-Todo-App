import React, { useState, useRef, useEffect } from 'react';
import { Check, Pencil, Trash2, X, Calendar, Clock, AlertCircle } from 'lucide-react';
import { Todo, Priority } from '../types.ts';
import { formatShortDate, formatTime24to12 } from '../utils/dateUtils.ts';

interface TodoItemProps {
  todo: Todo;
  onToggle: (id: string) => void;
  onEdit: (
    id: string,
    newText: string,
    newPriority?: Priority,
    newDueDate?: string,
    newDueTime?: string
  ) => void;
  onDelete: (id: string) => void;
}

export const TodoItem: React.FC<TodoItemProps> = ({
  todo,
  onToggle,
  onEdit,
  onDelete,
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editText, setEditText] = useState(todo.text);
  const [editPriority, setEditPriority] = useState<Priority>(todo.priority || 'none');
  const [editDate, setEditDate] = useState(todo.dueDate || '');
  const [editTime, setEditTime] = useState(todo.dueTime || '');
  const [hasError, setHasError] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isEditing) {
      setEditText(todo.text);
      setEditPriority(todo.priority || 'none');
      setEditDate(todo.dueDate || '');
      setEditTime(todo.dueTime || '');
      setHasError(false);
      const timer = setTimeout(() => {
        inputRef.current?.focus();
        inputRef.current?.select();
      }, 10);
      return () => clearTimeout(timer);
    }
  }, [isEditing, todo]);

  const handleSave = () => {
    const trimmed = editText.trim();
    if (!trimmed) {
      setHasError(true);
      inputRef.current?.focus();
      return;
    }
    onEdit(
      todo.id,
      trimmed,
      editPriority,
      editDate || undefined,
      editTime || undefined
    );
    setIsEditing(false);
    setHasError(false);
  };

  const handleCancel = () => {
    setEditText(todo.text);
    setIsEditing(false);
    setHasError(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleSave();
    } else if (e.key === 'Escape') {
      e.preventDefault();
      handleCancel();
    }
  };

  // Subtle priority dot indicator
  const renderPriorityDot = (p?: Priority) => {
    if (!p || p === 'none') return null;
    let colorClass = 'bg-zinc-400';
    let title = 'Low priority';
    if (p === 'high') {
      colorClass = 'bg-rose-500';
      title = 'High priority';
    } else if (p === 'medium') {
      colorClass = 'bg-amber-500';
      title = 'Medium priority';
    } else if (p === 'low') {
      colorClass = 'bg-blue-400';
      title = 'Low priority';
    }
    return (
      <span
        title={title}
        aria-label={title}
        className={`h-1.5 w-1.5 rounded-full ${colorClass} shrink-0 inline-block`}
      />
    );
  };

  return (
    <li
      className={`group relative flex flex-col sm:flex-row sm:items-center justify-between gap-2 sm:gap-3 rounded-lg border bg-white dark:bg-zinc-900 px-3.5 py-3 transition-all duration-150 ${
        todo.completed
          ? 'border-zinc-200/50 dark:border-zinc-800/60 bg-zinc-50/50 dark:bg-zinc-900/40 text-zinc-400 dark:text-zinc-500'
          : 'border-zinc-200/80 dark:border-zinc-800 hover:border-zinc-300 dark:hover:border-zinc-700 hover:shadow-[0_1px_2px_rgba(0,0,0,0.02)] text-zinc-800 dark:text-zinc-200'
      }`}
    >
      {isEditing ? (
        <div className="flex w-full flex-col gap-2.5">
          <input
            ref={inputRef}
            type="text"
            value={editText}
            onChange={(e) => {
              setEditText(e.target.value);
              if (hasError) setHasError(false);
            }}
            onKeyDown={handleKeyDown}
            aria-label={`Editing task: ${todo.text}`}
            className={`w-full rounded-md border bg-white dark:bg-zinc-800 px-3 py-1.5 text-sm text-zinc-900 dark:text-zinc-100 transition-colors focus:outline-none focus:ring-2 ${
              hasError
                ? 'border-red-400 focus:border-red-500 focus:ring-red-100'
                : 'border-zinc-300 dark:border-zinc-700 focus:border-zinc-900 dark:focus:border-zinc-100 focus:ring-zinc-900/10'
            }`}
          />

          {/* Inline Edit Details: Priority, Date, Time */}
          <div className="flex flex-wrap items-center justify-between gap-2 pt-1 border-t border-zinc-100 dark:border-zinc-800/80">
            <div className="flex flex-wrap items-center gap-2 text-xs">
              <select
                value={editPriority}
                onChange={(e) => setEditPriority(e.target.value as Priority)}
                aria-label="Task priority"
                className="rounded border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 px-2 py-1 text-xs text-zinc-700 dark:text-zinc-300 focus:outline-none"
              >
                <option value="none">No priority</option>
                <option value="low">Low priority</option>
                <option value="medium">Medium priority</option>
                <option value="high">High priority</option>
              </select>

              <div className="flex items-center gap-1">
                <input
                  type="date"
                  value={editDate}
                  onChange={(e) => setEditDate(e.target.value)}
                  aria-label="Due date"
                  className="rounded border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 px-2 py-1 text-xs text-zinc-700 dark:text-zinc-300 focus:outline-none"
                />
                <input
                  type="time"
                  value={editTime}
                  onChange={(e) => setEditTime(e.target.value)}
                  aria-label="Due time"
                  className="rounded border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 px-2 py-1 text-xs text-zinc-700 dark:text-zinc-300 focus:outline-none"
                />
              </div>
            </div>

            <div className="flex items-center gap-1.5 ml-auto">
              <button
                type="button"
                onClick={handleSave}
                title="Save (Enter)"
                aria-label="Save changes"
                className="inline-flex h-7 items-center gap-1 rounded-md bg-zinc-900 dark:bg-zinc-100 px-2.5 text-xs font-medium text-white dark:text-zinc-900 transition-colors hover:bg-zinc-800 dark:hover:bg-white"
              >
                <Check className="h-3.5 w-3.5" />
                <span>Save</span>
              </button>
              <button
                type="button"
                onClick={handleCancel}
                title="Cancel (Esc)"
                aria-label="Cancel editing"
                className="inline-flex h-7 items-center justify-center rounded-md border border-zinc-200 dark:border-zinc-700 px-2 text-xs text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800"
              >
                <X className="h-3.5 w-3.5" />
              </button>
            </div>
          </div>
        </div>
      ) : (
        <>
          <div className="flex min-w-0 flex-1 items-start sm:items-center gap-3">
            {/* Custom Checkbox */}
            <button
              type="button"
              role="checkbox"
              aria-checked={todo.completed}
              onClick={() => onToggle(todo.id)}
              aria-label={
                todo.completed
                  ? `Mark "${todo.text}" as incomplete`
                  : `Mark "${todo.text}" as complete`
              }
              className={`relative mt-0.5 sm:mt-0 flex h-4.5 w-4.5 shrink-0 items-center justify-center rounded-md border transition-all duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-zinc-900/20 dark:focus-visible:ring-zinc-100/20 focus-visible:ring-offset-1 ${
                todo.completed
                  ? 'border-zinc-900 dark:border-zinc-100 bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900'
                  : 'border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-900 hover:border-zinc-400 dark:hover:border-zinc-500'
              }`}
            >
              <Check
                className={`h-3 w-3 stroke-[2.5] transition-all duration-150 ${
                  todo.completed ? 'scale-100 opacity-100' : 'scale-50 opacity-0'
                }`}
              />
            </button>

            {/* Task Info & Metadata */}
            <div className="flex min-w-0 flex-1 flex-col gap-0.5">
              <div className="flex items-center gap-2">
                {renderPriorityDot(todo.priority)}
                <span
                  onClick={() => onToggle(todo.id)}
                  className={`cursor-pointer select-none text-[14px] leading-relaxed break-words transition-all duration-150 ${
                    todo.completed
                      ? 'text-zinc-400 dark:text-zinc-500 line-through decoration-zinc-300/80 dark:decoration-zinc-700 decoration-1'
                      : 'text-zinc-800 dark:text-zinc-200 hover:text-zinc-950 dark:hover:text-white'
                  }`}
                >
                  {todo.text}
                </span>
              </div>

              {/* Optional Date & Time pills */}
              {(todo.dueDate || todo.dueTime) && (
                <div className="flex items-center gap-2 text-[11px] text-zinc-400 dark:text-zinc-500">
                  {todo.dueDate && (
                    <span className="flex items-center gap-1">
                      <Calendar className="h-3 w-3" />
                      <span>{formatShortDate(todo.dueDate)}</span>
                    </span>
                  )}
                  {todo.dueTime && (
                    <span className="flex items-center gap-1">
                      <Clock className="h-3 w-3" />
                      <span>{formatTime24to12(todo.dueTime)}</span>
                    </span>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-1 opacity-80 sm:opacity-0 sm:group-hover:opacity-100 focus-within:opacity-100 transition-opacity duration-150 self-end sm:self-center shrink-0">
            <button
              type="button"
              onClick={() => setIsEditing(true)}
              aria-label={`Edit "${todo.text}"`}
              title="Edit task"
              className="inline-flex h-7 w-7 items-center justify-center rounded-md text-zinc-400 hover:text-zinc-800 dark:hover:text-zinc-200 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors focus-visible:opacity-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-zinc-900/20"
            >
              <Pencil className="h-3.5 w-3.5" />
            </button>
            <button
              type="button"
              onClick={() => onDelete(todo.id)}
              aria-label={`Delete "${todo.text}"`}
              title="Delete task"
              className="inline-flex h-7 w-7 items-center justify-center rounded-md text-zinc-400 hover:text-rose-600 dark:hover:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/30 transition-colors focus-visible:opacity-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rose-500/20"
            >
              <Trash2 className="h-3.5 w-3.5" />
            </button>
          </div>
        </>
      )}
    </li>
  );
};
