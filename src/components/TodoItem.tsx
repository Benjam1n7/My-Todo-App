import React, { useState, useRef, useEffect } from 'react';
import { Check, Pencil, Trash2, X, CheckSquare, Square } from 'lucide-react';
import { Todo } from '../types.ts';

interface TodoItemProps {
  todo: Todo;
  onToggle: (id: string) => void;
  onEdit: (id: string, newText: string) => void;
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
  const [editError, setEditError] = useState(false);
  const editInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isEditing) {
      setEditText(todo.text);
      editInputRef.current?.focus();
      editInputRef.current?.select();
    }
  }, [isEditing, todo.text]);

  const handleSave = () => {
    const trimmed = editText.trim();
    if (!trimmed) {
      setEditError(true);
      return;
    }
    onEdit(todo.id, trimmed);
    setIsEditing(false);
    setEditError(false);
  };

  const handleCancel = () => {
    setEditText(todo.text);
    setIsEditing(false);
    setEditError(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleSave();
    } else if (e.key === 'Escape') {
      e.preventDefault();
      handleCancel();
    }
  };

  return (
    <li
      className={`group relative flex items-center justify-between gap-3 rounded-lg border bg-white px-3.5 py-3 transition-colors ${
        todo.completed
          ? 'border-zinc-100 bg-zinc-50/50'
          : 'border-zinc-200/80 hover:border-zinc-300'
      }`}
    >
      {isEditing ? (
        <div className="flex w-full items-center gap-2">
          <input
            ref={editInputRef}
            type="text"
            value={editText}
            onChange={(e) => {
              setEditText(e.target.value);
              if (editError) setEditError(false);
            }}
            onKeyDown={handleKeyDown}
            className={`w-full rounded-md border bg-white px-3 py-1.5 text-sm text-zinc-900 focus:outline-none focus:ring-2 focus:ring-zinc-900/10 focus:border-zinc-900 ${
              editError ? 'border-red-400' : 'border-zinc-300'
            }`}
          />
          <div className="flex items-center gap-1 shrink-0">
            <button
              onClick={handleSave}
              title="Save changes (Enter)"
              aria-label="Save changes"
              className="inline-flex h-8 w-8 items-center justify-center rounded-md bg-zinc-900 text-white transition-colors hover:bg-zinc-800"
            >
              <Check className="h-4 w-4" />
            </button>
            <button
              onClick={handleCancel}
              title="Cancel editing (Esc)"
              aria-label="Cancel editing"
              className="inline-flex h-8 w-8 items-center justify-center rounded-md border border-zinc-200 text-zinc-600 transition-colors hover:bg-zinc-100"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        </div>
      ) : (
        <>
          <div className="flex flex-1 items-center gap-3 overflow-hidden">
            <button
              onClick={() => onToggle(todo.id)}
              aria-label={todo.completed ? 'Mark as incomplete' : 'Mark as complete'}
              className="flex h-5 w-5 shrink-0 items-center justify-center rounded border transition-colors focus:outline-none focus:ring-2 focus:ring-zinc-900/20 focus:ring-offset-1 text-zinc-900"
              style={{
                borderColor: todo.completed ? '#18181b' : '#d4d4d8',
                backgroundColor: todo.completed ? '#18181b' : 'transparent',
              }}
            >
              {todo.completed && <Check className="h-3.5 w-3.5 text-white stroke-[2.5]" />}
            </button>
            <span
              onClick={() => onToggle(todo.id)}
              className={`cursor-pointer select-none truncate text-sm transition-colors ${
                todo.completed
                  ? 'text-zinc-400 line-through'
                  : 'text-zinc-800 font-normal'
              }`}
            >
              {todo.text}
            </span>
          </div>

          <div className="flex items-center gap-1 opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity">
            <button
              onClick={() => setIsEditing(true)}
              aria-label="Edit task"
              title="Edit task"
              className="inline-flex h-8 w-8 items-center justify-center rounded-md text-zinc-400 transition-colors hover:bg-zinc-100 hover:text-zinc-700 focus:opacity-100 focus:outline-none focus:ring-2 focus:ring-zinc-900/10"
            >
              <Pencil className="h-3.5 w-3.5" />
            </button>
            <button
              onClick={() => onDelete(todo.id)}
              aria-label="Delete task"
              title="Delete task"
              className="inline-flex h-8 w-8 items-center justify-center rounded-md text-zinc-400 transition-colors hover:bg-red-50 hover:text-red-600 focus:opacity-100 focus:outline-none focus:ring-2 focus:ring-red-500/20"
            >
              <Trash2 className="h-3.5 w-3.5" />
            </button>
          </div>
        </>
      )}
    </li>
  );
};
