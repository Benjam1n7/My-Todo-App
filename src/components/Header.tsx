import React from 'react';

export const Header: React.FC = () => {
  return (
    <header className="mb-7">
      <div className="flex flex-col">
        <h1 className="text-xs font-semibold tracking-[0.2em] uppercase text-zinc-400 select-none">
          Todo
        </h1>
        <p className="mt-1 text-2xl sm:text-3xl font-semibold tracking-tight text-zinc-900">
          Clear your mind. Get things done.
        </p>
      </div>
    </header>
  );
};
