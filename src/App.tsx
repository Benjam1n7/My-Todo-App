import React, { useState, useEffect } from 'react';
import { Todo, Note, CalendarEvent, NavSection, Theme, Priority } from './types.ts';
import { Navigation } from './components/Navigation.tsx';
import { TodayView } from './components/TodayView.tsx';
import { TasksView } from './components/TasksView.tsx';
import { NotesView } from './components/NotesView.tsx';
import { CalendarView } from './components/CalendarView.tsx';
import { QuickCaptureModal } from './components/QuickCaptureModal.tsx';
import { GlobalSearchModal } from './components/GlobalSearchModal.tsx';
import { getTodayDateString } from './utils/dateUtils.ts';

const STORAGE_KEYS = {
  TODOS: 'personal_workspace_todos_v3',
  NOTES: 'personal_workspace_notes_v3',
  EVENTS: 'personal_workspace_events_v3',
  THEME: 'personal_workspace_theme_v3',
  SECTION: 'personal_workspace_section_v3',
};

export default function App() {
  const todayStr = getTodayDateString();

  // 1. Theme State
  const [theme, setTheme] = useState<Theme>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.THEME);
      if (saved === 'dark' || saved === 'light') return saved;
      return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    } catch {
      return 'light';
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.THEME, theme);
    } catch {}
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [theme]);

  const toggleTheme = () => {
    setTheme((prev) => (prev === 'light' ? 'dark' : 'light'));
  };

  // 2. Navigation State
  const [section, setSection] = useState<NavSection>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.SECTION) as NavSection;
      if (['today', 'tasks', 'notes', 'calendar'].includes(saved)) return saved;
      return 'today';
    } catch {
      return 'today';
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.SECTION, section);
    } catch {}
  }, [section]);

  // 3. Todos State - Genuinely empty for first-time users
  const [todos, setTodos] = useState<Todo[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.TODOS);
      if (saved !== null) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) return parsed;
      }
    } catch {}
    return [];
  });

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.TODOS, JSON.stringify(todos));
    } catch (e) {
      console.error('Failed to save todos', e);
    }
  }, [todos]);

  // 4. Notes State - Genuinely empty for first-time users
  const [notes, setNotes] = useState<Note[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.NOTES);
      if (saved !== null) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) return parsed;
      }
    } catch {}
    return [];
  });

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.NOTES, JSON.stringify(notes));
    } catch (e) {
      console.error('Failed to save notes', e);
    }
  }, [notes]);

  // 5. Calendar Events State - Genuinely empty for first-time users
  const [events, setEvents] = useState<CalendarEvent[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.EVENTS);
      if (saved !== null) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) return parsed;
      }
    } catch {}
    return [];
  });

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.EVENTS, JSON.stringify(events));
    } catch (e) {
      console.error('Failed to save events', e);
    }
  }, [events]);

  // 6. Modals
  const [isQuickCaptureOpen, setIsQuickCaptureOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  // Global Keyboard Shortcuts
  useEffect(() => {
    const handleGlobalKeyDown = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement | null;
      const isInput =
        target &&
        (target.tagName === 'INPUT' ||
          target.tagName === 'TEXTAREA' ||
          target.isContentEditable);

      if (isInput) return;

      if (e.key === 'q' || e.key === 'Q') {
        e.preventDefault();
        setIsQuickCaptureOpen(true);
      } else if (e.key === '/' || ((e.metaKey || e.ctrlKey) && e.key === 'k')) {
        e.preventDefault();
        setIsSearchOpen(true);
      } else if (e.key === '1') {
        e.preventDefault();
        setSection('today');
      } else if (e.key === '2') {
        e.preventDefault();
        setSection('tasks');
      } else if (e.key === '3') {
        e.preventDefault();
        setSection('notes');
      } else if (e.key === '4') {
        e.preventDefault();
        setSection('calendar');
      }
    };

    window.addEventListener('keydown', handleGlobalKeyDown);
    return () => window.removeEventListener('keydown', handleGlobalKeyDown);
  }, []);

  // Todo Handlers
  const handleAddTodo = (
    text: string,
    priority?: Priority,
    dueDate?: string,
    dueTime?: string
  ) => {
    const trimmed = text.trim();
    if (!trimmed) return;

    const newTodo: Todo = {
      id: crypto.randomUUID
        ? crypto.randomUUID()
        : `todo-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`,
      text: trimmed,
      completed: false,
      priority,
      dueDate,
      dueTime,
      createdAt: Date.now(),
    };

    setTodos((prev) => [newTodo, ...prev]);
  };

  const handleToggleTodo = (id: string) => {
    setTodos((prev) =>
      prev.map((todo) =>
        todo.id === id ? { ...todo, completed: !todo.completed } : todo
      )
    );
  };

  const handleEditTodo = (
    id: string,
    newText: string,
    newPriority?: Priority,
    newDueDate?: string,
    newDueTime?: string
  ) => {
    const trimmed = newText.trim();
    if (!trimmed) return;

    setTodos((prev) =>
      prev.map((todo) =>
        todo.id === id
          ? {
              ...todo,
              text: trimmed,
              priority: newPriority,
              dueDate: newDueDate,
              dueTime: newDueTime,
            }
          : todo
      )
    );
  };

  const handleDeleteTodo = (id: string) => {
    setTodos((prev) => prev.filter((todo) => todo.id !== id));
  };

  const handleClearCompleted = () => {
    setTodos((prev) => prev.filter((todo) => !todo.completed));
  };

  // Note Handlers
  const handleAddNote = (title: string, body: string, date?: string): string => {
    const newId = crypto.randomUUID
      ? crypto.randomUUID()
      : `note-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;

    const newNote: Note = {
      id: newId,
      title: title.trim() || 'Untitled Note',
      body,
      createdAt: Date.now(),
      updatedAt: Date.now(),
      date,
    };

    setNotes((prev) => [newNote, ...prev]);
    return newId;
  };

  const handleUpdateNote = (id: string, updates: Partial<Note>) => {
    setNotes((prev) =>
      prev.map((note) =>
        note.id === id ? { ...note, ...updates, updatedAt: Date.now() } : note
      )
    );
  };

  const handleDeleteNote = (id: string) => {
    setNotes((prev) => prev.filter((note) => note.id !== id));
  };

  // Event Handlers
  const handleAddEvent = (eventData: Omit<CalendarEvent, 'id' | 'createdAt'>) => {
    const newEvent: CalendarEvent = {
      ...eventData,
      id: crypto.randomUUID
        ? crypto.randomUUID()
        : `evt-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`,
      createdAt: Date.now(),
    };
    setEvents((prev) => [newEvent, ...prev]);
  };

  const handleDeleteEvent = (id: string) => {
    setEvents((prev) => prev.filter((e) => e.id !== id));
  };

  // Filter items relevant for Today
  const todayTasks = todos.filter(
    (t) => t.dueDate === todayStr || (!t.dueDate && !t.completed)
  );
  const todayEvents = events.filter((e) => e.date === todayStr);

  return (
    <div className="min-h-screen bg-[#fafaf9] dark:bg-[#0f0f11] text-zinc-900 dark:text-zinc-100 flex flex-col md:flex-row transition-colors duration-150">
      {/* Navigation: Desktop Rail & Mobile Bars */}
      <Navigation
        currentSection={section}
        onSelectSection={setSection}
        theme={theme}
        onToggleTheme={toggleTheme}
        onOpenQuickCapture={() => setIsQuickCaptureOpen(true)}
        onOpenSearch={() => setIsSearchOpen(true)}
        todayTasksCount={todayTasks.filter((t) => !t.completed).length}
      />

      {/* Main Content Workspace */}
      <div className="flex-1 flex flex-col min-w-0 pb-20 md:pb-8">
        <main className="flex-1 px-4 sm:px-8 py-6 sm:py-10 max-w-5xl w-full mx-auto">
          {section === 'today' && (
            <TodayView
              todayTasks={todayTasks}
              todayEvents={todayEvents}
              onToggleTodo={handleToggleTodo}
              onEditTodo={handleEditTodo}
              onDeleteTodo={handleDeleteTodo}
              onAddTodo={handleAddTodo}
              onNavigateToCalendar={() => setSection('calendar')}
              onWriteNote={() => {
                handleAddNote('', '', todayStr);
                setSection('notes');
              }}
              onPlanEvent={() => {
                setSection('calendar');
              }}
            />
          )}

          {section === 'tasks' && (
            <TasksView
              todos={todos}
              onAddTodo={handleAddTodo}
              onToggleTodo={handleToggleTodo}
              onEditTodo={handleEditTodo}
              onDeleteTodo={handleDeleteTodo}
              onClearCompleted={handleClearCompleted}
            />
          )}

          {section === 'notes' && (
            <NotesView
              notes={notes}
              onAddNote={handleAddNote}
              onUpdateNote={handleUpdateNote}
              onDeleteNote={handleDeleteNote}
            />
          )}

          {section === 'calendar' && (
            <CalendarView
              events={events}
              todos={todos}
              notes={notes}
              onAddEvent={handleAddEvent}
              onDeleteEvent={handleDeleteEvent}
              onToggleTodo={handleToggleTodo}
            />
          )}
        </main>
      </div>

      {/* Quick Capture Modal */}
      <QuickCaptureModal
        isOpen={isQuickCaptureOpen}
        onClose={() => setIsQuickCaptureOpen(false)}
        onAddTask={handleAddTodo}
        onAddNote={handleAddNote}
        onAddEvent={handleAddEvent}
      />

      {/* Global Search Modal */}
      <GlobalSearchModal
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
        todos={todos}
        notes={notes}
        events={events}
        onNavigate={setSection}
        onToggleTodo={handleToggleTodo}
      />
    </div>
  );
}
