import OpenAI from 'openai';

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

const client = new OpenAI({
  apiKey,
  baseURL,
});

const completion = await client.chat.completions.create({
  model,
  messages: [
    {
      role: 'user',
      content: 'Reply with one short sentence for an API SDK test.',
    },
  ],
});

console.log(completion.choices[0]?.message?.content ?? completion);
