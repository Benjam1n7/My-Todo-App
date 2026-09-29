import React, { useRef } from 'react';
import { Clock, Plus, FileText, Calendar as CalendarIcon } from 'lucide-react';
import { Todo, CalendarEvent, Priority } from '../types.ts';
import { TodoItem } from './TodoItem.tsx';
import { TodoInput, TodoInputHandle } from './TodoInput.tsx';
import { getGreeting, getTodayDateString, formatTime24to12, formatNaturalDate } from '../utils/dateUtils.ts';

interface TodayViewProps {
  todayTasks: Todo[];
  todayEvents: CalendarEvent[];
  onToggleTodo: (id: string) => void;
  onEditTodo: (
    id: string,
    newText: string,
    newPriority?: Priority,
    newDueDate?: string,
    newDueTime?: string
  ) => void;
  onDeleteTodo: (id: string) => void;
  onAddTodo: (
    text: string,
    priority?: Priority,
    dueDate?: string,
    dueTime?: string
  ) => void;
  onNavigateToCalendar: () => void;
  onWriteNote: () => void;
  onPlanEvent: () => void;
}

export const TodayView: React.FC<TodayViewProps> = ({
  todayTasks,
  todayEvents,
  onToggleTodo,
  onEditTodo,
  onDeleteTodo,
  onAddTodo,
  onNavigateToCalendar,
  onWriteNote,
  onPlanEvent,
}) => {
  const currentHour = new Date().getHours();
  const greeting = getGreeting(currentHour);
  const todayStr = getTodayDateString();
  const inputRef = useRef<TodoInputHandle>(null);

  const completedCount = todayTasks.filter((t) => t.completed).length;
  const totalCount = todayTasks.length;
  const percent = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;

  const isCompletelyEmpty = todayTasks.length === 0 && todayEvents.length === 0;

  const handleFocusComposer = () => {
    inputRef.current?.focus();
  };

  return (
    <div className="max-w-2xl mx-auto space-y-8">
      {/* Top Greeting & Live Clock Area */}
      <section className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 pb-6 border-b border-zinc-200/70 dark:border-zinc-800/80">
        <div>
          <span className="text-xs font-semibold uppercase tracking-[0.2em] text-zinc-400 dark:text-zinc-500">
            Today
          </span>
          <h1 className="mt-1 text-2xl sm:text-3xl font-semibold tracking-tight text-zinc-900 dark:text-zinc-50">
            {greeting}
          </h1>
          <p className="mt-1 text-xs text-zinc-500 dark:text-zinc-400">
            {totalCount > 0
              ? `${completedCount} of ${totalCount} tasks completed`
              : 'Your workspace is calm and ready.'}
          </p>
        </div>

        <div className="sm:text-right">
          <span className="text-xs font-medium tracking-wide text-zinc-400 dark:text-zinc-500 uppercase">
            {formatNaturalDate(new Date())}
          </span>
        </div>
      </section>

      {/* Progress Bar (Only when there are tasks) */}
      {totalCount > 0 && (
        <div className="w-full bg-zinc-100 dark:bg-zinc-800/80 h-1 rounded-full overflow-hidden">
          <div
            className="h-full bg-zinc-900 dark:bg-zinc-100 rounded-full transition-all duration-300 ease-out"
            style={{ width: `${percent}%` }}
          />
        </div>
      )}

      {/* Brand-new User Welcome State */}
      {isCompletelyEmpty ? (
        <div className="py-10 sm:py-16 flex flex-col items-center text-center">
          <div className="h-1.5 w-1.5 rounded-full bg-zinc-300 dark:bg-zinc-700 mb-4" />
          <h2 className="text-xl sm:text-2xl font-medium tracking-tight text-zinc-900 dark:text-zinc-100">
            Your day starts here.
          </h2>
          <p className="mt-1.5 text-xs sm:text-sm text-zinc-400 dark:text-zinc-500 max-w-sm leading-relaxed">
            Add a task, capture an idea, or plan something for your day.
          </p>

          {/* Three subtle primary actions */}
          <div className="mt-6 flex flex-wrap items-center justify-center gap-2.5">
            <button
              type="button"
              onClick={handleFocusComposer}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900 text-xs font-medium hover:bg-zinc-800 dark:hover:bg-white shadow-2xs transition-all active:scale-[0.98]"
            >
              <Plus className="h-3.5 w-3.5" />
              <span>Add task</span>
            </button>

            <button
              type="button"
              onClick={onWriteNote}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 text-zinc-700 dark:text-zinc-300 text-xs font-medium hover:bg-zinc-50 dark:hover:bg-zinc-800 transition-colors"
            >
              <FileText className="h-3.5 w-3.5 text-zinc-400" />
              <span>Write a note</span>
            </button>

            <button
              type="button"
              onClick={onPlanEvent}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 text-zinc-700 dark:text-zinc-300 text-xs font-medium hover:bg-zinc-50 dark:hover:bg-zinc-800 transition-colors"
            >
              <CalendarIcon className="h-3.5 w-3.5 text-zinc-400" />
              <span>Plan an event</span>
            </button>
          </div>

          {/* Prompt composer right below */}
          <div className="w-full max-w-md mt-10 text-left">
            <TodoInput
              ref={inputRef}
              onAddTodo={(text, priority, dueDate, dueTime) =>
                onAddTodo(text, priority, dueDate || todayStr, dueTime)
              }
              defaultDate={todayStr}
            />
          </div>
        </div>
      ) : (
        <>
          {/* Today's Schedule (Events) */}
          {todayEvents.length > 0 && (
            <section>
              <div className="flex items-center justify-between mb-3">
                <h2 className="text-xs font-semibold uppercase tracking-wider text-zinc-400 dark:text-zinc-500">
                  Schedule Today
                </h2>
                <button
                  type="button"
                  onClick={onNavigateToCalendar}
                  className="text-xs text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-200 transition-colors"
                >
                  View calendar →
                </button>
              </div>

              <div className="grid gap-2">
                {todayEvents.map((evt) => (
                  <div
                    key={evt.id}
                    className="flex items-center justify-between rounded-lg border border-zinc-200/80 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-3"
                  >
                    <div className="flex items-center gap-2.5">
                      <div className="flex h-7 w-7 items-center justify-center rounded bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-300">
                        <Clock className="h-3.5 w-3.5" />
                      </div>
                      <div>
                        <h3 className="text-sm font-medium text-zinc-900 dark:text-zinc-100">
                          {evt.title}
                        </h3>
                        {evt.description && (
                          <p className="text-xs text-zinc-500 dark:text-zinc-400">
                            {evt.description}
                          </p>
                        )}
                      </div>
                    </div>

                    <div className="text-xs font-medium tabular-nums text-zinc-500 dark:text-zinc-400">
                      {formatTime24to12(evt.startTime)}
                      {evt.endTime ? ` – ${formatTime24to12(evt.endTime)}` : ''}
                    </div>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Today's Focus (Tasks) */}
          <section>
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-xs font-semibold uppercase tracking-wider text-zinc-400 dark:text-zinc-500">
                Today's Focus
              </h2>
              <span className="text-xs text-zinc-400">
                {todayTasks.filter((t) => !t.completed).length} remaining
              </span>
            </div>

            {/* Quick inline task composer defaulting to today */}
            <TodoInput
              ref={inputRef}
              onAddTodo={(text, priority, dueDate, dueTime) =>
                onAddTodo(text, priority, dueDate || todayStr, dueTime)
              }
              defaultDate={todayStr}
            />

            {todayTasks.length > 0 && (
              <ul className="space-y-1.5" aria-label="Today tasks">
                {todayTasks.map((todo) => (
                  <TodoItem
                    key={todo.id}
                    todo={todo}
                    onToggle={onToggleTodo}
                    onEdit={onEditTodo}
                    onDelete={onDeleteTodo}
                  />
                ))}
              </ul>
            )}
          </section>
        </>
      )}
    </div>
  );
};
