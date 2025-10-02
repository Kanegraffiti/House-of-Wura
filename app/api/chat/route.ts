export const runtime = 'edge';

import { NextResponse } from 'next/server';
import { streamText } from 'ai';
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
    const { messages } = await req.json();
    const userLast = messages?.slice().reverse().find((m: any) => m.role === 'user')?.content || '';

    let context = '';
    const store = await getEmbeddingsModule();
    if (store && userLast) {
      const embRes = await fetch('https://api.openai.com/v1/embeddings', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ model: 'text-embedding-3-small', input: userLast })
      });
      const embJson = await embRes.json();
      const qe: number[] = embJson?.data?.[0]?.embedding || [];
      const top = store
        .map((e) => ({ ...e, score: qe.length ? cosine(qe, e.embedding) : 0 }))
        .sort((a, b) => b.score - a.score)
        .slice(0, 5);
      context = top.map((s) => `# ${s.section}\n${s.text}`).join('\n\n---\n\n');
    }

    const system = `
You are House of Wura's assistant for fashion + event planning.
Base all factual answers on the provided context; if unsure, say what info is needed.
Always offer a WhatsApp link for enquiries with SKU or service details when relevant.
Reply concise, warm, and on-brand.
`.trim();

    const result = await streamText({
      model: openai('gpt-4o-mini'),
      system,
      messages: [
        {
          role: 'user',
          content: `Context:\n${context || '(no extra context)'}\n\nUser:\n${userLast}`
        }
      ]
    });

    return result.toAIStreamResponse();
  } catch (e: any) {
    if (process.env.DEBUG_WURA === 'true') console.error('POST /api/chat', e);
    return NextResponse.json({ ok: false, error: 'CHAT_FAILED' }, { status: 500 });
  }
}
