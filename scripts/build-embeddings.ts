#!/usr/bin/env ts-node
import fs from 'node:fs/promises';
import path from 'node:path';
import { embedMany } from 'ai';
import { createOpenAI } from '@ai-sdk/openai';

const openai = createOpenAI({ apiKey: process.env.OPENAI_API_KEY! });
const DIR = path.join(process.cwd(), 'data', 'knowledge');

async function main() {
  const files = (await fs.readdir(DIR)).filter((f) => f.endsWith('.md'));
  const docs = await Promise.all(
    files.map(async (f) => {
      const text = await fs.readFile(path.join(DIR, f), 'utf8');
      return { id: f, text, meta: { section: f.replace('.md', '') } };
    })
  );

  const { embeddings } = await embedMany({
    model: openai.embedding('text-embedding-3-small'),
    values: docs.map((d) => d.text)
  });

  const out = docs.map((d, i) => ({
    id: d.id,
    section: d.meta.section,
    embedding: embeddings[i],
    text: d.text
  }));
  await fs.writeFile(
    path.join(process.cwd(), 'data', 'embeddings.json'),
    JSON.stringify(out)
  );
  console.log('Wrote data/embeddings.json with', out.length, 'items');
}
main().catch((e) => {
  console.error(e);
  process.exit(1);
});
