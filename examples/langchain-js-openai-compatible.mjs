let ChatOpenAI;

try {
  ({ ChatOpenAI } = await import('@langchain/openai'));
} catch {
  console.error('Install dependency first: npm install @langchain/openai');
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

const chat = new ChatOpenAI({
  apiKey,
  model,
  temperature: 0,
  configuration: {
    baseURL,
  },
});

const response = await chat.invoke('Reply with one short sentence for a LangChain endpoint test.');
console.log(response.content ?? response);

