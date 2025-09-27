'use client';

import dynamic from 'next/dynamic';
import { useEffect, useMemo, useRef, useState } from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';

import { trans } from '@/lib/motion';
import { waLink } from '@/lib/wa';

const ChatPanel = dynamic(() => import('./ChatWidgetPanel'), {
  ssr: false,
  loading: () => <ChatWidgetSkeleton />
});

function ChatWidgetSkeleton() {
  return (
    <motion.aside
      aria-hidden
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0, transition: trans(0.18) }}
      exit={{ opacity: 0, y: 16, transition: trans(0.16) }}
      className="fixed bottom-4 right-4 z-50 w-[92%] max-w-sm rounded-2xl border border-wura-black/10 bg-white/95 p-4 shadow-2xl backdrop-blur"
    >
      <div className="mb-4 h-4 w-24 rounded-full bg-wura-black/10" />
      <div className="space-y-3">
        <div className="h-20 rounded-2xl bg-wura-black/5" />
        <div className="h-12 rounded-2xl bg-wura-black/5" />
      </div>
    </motion.aside>
  );
}

export default function ChatWidget() {
  const reduceMotion = useReducedMotion();
  const [open, setOpen] = useState(false);
  const [shouldLoad, setShouldLoad] = useState(false);
  const [visible, setVisible] = useState(false);
  const buttonRef = useRef<HTMLButtonElement | null>(null);

  const whatsappFallback = useMemo(
    () => waLink("Hello House of Wura! I'd love to speak with the concierge."),
    []
  );

  useEffect(() => {
    if (!buttonRef.current || typeof IntersectionObserver === 'undefined') {
      return;
    }
    const node = buttonRef.current;
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries.some((entry) => entry.isIntersecting)) {
          setShouldLoad(true);
          setVisible(true);
          observer.disconnect();
        }
      },
      { rootMargin: '160px' }
    );
    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!shouldLoad) return;
    const connection = (navigator as any)?.connection;
    if (connection && connection.saveData) {
      return;
    }

    let cancelled = false;
    const preload = () => {
      if (cancelled) return;
      (ChatPanel as any).preload?.();
    };

    if (typeof window !== 'undefined' && 'requestIdleCallback' in window) {
      const idleId = (window as any).requestIdleCallback(preload, { timeout: 2500 });
      return () => {
        cancelled = true;
        (window as any).cancelIdleCallback?.(idleId);
      };
    }

    if (typeof window === 'undefined') {
      return () => {
        cancelled = true;
      };
    }

    const timeout = globalThis.setTimeout(preload, 1200);
    return () => {
      cancelled = true;
      globalThis.clearTimeout(timeout);
    };
  }, [shouldLoad]);

  const handleIntent = () => {
    setShouldLoad(true);
    setOpen(true);
  };

  return (
    <div className="pointer-events-none fixed bottom-5 right-5 z-40 flex flex-col items-end gap-3">
      <motion.button
        ref={buttonRef}
        type="button"
        aria-label="Open AI assistant"
        aria-controls="wura-chat-widget"
        aria-expanded={open}
        onClick={handleIntent}
        onMouseEnter={() => setShouldLoad(true)}
        onFocus={() => setShouldLoad(true)}
        className="pointer-events-auto flex items-center gap-2 rounded-full border border-wura-black/10 bg-white px-4 py-2 text-sm font-semibold text-wura-black shadow-[0_18px_36px_rgba(11,11,11,0.16)] backdrop-blur focus:outline-none focus-visible:ring-2 focus-visible:ring-wura-gold"
        whileHover={reduceMotion ? undefined : { y: -4, transition: trans(0.18) }}
        whileTap={reduceMotion ? undefined : { scale: 0.96 }}
      >
        Ask Wura
      </motion.button>

      <AnimatePresence>
        {(open || shouldLoad || visible) && (
          <div className="pointer-events-auto">
            <ChatPanel
              id="wura-chat-widget"
              open={open}
              onOpenChange={setOpen}
              fallbackWhatsApp={whatsappFallback}
              onClose={() => setOpen(false)}
            />
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
