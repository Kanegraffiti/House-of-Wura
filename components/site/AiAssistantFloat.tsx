'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import { Bot, Loader2, Send, X } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { formatWhatsappDisplay } from '@/lib/format';
import { cn } from '@/lib/utils';
import { getConfiguredWhatsAppNumber, waLink } from '@/lib/wa';

import type { ChatCompletionChunk, InitProgressReport, MLCEngineInterface } from '@mlc-ai/web-llm';

type ConversationMessage = {
  id: string;
  role: 'user' | 'assistant';
  content: string;
};

type EngineState = 'idle' | 'loading' | 'ready' | 'error';

const MODEL_ID = 'Qwen2.5-0.5B-Instruct-q4f16_1-MLC';

const whatsappDigits = getConfiguredWhatsAppNumber();
const whatsappDisplayRaw = formatWhatsappDisplay(whatsappDigits) || '+2349060294599';
const whatsappDisplay = (() => {
  const pretty = whatsappDisplayRaw.replace(
    /(\+\d{3})(\d{3})(\d{3})(\d{0,4})/,
    (_match, a: string, b: string, c: string, d: string) =>
      [a, b, c, d].filter(Boolean).join(' ')
  );
  const trimmed = pretty.trim();
  return trimmed || whatsappDisplayRaw;
})();
const handoffMessage = "Hello House of Wura! I'd love to speak with the concierge.";
const whatsappDeeplink = waLink(handoffMessage);

const SYSTEM_PROMPT = `You are Flora, the warm and knowledgeable AI concierge for House of Wura. Offer concise, reassuring guidance about couture fashion, luxury events, and the online shop. When questions require personal assistance, encourage the guest to message the human team on WhatsApp at ${whatsappDisplay}. Keep replies under 120 words and reference House of Wura's signature elegance.`;
const WELCOME_MESSAGE = `Hello! I'm Flora, the AI concierge for House of Wura. Ask me about bespoke looks, events, timelines, or your order. When you're ready for a personal chat, our human concierge is on WhatsApp at ${whatsappDisplay}.`;

