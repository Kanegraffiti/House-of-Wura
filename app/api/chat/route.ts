export const runtime = 'edge';

import { streamText } from 'ai';
import { createOpenAI } from '@ai-sdk/openai';
import { NextResponse } from 'next/server';

import rawEntries from '@/data/embeddings.json';

type RawEntry = {
  id: string;
  section: string;
  text: string;
  embedding?: number[];
};

interface Message {
  role: 'user' | 'assistant' | 'system';
  content: string;
}

interface KnowledgeEntry {
  id: string;
  section: string;
  text: string;
  counts: Record<string, number>;
  norm: number;
  boost: number;
}

const boostMap: Record<string, number> = {
  faq: 1.35,
  policies: 1.2,
  services: 1.1,
  sizing: 1.1,
  care: 1.05,
  shipping: 1.08,
  brand: 0.95
};

const knowledgeBase: KnowledgeEntry[] = (rawEntries as RawEntry[]).map((entry) => {
  const tokens = tokenize(entry.text);
  const counts: Record<string, number> = {};
  for (const token of tokens) {
    counts[token] = (counts[token] ?? 0) + 1;
  }
  const norm = Math.sqrt(Object.values(counts).reduce((sum, count) => sum + count * count, 0));
  return {
    id: entry.id,
    section: entry.section,
    text: entry.text,
    counts,
    norm: Number.isFinite(norm) && norm > 0 ? norm : 1,
    boost: boostMap[entry.section as keyof typeof boostMap] ?? 1
  };
});

const DEFAULT_GROQ_MODEL = process.env.GROQ_MODEL ?? 'llama-3.1-8b-instant';
const DEFAULT_OPENAI_MODEL = process.env.OPENAI_MODEL ?? 'gpt-4o-mini';

function tokenize(text: string): string[] {
  return text
    .toLowerCase()
    .replace(/[^\p{L}\p{N}\s]/gu, ' ')
    .split(/\s+/)
    .filter(Boolean);
}

function lexicalCosine(
  queryCounts: Record<string, number>,
  queryNorm: number,
  entry: KnowledgeEntry
): number {
  if (!queryNorm || !entry.norm) return 0;
  let dot = 0;
  for (const token of Object.keys(queryCounts)) {
    const entryCount = entry.counts[token];
    if (entryCount) {
      dot += queryCounts[token] * entryCount;
    }
  }
  return dot / (queryNorm * entry.norm);
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const messages = (body?.messages ?? []) as Message[];
    const userLast = [...messages].reverse().find((message) => message.role === 'user')?.content ?? '';

    if (!userLast.trim()) {
      return NextResponse.json({ error: 'Missing prompt' }, { status: 400 });
    }

    const groqKey = process.env.GROQ_API_KEY;
    const openaiKey = process.env.OPENAI_API_KEY;

    if (!groqKey && !openaiKey) {
      return NextResponse.json({ error: 'Missing GROQ_API_KEY or OPENAI_API_KEY' }, { status: 500 });
    }

    const tokens = tokenize(userLast);
    const queryCounts: Record<string, number> = {};
    for (const token of tokens) {
      queryCounts[token] = (queryCounts[token] ?? 0) + 1;
    }
    const queryNorm = Math.sqrt(Object.values(queryCounts).reduce((sum, count) => sum + count * count, 0)) || 1;

    const contextResults = knowledgeBase
      .map((entry) => ({
        entry,
        score: lexicalCosine(queryCounts, queryNorm, entry) * entry.boost
      }))
      .filter((result) => result.score > 0.04)
      .sort((a, b) => b.score - a.score)
      .slice(0, 4);

    const context = contextResults
      .map((result) => `# ${result.entry.section}\n${result.entry.text}`)
      .join('\n\n---\n\n');

    const system = `You are Wura, the digital stylist for House of Wura. Reference the supplied context for factual claims.
If information is missing, ask concise follow-up questions before answering. Keep responses warm, welcoming, and grounded in Yoruba luxury fashion expertise.
When the guest requests a purchase or consultation, kindly offer the WhatsApp concierge link (https://wa.me/${process.env.NEXT_PUBLIC_WA_NUMBER ?? '2349060294599'}).`.trim();

    const usingGroq = Boolean(groqKey);
    const provider = createOpenAI({
      apiKey: usingGroq ? groqKey! : openaiKey!,
      baseURL: usingGroq ? 'https://api.groq.com/openai/v1' : undefined
    });

    const response = await streamText({
      model: provider(usingGroq ? DEFAULT_GROQ_MODEL : DEFAULT_OPENAI_MODEL),
      system,
      messages: [
        {
          role: 'user',
          content: context
            ? `Context:\n${context}\n\nGuest question:\n${userLast}`
            : `Guest question:\n${userLast}`
        }
      ],
      maxTokens: 320,
      temperature: 0.5
    });

    return response.toDataStreamResponse();
  } catch (error) {
    return NextResponse.json({ error: 'Unable to process message' }, { status: 500 });
  }
}
