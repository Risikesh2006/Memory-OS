// Local, zero-dependency fallback provider. This is NOT an LLM -- it's honest, deterministic
// text processing so the product still behaves sensibly with no AI API key configured, instead
// of returning fake/mocked "AI" output. Swap in providers/openai.js (or another real provider)
// by setting AI_PROVIDER=openai and OPENAI_API_KEY in the environment -- no controller changes
// are needed, since everything goes through services/ai/index.js's provider interface.

const STOPWORDS = new Set([
  'the', 'a', 'an', 'and', 'or', 'but', 'is', 'are', 'was', 'were', 'to', 'of', 'in', 'on',
  'at', 'for', 'with', 'this', 'that', 'it', 'as', 'by', 'from', 'be', 'been', 'i', 'my', 'me',
  'we', 'our', 'you', 'your', 'he', 'she', 'they', 'them', 'his', 'her', 'their', 'not', 'no',
  'so', 'if', 'then', 'than', 'about', 'into', 'over', 'after', 'before', 'up', 'down', 'out',
]);

function tokenize(text) {
  return (text || '')
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, ' ')
    .split(/\s+/)
    .filter((w) => w.length > 2 && !STOPWORDS.has(w));
}

function summarize(text, maxSentences = 2) {
  const clean = (text || '').replace(/\s+/g, ' ').trim();
  if (!clean) return '';
  const sentences = clean.match(/[^.!?]+[.!?]?/g) || [clean];
  return sentences.slice(0, maxSentences).join(' ').trim();
}

function suggestTags(text, max = 5) {
  const counts = {};
  for (const word of tokenize(text)) counts[word] = (counts[word] || 0) + 1;
  return Object.entries(counts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, max)
    .map(([word]) => word);
}

async function generateText({ prompt, context }) {
  // No generative model available -- return a clearly-labeled extractive answer built only
  // from the supplied context, never fabricated. Callers must treat this as a lower-quality
  // stand-in and are expected to check `provider === 'local'` in the response if they want to
  // surface that distinction to the user.
  const snippets = (context || []).slice(0, 3).map((c) => c.text).filter(Boolean);
  if (!snippets.length) {
    return "I don't have enough saved memories to answer that yet.";
  }
  return `Based on your saved memories: ${snippets.join(' | ')}`;
}

async function embed({ text }) {
  // No real embedding model configured. Returning null (not a fake vector) so callers can
  // detect embeddings are unavailable rather than silently storing meaningless vectors.
  return null;
}

module.exports = {
  name: 'local',
  model: 'extractive-v1',
  generateText,
  embed,
  summarize,
  suggestTags,
};
