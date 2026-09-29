import React, { useState, useEffect } from 'react';
import { X, CheckSquare, FileText, Calendar as CalendarIcon } from 'lucide-react';
import { Priority, CalendarEvent } from '../types.ts';
import { getTodayDateString } from '../utils/dateUtils.ts';

interface QuickCaptureModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddTask: (text: string, priority?: Priority, dueDate?: string, dueTime?: string) => void;
  onAddNote: (title: string, body: string, date?: string) => string;
  onAddEvent: (event: Omit<CalendarEvent, 'id' | 'createdAt'>) => void;
}

type CaptureType = 'task' | 'note' | 'event';

export const QuickCaptureModal: React.FC<QuickCaptureModalProps> = ({
  isOpen,
  onClose,
  onAddTask,
  onAddNote,
  onAddEvent,
}) => {
  const [type, setType] = useState<CaptureType>('task');

  // Task form
  const [taskText, setTaskText] = useState('');
  const [taskPriority, setTaskPriority] = useState<Priority>('none');
  const [taskDate, setTaskDate] = useState(getTodayDateString());
  const [taskTime, setTaskTime] = useState('');

  // Note form
  const [noteTitle, setNoteTitle] = useState('');
  const [noteBody, setNoteBody] = useState('');

  // Event form
  const [eventTitle, setEventTitle] = useState('');
  const [eventDate, setEventDate] = useState(getTodayDateString());
  const [eventStartTime, setEventStartTime] = useState('09:00');
  const [eventEndTime, setEventEndTime] = useState('10:00');
  const [eventDesc, setEventDesc] = useState('');

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (type === 'task') {
      if (!taskText.trim()) return;
      onAddTask(
        taskText.trim(),
        taskPriority !== 'none' ? taskPriority : undefined,
        taskDate || undefined,
        taskTime || undefined
      );
      setTaskText('');
    } else if (type === 'note') {
      if (!noteTitle.trim() && !noteBody.trim()) return;
      onAddNote(
        noteTitle.trim() || 'Untitled Note',
        noteBody.trim(),
        getTodayDateString()
      );
      setNoteTitle('');
      setNoteBody('');
    } else if (type === 'event') {
      if (!eventTitle.trim()) return;
      onAddEvent({
        title: eventTitle.trim(),
        date: eventDate,
        startTime: eventStartTime,
        endTime: eventEndTime || undefined,
        description: eventDesc.trim() || undefined,
      });
      setEventTitle('');
      setEventDesc('');
    }
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs animate-in fade-in duration-100">
      <div
        className="w-full max-w-lg rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 shadow-xl overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header Tabs */}
        <div className="flex items-center justify-between px-4 py-3 border-b border-zinc-100 dark:border-zinc-800">
          <div className="flex items-center gap-1">
            <button
              type="button"
              onClick={() => setType('task')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                type === 'task'
                  ? 'bg-zinc-100 dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100'
                  : 'text-zinc-500 hover:text-zinc-800 dark:hover:text-zinc-200'
              }`}
            >
              <CheckSquare className="h-3.5 w-3.5" />
              <span>Task</span>
            </button>

            <button
              type="button"
              onClick={() => setType('note')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                type === 'note'
                  ? 'bg-zinc-100 dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100'
                  : 'text-zinc-500 hover:text-zinc-800 dark:hover:text-zinc-200'
              }`}
            >
              <FileText className="h-3.5 w-3.5" />
              <span>Note</span>
            </button>

            <button
              type="button"
              onClick={() => setType('event')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                type === 'event'
                  ? 'bg-zinc-100 dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100'
                  : 'text-zinc-500 hover:text-zinc-800 dark:hover:text-zinc-200'
              }`}
            >
              <CalendarIcon className="h-3.5 w-3.5" />
              <span>Event</span>
            </button>
          </div>

          <button
            type="button"
            onClick={onClose}
            aria-label="Close dialog"
            className="p-1 rounded-md text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-200 hover:bg-zinc-100 dark:hover:bg-zinc-800"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Content Form */}
        <form onSubmit={handleSubmit} className="p-4 space-y-3">
          {type === 'task' && (
            <>
              <input
                type="text"
                autoFocus
                placeholder="What needs to be done?"
                value={taskText}
                onChange={(e) => setTaskText(e.target.value)}
                className="w-full text-sm font-medium text-zinc-900 dark:text-zinc-100 bg-transparent placeholder:text-zinc-400 focus:outline-none"
              />

              <div className="flex flex-wrap items-center gap-3 pt-2 text-xs text-zinc-600 dark:text-zinc-400">
                <div className="flex items-center gap-1">
                  <span>Date:</span>
                  <input
                    type="date"
                    value={taskDate}
                    onChange={(e) => setTaskDate(e.target.value)}
                    className="rounded border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 px-2 py-0.5 text-xs text-zinc-800 dark:text-zinc-200 focus:outline-none"
                  />
                </div>

                <div className="flex items-center gap-1">
                  <span>Time:</span>
                  <input
                    type="time"
                    value={taskTime}
                    onChange={(e) => setTaskTime(e.target.value)}
                    className="rounded border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 px-2 py-0.5 text-xs text-zinc-800 dark:text-zinc-200 focus:outline-none"
                  />
                </div>

                <div className="flex items-center gap-1 ml-auto">
                  <span>Priority:</span>
                  <select
                    value={taskPriority}
                    onChange={(e) => setTaskPriority(e.target.value as Priority)}
                    className="rounded border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 px-2 py-0.5 text-xs text-zinc-800 dark:text-zinc-200 focus:outline-none"
                  >
                    <option value="none">None</option>
                    <option value="low">Low</option>
                    <option value="medium">Medium</option>
                    <option value="high">High</option>
                  </select>
                </div>
              </div>
            </>
          )}

          {type === 'note' && (
            <>
              <input
                type="text"
                autoFocus
                placeholder="Note Title"
                value={noteTitle}
                onChange={(e) => setNoteTitle(e.target.value)}
                className="w-full text-sm font-semibold text-zinc-900 dark:text-zinc-100 bg-transparent placeholder:text-zinc-400 focus:outline-none"
              />

              <textarea
                rows={4}
                placeholder="Write your note..."
                value={noteBody}
                onChange={(e) => setNoteBody(e.target.value)}
                className="w-full text-xs text-zinc-700 dark:text-zinc-300 bg-transparent resize-none placeholder:text-zinc-400 focus:outline-none"
              />
            </>
          )}

          {type === 'event' && (
            <>
              <input
                type="text"
                autoFocus
                placeholder="Event title..."
                value={eventTitle}
                onChange={(e) => setEventTitle(e.target.value)}
                className="w-full text-sm font-semibold text-zinc-900 dark:text-zinc-100 bg-transparent placeholder:text-zinc-400 focus:outline-none"
              />

              <div className="grid grid-cols-2 gap-3 text-xs">
                <div>
                  <label className="text-[10px] text-zinc-400 block mb-1">Date</label>
                  <input
                    type="date"
                    value={eventDate}
                    onChange={(e) => setEventDate(e.target.value)}
                    className="w-full rounded border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 px-2 py-1 text-zinc-900 dark:text-zinc-100 focus:outline-none"
                  />
                </div>

                <div className="flex gap-2">
                  <div className="flex-1">
                    <label className="text-[10px] text-zinc-400 block mb-1">Start</label>
                    <input
                      type="time"
                      value={eventStartTime}
                      onChange={(e) => setEventStartTime(e.target.value)}
                      className="w-full rounded border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 px-2 py-1 text-zinc-900 dark:text-zinc-100 focus:outline-none"
                    />
                  </div>
                  <div className="flex-1">
                    <label className="text-[10px] text-zinc-400 block mb-1">End</label>
                    <input
                      type="time"
                      value={eventEndTime}
                      onChange={(e) => setEventEndTime(e.target.value)}
                      className="w-full rounded border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 px-2 py-1 text-zinc-900 dark:text-zinc-100 focus:outline-none"
                    />
                  </div>
                </div>
              </div>

              <input
                type="text"
                placeholder="Optional description or link"
                value={eventDesc}
                onChange={(e) => setEventDesc(e.target.value)}
                className="w-full text-xs text-zinc-700 dark:text-zinc-300 rounded border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 px-2 py-1 focus:outline-none"
              />
            </>
          )}

          <div className="flex items-center justify-between pt-3 border-t border-zinc-100 dark:border-zinc-800">
            <span className="text-[11px] text-zinc-400">
              Press Enter to save · Esc to close
            </span>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={onClose}
                className="px-3 py-1.5 rounded-lg text-xs text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-1.5 rounded-lg bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900 text-xs font-medium hover:bg-zinc-800 dark:hover:bg-white transition-colors"
              >
                Save
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};
