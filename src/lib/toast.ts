export type ToastType = 'success' | 'error' | 'info' | 'warning';

export interface ToastEvent {
  id: string;
  type: ToastType;
  message: string;
  duration: number; // ms, 0 = manual dismiss
}

type Listener = (event: ToastEvent) => void;

const listeners = new Set<Listener>();

function subscribe(fn: Listener) {
  listeners.add(fn);
  return () => { listeners.delete(fn); };
}

function emit(type: ToastType, message: string, duration?: number) {
  const id =
    typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function'
      ? crypto.randomUUID()
      : String(Date.now()) + String(Math.random()).slice(2, 8);

  // Errors require manual dismiss (duration=0), everything else auto-dismisses
  const resolvedDuration = duration ?? (type === 'error' ? 0 : 4000);

  const event: ToastEvent = { id, type, message, duration: resolvedDuration };
  listeners.forEach((fn) => fn(event));
  return id;
}

export const toast = {
  success: (message: string, duration?: number) => emit('success', message, duration),
  error: (message: string, duration?: number) => emit('error', message, duration ?? 0),
  info: (message: string, duration?: number) => emit('info', message, duration),
  warning: (message: string, duration?: number) => emit('warning', message, duration),
  subscribe,
};
