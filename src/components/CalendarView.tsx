import React, { useState } from 'react';
import { ChevronLeft, ChevronRight, Plus, Clock, Trash2, Calendar as CalendarIcon, CheckSquare, FileText } from 'lucide-react';
import { CalendarEvent, Todo, Note } from '../types.ts';
import { getTodayDateString, formatTime24to12 } from '../utils/dateUtils.ts';
import { EmptyState } from './EmptyState.tsx';

interface CalendarViewProps {
  events: CalendarEvent[];
  todos: Todo[];
  notes: Note[];
  onAddEvent: (event: Omit<CalendarEvent, 'id' | 'createdAt'>) => void;
  onDeleteEvent: (id: string) => void;
  onToggleTodo: (id: string) => void;
}

export const CalendarView: React.FC<CalendarViewProps> = ({
  events,
  todos,
  notes,
  onAddEvent,
  onDeleteEvent,
  onToggleTodo,
}) => {
  const todayStr = getTodayDateString();
  const [currentDate, setCurrentDate] = useState(() => new Date());
  const [selectedDate, setSelectedDate] = useState<string>(todayStr);

  // New Event Form State
  const [isAddingEvent, setIsAddingEvent] = useState(false);
  const [eventTitle, setEventTitle] = useState('');
  const [eventStartTime, setEventStartTime] = useState('09:00');
  const [eventEndTime, setEventEndTime] = useState('10:00');
  const [eventDescription, setEventDescription] = useState('');

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  const monthName = currentDate.toLocaleDateString(undefined, {
    month: 'long',
    year: 'numeric',
  });

  // Calendar math
  const firstDayOfMonth = new Date(year, month, 1).getDay(); // 0 is Sunday
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  const prevMonth = () => {
    setCurrentDate(new Date(year, month - 1, 1));
  };

  const nextMonth = () => {
    setCurrentDate(new Date(year, month + 1, 1));
  };

  const goToToday = () => {
    const now = new Date();
    setCurrentDate(now);
    setSelectedDate(todayStr);
  };

  const handleCreateEvent = (e: React.FormEvent) => {
    e.preventDefault();
    if (!eventTitle.trim()) return;

    onAddEvent({
      title: eventTitle.trim(),
      date: selectedDate,
      startTime: eventStartTime,
      endTime: eventEndTime || undefined,
      description: eventDescription.trim() || undefined,
    });

    setEventTitle('');
    setEventDescription('');
    setIsAddingEvent(false);
  };

  // Filter items for selected day
  const dayEvents = events.filter((e) => e.date === selectedDate);
  const dayTodos = todos.filter((t) => t.dueDate === selectedDate);
  const dayNotes = notes.filter((n) => n.date === selectedDate);

  // Format selected date nicely
  const [sY, sM, sD] = selectedDate.split('-').map(Number);
  const selectedDateObj = new Date(sY, sM - 1, sD);
  const formattedSelectedDate = selectedDateObj.toLocaleDateString(undefined, {
    weekday: 'long',
    month: 'short',
    day: 'numeric',
  });

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header & Month Navigator */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-zinc-200/80 dark:border-zinc-800">
        <div>
          <span className="text-xs font-semibold uppercase tracking-[0.2em] text-zinc-400 dark:text-zinc-500">
            Calendar
          </span>
          <h1 className="text-2xl font-semibold tracking-tight text-zinc-900 dark:text-zinc-50">
            {monthName}
          </h1>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={goToToday}
            className="px-2.5 py-1 text-xs font-medium rounded-md border border-zinc-200 dark:border-zinc-800 hover:bg-zinc-100 dark:hover:bg-zinc-800 text-zinc-700 dark:text-zinc-300 transition-colors"
          >
            Today
          </button>
          <div className="flex items-center border border-zinc-200 dark:border-zinc-800 rounded-md overflow-hidden">
            <button
              type="button"
              onClick={prevMonth}
              aria-label="Previous month"
              className="p-1.5 hover:bg-zinc-100 dark:hover:bg-zinc-800 text-zinc-600 dark:text-zinc-400 transition-colors"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>
            <button
              type="button"
              onClick={nextMonth}
              aria-label="Next month"
              className="p-1.5 hover:bg-zinc-100 dark:hover:bg-zinc-800 text-zinc-600 dark:text-zinc-400 transition-colors"
            >
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Main Grid & Day Schedule View */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Month Calendar Grid (7 cols) - ALWAYS fully displayed */}
        <div className="lg:col-span-7 bg-white dark:bg-zinc-900/60 rounded-xl border border-zinc-200/80 dark:border-zinc-800 p-4">
          {/* Day of Week Headers */}
          <div className="grid grid-cols-7 text-center text-xs font-medium text-zinc-400 dark:text-zinc-500 pb-2 mb-1 border-b border-zinc-100 dark:border-zinc-800">
            <span>Su</span>
            <span>Mo</span>
            <span>Tu</span>
            <span>We</span>
            <span>Th</span>
            <span>Fr</span>
            <span>Sa</span>
          </div>

          {/* Days Grid */}
          <div className="grid grid-cols-7 gap-1">
            {/* Blank leading days */}
            {Array.from({ length: firstDayOfMonth }).map((_, i) => (
              <div key={`blank-${i}`} className="h-10 sm:h-12" />
            ))}

            {/* Month Days */}
            {Array.from({ length: daysInMonth }).map((_, idx) => {
              const dayNum = idx + 1;
              const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(dayNum).padStart(2, '0')}`;
              const isSelected = selectedDate === dateStr;
              const isToday = todayStr === dateStr;

              // Check if items exist on this day
              const hasEvents = events.some((e) => e.date === dateStr);
              const hasTodos = todos.some((t) => t.dueDate === dateStr);

              return (
                <button
                  key={dateStr}
                  type="button"
                  onClick={() => setSelectedDate(dateStr)}
                  className={`h-10 sm:h-12 flex flex-col items-center justify-between p-1 rounded-lg transition-colors border ${
                    isSelected
                      ? 'border-zinc-900 dark:border-zinc-100 bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900 font-semibold'
                      : isToday
                      ? 'border-zinc-300 dark:border-zinc-700 bg-zinc-100/70 dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 font-medium'
                      : 'border-transparent text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100/70 dark:hover:bg-zinc-800/60'
                  }`}
                >
                  <span className="text-xs">{dayNum}</span>

                  {/* Dot Indicators */}
                  <div className="flex gap-0.5 mt-0.5">
                    {hasEvents && (
                      <span
                        className={`h-1 w-1 rounded-full ${
                          isSelected ? 'bg-white dark:bg-zinc-900' : 'bg-blue-500'
                        }`}
                      />
                    )}
                    {hasTodos && (
                      <span
                        className={`h-1 w-1 rounded-full ${
                          isSelected ? 'bg-white dark:bg-zinc-900' : 'bg-amber-500'
                        }`}
                      />
                    )}
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Selected Day Agenda (5 cols) */}
        <div className="lg:col-span-5 flex flex-col bg-white dark:bg-zinc-900/60 rounded-xl border border-zinc-200/80 dark:border-zinc-800 p-4">
          <div className="flex items-center justify-between pb-3 border-b border-zinc-100 dark:border-zinc-800">
            <div>
              <span className="text-[11px] font-semibold uppercase tracking-wider text-zinc-400">
                Agenda
              </span>
              <h2 className="text-sm font-semibold text-zinc-900 dark:text-zinc-100">
                {formattedSelectedDate}
              </h2>
            </div>

            <button
              type="button"
              onClick={() => setIsAddingEvent(!isAddingEvent)}
              className="flex items-center gap-1 px-2.5 py-1 text-xs font-medium rounded-md bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900 hover:bg-zinc-800 dark:hover:bg-white transition-colors"
            >
              <Plus className="h-3.5 w-3.5" />
              <span>Add event</span>
            </button>
          </div>

          {/* New Event Form */}
          {isAddingEvent && (
            <form onSubmit={handleCreateEvent} className="mt-3 p-3 rounded-lg border border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800/70 space-y-2 text-xs">
              <input
                type="text"
                autoFocus
                placeholder="Event title..."
                value={eventTitle}
                onChange={(e) => setEventTitle(e.target.value)}
                className="w-full rounded border border-zinc-200 dark:border-zinc-600 bg-white dark:bg-zinc-900 px-2.5 py-1.5 text-zinc-900 dark:text-zinc-100 focus:outline-none"
              />

              <div className="flex items-center gap-2">
                <input
                  type="time"
                  value={eventStartTime}
                  onChange={(e) => setEventStartTime(e.target.value)}
                  className="rounded border border-zinc-200 dark:border-zinc-600 bg-white dark:bg-zinc-900 px-2 py-1 text-zinc-900 dark:text-zinc-100 focus:outline-none"
                />
                <span className="text-zinc-400">–</span>
                <input
                  type="time"
                  value={eventEndTime}
                  onChange={(e) => setEventEndTime(e.target.value)}
                  className="rounded border border-zinc-200 dark:border-zinc-600 bg-white dark:bg-zinc-900 px-2 py-1 text-zinc-900 dark:text-zinc-100 focus:outline-none"
                />
              </div>

              <input
                type="text"
                placeholder="Description (optional)"
                value={eventDescription}
                onChange={(e) => setEventDescription(e.target.value)}
                className="w-full rounded border border-zinc-200 dark:border-zinc-600 bg-white dark:bg-zinc-900 px-2.5 py-1 text-zinc-900 dark:text-zinc-100 focus:outline-none"
              />

              <div className="flex justify-end gap-2 pt-1">
                <button
                  type="button"
                  onClick={() => setIsAddingEvent(false)}
                  className="px-2.5 py-1 text-zinc-500 hover:text-zinc-700 dark:hover:text-zinc-300"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={!eventTitle.trim()}
                  className="px-3 py-1 rounded bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900 font-medium"
                >
                  Save event
                </button>
              </div>
            </form>
          )}

          {/* Agenda Items List */}
          <div className="flex-1 overflow-y-auto mt-3 space-y-3">
            {/* Events */}
            {dayEvents.length > 0 && (
              <div>
                <span className="text-[10px] font-semibold uppercase tracking-wider text-zinc-400 block mb-1">
                  Events ({dayEvents.length})
                </span>
                <div className="space-y-1.5">
                  {dayEvents.map((evt) => (
                    <div
                      key={evt.id}
                      className="group flex items-start justify-between gap-2 p-2.5 rounded-lg border border-zinc-200/80 dark:border-zinc-800 bg-zinc-50/70 dark:bg-zinc-800/40 text-xs"
                    >
                      <div>
                        <div className="font-medium text-zinc-900 dark:text-zinc-100">
                          {evt.title}
                        </div>
                        <div className="text-[11px] text-zinc-500 flex items-center gap-1 mt-0.5">
                          <Clock className="h-3 w-3" />
                          <span>
                            {formatTime24to12(evt.startTime)}
                            {evt.endTime ? ` – ${formatTime24to12(evt.endTime)}` : ''}
                          </span>
                        </div>
                        {evt.description && (
                          <p className="text-[11px] text-zinc-400 mt-1">
                            {evt.description}
                          </p>
                        )}
                      </div>

                      <button
                        type="button"
                        onClick={() => onDeleteEvent(evt.id)}
                        className="opacity-0 group-hover:opacity-100 p-1 text-zinc-400 hover:text-rose-500 transition-opacity"
                        aria-label={`Delete event ${evt.title}`}
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Scheduled Tasks for this day */}
            {dayTodos.length > 0 && (
              <div>
                <span className="text-[10px] font-semibold uppercase tracking-wider text-zinc-400 block mb-1">
                  Tasks Due ({dayTodos.length})
                </span>
                <div className="space-y-1">
                  {dayTodos.map((todo) => (
                    <div
                      key={todo.id}
                      onClick={() => onToggleTodo(todo.id)}
                      className={`flex items-center gap-2 p-2 rounded-lg border border-zinc-200/70 dark:border-zinc-800 text-xs cursor-pointer ${
                        todo.completed
                          ? 'text-zinc-400 line-through bg-zinc-50/40 dark:bg-zinc-900/30'
                          : 'text-zinc-800 dark:text-zinc-200 hover:bg-zinc-50 dark:hover:bg-zinc-800/50'
                      }`}
                    >
                      <CheckSquare className="h-3.5 w-3.5 text-zinc-400" />
                      <span className="truncate">{todo.text}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Notes associated with this day */}
            {dayNotes.length > 0 && (
              <div>
                <span className="text-[10px] font-semibold uppercase tracking-wider text-zinc-400 block mb-1">
                  Notes ({dayNotes.length})
                </span>
                <div className="space-y-1">
                  {dayNotes.map((note) => (
                    <div
                      key={note.id}
                      className="p-2 rounded-lg border border-zinc-200/70 dark:border-zinc-800 text-xs text-zinc-700 dark:text-zinc-300"
                    >
                      <div className="font-medium truncate">{note.title}</div>
                      <div className="text-[11px] text-zinc-400 truncate">{note.body}</div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* When there is no agenda item for this day */}
            {dayEvents.length === 0 && dayTodos.length === 0 && dayNotes.length === 0 && (
              <EmptyState
                title="Your calendar is clear."
                description="Plan something when you're ready."
                actionLabel="Add event"
                onAction={() => setIsAddingEvent(true)}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
