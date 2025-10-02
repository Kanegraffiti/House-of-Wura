export const runtime = 'edge';

import { NextResponse } from 'next/server';
import { convertToCoreMessages, streamText, type CoreMessage } from 'ai';
import { createOpenAI } from '@ai-sdk/openai';

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

export async function POST(req: Request) {
  try {
    if (!process.env.OPENAI_API_KEY) {
      return NextResponse.json({ ok: false, error: 'NO_OPENAI_KEY' }, { status: 503 });
    }
    const payload = await req.json();
    const history = Array.isArray(payload?.messages)
      ? convertToCoreMessages(payload.messages as any)
      : [];

    const userLast = extractLatestUserMessage(history);

    let context = '';
    const store = await getEmbeddingsModule();
    if (store && userLast) {
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
      : userLast
        ? ([{ role: 'user', content: userLast }] as CoreMessage[])
        : [];

    if (!chatMessages.length) {
      return NextResponse.json({ ok: false, error: 'EMPTY_PROMPT' }, { status: 400 });
    }

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
