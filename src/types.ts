export type Priority = 'none' | 'low' | 'medium' | 'high';

export interface Todo {
  id: string;
  text: string;
  completed: boolean;
  createdAt: number;
  priority?: Priority;
  dueDate?: string; // YYYY-MM-DD
  dueTime?: string; // HH:mm
}

export type FilterType = 'all' | 'active' | 'completed';

export interface Note {
  id: string;
  title: string;
  body: string;
  createdAt: number;
  updatedAt: number;
  date?: string; // Optional connection to YYYY-MM-DD
}

export interface CalendarEvent {
  id: string;
  title: string;
  date: string; // YYYY-MM-DD
  startTime: string; // HH:mm
  endTime?: string; // HH:mm
  description?: string;
  createdAt: number;
}

export type NavSection = 'today' | 'tasks' | 'notes' | 'calendar';
export type Theme = 'light' | 'dark';
