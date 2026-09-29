import React from 'react';

interface EmptyStateProps {
  title: string;
  description: string;
  actionLabel?: string;
  onAction?: () => void;
  className?: string;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  title,
  description,
  actionLabel,
  onAction,
  className = '',
}) => {
  return (
    <div className={`flex flex-col items-center justify-center py-16 px-4 text-center ${className}`}>
      <div className="h-1.5 w-1.5 rounded-full bg-zinc-300 dark:bg-zinc-700 mb-3" />
      <h3 className="text-sm font-medium text-zinc-900 dark:text-zinc-100">{title}</h3>
      <p className="mt-1 text-xs text-zinc-400 dark:text-zinc-500 max-w-xs leading-relaxed">
        {description}
      </p>
      {actionLabel && onAction && (
        <button
          type="button"
          onClick={onAction}
          className="mt-4 inline-flex items-center justify-center px-3 py-1.5 rounded-lg border border-zinc-200 dark:border-zinc-800 text-xs font-medium text-zinc-800 dark:text-zinc-200 hover:bg-zinc-100 dark:hover:bg-zinc-800/80 transition-colors shadow-2xs"
        >
          {actionLabel}
        </button>
      )}
    </div>
  );
};
