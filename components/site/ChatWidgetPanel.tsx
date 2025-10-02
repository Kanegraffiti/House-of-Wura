'use client';

import { FormEvent, useEffect, useMemo, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Loader2, Send, Sparkles, X } from 'lucide-react';

import { trans } from '@/lib/motion';
import { cn } from '@/lib/utils';

interface ChatWidgetPanelProps {
  id?: string;
  open: boolean;
  onOpenChange?: (next: boolean) => void;
  onClose?: () => void;
  fallbackWhatsApp: string;
}

type ChatMessage = {
  role: 'user' | 'assistant';
  content: string;
};

export default function ChatWidgetPanel({
  id = 'wura-chat-widget',
  open,
  onOpenChange,
  onClose,
  fallbackWhatsApp
}: ChatWidgetPanelProps) {
  const [improveOptIn, setImproveOptIn] = useState(false);
  const inputRef = useRef<HTMLInputElement | null>(null);
  const controllerRef = useRef<AbortController | null>(null);
  const [input, setInput] = useState('');
  const [msgs, setMsgs] = useState<ChatMessage[]>([]);
  const [isStreaming, setIsStreaming] = useState(false);
  const msgsRef = useRef<ChatMessage[]>([]);
  msgsRef.current = msgs;

  const initialMessage = useMemo(
    () => ({
      role: 'assistant' as const,
      content: "Hello! I'm Wura, the digital stylist for House of Wura. Ask about services, sizing, timelines, or couture care."
    }),
    []
  );

  useEffect(() => {
    if (open) {
      inputRef.current?.focus();
      return;
    }
    controllerRef.current?.abort();
    controllerRef.current = null;
    setInput('');
  }, [open]);

  const close = () => {
    onOpenChange?.(false);
    onClose?.();
  };

  const send = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const prompt = input.trim();
    if (!prompt || isStreaming) return;

    const userMessage: ChatMessage = { role: 'user', content: prompt };
    const nextMessages = [...msgsRef.current, userMessage];
    setMsgs(nextMessages);
    setInput('');
    setIsStreaming(true);

    const controller = new AbortController();
    controllerRef.current = controller;

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: nextMessages, improveOptIn }),
        signal: controller.signal
      });

      if (!res.ok) {
        const j = await res.json().catch(() => ({}));
        setMsgs((s) => [
          ...s,
          {
            role: 'assistant',
            content:
              j?.error === 'NO_OPENAI_KEY'
                ? 'Assistant is temporarily offline. Please use WhatsApp for quick help.'
                : "Hmm, I couldn't reach the assistant right now. Please try again or use WhatsApp."
          }
        ]);
        return;
      }

      if (!res.body) {
        setMsgs((s) => [
          ...s,
          { role: 'assistant', content: "Hmm, I couldn't reach the assistant right now. Please try again or use WhatsApp." }
        ]);
        return;
      }

      setMsgs((s) => [...s, { role: 'assistant', content: '' }]);
      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      let acc = '';
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        acc += decoder.decode(value, { stream: true });
        setMsgs((s) => {
          const copy = [...s];
          copy[copy.length - 1] = { role: 'assistant', content: acc };
          return copy;
        });
      }
    } catch (err) {
      if ((err as Error).name === 'AbortError') return;
      setMsgs((s) => [
        ...s,
        { role: 'assistant', content: 'Network error. Please try again or use WhatsApp.' }
      ]);
    } finally {
      controllerRef.current = null;
      setIsStreaming(false);
    }
  };

  const thread = msgs;

  return (
    <AnimatePresence>
      {open && (
        <motion.aside
          key="chat"
          role="dialog"
          aria-modal="true"
          aria-label="House of Wura AI chat"
          id={id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0, transition: { ...trans(0.22), type: 'spring', stiffness: 280, damping: 32 } }}
          exit={{ opacity: 0, y: 16, transition: trans(0.16) }}
          className="w-[92vw] max-w-sm overflow-hidden rounded-3xl border border-wura-black/10 bg-white shadow-[0_30px_60px_rgba(11,11,11,0.2)]"
        >
          <header className="flex items-center justify-between border-b border-wura-black/10 bg-wura-black/5 px-4 py-3">
            <div className="flex items-center gap-2 text-sm font-semibold uppercase tracking-[0.3em] text-wura-black/70">
              <Sparkles className="h-4 w-4 text-wura-gold" aria-hidden />
              Wura Assistant
            </div>
            <button
              type="button"
              className="focus-ring rounded-full border border-transparent p-1 text-wura-black transition hover:border-wura-gold"
              aria-label="Close chat"
              onClick={close}
            >
              <X className="h-4 w-4" aria-hidden />
            </button>
          </header>

          <div className="flex max-h-[60vh] flex-col">
            <div className="flex-1 space-y-4 overflow-y-auto px-4 py-4">
              <motion.div layout className="flex justify-start">
                <span className="inline-block max-w-[85%] rounded-2xl bg-wura-black/90 px-3 py-2 text-sm text-white shadow-md">
                  {initialMessage.content}
                </span>
              </motion.div>
              <AnimatePresence initial={false}>
                {thread.map((message, index) => (
                  <motion.div
                    key={`${message.role}-${index}-${message.content.slice(0, 6)}`}
                    layout
                    initial={{ opacity: 0, y: 6 }}
                    animate={{ opacity: 1, y: 0, transition: trans(0.18) }}
                    exit={{ opacity: 0, y: -6, transition: trans(0.12) }}
                    className={cn('flex', message.role === 'user' ? 'justify-end' : 'justify-start')}
                  >
                    <span
                      className={cn(
                        'inline-block max-w-[85%] rounded-2xl px-3 py-2 text-sm shadow-sm',
                        message.role === 'user'
                          ? 'bg-wura-wine text-white'
                          : 'bg-wura-black/5 text-wura-black'
                      )}
                    >
                      {message.content}
                    </span>
                  </motion.div>
                ))}
              </AnimatePresence>
              {isStreaming && (
                <div className="flex justify-start">
                  <span className="inline-flex items-center gap-2 rounded-2xl bg-wura-black/5 px-3 py-2 text-xs uppercase tracking-[0.3em] text-wura-black/50">
                    <Loader2 className="h-3.5 w-3.5 animate-spin" aria-hidden />
                    Thinking
                  </span>
                </div>
              )}
            </div>

            <div className="space-y-3 border-t border-wura-black/10 px-4 py-3">
              <form onSubmit={send} className="space-y-3">
                <div className="flex gap-2">
                  <input
                    ref={inputRef}
                    value={input}
                    onChange={(event) => setInput(event.target.value)}
                    placeholder="Ask about services, sizing, care, or policies…"
                    className="flex-1 rounded-full border border-wura-black/15 bg-white px-4 py-2 text-sm text-wura-black placeholder:text-wura-black/40 focus:border-wura-gold focus:outline-none"
                    autoComplete="off"
                    disabled={isStreaming}
                  />
                  <button
                    type="submit"
                    className="inline-flex h-10 min-w-[3rem] items-center justify-center rounded-full bg-wura-black px-3 text-sm font-semibold uppercase tracking-[0.3em] text-white transition hover:bg-wura-wine"
                    disabled={!input.trim() || isStreaming}
                  >
                    {isStreaming ? <Loader2 className="h-4 w-4 animate-spin" aria-hidden /> : <Send className="h-4 w-4" aria-hidden />}
                    <span className="sr-only">Send</span>
                  </button>
                </div>
              </form>
              <div className="flex items-center justify-between gap-3 rounded-2xl border border-dashed border-wura-black/10 px-3 py-2 text-xs text-wura-black/60">
                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={improveOptIn}
                    onChange={(event) => setImproveOptIn(event.target.checked)}
                    className="h-4 w-4 rounded border-wura-black/30 text-wura-wine focus:ring-wura-gold"
                  />
                  Help improve future answers
                </label>
                <a
                  href={fallbackWhatsApp}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="underline"
                >
                  WhatsApp concierge
                </a>
              </div>
            </div>
          </div>
        </motion.aside>
      )}
    </AnimatePresence>
  );
}
