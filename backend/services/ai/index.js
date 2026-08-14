const local = require('./providers/local');

function resolveProvider() {
  const configured = process.env.AI_PROVIDER;
  if (configured === 'openai' && process.env.OPENAI_API_KEY) {
    return require('./providers/openai');
  }
  if (configured === 'openai' && !process.env.OPENAI_API_KEY) {
    console.warn('[ai] AI_PROVIDER=openai but OPENAI_API_KEY is missing -- falling back to local provider');
  }
  return local;
}

module.exports = { getProvider: resolveProvider, local };
