import React, { useState, useRef, forwardRef, useImperativeHandle } from 'react';
import { CornerDownLeft, Plus, Calendar, Flag, Clock } from 'lucide-react';
import { Priority } from '../types.ts';
import { getTodayDateString } from '../utils/dateUtils.ts';

export interface TodoInputHandle {
  focus: () => void;
}

interface TodoInputProps {
  onAddTodo: (
    text: string,
    priority?: Priority,
    dueDate?: string,
    dueTime?: string
  ) => void;
  defaultDate?: string;
}

export const TodoInput = forwardRef<TodoInputHandle, TodoInputProps>(
  ({ onAddTodo, defaultDate }, ref) => {
    const [text, setText] = useState('');
    const [priority, setPriority] = useState<Priority>('none');
    const [dueDate, setDueDate] = useState<string>(defaultDate || '');
    const [dueTime, setDueTime] = useState<string>('');
    const [showOptions, setShowOptions] = useState(false);
    const [hasAddedRecently, setHasAddedRecently] = useState(false);
    const inputRef = useRef<HTMLInputElement>(null);

    useImperativeHandle(ref, () => ({
      focus: () => {
        inputRef.current?.focus();
      },
    }));

    const handleSubmit = (e: React.FormEvent) => {
      e.preventDefault();
      const trimmed = text.trim();
      if (!trimmed) return;

      onAddTodo(
        trimmed,
        priority !== 'none' ? priority : undefined,
        dueDate || undefined,
        dueTime || undefined
      );

      setText('');
      setPriority('none');
      setDueDate(defaultDate || '');
      setDueTime('');
      setShowOptions(false);

      // Subtle feedback flash
      setHasAddedRecently(true);
      setTimeout(() => setHasAddedRecently(false), 250);
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
      if (e.key === 'Escape') {
        inputRef.current?.blur();
        setShowOptions(false);
      }
    };

    return (
      <form onSubmit={handleSubmit} className="relative mb-5">
        <div
          className={`flex flex-col rounded-xl bg-white dark:bg-zinc-900 transition-all duration-200 border ${
            hasAddedRecently
              ? 'border-zinc-900 dark:border-zinc-100 ring-2 ring-zinc-900/10 dark:ring-zinc-100/10'
              : 'border-zinc-200/90 dark:border-zinc-800 shadow-[0_1px_2px_rgba(0,0,0,0.03)] hover:border-zinc-300 dark:hover:border-zinc-700 focus-within:border-zinc-900 dark:focus-within:border-zinc-100 focus-within:ring-2 focus-within:ring-zinc-900/10 dark:focus-within:ring-zinc-100/10'
          }`}
        >
          <div className="flex items-center">
            <span className="flex items-center pl-3.5 pr-1 text-zinc-400 dark:text-zinc-500 select-none">
              <Plus className="h-4 w-4 stroke-[2]" />
            </span>

            <input
              ref={inputRef}
              type="text"
              value={text}
              onChange={(e) => setText(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Add a new task..."
              aria-label="Add a new task"
              className="w-full bg-transparent py-3.5 pl-2 pr-12 text-[14.5px] text-zinc-900 dark:text-zinc-100 placeholder:text-zinc-400 dark:placeholder:text-zinc-600 focus:outline-none"
            />

            <div className="flex items-center gap-1 pr-2.5">
              <button
                type="button"
                onClick={() => setShowOptions(!showOptions)}
                title="Task details (date, priority)"
                aria-label="Toggle task options"
                className={`flex h-7 w-7 items-center justify-center rounded-md text-xs transition-colors ${
                  showOptions || dueDate || priority !== 'none' || dueTime
                    ? 'bg-zinc-100 dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100'
                    : 'text-zinc-400 dark:text-zinc-600 hover:text-zinc-700 dark:hover:text-zinc-300'
                }`}
              >
                <Calendar className="h-3.5 w-3.5" />
              </button>

              <button
                type="submit"
                disabled={!text.trim()}
                aria-label="Add task"
                className={`flex h-7 items-center justify-center rounded-md px-2 text-xs font-medium transition-all ${
                  text.trim()
                    ? 'bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900 shadow-2xs hover:bg-zinc-800 dark:hover:bg-white active:scale-[0.98]'
                    : 'text-zinc-300 dark:text-zinc-700 opacity-60 cursor-default'
                }`}
              >
                <span className="hidden sm:inline mr-1 text-[11px]">Add</span>
                <CornerDownLeft className="h-3 w-3" />
              </button>
            </div>
          </div>

          {/* Optional detail row */}
          {showOptions && (
            <div className="flex flex-wrap items-center gap-3 px-3.5 pb-3 pt-1 border-t border-zinc-100 dark:border-zinc-800/80 text-xs">
              <div className="flex items-center gap-1.5 text-zinc-600 dark:text-zinc-400">
                <Calendar className="h-3.5 w-3.5 text-zinc-400" />
                <input
                  type="date"
                  value={dueDate}
                  onChange={(e) => setDueDate(e.target.value)}
                  aria-label="Set due date"
                  className="rounded border border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800 px-2 py-0.5 text-xs text-zinc-800 dark:text-zinc-200 focus:outline-none"
                />
                <button
                  type="button"
                  onClick={() => setDueDate(getTodayDateString())}
                  className="text-[11px] text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-200 underline underline-offset-2"
                >
                  Today
                </button>
              </div>

              <div className="flex items-center gap-1.5 text-zinc-600 dark:text-zinc-400">
                <Clock className="h-3.5 w-3.5 text-zinc-400" />
                <input
                  type="time"
                  value={dueTime}
                  onChange={(e) => setDueTime(e.target.value)}
                  aria-label="Set due time"
                  className="rounded border border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800 px-2 py-0.5 text-xs text-zinc-800 dark:text-zinc-200 focus:outline-none"
                />
              </div>

              <div className="flex items-center gap-1.5 ml-auto">
                <Flag className="h-3.5 w-3.5 text-zinc-400" />
                <select
                  value={priority}
                  onChange={(e) => setPriority(e.target.value as Priority)}
                  aria-label="Set priority"
                  className="rounded border border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800 px-2 py-0.5 text-xs text-zinc-800 dark:text-zinc-200 focus:outline-none"
                >
                  <option value="none">No priority</option>
                  <option value="low">Low</option>
                  <option value="medium">Medium</option>
                  <option value="high">High</option>
                </select>
              </div>
            </div>
          )}
        </div>
      </form>
    );
  }
);

TodoInput.displayName = 'TodoInput';
