const apiKey = process.env.TKEN_API_KEY;
const baseUrl = process.env.TKEN_BASE_URL || 'https://www.tken.shop/v1';
const model = process.env.TKEN_MODEL;

if (!apiKey) {
  console.error('Missing TKEN_API_KEY.');
  process.exit(1);
}

const headers = {
  Authorization: `Bearer ${apiKey}`,
  'Content-Type': 'application/json',
};

const modelsRes = await fetch(`${baseUrl}/models`, { headers });
console.log(`GET /models -> ${modelsRes.status}`);

if (!modelsRes.ok) {
  console.error(await modelsRes.text());
  process.exit(1);
}

const modelsJson = await modelsRes.json();
const availableModels = Array.isArray(modelsJson.data) ? modelsJson.data : [];
console.log(`Models returned: ${availableModels.length}`);

const selectedModel = model || availableModels[0]?.id;

if (!selectedModel) {
  console.error('No model selected and no model id returned by /models.');
  process.exit(1);
}

const chatRes = await fetch(`${baseUrl}/chat/completions`, {
  method: 'POST',
  headers,
  body: JSON.stringify({
    model: selectedModel,
    messages: [
      {
        role: 'user',
        content: 'Reply with one short sentence for an API smoke test.',
      },
    ],
  }),
});

console.log(`POST /chat/completions -> ${chatRes.status}`);
const chatBody = await chatRes.text();

if (!chatRes.ok) {
  console.error(chatBody);
  process.exit(1);
}

console.log(chatBody);
