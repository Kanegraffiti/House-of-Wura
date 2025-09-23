'use client';

import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';

import { motionDur, trans } from '@/lib/motion';

interface ToastContextValue {
  push: (message: string) => void;
}

interface ToastItem {
  id: string;
  message: string;
}

const ToastContext = createContext<ToastContextValue | null>(null);

const makeId = () =>
  typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function'
    ? crypto.randomUUID()
    : `${Date.now()}-${Math.random().toString(16).slice(2)}`;

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<ToastItem[]>([]);
  const timers = useRef(new Map<string, number>());

  const remove = useCallback((id: string) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id));
    const timeout = timers.current.get(id);
    if (timeout) {
      window.clearTimeout(timeout);
      timers.current.delete(id);
    }
  }, []);

  const push = useCallback(
    (message: string) => {
      const id = makeId();
      setToasts((prev) => [...prev, { id, message }]);
      const timeout = window.setTimeout(() => remove(id), 2600);
      timers.current.set(id, timeout);
    },
    [remove]
  );

  useEffect(() => {
    return () => {
      timers.current.forEach((timeout) => window.clearTimeout(timeout));
      timers.current.clear();
    };
  }, []);

  const value = useMemo(() => ({ push }), [push]);

  return (
    <ToastContext.Provider value={value}>
      {children}
      <div className="pointer-events-none fixed bottom-6 right-6 z-[90] flex flex-col gap-3 sm:bottom-8 sm:right-8">
        <AnimatePresence>
          {toasts.map((toast) => (
            <motion.div
              key={toast.id}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0, transition: trans(motionDur.sm) }}
              exit={{ opacity: 0, y: 12, transition: { duration: motionDur.xs } }}
              className="pointer-events-auto w-[260px] rounded-2xl bg-wura-black/95 text-white shadow-[0_18px_40px_rgba(11,11,11,0.25)]"
              role="status"
              aria-live="polite"
              onClick={() => remove(toast.id)}
            >
              <p className="px-4 py-3 text-sm">{toast.message}</p>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </ToastContext.Provider>
  );
}

export function useToast() {
  const ctx = useContext(ToastContext);
  if (!ctx) {
    throw new Error('useToast must be used within ToastProvider');
  }
  return ctx;
}
