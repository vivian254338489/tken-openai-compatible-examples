let createOpenAICompatible;
let generateText;

try {
  ({ createOpenAICompatible } = await import('@ai-sdk/openai-compatible'));
  ({ generateText } = await import('ai'));
} catch {
  console.error('Install dependencies first: npm install ai @ai-sdk/openai-compatible');
  process.exit(1);
}

const apiKey = process.env.TKEN_API_KEY;
const baseURL = process.env.TKEN_BASE_URL || 'https://www.tken.shop/v1';
const model = process.env.TKEN_MODEL || 'replace-with-an-available-model';

if (!apiKey) {
  console.error('Set TKEN_API_KEY first.');
  process.exit(1);
}

if (model === 'replace-with-an-available-model') {
  console.error('Set TKEN_MODEL to a model id returned by /v1/models.');
  process.exit(1);
}

const tken = createOpenAICompatible({
  name: 'tken',
  apiKey,
  baseURL,
});

const { text, usage } = await generateText({
  model: tken(model),
  prompt: 'Reply with one short sentence for a Vercel AI SDK endpoint test.',
});

console.log(text);

if (usage) {
  console.error(JSON.stringify({ usage }, null, 2));
}

