import React, { useState, useMemo } from 'react';
import { Plus, Search, Trash2, Calendar, ArrowLeft, Clock } from 'lucide-react';
import { Note } from '../types.ts';
import { formatShortDate } from '../utils/dateUtils.ts';
import { EmptyState } from './EmptyState.tsx';

interface NotesViewProps {
  notes: Note[];
  onAddNote: (title: string, body: string, date?: string) => string;
  onUpdateNote: (id: string, updates: Partial<Note>) => void;
  onDeleteNote: (id: string) => void;
}

export const NotesView: React.FC<NotesViewProps> = ({
  notes,
  onAddNote,
  onUpdateNote,
  onDeleteNote,
}) => {
  const [selectedNoteId, setSelectedNoteId] = useState<string | null>(() => {
    return notes.length > 0 ? notes[0].id : null;
  });
  const [searchQuery, setSearchQuery] = useState('');
  const [mobileDetailOpen, setMobileDetailOpen] = useState(false);

  const filteredNotes = useMemo(() => {
    if (!searchQuery.trim()) return notes;
    const q = searchQuery.toLowerCase();
    return notes.filter(
      (n) => n.title.toLowerCase().includes(q) || n.body.toLowerCase().includes(q)
    );
  }, [notes, searchQuery]);

  const selectedNote = useMemo(() => {
    return notes.find((n) => n.id === selectedNoteId) || null;
  }, [notes, selectedNoteId]);

  const handleCreateNew = () => {
    const newId = onAddNote('Untitled Note', '', undefined);
    setSelectedNoteId(newId);
    setMobileDetailOpen(true);
  };

  const handleDelete = (id: string) => {
    onDeleteNote(id);
    if (selectedNoteId === id) {
      const remaining = notes.filter((n) => n.id !== id);
      setSelectedNoteId(remaining.length > 0 ? remaining[0].id : null);
      setMobileDetailOpen(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto h-[calc(100vh-8rem)] min-h-[500px] flex flex-col">
      {/* Top Header */}
      <div className="flex items-center justify-between pb-4 border-b border-zinc-200/80 dark:border-zinc-800">
        <div>
          <span className="text-xs font-semibold uppercase tracking-[0.2em] text-zinc-400 dark:text-zinc-500">
            Notes
          </span>
          <h1 className="text-2xl font-semibold tracking-tight text-zinc-900 dark:text-zinc-50">
            Scratchpad & Ideas
          </h1>
        </div>

        <button
          type="button"
          onClick={handleCreateNew}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900 text-xs font-medium hover:bg-zinc-800 dark:hover:bg-white shadow-2xs transition-colors"
        >
          <Plus className="h-3.5 w-3.5" />
          <span>New note</span>
        </button>
      </div>

      {/* When there are no notes at all */}
      {notes.length === 0 ? (
        <div className="flex-1 flex items-center justify-center">
          <EmptyState
            title="Nothing written yet."
            description="Capture an idea, thought, or reminder."
            actionLabel="New note"
            onAction={handleCreateNew}
          />
        </div>
      ) : (
        /* Main Split Layout */
        <div className="flex-1 flex overflow-hidden pt-4 gap-4">
          {/* Left Side: Search & Note List */}
          <div
            className={`w-full md:w-72 shrink-0 flex flex-col border-r border-zinc-200/70 dark:border-zinc-800/80 pr-4 overflow-y-auto ${
              mobileDetailOpen ? 'hidden md:flex' : 'flex'
            }`}
          >
            {/* Note Search */}
            <div className="relative mb-3">
              <Search className="absolute left-2.5 top-2.5 h-3.5 w-3.5 text-zinc-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search notes..."
                aria-label="Search notes"
                className="w-full rounded-lg border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 py-1.5 pl-8 pr-3 text-xs text-zinc-900 dark:text-zinc-100 placeholder:text-zinc-400 focus:outline-none focus:ring-1 focus:ring-zinc-900 dark:focus:ring-zinc-100"
              />
            </div>

            {/* Note List */}
            <div className="flex-1 space-y-1 overflow-y-auto">
              {filteredNotes.length > 0 ? (
                filteredNotes.map((note) => {
                  const isSelected = selectedNote?.id === note.id;
                  return (
                    <button
                      key={note.id}
                      type="button"
                      onClick={() => {
                        setSelectedNoteId(note.id);
                        setMobileDetailOpen(true);
                      }}
                      className={`w-full text-left p-3 rounded-lg transition-colors border ${
                        isSelected
                          ? 'border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-800/90 shadow-2xs'
                          : 'border-transparent hover:bg-zinc-100/70 dark:hover:bg-zinc-900/60'
                      }`}
                    >
                      <h3 className="text-sm font-medium text-zinc-900 dark:text-zinc-100 truncate">
                        {note.title || 'Untitled'}
                      </h3>
                      <p className="mt-1 text-xs text-zinc-500 dark:text-zinc-400 line-clamp-2 leading-relaxed">
                        {note.body ? note.body.replace(/\n/g, ' ') : 'No additional text'}
                      </p>
                      <div className="mt-2 flex items-center justify-between text-[10px] text-zinc-400">
                        <span>{new Date(note.updatedAt).toLocaleDateString()}</span>
                        {note.date && (
                          <span className="flex items-center gap-1">
                            <Calendar className="h-2.5 w-2.5" />
                            <span>{formatShortDate(note.date)}</span>
                          </span>
                        )}
                      </div>
                    </button>
                  );
                })
              ) : (
                <div className="py-8 text-center text-xs text-zinc-400">
                  No notes match your search.
                </div>
              )}
            </div>
          </div>

          {/* Right Side: Selected Note Editor */}
          <div
            className={`flex-1 flex flex-col bg-white dark:bg-zinc-900/40 rounded-xl border border-zinc-200/80 dark:border-zinc-800 p-4 overflow-y-auto ${
              mobileDetailOpen ? 'flex' : 'hidden md:flex'
            }`}
          >
            {selectedNote ? (
              <div className="flex-1 flex flex-col">
                {/* Note Header / Meta */}
                <div className="flex items-center justify-between pb-3 border-b border-zinc-100 dark:border-zinc-800">
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => setMobileDetailOpen(false)}
                      className="md:hidden p-1 rounded-md text-zinc-500 hover:bg-zinc-100 dark:hover:bg-zinc-800"
                      aria-label="Back to notes list"
                    >
                      <ArrowLeft className="h-4 w-4" />
                    </button>
                    <span className="text-[11px] text-zinc-400 flex items-center gap-1">
                      <Clock className="h-3 w-3" />
                      <span>
                        Updated {new Date(selectedNote.updatedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    {/* Optional Associated Date */}
                    <div className="flex items-center gap-1 text-xs text-zinc-500">
                      <Calendar className="h-3.5 w-3.5 text-zinc-400" />
                      <input
                        type="date"
                        value={selectedNote.date || ''}
                        onChange={(e) =>
                          onUpdateNote(selectedNote.id, {
                            date: e.target.value || undefined,
                            updatedAt: Date.now(),
                          })
                        }
                        title="Associate note with a date"
                        aria-label="Associate note with date"
                        className="rounded border border-zinc-200 dark:border-zinc-700 bg-transparent px-1.5 py-0.5 text-xs text-zinc-700 dark:text-zinc-300 focus:outline-none"
                      />
                    </div>

                    <button
                      type="button"
                      onClick={() => handleDelete(selectedNote.id)}
                      aria-label="Delete note"
                      title="Delete note"
                      className="p-1.5 text-zinc-400 hover:text-rose-600 dark:hover:text-rose-400 rounded-md hover:bg-rose-50 dark:hover:bg-rose-950/30 transition-colors"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>

                {/* Title Input */}
                <input
                  type="text"
                  value={selectedNote.title}
                  onChange={(e) =>
                    onUpdateNote(selectedNote.id, {
                      title: e.target.value,
                      updatedAt: Date.now(),
                    })
                  }
                  placeholder="Note Title"
                  aria-label="Note Title"
                  className="w-full mt-3 text-lg font-semibold text-zinc-900 dark:text-zinc-100 placeholder:text-zinc-400 bg-transparent focus:outline-none"
                />

                {/* Body Textarea */}
                <textarea
                  value={selectedNote.body}
                  onChange={(e) =>
                    onUpdateNote(selectedNote.id, {
                      body: e.target.value,
                      updatedAt: Date.now(),
                    })
                  }
                  placeholder="Write your thoughts..."
                  aria-label="Note Content"
                  className="w-full flex-1 mt-3 resize-none bg-transparent text-sm leading-relaxed text-zinc-700 dark:text-zinc-300 placeholder:text-zinc-400 focus:outline-none"
                />
              </div>
            ) : (
              <div className="flex-1 flex items-center justify-center">
                <EmptyState
                  title="Nothing written yet."
                  description="Capture an idea, thought, or reminder."
                  actionLabel="New note"
                  onAction={handleCreateNew}
                />
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
