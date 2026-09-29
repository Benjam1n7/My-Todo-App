import React from 'react';
import { CheckCircle2 } from 'lucide-react';

interface HeaderProps {
  totalCount: number;
  completedCount: number;
}

export const Header: React.FC<HeaderProps> = ({ totalCount, completedCount }) => {
  const percent = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;

  return (
    <header className="mb-8">
      <div className="flex items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-zinc-900 text-white shadow-sm">
              <CheckCircle2 className="h-5 w-5 stroke-[2.2]" />
            </div>
            <h1 className="text-2xl font-bold tracking-tight text-zinc-900 sm:text-3xl">
              Todo List
            </h1>
          </div>
          <p className="mt-1 text-sm text-zinc-500">
            Keep track of your daily tasks and stay organized.
          </p>
        </div>

        {totalCount > 0 && (
          <div className="hidden sm:flex flex-col items-end">
            <span className="text-xs font-medium text-zinc-500">
              {completedCount} of {totalCount} completed
            </span>
            <div className="mt-1.5 h-1.5 w-28 overflow-hidden rounded-full bg-zinc-100">
              <div
                className="h-full rounded-full bg-zinc-900 transition-all duration-300 ease-out"
                style={{ width: `${percent}%` }}
              />
            </div>
          </div>
        )}
      </div>
    </header>
  );
};
