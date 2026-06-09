#!/usr/bin/env node
import OpenAI from 'openai';

const apiKey = process.env.TKEN_API_KEY;
const baseURL = process.env.TKEN_BASE_URL || 'https://www.tken.shop/v1';
const model = process.env.TKEN_MODEL || 'replace-with-an-available-model';
const requestedModes = parseModes(process.argv.slice(2).join(',') || process.env.TKEN_CAPABILITY_MODES || 'stream,json,tools');

if (!apiKey) {
  console.error('Set TKEN_API_KEY first.');
  process.exit(1);
}

if (model === 'replace-with-an-available-model') {
  console.error('Set TKEN_MODEL to a model id returned by /v1/models.');
  process.exit(1);
}

if (!requestedModes.size) {
  console.error('Choose at least one mode: stream, json, tools.');
  process.exit(1);
}

const client = new OpenAI({
  apiKey,
  baseURL,
  timeout: Number(process.env.TKEN_SDK_TIMEOUT_MS || 30000),
  maxRetries: Number(process.env.TKEN_SDK_MAX_RETRIES || 0),
});

const results = [];

if (requestedModes.has('stream')) {
  results.push(await runCheck('stream', runStreamingCheck));
}

if (requestedModes.has('json')) {
  results.push(await runCheck('json', runJsonCheck));
}

if (requestedModes.has('tools')) {
  results.push(await runCheck('tools', runToolCallCheck));
}

console.log(JSON.stringify({ ok: results.every((item) => item.ok), baseURL, model, results }, null, 2));

if (results.some((item) => !item.ok)) {
  process.exit(1);
}

function parseModes(value) {
  return new Set(
    value
      .split(/[,\s]+/)
      .map((item) => item.trim().toLowerCase())
      .filter(Boolean)
      .map((item) => {
        if (item === 'tool' || item === 'tool-calls') return 'tools';
        if (item === 'structured' || item === 'json-mode') return 'json';
        return item;
      })
      .filter((item) => ['stream', 'json', 'tools'].includes(item)),
  );
}

async function runCheck(name, check) {
  try {
    const detail = await check();
    return { name, ok: true, detail };
  } catch (error) {
    return {
      name,
      ok: false,
      error: sanitizeError(error),
    };
  }
}

async function runStreamingCheck() {
  const stream = await client.chat.completions.create({
    model,
    stream: true,
    max_tokens: 80,
    messages: [
      {
        role: 'user',
        content: 'Reply with one short sentence for a streaming API smoke test.',
      },
    ],
  });

  let chunks = 0;
  let content = '';
  for await (const part of stream) {
    const delta = part.choices?.[0]?.delta?.content || '';
    if (delta) {
      chunks += 1;
      content += delta;
    }
  }

  if (!chunks || !content.trim()) {
    throw new Error('Streaming completed without content chunks.');
  }

  return { chunks, chars: content.trim().length };
}

async function runJsonCheck() {
  const completion = await client.chat.completions.create({
    model,
    response_format: { type: 'json_object' },
    max_tokens: 120,
    messages: [
      { role: 'system', content: 'Return only valid JSON.' },
      {
        role: 'user',
        content: 'Return an object with keys ok, feature, and note for a JSON-mode smoke test.',
      },
    ],
  });

  const content = completion.choices?.[0]?.message?.content || '';
  const parsed = JSON.parse(content);

  return {
    keys: Object.keys(parsed).sort(),
    chars: content.length,
  };
}

async function runToolCallCheck() {
  const completion = await client.chat.completions.create({
    model,
    max_tokens: 120,
    tools: [
      {
        type: 'function',
        function: {
          name: 'record_gateway_capability',
          description: 'Record one OpenAI-compatible gateway capability smoke result.',
          parameters: {
            type: 'object',
            properties: {
              feature: { type: 'string' },
              status: { type: 'string', enum: ['pass', 'review'] },
              note: { type: 'string' },
            },
            required: ['feature', 'status', 'note'],
            additionalProperties: false,
          },
        },
      },
    ],
    tool_choice: {
      type: 'function',
      function: { name: 'record_gateway_capability' },
    },
    messages: [
      {
        role: 'user',
        content: 'Call the tool with feature "tool_calls", status "pass", and a short note.',
      },
    ],
  });

  const toolCalls = completion.choices?.[0]?.message?.tool_calls || [];
  if (!toolCalls.length) {
    throw new Error('No tool_calls returned.');
  }

  return {
    tool_calls: toolCalls.length,
    names: toolCalls.map((call) => call.function?.name).filter(Boolean),
  };
}

function sanitizeError(error) {
  const status = error?.status || error?.code || 'unknown';
  const message = String(error?.message || error).replace(apiKey, '[redacted]');
  return { status, message: message.slice(0, 500) };
}
