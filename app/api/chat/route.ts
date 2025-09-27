export const runtime = 'edge';

import { embed, streamText } from 'ai';
import { createOpenAI } from '@ai-sdk/openai';
import { NextResponse } from 'next/server';

import embeddings from '@/data/embeddings.json';

interface Message {
  role: 'user' | 'assistant' | 'system';
  content: string;
}

type EmbeddingEntry = {
  id: string;
  section: string;
  embedding: number[];
  text: string;
};

const boostMap: Record<string, number> = {
  faq: 1.35,
  policies: 1.2,
  services: 1.1,
  sizing: 1.1,
  care: 1.05,
  shipping: 1.08,
  brand: 0.95
};

function cosine(a: number[], b: number[]): number {
  const length = Math.min(a.length, b.length);
  if (length === 0) return 0;
  let dot = 0;
  let normA = 0;
  let normB = 0;
  for (let i = 0; i < length; i += 1) {
    dot += a[i] * b[i];
    normA += a[i] * a[i];
    normB += b[i] * b[i];
  }
  const denom = Math.sqrt(normA) * Math.sqrt(normB);
  if (!Number.isFinite(denom) || denom === 0) return 0;
  return dot / denom;
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const messages = (body?.messages ?? []) as Message[];
    const userLast = [...messages].reverse().find((message) => message.role === 'user')?.content ?? '';

    if (!userLast.trim()) {
      return NextResponse.json({ error: 'Missing prompt' }, { status: 400 });
    }

    const openai = createOpenAI({ apiKey: process.env.OPENAI_API_KEY! });
    const { embedding: queryEmbedding } = await embed({
      model: openai.embedding('text-embedding-3-small'),
      value: userLast
    });

    if (!queryEmbedding?.length) {
      return NextResponse.json({ error: 'Failed to embed prompt' }, { status: 500 });
    }

    const results = (embeddings as EmbeddingEntry[])
      .map((entry) => {
        const boost = boostMap[entry.section as keyof typeof boostMap] ?? 1;
        return {
          ...entry,
          score: cosine(queryEmbedding, entry.embedding) * boost
        };
      })
      .sort((a, b) => b.score - a.score)
      .slice(0, 5);

    const context = results
      .map((result) => `# ${result.section}\n${result.text}`)
      .join('\n\n---\n\n');

    const system = `You are House of Wura's helpful stylist and event concierge. Use only the supplied context for factual claims.
Ask concise follow-up questions when information is missing. Maintain a warm, luxurious tone with practical detail. Offer the WhatsApp concierge link (https://wa.me/${process.env.NEXT_PUBLIC_WA_NUMBER ?? '2349060294599'}) when purchases or consultations are requested.`.trim();

    const response = await streamText({
      model: openai('gpt-4o-mini'),
      system,
      messages: [
        {
          role: 'user',
          content: `Context:\n${context}\n\nUser question:\n${userLast}`
        }
      ]
    });

    return response.toDataStreamResponse();
  } catch (error) {
    return NextResponse.json({ error: 'Unable to process message' }, { status: 500 });
  }
}
