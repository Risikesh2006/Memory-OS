// Real provider backed by the OpenAI API. Only usable once OPENAI_API_KEY is set -- this file
// intentionally throws rather than silently falling back, so a misconfiguration is loud instead
// of quietly degrading to mocked output.

const axios = require('axios');

const API_BASE = 'https://api.openai.com/v1';
const TEXT_MODEL = process.env.OPENAI_TEXT_MODEL || 'gpt-4o-mini';
const EMBEDDING_MODEL = process.env.OPENAI_EMBEDDING_MODEL || 'text-embedding-3-small';

function client() {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) throw new Error('OPENAI_API_KEY is not set');
  return axios.create({
    baseURL: API_BASE,
    headers: { Authorization: `Bearer ${apiKey}`, 'Content-Type': 'application/json' },
    timeout: 30000,
  });
}

async function generateText({ prompt, context }) {
  const contextBlock = (context || [])
    .map((c, i) => `[${i + 1}] ${c.text}`)
    .join('\n');

  const { data } = await client().post('/chat/completions', {
    model: TEXT_MODEL,
    messages: [
      {
        role: 'system',
        content: 'You are Legacy OS, a private memory assistant. Answer ONLY using the numbered ' +
          'memory excerpts provided below. If the excerpts do not contain the answer, say so ' +
          'plainly instead of guessing. Cite excerpt numbers like [1] inline.',
      },
      { role: 'user', content: `Memories:\n${contextBlock}\n\nQuestion: ${prompt}` },
    ],
    temperature: 0.3,
  });

  return data.choices[0].message.content;
}

async function embed({ text }) {
  const { data } = await client().post('/embeddings', { model: EMBEDDING_MODEL, input: text });
  return data.data[0].embedding;
}

module.exports = {
  name: 'openai',
  model: TEXT_MODEL,
  generateText,
  embed,
};
