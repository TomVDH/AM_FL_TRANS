'use client';

import React, { useState, useRef, useEffect, useCallback } from 'react';
import type { Notification } from '@/hooks/useNotificationLog';

export interface NotificationCenterProps {
  notifications: Notification[];
  unreadCount: number;
  onMarkAllRead: () => void;
  onClearAll: () => void;
  onRemove: (id: string) => void;
}

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function relativeTime(date: Date): string {
  const seconds = Math.floor((Date.now() - date.getTime()) / 1000);
  if (seconds < 60) return 'just now';
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  return `${days}d ago`;
}

const DOT_COLORS: Record<Notification['type'], string> = {
  success: 'bg-green-500',
  error: 'bg-red-500',
  info: 'bg-blue-500',
  warning: 'bg-amber-500',
};

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

export default function NotificationCenter({
  notifications,
  unreadCount,
  onMarkAllRead,
  onClearAll,
  onRemove,
}: NotificationCenterProps) {
  const [open, setOpen] = useState(false);
  const panelRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);

  // Mark all read whenever the panel is opened
  const toggle = useCallback(() => {
    setOpen((prev) => {
      const next = !prev;
      if (next) onMarkAllRead();
      return next;
    });
  }, [onMarkAllRead]);

  // Close on Escape
  useEffect(() => {
    if (!open) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(false);
    };
    document.addEventListener('keydown', handler);
    return () => document.removeEventListener('keydown', handler);
  }, [open]);

  // Close on click outside
  useEffect(() => {
    if (!open) return;
    const handler = (e: MouseEvent) => {
      if (
        panelRef.current &&
        !panelRef.current.contains(e.target as Node) &&
        buttonRef.current &&
        !buttonRef.current.contains(e.target as Node)
      ) {
        setOpen(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, [open]);

  return (
    <div className="relative">
      {/* Bell button */}
      <button
        ref={buttonRef}
        onClick={toggle}
        aria-label="Notifications"
        className="relative p-1.5 text-gray-600 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white transition-colors"
        style={{ borderRadius: '3px' }}
      >
        {/* Bell SVG */}
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-4 w-4"
          viewBox="0 0 20 20"
          fill="currentColor"
          aria-hidden="true"
        >
          <path d="M10 2a6 6 0 00-6 6v3.586l-.707.707A1 1 0 004 14h12a1 1 0 00.707-1.707L16 11.586V8a6 6 0 00-6-6zM10 18a3 3 0 01-3-3h6a3 3 0 01-3 3z" />
        </svg>

        {/* Unread badge */}
        {unreadCount > 0 && (
          <span
            className="absolute -top-0.5 -right-0.5 flex items-center justify-center min-w-[16px] h-4 px-1 text-[10px] font-bold leading-none text-white bg-red-500"
            style={{ borderRadius: '3px' }}
          >
            {unreadCount > 99 ? '99+' : unreadCount}
          </span>
        )}
      </button>

      {/* Slide-out panel */}
      {open && (
        <div
          ref={panelRef}
          className="absolute right-0 bottom-full mb-2 w-80 max-w-sm max-h-96 overflow-y-auto bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 shadow-lg z-50"
          style={{ borderRadius: '3px' }}
          role="dialog"
          aria-label="Notification center"
        >
          {/* Header */}
          <div className="sticky top-0 flex items-center justify-between px-3 py-2 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
            <span className="text-sm font-semibold text-gray-800 dark:text-gray-100">
              Notifications
            </span>
            <button
              onClick={onClearAll}
              className="text-xs text-gray-500 hover:text-gray-800 dark:text-gray-400 dark:hover:text-gray-100 transition-colors"
              style={{ borderRadius: '3px' }}
            >
              Clear all
            </button>
          </div>

          {/* List */}
          {notifications.length === 0 ? (
            <div className="px-3 py-6 text-center text-sm text-gray-400 dark:text-gray-500">
              No notifications yet
            </div>
          ) : (
            <ul className="divide-y divide-gray-100 dark:divide-gray-700">
              {notifications.map((n) => (
                <li
                  key={n.id}
                  className="flex items-start gap-2 px-3 py-2 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors"
                >
                  {/* Colored dot */}
                  <span
                    className={`mt-1.5 flex-shrink-0 h-2 w-2 ${DOT_COLORS[n.type]}`}
                    style={{ borderRadius: '3px' }}
                  />

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-gray-800 dark:text-gray-100 break-words">
                      {n.message}
                    </p>
                    <div className="flex items-center gap-2 mt-0.5">
                      <span className="text-xs text-gray-400 dark:text-gray-500">
                        {relativeTime(n.timestamp)}
                      </span>
                      {n.undoAction && (
                        <button
                          onClick={() => {
                            n.undoAction!();
                            onRemove(n.id);
                          }}
                          className="text-xs font-medium text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 transition-colors"
                          style={{ borderRadius: '3px' }}
                        >
                          Undo
                        </button>
                      )}
                    </div>
                  </div>

                  {/* Dismiss */}
                  <button
                    onClick={() => onRemove(n.id)}
                    aria-label={`Dismiss notification: ${n.message}`}
                    className="flex-shrink-0 mt-0.5 p-0.5 text-gray-300 hover:text-gray-500 dark:text-gray-600 dark:hover:text-gray-400 transition-colors"
                    style={{ borderRadius: '3px' }}
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-3.5 w-3.5"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                      aria-hidden="true"
                    >
                      <path
                        fillRule="evenodd"
                        d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
    </div>
  );
}
