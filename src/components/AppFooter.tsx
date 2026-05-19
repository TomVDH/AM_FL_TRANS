'use client';

import React, { useState, useEffect, useCallback, useRef } from 'react';
import { toast as toastEmitter, type ToastEvent } from '@/lib/toast';

interface AppFooterProps {
  darkMode: boolean;
  toggleDarkMode: () => void;
  gradientColors: string[];
  showVersionHash: boolean;
  VERSION_HASH: string;
  onVersionBadgeHover?: (hovering: boolean) => void;
  onVersionBadgeClick?: () => void;
  variant?: 'setup' | 'translation';
  renderActions?: () => React.ReactNode;
}

const ICON_COLOR: Record<ToastEvent['type'], string> = {
  success: 'text-emerald-500',
  error: 'text-red-500',
  info: 'text-blue-400 dark:text-blue-300',
  warning: 'text-amber-500',
};

const ICON: Record<ToastEvent['type'], React.ReactNode> = {
  success: (
    <svg className="w-3 h-3 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
    </svg>
  ),
  error: (
    <svg className="w-3 h-3 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" />
    </svg>
  ),
  info: (
    <svg className="w-3 h-3 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  ),
  warning: (
    <svg className="w-3 h-3 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
    </svg>
  ),
};

export default function AppFooter({
  darkMode,
  toggleDarkMode,
  gradientColors,
  showVersionHash,
  VERSION_HASH,
  onVersionBadgeHover,
  onVersionBadgeClick,
  variant = 'setup',
  renderActions,
}: AppFooterProps) {
  const [items, setItems] = useState<ToastEvent[]>([]);
  const timersRef = useRef<Map<string, ReturnType<typeof setTimeout>>>(new Map());
  // Cabinet egg: Kevijntje — hold hover on version badge for 5s to see "PROOST"
  const [proost, setProost] = useState(false);
  const proostTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const handleBadgeEnter = useCallback(() => {
    onVersionBadgeHover?.(true);
    proostTimer.current = setTimeout(() => setProost(true), 5000);
  }, [onVersionBadgeHover]);
  const handleBadgeLeave = useCallback(() => {
    onVersionBadgeHover?.(false);
    if (proostTimer.current) clearTimeout(proostTimer.current);
    proostTimer.current = null;
    setProost(false);
  }, [onVersionBadgeHover]);

  useEffect(() => {
    return toastEmitter.subscribe((event) => {
      setItems((prev) => [...prev.slice(-2), event]); // keep max 3

      if (event.duration > 0) {
        const timer = setTimeout(() => {
          setItems((prev) => prev.filter((t) => t.id !== event.id));
          timersRef.current.delete(event.id);
        }, event.duration);
        timersRef.current.set(event.id, timer);
      }
    });
  }, []);

  const dismiss = useCallback((id: string) => {
    const timer = timersRef.current.get(id);
    if (timer) { clearTimeout(timer); timersRef.current.delete(id); }
    setItems((prev) => prev.filter((t) => t.id !== id));
  }, []);

  return (
    <div className={variant === 'setup' ? 'py-2.5' : 'shrink-0 py-3 px-3 md:px-5 border-t border-[#374151] bg-[#111827]'}>
      {/* Inline notifications */}
      {items.length > 0 && (
        <div className="flex flex-col gap-1 mb-2">
          {items.map((item) => (
            <div
              key={item.id}
              className="flex items-center gap-2 animate-[fadeSlideIn_200ms_ease-out]"
              role="alert"
            >
              <span className={ICON_COLOR[item.type]}>{ICON[item.type]}</span>
              <span className="text-[11px] text-[#9ca3af] truncate">{item.message}</span>
              {item.duration === 0 && (
                <button
                  onClick={() => dismiss(item.id)}
                  className="shrink-0 ml-auto text-[#6b7280] hover:text-[#f9fafb] transition-colors"
                  aria-label="Dismiss"
                >
                  <svg className="w-2.5 h-2.5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                  </svg>
                </button>
              )}
            </div>
          ))}
        </div>
      )}

      <div className="flex items-center justify-between">
        {/* Left: Branding */}
        <div className="flex items-center gap-2.5">
          <img
            src="/images/ass-favico-trans.png"
            alt=""
            className="h-5 w-5 invert transition-transform duration-500 hover:rotate-[360deg]"
          />
          <div className="leading-tight min-w-0 hidden sm:block">
            <p className="text-[11px] font-bold uppercase tracking-[0.05em] text-[#9ca3af] whitespace-nowrap">AM FL V</p>
            <p
              className="text-[10px] text-[#6b7280] select-none whitespace-nowrap"
              title=""
              onDoubleClick={(e) => {
                if (e.detail >= 3) {
                  (e.target as HTMLElement).title = '184 commits / 8 months / 126 donkeys / 1 tool / Aug 2025 — Mar 2026';
                }
              }}
            >
              Onnozelaer Marketing Works &copy; 2026
            </p>
          </div>
        </div>

        {/* Right: Actions */}
        <div className="flex items-center gap-1.5">
          {renderActions && (
            <>
              {renderActions()}
              <div className="w-px h-4 bg-gray-200 dark:bg-gray-700 mx-0.5" />
            </>
          )}

          {variant === 'setup' && (
            <>
              <button
                onClick={() => window.open('https://vimeo.com/880909581/c40dfa73d0', '_blank')}
                className="h-7 px-2.5 flex items-center gap-1.5 bg-[#1f2937] text-[#9ca3af] border border-[#4b5563] hover:bg-[#374151] hover:text-[#f9fafb] hover:border-[#6b7280] transition-colors duration-200 rounded-[3px]"
                title="Watch Video"
                aria-label="Watch Video"
              >
                <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 24 24"><path d="M8 5v14l11-7z"/></svg>
                <span className="text-[10px] font-bold uppercase tracking-[0.05em]">Video</span>
              </button>
              <button
                onClick={() => window.open('https://github.com/TomVDH/AM_FL_TRANS', '_blank')}
                className="h-7 px-2.5 flex items-center gap-1.5 bg-[#1f2937] text-[#9ca3af] border border-[#4b5563] hover:bg-[#374151] hover:text-[#f9fafb] hover:border-[#6b7280] transition-colors duration-200 rounded-[3px]"
                title="View GitHub Repository"
                aria-label="View GitHub Repository"
              >
                <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 24 24"><path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/></svg>
                <span className="text-[10px] font-bold uppercase tracking-[0.05em]">GitHub</span>
              </button>
              <div className="w-px h-4 bg-[#4b5563] mx-0.5" />
            </>
          )}

          <button
            onClick={toggleDarkMode}
            className="h-7 px-2 flex items-center text-[#9ca3af] hover:text-[#f9fafb] transition-colors"
            aria-label="Toggle dark mode"
          >
            {darkMode ? (
              <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464 4.95l.707.707a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414zm2.12-10.607a1 1 0 010 1.414l-.706.707a1 1 0 11-1.414-1.414l.707-.707a1 1 0 011.414 0zM17 11a1 1 0 100-2h-1a1 1 0 100 2h1zm-7 4a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zM5.05 6.464A1 1 0 106.465 5.05l-.708-.707a1 1 0 00-1.414 1.414l.707.707zm1.414 8.486l-.707.707a1 1 0 01-1.414-1.414l.707-.707a1 1 0 011.414 1.414zM4 11a1 1 0 100-2H3a1 1 0 000 2h1z" clipRule="evenodd" />
              </svg>
            ) : (
              <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 20 20">
                <path d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z" />
              </svg>
            )}
          </button>

          {/* Version chip — flat Scene Gray pill (was a decorative gradient pill — Provenance violation).
           * Click still cycles the easter egg label. */}
          <div
            className="relative cursor-pointer flex items-center justify-center bg-[#1f2937] hover:bg-[#374151] border border-[#4b5563] hover:border-[#6b7280]"
            onMouseEnter={handleBadgeEnter}
            onMouseLeave={handleBadgeLeave}
            onClick={() => onVersionBadgeClick?.()}
            title="Version"
            style={{
              width: showVersionHash ? '72px' : '48px',
              height: '20px',
              borderRadius: '3px',
              transition: 'width 0.3s cubic-bezier(0.34, 1.56, 0.64, 1), background-color 0.2s ease, border-color 0.2s ease',
            }}
          >
            <span
              className="text-[#9ca3af] uppercase"
              style={{
                fontFamily: 'ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace',
                fontSize: '9px',
                fontWeight: 700,
                letterSpacing: '0.12em',
                opacity: showVersionHash ? 1 : 0,
                transform: showVersionHash ? 'translateY(0)' : 'translateY(2px)',
                transition: 'all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1)',
              }}
            >
              {proost ? 'PROOST' : VERSION_HASH}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
