import React, { useState, useEffect, useMemo } from 'react';
import { Search, X, CheckSquare, FileText, Calendar as CalendarIcon, ArrowRight } from 'lucide-react';
import { Todo, Note, CalendarEvent, NavSection } from '../types.ts';
import { formatShortDate } from '../utils/dateUtils.ts';

interface GlobalSearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  todos: Todo[];
  notes: Note[];
  events: CalendarEvent[];
  onNavigate: (section: NavSection) => void;
  onToggleTodo: (id: string) => void;
}

export const GlobalSearchModal: React.FC<GlobalSearchModalProps> = ({
  isOpen,
  onClose,
  todos,
  notes,
  events,
  onNavigate,
  onToggleTodo,
}) => {
  const [query, setQuery] = useState('');

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  const results = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) {
      return { tasks: [], notes: [], events: [] };
    }

    return {
      tasks: todos.filter((t) => t.text.toLowerCase().includes(q)),
      notes: notes.filter(
        (n) => n.title.toLowerCase().includes(q) || n.body.toLowerCase().includes(q)
      ),
      events: events.filter(
        (e) =>
          e.title.toLowerCase().includes(q) ||
          (e.description && e.description.toLowerCase().includes(q))
      ),
    };
  }, [query, todos, notes, events]);

  if (!isOpen) return null;

  const totalResults =
    results.tasks.length + results.notes.length + results.events.length;

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-20 p-4 bg-black/40 backdrop-blur-xs">
      <div
        className="w-full max-w-lg rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 shadow-2xl overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Search Input Bar */}
        <div className="flex items-center px-3 py-3 border-b border-zinc-100 dark:border-zinc-800">
          <Search className="h-4 w-4 text-zinc-400 mr-2 shrink-0" />
          <input
            type="text"
            autoFocus
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search tasks, notes, events..."
            aria-label="Search all items"
            className="w-full text-sm bg-transparent text-zinc-900 dark:text-zinc-100 placeholder:text-zinc-400 focus:outline-none"
          />
          <button
            type="button"
            onClick={onClose}
            aria-label="Close search"
            className="p-1 text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-200 rounded"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Results List */}
        <div className="max-h-96 overflow-y-auto p-2 space-y-3">
          {query.trim() === '' ? (
            <div className="p-6 text-center text-xs text-zinc-400">
              Type keywords to search across your workspace.
            </div>
          ) : totalResults === 0 ? (
            <div className="p-6 text-center text-xs text-zinc-400">
              No results found for "{query}".
            </div>
          ) : (
            <>
              {/* Tasks Section */}
              {results.tasks.length > 0 && (
                <div>
                  <div className="flex items-center justify-between px-2 py-1 text-[10px] font-semibold uppercase tracking-wider text-zinc-400">
                    <span>Tasks ({results.tasks.length})</span>
                    <button
                      type="button"
                      onClick={() => {
                        onNavigate('tasks');
                        onClose();
                      }}
                      className="hover:text-zinc-700 dark:hover:text-zinc-200"
                    >
                      View all →
                    </button>
                  </div>
                  <div className="space-y-0.5">
                    {results.tasks.map((todo) => (
                      <div
                        key={todo.id}
                        className="flex items-center justify-between p-2 rounded-lg hover:bg-zinc-50 dark:hover:bg-zinc-800/60 text-xs transition-colors"
                      >
                        <div className="flex items-center gap-2 min-w-0">
                          <button
                            type="button"
                            onClick={() => onToggleTodo(todo.id)}
                            className="text-zinc-400 hover:text-zinc-800 dark:hover:text-zinc-200"
                          >
                            <CheckSquare className="h-3.5 w-3.5" />
                          </button>
                          <span
                            className={`truncate ${
                              todo.completed
                                ? 'text-zinc-400 line-through'
                                : 'text-zinc-800 dark:text-zinc-200'
                            }`}
                          >
                            {todo.text}
                          </span>
                        </div>
                        {todo.dueDate && (
                          <span className="text-[10px] text-zinc-400 shrink-0 ml-2">
                            {formatShortDate(todo.dueDate)}
                          </span>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Notes Section */}
              {results.notes.length > 0 && (
                <div>
                  <div className="flex items-center justify-between px-2 py-1 text-[10px] font-semibold uppercase tracking-wider text-zinc-400">
                    <span>Notes ({results.notes.length})</span>
                    <button
                      type="button"
                      onClick={() => {
                        onNavigate('notes');
                        onClose();
                      }}
                      className="hover:text-zinc-700 dark:hover:text-zinc-200"
                    >
                      View all →
                    </button>
                  </div>
                  <div className="space-y-0.5">
                    {results.notes.map((note) => (
                      <button
                        key={note.id}
                        type="button"
                        onClick={() => {
                          onNavigate('notes');
                          onClose();
                        }}
                        className="w-full text-left p-2 rounded-lg hover:bg-zinc-50 dark:hover:bg-zinc-800/60 text-xs transition-colors flex items-center justify-between"
                      >
                        <div className="flex items-center gap-2 min-w-0">
                          <FileText className="h-3.5 w-3.5 text-zinc-400 shrink-0" />
                          <span className="font-medium text-zinc-800 dark:text-zinc-200 truncate">
                            {note.title || 'Untitled Note'}
                          </span>
                        </div>
                        <ArrowRight className="h-3 w-3 text-zinc-400 shrink-0" />
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Events Section */}
              {results.events.length > 0 && (
                <div>
                  <div className="flex items-center justify-between px-2 py-1 text-[10px] font-semibold uppercase tracking-wider text-zinc-400">
                    <span>Events ({results.events.length})</span>
                    <button
                      type="button"
                      onClick={() => {
                        onNavigate('calendar');
                        onClose();
                      }}
                      className="hover:text-zinc-700 dark:hover:text-zinc-200"
                    >
                      View all →
                    </button>
                  </div>
                  <div className="space-y-0.5">
                    {results.events.map((evt) => (
                      <button
                        key={evt.id}
                        type="button"
                        onClick={() => {
                          onNavigate('calendar');
                          onClose();
                        }}
                        className="w-full text-left p-2 rounded-lg hover:bg-zinc-50 dark:hover:bg-zinc-800/60 text-xs transition-colors flex items-center justify-between"
                      >
                        <div className="flex items-center gap-2 min-w-0">
                          <CalendarIcon className="h-3.5 w-3.5 text-zinc-400 shrink-0" />
                          <span className="font-medium text-zinc-800 dark:text-zinc-200 truncate">
                            {evt.title}
                          </span>
                        </div>
                        <span className="text-[10px] text-zinc-400 shrink-0 ml-2">
                          {formatShortDate(evt.date)} · {evt.startTime}
                        </span>
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};
