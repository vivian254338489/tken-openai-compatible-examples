#!/usr/bin/env node

const baseUrl = (process.env.TKEN_BASE_URL || 'https://www.tken.shop/v1').replace(/\/+$/, '');
const apiKey = process.env.TKEN_API_KEY;

const routeModels = {
  fast: process.env.TKEN_MODEL_FAST || process.env.TKEN_MODEL || 'replace-with-an-available-model',
  balanced: process.env.TKEN_MODEL_BALANCED || process.env.TKEN_MODEL || 'replace-with-an-available-model',
  reasoning: process.env.TKEN_MODEL_REASONING || process.env.TKEN_MODEL || 'replace-with-an-available-model',
};

const route = process.argv[2] || 'fast';
const prompt = process.argv.slice(3).join(' ') || 'Summarize why route-level model selection helps control LLM cost.';

if (!apiKey) {
  console.error('Set TKEN_API_KEY first.');
  process.exit(1);
}

if (!routeModels[route]) {
  console.error(`Unknown route "${route}". Use one of: ${Object.keys(routeModels).join(', ')}`);
  process.exit(1);
}

if (routeModels[route] === 'replace-with-an-available-model') {
  console.error('Set TKEN_MODEL or a route-specific model env var after checking /v1/models.');
  process.exit(1);
}

const response = await fetch(`${baseUrl}/chat/completions`, {
  method: 'POST',
  headers: {
    Authorization: `Bearer ${apiKey}`,
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    model: routeModels[route],
    max_tokens: route === 'fast' ? 160 : 500,
    messages: [{ role: 'user', content: prompt }],
  }),
});

const text = await response.text();

if (!response.ok) {
  console.error(`HTTP ${response.status}: ${text.slice(0, 1000)}`);
  process.exit(1);
}

const json = JSON.parse(text);
console.log(json.choices?.[0]?.message?.content ?? json);
