import React, { useState, useEffect } from 'react';
import { Todo, FilterType } from './types.ts';
import { Header } from './components/Header.tsx';
import { TodoInput } from './components/TodoInput.tsx';
import { TodoItem } from './components/TodoItem.tsx';
import { TodoFilters } from './components/TodoFilters.tsx';
import { EmptyState } from './components/EmptyState.tsx';

const STORAGE_KEY = 'minimal_todo_app_tasks';

const INITIAL_TODOS: Todo[] = [
  {
    id: 'init-1',
    text: 'Welcome to your new Todo List',
    completed: true,
    createdAt: Date.now() - 3600000,
  },
  {
    id: 'init-2',
    text: 'Click the checkbox to complete a task',
    completed: false,
    createdAt: Date.now() - 1800000,
  },
  {
    id: 'init-3',
    text: 'Hover and click the pencil icon to edit',
    completed: false,
    createdAt: Date.now(),
  },
];

export default function App() {
  const [todos, setTodos] = useState<Todo[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved !== null) {
        return JSON.parse(saved);
      }
      return INITIAL_TODOS;
    } catch {
      return INITIAL_TODOS;
    }
  });

  const [filter, setFilter] = useState<FilterType>('all');

  // Synchronize todos to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(todos));
    } catch (e) {
      console.error('Failed to save todos to localStorage', e);
    }
  }, [todos]);

  const handleAddTodo = (text: string) => {
    const trimmed = text.trim();
    if (!trimmed) return;

    const newTodo: Todo = {
      id: crypto.randomUUID ? crypto.randomUUID() : `todo-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`,
      text: trimmed,
      completed: false,
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

  const handleEditTodo = (id: string, newText: string) => {
    const trimmed = newText.trim();
    if (!trimmed) return;

    setTodos((prev) =>
      prev.map((todo) =>
        todo.id === id ? { ...todo, text: trimmed } : todo
      )
    );
  };

  const handleDeleteTodo = (id: string) => {
    setTodos((prev) => prev.filter((todo) => todo.id !== id));
  };

  const handleClearCompleted = () => {
    setTodos((prev) => prev.filter((todo) => !todo.completed));
  };

  const activeCount = todos.filter((t) => !t.completed).length;
  const completedCount = todos.filter((t) => t.completed).length;
  const totalCount = todos.length;

  const filteredTodos = todos.filter((todo) => {
    if (filter === 'active') return !todo.completed;
    if (filter === 'completed') return todo.completed;
    return true;
  });

  return (
    <div className="min-h-screen bg-zinc-50 px-4 py-8 sm:py-16 text-zinc-900 selection:bg-zinc-900 selection:text-white flex flex-col justify-between">
      <div className="mx-auto w-full max-w-lg">
        {/* Main Card */}
        <div className="rounded-2xl border border-zinc-200/80 bg-white p-5 sm:p-7 shadow-xs">
          <Header totalCount={totalCount} completedCount={completedCount} />

          <TodoInput onAddTodo={handleAddTodo} />

          {/* Todo List Items */}
          <main>
            {filteredTodos.length > 0 ? (
              <ul className="space-y-2" aria-label="Tasks list">
                {filteredTodos.map((todo) => (
                  <TodoItem
                    key={todo.id}
                    todo={todo}
                    onToggle={handleToggleTodo}
                    onEdit={handleEditTodo}
                    onDelete={handleDeleteTodo}
                  />
                ))}
              </ul>
            ) : (
              <EmptyState filter={filter} hasAnyTodos={totalCount > 0} />
            )}
          </main>

          {/* Bottom Filter & Actions */}
          {totalCount > 0 && (
            <TodoFilters
              currentFilter={filter}
              onFilterChange={setFilter}
              activeCount={activeCount}
              completedCount={completedCount}
              totalCount={totalCount}
              onClearCompleted={handleClearCompleted}
            />
          )}
        </div>

        {/* Keyboard hints */}
        <div className="mt-4 text-center">
          <p className="text-xs text-zinc-400">
            Press <kbd className="rounded border border-zinc-200 bg-white px-1.5 py-0.5 text-[10px] text-zinc-600 shadow-2xs">Enter</kbd> to add or save · <kbd className="rounded border border-zinc-200 bg-white px-1.5 py-0.5 text-[10px] text-zinc-600 shadow-2xs">Esc</kbd> to cancel edit
          </p>
        </div>
      </div>

      {/* Footer */}
      <footer className="mt-12 text-center text-xs text-zinc-400">
        <p>Simple & minimal task management</p>
      </footer>
    </div>
  );
}
