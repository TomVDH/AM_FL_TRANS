'use client';

import { useState, useCallback, useRef } from 'react';
import { toast } from 'sonner';

const MAX_NOTIFICATIONS = 50;

export interface Notification {
  id: string;
  type: 'success' | 'error' | 'info' | 'warning';
  message: string;
  timestamp: Date;
  undoAction?: () => void;
}

export function useNotificationLog() {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [lastReadTimestamp, setLastReadTimestamp] = useState<Date>(() => new Date());

  const addNotification = useCallback(
    (type: Notification['type'], message: string, undoAction?: () => void) => {
      const id =
        typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function'
          ? crypto.randomUUID()
          : String(Date.now()) + String(Math.random()).slice(2, 8);

      const entry: Notification = {
        id,
        type,
        message,
        timestamp: new Date(),
        undoAction,
      };

      setNotifications((prev) => {
        const next = [entry, ...prev];
        if (next.length > MAX_NOTIFICATIONS) {
          return next.slice(0, MAX_NOTIFICATIONS);
        }
        return next;
      });

      return id;
    },
    [],
  );

  const removeNotification = useCallback((id: string) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id));
  }, []);

  const clearAll = useCallback(() => {
    setNotifications([]);
  }, []);

  const markAllRead = useCallback(() => {
    setLastReadTimestamp(new Date());
  }, []);

  const unreadCount = notifications.filter(
    (n) => n.timestamp > lastReadTimestamp,
  ).length;

  return {
    notifications,
    unreadCount,
    addNotification,
    removeNotification,
    clearAll,
    markAllRead,
  };
}

// ---------------------------------------------------------------------------
// Singleton-style helper so any module can fire a toast AND log it in one call.
// The hook owner must call `registerLogFn` once to wire the two together.
// ---------------------------------------------------------------------------

type LogFn = (
  type: Notification['type'],
  message: string,
  undoAction?: () => void,
) => void;

let _logFn: LogFn | null = null;

/** Call this once from the component that owns useNotificationLog(). */
export function registerLogFn(fn: LogFn) {
  _logFn = fn;
}

/** Unregister on unmount to avoid stale references. */
export function unregisterLogFn() {
  _logFn = null;
}

/**
 * Drop-in replacement for `toast.success(...)` / `toast.error(...)` etc.
 * Fires the sonner toast AND appends to the notification log.
 */
export function notifyAndLog(
  type: Notification['type'],
  message: string,
  undoAction?: () => void,
) {
  // Fire the sonner toast
  switch (type) {
    case 'success':
      toast.success(message);
      break;
    case 'error':
      toast.error(message);
      break;
    case 'warning':
      toast.warning(message);
      break;
    case 'info':
    default:
      toast.info(message);
      break;
  }

  // Append to the in-memory log if the hook is wired up
  if (_logFn) {
    _logFn(type, message, undoAction);
  }
}
