#!/usr/bin/env node

const DEFAULT_BASE_URL = 'https://www.tken.shop/v1';

function printHelp() {
  console.log(`OpenAI-compatible endpoint tester

Usage:
  node tools/endpoint-tester.mjs [options]

Options:
  --base-url <url>       OpenAI-compatible base URL. Defaults to TKEN_BASE_URL or ${DEFAULT_BASE_URL}
  --api-key-env <name>   Environment variable that contains the API key. Defaults to TKEN_API_KEY
  --model <id>           Model ID to test. If omitted, the first /models id is used
  --skip-chat            Check /models only
  --json                 Print machine-readable JSON
  --timeout-ms <number>  Per-request timeout. Defaults to 20000
  --prompt <text>        Chat test prompt
  --help                 Print this help

The tester reads API keys from environment variables only. It does not store or print keys.`);
}

function parseArgs(argv) {
  const options = {
    baseUrl: process.env.TKEN_BASE_URL || DEFAULT_BASE_URL,
    apiKeyEnv: 'TKEN_API_KEY',
    model: process.env.TKEN_MODEL || '',
    skipChat: false,
    json: false,
    timeoutMs: 20000,
    prompt: 'Reply with one short sentence for an API endpoint compatibility test.',
  };

  for (let i = 0; i < argv.length; i += 1) {
    const arg = argv[i];
    const next = () => {
      const value = argv[i + 1];
      if (!value || value.startsWith('--')) {
        throw new Error(`Missing value for ${arg}`);
      }
      i += 1;
      return value;
    };

    switch (arg) {
      case '--base-url':
        options.baseUrl = next();
        break;
      case '--api-key-env':
        options.apiKeyEnv = next();
        break;
      case '--model':
        options.model = next();
        break;
      case '--skip-chat':
        options.skipChat = true;
        break;
      case '--json':
        options.json = true;
        break;
      case '--timeout-ms':
        options.timeoutMs = Number(next());
        if (!Number.isFinite(options.timeoutMs) || options.timeoutMs <= 0) {
          throw new Error('--timeout-ms must be a positive number');
        }
        break;
      case '--prompt':
        options.prompt = next();
        break;
      case '--help':
      case '-h':
        options.help = true;
        break;
      default:
        throw new Error(`Unknown option: ${arg}`);
    }
  }

  options.baseUrl = options.baseUrl.replace(/\/+$/, '');
  return options;
}

async function fetchWithTimeout(url, init, timeoutMs) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);
  try {
    return await fetch(url, { ...init, signal: controller.signal });
  } finally {
    clearTimeout(timer);
  }
}

async function readJsonOrText(response) {
  const text = await response.text();
  if (!text) {
    return { text: '', json: null };
  }
  try {
    return { text, json: JSON.parse(text) };
  } catch {
    return { text, json: null };
  }
}

function summarizeBody(text) {
  return text.length > 1000 ? `${text.slice(0, 1000)}...` : text;
}

function logHuman(message, options) {
  if (!options.json) {
    console.log(message);
  }
}

async function run() {
  const options = parseArgs(process.argv.slice(2));
  if (options.help) {
    printHelp();
    return;
  }

  if (typeof fetch !== 'function') {
    throw new Error('This tester requires Node.js 18+ with global fetch support.');
  }

  const apiKey = process.env[options.apiKeyEnv];
  if (!apiKey) {
    throw new Error(`Set ${options.apiKeyEnv} first. API keys are read from environment variables only.`);
  }

  const headers = {
    Authorization: `Bearer ${apiKey}`,
    'Content-Type': 'application/json',
  };

  const result = {
    baseUrl: options.baseUrl,
    apiKeyEnv: options.apiKeyEnv,
    models: {
      ok: false,
      status: null,
      count: 0,
      sampleIds: [],
    },
    chat: null,
  };

  logHuman(`GET ${options.baseUrl}/models`, options);
  const modelsResponse = await fetchWithTimeout(`${options.baseUrl}/models`, { headers }, options.timeoutMs);
  const modelsBody = await readJsonOrText(modelsResponse);
  result.models.status = modelsResponse.status;

  if (!modelsResponse.ok) {
    result.models.error = summarizeBody(modelsBody.text);
    if (options.json) {
      console.log(JSON.stringify(result, null, 2));
    }
    throw new Error(`/models failed with HTTP ${modelsResponse.status}`);
  }

  const modelItems = Array.isArray(modelsBody.json?.data) ? modelsBody.json.data : [];
  const modelIds = modelItems.map((item) => item?.id).filter(Boolean);
  result.models.ok = true;
  result.models.count = modelIds.length;
  result.models.sampleIds = modelIds.slice(0, 10);

  logHuman(`OK: /models returned ${modelIds.length} model id(s).`, options);

  const selectedModel = options.model || modelIds[0];
  if (!selectedModel) {
    if (options.skipChat) {
      if (options.json) {
        console.log(JSON.stringify(result, null, 2));
      }
      return;
    }
    throw new Error('No model specified and /models did not return a model id.');
  }

  if (options.skipChat) {
    result.selectedModel = selectedModel;
    if (options.json) {
      console.log(JSON.stringify(result, null, 2));
    }
    return;
  }

  result.selectedModel = selectedModel;
  result.chat = {
    ok: false,
    status: null,
  };

  logHuman(`POST ${options.baseUrl}/chat/completions using model "${selectedModel}"`, options);
  const chatResponse = await fetchWithTimeout(
    `${options.baseUrl}/chat/completions`,
    {
      method: 'POST',
      headers,
      body: JSON.stringify({
        model: selectedModel,
        messages: [{ role: 'user', content: options.prompt }],
      }),
    },
    options.timeoutMs,
  );
  const chatBody = await readJsonOrText(chatResponse);
  result.chat.status = chatResponse.status;

  if (!chatResponse.ok) {
    result.chat.error = summarizeBody(chatBody.text);
    if (options.json) {
      console.log(JSON.stringify(result, null, 2));
    }
    throw new Error(`/chat/completions failed with HTTP ${chatResponse.status}`);
  }

  result.chat.ok = true;
  result.chat.preview =
    chatBody.json?.choices?.[0]?.message?.content ??
    chatBody.json?.choices?.[0]?.text ??
    summarizeBody(chatBody.text);

  if (options.json) {
    console.log(JSON.stringify(result, null, 2));
  } else {
    console.log('OK: chat completion returned a successful response.');
    console.log(String(result.chat.preview));
  }
}

run().catch((error) => {
  console.error(`Error: ${error.message}`);
  process.exitCode = 1;
});