export function AiAssistantFloat() {
  const reduceMotion = useReducedMotion();
  const [open, setOpen] = useState(false);
  const [engineState, setEngineState] = useState<EngineState>('idle');
  const [progress, setProgress] = useState(0);
  const [progressText, setProgressText] = useState<string | null>(null);
  const [input, setInput] = useState('');
  const [isReplying, setIsReplying] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [messages, setMessages] = useState<ConversationMessage[]>([
    { id: 'assistant-welcome', role: 'assistant', content: WELCOME_MESSAGE }
  ]);

  const engineRef = useRef<MLCEngineInterface | null>(null);
  const messagesRef = useRef<ConversationMessage[]>(messages);
  const listEndRef = useRef<HTMLDivElement | null>(null);
  const isMountedRef = useRef(true);

  useEffect(() => {
    messagesRef.current = messages;
    if (open) {
      listEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, open]);

  useEffect(() => {
    return () => {
      isMountedRef.current = false;
      const engine = engineRef.current;
      engineRef.current = null;
      if (engine) {
        engine.unload().catch(() => undefined);
      }
    };
  }, []);

  const loadEngine = useCallback(async () => {
    if (engineRef.current || engineState === 'loading') {
      setEngineState('ready');
      return;
    }

    if (typeof navigator === 'undefined' || !(navigator as any).gpu) {
      setEngineState('error');
      setError(`Your browser doesn't support WebGPU yet. Please message us on WhatsApp at ${whatsappDisplay}.`);
      return;
    }

    setEngineState('loading');
    setProgress(0);
    setProgressText('Preparing open-source concierge…');
    setError(null);

    try {
      const webllm = await import('@mlc-ai/web-llm');
      const { CreateMLCEngine, prebuiltAppConfig } = webllm;
      const appConfig = {
        ...prebuiltAppConfig,
        useIndexedDBCache: true,
        model_list: prebuiltAppConfig.model_list.filter((item) => item.model_id === MODEL_ID)
      };

      if (!appConfig.model_list.length) {
        throw new Error(`Model ${MODEL_ID} was not found in the WebLLM configuration.`);
      }

      const engine = await CreateMLCEngine(MODEL_ID, {
        appConfig,
        initProgressCallback: (report: InitProgressReport) => {
          if (!isMountedRef.current) return;
          if (Number.isFinite(report.progress)) {
            setProgress(Math.max(0, Math.min(1, report.progress)));
          }
          setProgressText(report.text);
        }
      });

      if (!isMountedRef.current) {
        await engine.unload().catch(() => undefined);
        return;
      }

      engineRef.current = engine;
      setEngineState('ready');
      setProgress(1);
      setProgressText('Flora is ready to help.');
    } catch (err) {
      console.error('Failed to load AI concierge', err);
      if (!isMountedRef.current) return;
      setEngineState('error');
      setError(`We couldn't load the AI concierge. Please refresh or message us on WhatsApp at ${whatsappDisplay}.`);
    }
  }, [engineState]);

  useEffect(() => {
    if (open && engineState === 'idle') {
      void loadEngine();
    }
  }, [open, engineState, loadEngine]);

  useEffect(() => {
    if (engineState === 'ready') {
      setError(null);
    }
  }, [engineState]);

  const sendMessage = useCallback(
    async (prompt: string) => {
      const trimmed = prompt.trim();
      if (!trimmed) return;

      const engine = engineRef.current;
      const userMessage: ConversationMessage = {
        id: `user-${Date.now()}`,
        role: 'user',
        content: trimmed
      };
      const assistantId = `assistant-${Date.now()}`;

      const historyLimit = 12;
      const conversation = [...messagesRef.current.slice(-historyLimit), userMessage];

      setMessages((prev) => [...prev, userMessage, { id: assistantId, role: 'assistant', content: '' }]);
      setIsReplying(true);
      setError(null);

      if (!engine) {
        setMessages((prev) =>
          prev.map((message) =>
            message.id === assistantId
              ? {
                  ...message,
                  content: `Flora is still loading. Please wait a moment or reach out on WhatsApp at ${whatsappDisplay}.`
                }
              : message
          )
        );
        setIsReplying(false);
        return;
      }

      try {
        const stream = (await engine.chat.completions.create({
          messages: [
            { role: 'system', content: SYSTEM_PROMPT },
            ...conversation.map(({ role, content }) => ({ role, content }))
          ],
          stream: true,
          temperature: 0.7
        })) as AsyncIterable<ChatCompletionChunk>;

        for await (const chunk of stream) {
          const delta = chunk.choices?.[0]?.delta?.content ?? '';
          if (!delta) continue;
          setMessages((prev) =>
            prev.map((message) =>
              message.id === assistantId ? { ...message, content: message.content + delta } : message
            )
          );
        }

        const fullReply = await engine.getMessage();
        setMessages((prev) =>
          prev.map((message) =>
            message.id === assistantId ? { ...message, content: fullReply } : message
          )
        );
      } catch (err) {
        console.error('Failed to generate AI response', err);
        setMessages((prev) =>
          prev.map((message) =>
            message.id === assistantId
              ? {
                  ...message,
                  content: `Something went wrong. Please try again or contact us on WhatsApp at ${whatsappDisplay}.`
                }
              : message
          )
        );
      } finally {
        setIsReplying(false);
      }
    },
    []
  );

  const submitPrompt = useCallback(() => {
    const trimmed = input.trim();
    if (!trimmed) return;
    if (engineState !== 'ready') {
      setError(`Flora is warming up. Please wait a few seconds or message us on WhatsApp at ${whatsappDisplay}.`);
      return;
    }
    if (isReplying) return;
    setInput('');
    void sendMessage(trimmed);
  }, [engineState, input, isReplying, sendMessage]);

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    submitPrompt();
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault();
      submitPrompt();
    }
  };

  const progressPercent = Math.round(progress * 100);

  const idleAnimation = reduceMotion ? {} : { y: [0, -3, 0] };
  const idleTransition = reduceMotion
    ? undefined
    : { duration: 1.8, ease: 'easeInOut', repeat: Infinity, repeatDelay: 6 };
  const hoverAnimation = reduceMotion ? {} : { rotate: -2, y: -4, transition: { duration: 0.2 } };

  return (
    <div className="fixed bottom-6 right-6 z-40 flex flex-col items-end gap-3 sm:bottom-8 sm:right-8">
      <AnimatePresence>
        {open && (
          <motion.div
            key="ai-assistant"
            id="flora-ai-concierge"
            initial={{ opacity: 0, y: 12, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1, transition: { type: 'spring', stiffness: 220, damping: 26 } }}
            exit={{ opacity: 0, y: 12, scale: 0.95, transition: { duration: 0.18 } }}
            className="w-[min(360px,calc(100vw-3rem))] sm:w-[380px]"
            role="dialog"
            aria-modal="true"
            aria-label="Flora AI concierge chat"
          >
            <div className="flex h-full flex-col overflow-hidden rounded-3xl border border-wura-black/10 bg-white shadow-[0_26px_72px_rgba(11,11,11,0.18)]">
              <div className="flex items-start justify-between gap-3 border-b border-wura-black/10 p-5">
                <div className="space-y-2">
                  <div>
                    <p className="font-display text-xl text-wura-black">Flora, AI Concierge</p>
                    <p className="text-[0.65rem] uppercase tracking-[0.35em] text-wura-black/50">
                      Powered by open-source WebLLM
                    </p>
                  </div>
                  <span className="inline-flex items-center gap-1 rounded-full bg-wura-gold/20 px-3 py-1 text-[0.6rem] font-semibold uppercase tracking-[0.35em] text-wura-black/70">
                    Beta
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => setOpen(false)}
                  className="focus-ring rounded-full border border-transparent p-2 text-wura-black/70 transition hover:border-wura-gold hover:text-wura-black"
                  aria-label="Close AI concierge"
                >
                  <X className="h-4 w-4" aria-hidden />
                </button>
              </div>
              <div className="flex max-h-[420px] flex-col gap-3 overflow-y-auto bg-wura-black/5 p-4" aria-live="polite">
                {messages.map((message) => (
                  <div
                    key={message.id}
                    className={cn(
                      'max-w-[92%] whitespace-pre-wrap rounded-3xl px-4 py-3 text-sm leading-relaxed shadow-sm',
                      message.role === 'assistant'
                        ? 'self-start border border-wura-black/10 bg-white text-wura-black/80'
                        : 'self-end bg-wura-black text-white'
                    )}
                  >
                    {message.role === 'assistant' && !message.content ? (
                      <span className="flex items-center gap-2 text-xs text-wura-black/60">
                        <Loader2 className="h-3.5 w-3.5 animate-spin" aria-hidden /> Typing…
                      </span>
                    ) : (
                      message.content
                    )}
                  </div>
                ))}
                <div ref={listEndRef} />
              </div>
              <div className="space-y-3 border-t border-wura-black/10 p-4">
                {engineState === 'loading' && (
                  <div className="flex items-center gap-3 rounded-2xl border border-dashed border-wura-black/20 bg-wura-black/5 px-4 py-3 text-xs text-wura-black/70">
                    <Loader2 className="h-4 w-4 animate-spin text-wura-black/60" aria-hidden />
                    <div className="space-y-1">
                      <p>
                        Warming up Flora… {progressPercent}%{' '}
                        <span className="font-semibold text-wura-black/80">(runs privately in your browser)</span>
                      </p>
                      {progressText && (
                        <p className="text-[0.6rem] uppercase tracking-[0.3em] text-wura-black/40">{progressText}</p>
                      )}
                    </div>
                  </div>
                )}
                {error && (
                  <div className="space-y-2">
                    <p
                      className="rounded-2xl border border-wura-wine/40 bg-wura-wine/10 p-3 text-xs text-wura-wine"
                      role="alert"
                    >
                      {error}
                    </p>
                    {engineState === 'error' && (
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="w-full border border-dashed border-wura-black/10 text-[0.65rem] uppercase tracking-[0.3em] text-wura-black/70 hover:border-wura-gold hover:text-wura-black"
                        onClick={() => {
                          setEngineState('idle');
                          setError(null);
                          void loadEngine();
                        }}
                      >
                        Retry loading Flora
                      </Button>
                    )}
                  </div>
                )}
                <form onSubmit={handleSubmit} className="space-y-2">
                  <Textarea
                    value={input}
                    onChange={(event) => setInput(event.target.value)}
                    onKeyDown={handleKeyDown}
                    placeholder="Ask about looks, availability, or bespoke planning…"
                    rows={3}
                    className="min-h-[96px] rounded-3xl border-wura-black/15 bg-white text-sm leading-relaxed text-wura-black focus-visible:border-wura-gold"
                  />
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <Button
                      type="submit"
                      size="sm"
                      className="px-6 py-2"
                      disabled={!input.trim() || engineState !== 'ready' || isReplying}
                    >
                      {isReplying ? (
                        <>
                          <Loader2 className="h-3.5 w-3.5 animate-spin" aria-hidden /> Responding…
                        </>
                      ) : (
                        <>
                          <Send className="h-3.5 w-3.5" aria-hidden /> Ask Flora
                        </>
                      )}
                    </Button>
                    <a
                      href={whatsappDeeplink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-[0.65rem] font-semibold uppercase tracking-[0.3em] text-wura-black/60 hover:text-wura-black"
                    >
                      Need a human? WhatsApp {whatsappDisplay}
                    </a>
                  </div>
                  <p className="text-[0.6rem] leading-relaxed text-wura-black/45">
                    Powered by the open-source Qwen2.5 0.5B Instruct model running with WebLLM in your browser. Responses may not
                    be perfect—confirm details with our concierge on WhatsApp.
                  </p>
                </form>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      <motion.button
        type="button"
        onClick={() => setOpen((prev) => !prev)}
        initial={{ y: 0, opacity: 1 }}
        animate={idleAnimation}
        transition={idleTransition}
        whileHover={hoverAnimation}
        className="focus-ring flex h-14 w-14 items-center justify-center rounded-full bg-wura-black text-white shadow-[0_18px_36px_rgba(11,11,11,0.28)]"
        aria-haspopup="dialog"
        aria-expanded={open}
        aria-controls="flora-ai-concierge"
      >
        <Bot className="h-6 w-6" aria-hidden />
        <span className="sr-only">{open ? 'Close AI concierge' : 'Chat with AI concierge'}</span>
      </motion.button>
    </div>
  );
}
