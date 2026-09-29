import React, { useState, useRef } from 'react';
import { Plus } from 'lucide-react';

interface TodoInputProps {
  onAddTodo: (text: string) => void;
}

export const TodoInput: React.FC<TodoInputProps> = ({ onAddTodo }) => {
  const [text, setText] = useState('');
  const [error, setError] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = text.trim();

    if (!trimmed) {
      setError('Please enter a task description');
      inputRef.current?.focus();
      return;
    }

    onAddTodo(trimmed);
    setText('');
    setError(null);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setText(e.target.value);
    if (error) setError(null);
  };

  return (
    <form onSubmit={handleSubmit} className="mb-6">
      <div className="flex flex-col sm:flex-row gap-2">
        <div className="relative flex-1">
          <input
            ref={inputRef}
            type="text"
            value={text}
            onChange={handleChange}
            placeholder="What needs to be done?"
            aria-label="What needs to be done?"
            className={`w-full rounded-lg border bg-white px-4 py-2.5 text-sm text-zinc-900 placeholder-zinc-400 transition-colors focus:outline-none focus:ring-2 focus:ring-zinc-900/10 focus:border-zinc-900 ${
              error ? 'border-red-400 focus:border-red-500 focus:ring-red-100' : 'border-zinc-200'
            }`}
          />
          {error && (
            <p className="absolute -bottom-5 left-1 text-xs text-red-600 font-medium">
              {error}
            </p>
          )}
        </div>
        <button
          type="submit"
          className="inline-flex items-center justify-center gap-1.5 rounded-lg bg-zinc-900 px-4 py-2.5 text-sm font-medium text-white transition-colors hover:bg-zinc-800 active:bg-zinc-950 focus:outline-none focus:ring-2 focus:ring-zinc-900/20 shadow-sm"
        >
          <Plus className="h-4 w-4" />
          <span>Add task</span>
        </button>
      </div>
    </form>
  );
};
