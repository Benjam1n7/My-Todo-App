import React from 'react';
import {
  Sun,
  Moon,
  Search,
  Plus,
  Compass,
  CheckSquare,
  FileText,
  Calendar as CalendarIcon,
} from 'lucide-react';
import { NavSection, Theme } from '../types.ts';

interface NavigationProps {
  currentSection: NavSection;
  onSelectSection: (section: NavSection) => void;
  theme: Theme;
  onToggleTheme: () => void;
  onOpenQuickCapture: () => void;
  onOpenSearch: () => void;
  todayTasksCount: number;
}

export const Navigation: React.FC<NavigationProps> = ({
  currentSection,
  onSelectSection,
  theme,
  onToggleTheme,
  onOpenQuickCapture,
  onOpenSearch,
  todayTasksCount,
}) => {
  const navItems: { id: NavSection; label: string; icon: React.ReactNode; badge?: number }[] = [
    {
      id: 'today',
      label: 'Today',
      icon: <Compass className="h-4 w-4" />,
      badge: todayTasksCount > 0 ? todayTasksCount : undefined,
    },
    {
      id: 'tasks',
      label: 'Tasks',
      icon: <CheckSquare className="h-4 w-4" />,
    },
    {
      id: 'notes',
      label: 'Notes',
      icon: <FileText className="h-4 w-4" />,
    },
    {
      id: 'calendar',
      label: 'Calendar',
      icon: <CalendarIcon className="h-4 w-4" />,
    },
  ];

  return (
    <>
      {/* Desktop Sidebar Rail */}
      <aside className="hidden md:flex flex-col justify-between w-56 shrink-0 border-r border-zinc-200/80 dark:border-zinc-800/80 bg-white/70 dark:bg-zinc-950/70 p-4 backdrop-blur-md sticky top-0 h-screen select-none">
        <div>
          {/* Top Brand */}
          <div className="mb-6 px-2 flex items-center justify-between">
            <span className="text-xs font-semibold tracking-[0.2em] uppercase text-zinc-400 dark:text-zinc-500">
              Workspace
            </span>
          </div>

          {/* Quick Actions: Quick Capture & Search */}
          <div className="flex flex-col gap-1.5 mb-6">
            <button
              type="button"
              onClick={onOpenQuickCapture}
              className="flex items-center justify-between w-full px-2.5 py-1.5 rounded-lg bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900 text-xs font-medium hover:bg-zinc-800 dark:hover:bg-white shadow-2xs transition-colors"
            >
              <span className="flex items-center gap-1.5">
                <Plus className="h-3.5 w-3.5" />
                <span>Quick capture</span>
              </span>
              <kbd className="text-[10px] opacity-70 font-mono">Q</kbd>
            </button>

            <button
              type="button"
              onClick={onOpenSearch}
              className="flex items-center justify-between w-full px-2.5 py-1.5 rounded-lg border border-zinc-200 dark:border-zinc-800 text-zinc-600 dark:text-zinc-400 text-xs hover:bg-zinc-50 dark:hover:bg-zinc-900 transition-colors"
            >
              <span className="flex items-center gap-1.5">
                <Search className="h-3.5 w-3.5 text-zinc-400" />
                <span>Search</span>
              </span>
              <kbd className="text-[10px] text-zinc-400 font-mono">/</kbd>
            </button>
          </div>

          {/* Primary Nav List */}
          <nav className="flex flex-col gap-1" aria-label="Main Navigation">
            {navItems.map((item) => {
              const isActive = currentSection === item.id;
              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => onSelectSection(item.id)}
                  className={`flex items-center justify-between px-2.5 py-2 rounded-lg text-xs font-medium transition-colors ${
                    isActive
                      ? 'bg-zinc-100 dark:bg-zinc-900 text-zinc-950 dark:text-zinc-50 font-semibold'
                      : 'text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-200 hover:bg-zinc-50 dark:hover:bg-zinc-900/50'
                  }`}
                >
                  <span className="flex items-center gap-2">
                    <span className={isActive ? 'text-zinc-900 dark:text-zinc-100' : 'text-zinc-400'}>
                      {item.icon}
                    </span>
                    <span>{item.label}</span>
                  </span>

                  {item.badge !== undefined && (
                    <span className="px-1.5 py-0.2 rounded-full text-[10px] font-medium bg-zinc-200 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300">
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Bottom Theme & Shortcuts */}
        <div className="pt-4 border-t border-zinc-100 dark:border-zinc-800/80 flex items-center justify-between px-1">
          <button
            type="button"
            onClick={onToggleTheme}
            aria-label="Toggle theme"
            className="flex items-center gap-2 text-xs text-zinc-500 hover:text-zinc-800 dark:hover:text-zinc-200 transition-colors"
          >
            {theme === 'dark' ? (
              <>
                <Sun className="h-3.5 w-3.5 text-amber-400" />
                <span>Light mode</span>
              </>
            ) : (
              <>
                <Moon className="h-3.5 w-3.5 text-zinc-500" />
                <span>Dark mode</span>
              </>
            )}
          </button>
        </div>
      </aside>

      {/* Mobile Top Header */}
      <header className="md:hidden flex items-center justify-between px-4 py-3 border-b border-zinc-200/80 dark:border-zinc-800/80 bg-white/90 dark:bg-zinc-950/90 backdrop-blur-md sticky top-0 z-30 select-none">
        <div className="flex items-center gap-2">
          <span className="text-xs font-bold tracking-[0.2em] uppercase text-zinc-900 dark:text-zinc-100">
            {currentSection}
          </span>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={onOpenSearch}
            aria-label="Open search"
            className="p-1.5 rounded-lg text-zinc-500 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800"
          >
            <Search className="h-4 w-4" />
          </button>

          <button
            type="button"
            onClick={onOpenQuickCapture}
            aria-label="Quick capture"
            className="p-1.5 rounded-lg bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900 shadow-2xs"
          >
            <Plus className="h-4 w-4" />
          </button>

          <button
            type="button"
            onClick={onToggleTheme}
            aria-label="Toggle theme"
            className="p-1.5 rounded-lg text-zinc-500 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800"
          >
            {theme === 'dark' ? (
              <Sun className="h-4 w-4 text-amber-400" />
            ) : (
              <Moon className="h-4 w-4" />
            )}
          </button>
        </div>
      </header>

      {/* Mobile Bottom Navigation Bar */}
      <nav
        className="md:hidden fixed bottom-0 left-0 right-0 z-30 border-t border-zinc-200/80 dark:border-zinc-800/80 bg-white/95 dark:bg-zinc-950/95 backdrop-blur-md px-2 py-1.5 flex items-center justify-around select-none"
        aria-label="Mobile Navigation"
      >
        {navItems.map((item) => {
          const isActive = currentSection === item.id;
          return (
            <button
              key={item.id}
              type="button"
              onClick={() => onSelectSection(item.id)}
              className={`flex flex-col items-center gap-1 py-1 px-3 rounded-lg text-[10px] font-medium transition-colors ${
                isActive
                  ? 'text-zinc-950 dark:text-zinc-100 font-semibold'
                  : 'text-zinc-400 dark:text-zinc-500 hover:text-zinc-700'
              }`}
            >
              <span className="relative">
                {item.icon}
                {item.badge !== undefined && (
                  <span className="absolute -top-1 -right-2 h-2 w-2 rounded-full bg-zinc-900 dark:bg-zinc-100" />
                )}
              </span>
              <span>{item.label}</span>
            </button>
          );
        })}
      </nav>
    </>
  );
};
