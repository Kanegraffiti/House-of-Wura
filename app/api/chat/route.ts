export const runtime = 'edge';

import { NextResponse } from 'next/server';
import { convertToCoreMessages, streamText, type CoreMessage } from 'ai';
import { createOpenAI } from '@ai-sdk/openai';

import { waLink } from '@/lib/wa';

const openai = createOpenAI({ apiKey: process.env.OPENAI_API_KEY || '' });

function cosine(a: number[], b: number[]) {
  let s = 0;
  let na = 0;
  let nb = 0;
  for (let i = 0; i < a.length; i += 1) {
    s += a[i] * b[i];
    na += a[i] * a[i];
    nb += b[i] * b[i];
  }
  return s / (Math.sqrt(na) * Math.sqrt(nb) + 1e-8);
}

async function getEmbeddingsModule() {
  try {
    const mod = await import('@/data/embeddings.json');
    return (mod as any).default as Array<{ id: string; section: string; embedding: number[]; text: string }>;
  } catch (e) {
    if (process.env.DEBUG_WURA === 'true') console.warn('No embeddings.json; proceeding without RAG');
    return null;
  }
}

type KnowledgeEntry = { id: string; section: string; embedding: number[]; text: string };

export async function POST(req: Request) {
  try {
    const payload = await req.json();
    const history = Array.isArray(payload?.messages)
      ? convertToCoreMessages(payload.messages as any)
      : [];

    const userLast = extractLatestUserMessage(history);

    if (!userLast) {
      return NextResponse.json({ ok: false, error: 'EMPTY_PROMPT' }, { status: 400 });
    }

    const store = await getEmbeddingsModule();

    if (!process.env.OPENAI_API_KEY) {
      const fallback = buildFallbackAnswer(userLast, store);
      const encoder = new TextEncoder();
      return new Response(
        new ReadableStream({
          start(controller) {
            controller.enqueue(encoder.encode(fallback));
            controller.close();
          }
        }),
        { headers: { 'Content-Type': 'text/plain; charset=utf-8' } }
      );
    }

    let context = '';
    if (store) {
      try {
        const embRes = await fetch('https://api.openai.com/v1/embeddings', {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ model: 'text-embedding-3-small', input: userLast })
        });
        if (embRes.ok) {
          const embJson = await embRes.json();
          const qe: number[] = embJson?.data?.[0]?.embedding || [];
          const top = store
            .map((e) => ({ ...e, score: qe.length ? cosine(qe, e.embedding) : 0 }))
            .sort((a, b) => b.score - a.score)
            .slice(0, 5);
          context = top.map((s) => `# ${s.section}\n${s.text}`).join('\n\n---\n\n');
        }
      } catch (err) {
        if (process.env.DEBUG_WURA === 'true') {
          console.warn('Failed to load embeddings for chat', err);
        }
      }
    }

    const systemBase = `You are House of Wura's assistant for fashion + event planning.
Base all factual answers on the provided context; if unsure, say what info is needed.
Always offer a WhatsApp link for enquiries with SKU or service details when relevant.
Reply concise, warm, and on-brand.`;

    const system = context
      ? `${systemBase}\n\nContext:\n${context}`
      : `${systemBase}\n\nContext: (no extra context)`;

    const chatMessages = history.length
      ? history
      : ([{ role: 'user', content: userLast }] as CoreMessage[]);

    const result = await streamText({
      model: openai('gpt-4o-mini'),
      system,
      messages: chatMessages
    });

    return result.toDataStreamResponse();
  } catch (e: any) {
    if (process.env.DEBUG_WURA === 'true') console.error('POST /api/chat', e);
    return NextResponse.json({ ok: false, error: 'CHAT_FAILED' }, { status: 500 });
  }
}

function extractLatestUserMessage(messages: CoreMessage[]) {
  for (let i = messages.length - 1; i >= 0; i -= 1) {
    const message = messages[i];
    if (message.role !== 'user') continue;
    const content = Array.isArray(message.content)
      ? message.content
          .map((part) => {
            if (typeof part === 'string') return part;
            if ('type' in part && part.type === 'text') return part.text;
            return '';
          })
          .join(' ')
          .trim()
      : typeof message.content === 'string'
        ? message.content
        : '';
    if (content) return content;
  }
  return '';
}

function buildFallbackAnswer(query: string, store: KnowledgeEntry[] | null) {
  const normalized = query.toLowerCase();
  const tokens = normalized.match(/[\p{L}\p{N}']+/gu)?.map((token) => token.trim()).filter(Boolean) ?? [];

  const matches =
    store
      ?.map((entry) => {
        const haystack = `${entry.section}\n${entry.text}`.toLowerCase();
        let score = 0;
        for (const token of tokens) {
          if (token.length < 3) continue;
          if (!haystack.includes(token)) continue;
          const weight = token.length >= 6 ? 3 : 2;
          score += weight;
        }
        return { entry, score };
      })
      .filter((item) => item.score > 0)
      .sort((a, b) => b.score - a.score)
      .slice(0, 3) ?? [];

  const snippets = matches.map(({ entry }) => {
    const excerpt = pickRelevantSentences(entry.text, tokens);
    return `• ${entry.section}: ${excerpt}`;
  });

  const concierge = waLink("Hello House of Wura! I'd love to talk about your bespoke services.");

  if (!snippets.length) {
    return [
      "I'm here to help with couture looks, events, and concierge planning.",
      'Share a few details about your vision and I will point you in the right direction.',
      `For a personal stylist right away, tap our WhatsApp concierge: ${concierge}`
    ].join(' ');
  }

  return [
    "Here's what I can share right now:",
    ...snippets,
    `If you'd like a stylist to continue the conversation, tap our WhatsApp concierge: ${concierge}`
  ].join('\n');
}

function pickRelevantSentences(text: string, tokens: string[]) {
  const sentences = text.split(/(?<=[.!?])\s+/);
  const loweredTokens = tokens.filter((token) => token.length >= 3).map((token) => token.toLowerCase());
  const relevant = sentences.filter((sentence) => {
    const lower = sentence.toLowerCase();
    return loweredTokens.some((token) => lower.includes(token));
  });
  const snippet = (relevant.length ? relevant : sentences.slice(0, 2)).join(' ');
  return snippet.length > 280 ? `${snippet.slice(0, 277).trimEnd()}…` : snippet;
}
