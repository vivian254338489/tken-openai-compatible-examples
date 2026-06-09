# Vercel AI SDK With TKEN

Use this guide when a Next.js, Node.js, or edge/server route uses the Vercel AI SDK and you want it to call TKEN through an OpenAI-compatible base URL.

TKEN base URL:

```text
https://www.tken.shop/v1
```

Disclosure: TKEN is an independent third-party API gateway. It is not officially affiliated with Vercel, the AI SDK project, OpenAI, or other model providers. Feature behavior can vary by selected model, provider route, account limits, and provider status.

## Before You Change App Code

1. Run `/v1/models` first.
2. Pick one model ID returned by TKEN.
3. Run one non-streaming chat completion.
4. Only then wire the AI SDK integration.

Use the repo tester:

```bash
node tools/endpoint-tester.mjs --skip-chat
node tools/endpoint-tester.mjs --model "$TKEN_MODEL"
```

## Environment

```bash
export TKEN_API_KEY="sk-your-tken-key"
export TKEN_BASE_URL="https://www.tken.shop/v1"
export TKEN_MODEL="replace-with-an-available-model"
```

PowerShell:

```powershell
$env:TKEN_API_KEY="sk-your-tken-key"
$env:TKEN_BASE_URL="https://www.tken.shop/v1"
$env:TKEN_MODEL="replace-with-an-available-model"
```

Keep the key in server-side environment variables. Do not expose it through public browser JavaScript, client components, static config, screenshots, or logs.

## Install

```bash
npm install ai @ai-sdk/openai-compatible
```

## Minimal Text Generation

```js
import { generateText } from "ai";
import { createOpenAICompatible } from "@ai-sdk/openai-compatible";

const tken = createOpenAICompatible({
  name: "tken",
  apiKey: process.env.TKEN_API_KEY,
  baseURL: process.env.TKEN_BASE_URL || "https://www.tken.shop/v1",
});

const { text } = await generateText({
  model: tken(process.env.TKEN_MODEL),
  prompt: "Reply with one short sentence for an AI SDK endpoint test.",
});

console.log(text);
```

Full runnable example: `examples/vercel-ai-sdk-openai-compatible.mjs`.

## Server Route Pattern

Use a server-only route when the app has a browser UI:

```js
import { streamText } from "ai";
import { createOpenAICompatible } from "@ai-sdk/openai-compatible";

const tken = createOpenAICompatible({
  name: "tken",
  apiKey: process.env.TKEN_API_KEY,
  baseURL: process.env.TKEN_BASE_URL || "https://www.tken.shop/v1",
});

export async function POST(req) {
  const { messages } = await req.json();

  const result = streamText({
    model: tken(process.env.TKEN_MODEL),
    messages,
  });

  return result.toTextStreamResponse();
}
```

If your selected model route does not pass the streaming check, keep the first rollout on non-streaming `generateText` and retry streaming with a model that passed `docs/openai-sdk-capability-smoke.md`.

## Rollout Checklist

- The route reads `TKEN_API_KEY` only on the server.
- `TKEN_MODEL` is a model ID returned by `/v1/models`.
- Non-streaming generation passes before streaming is enabled.
- Request timeout and retry limits are explicit.
- User-facing routes have token or spend caps.
- Logs redact prompts, keys, account IDs, usage records, and provider dashboard details.
- Tool calling, JSON object generation, image, and embedding routes are tested separately.

## Failure Map

| Symptom | Likely Cause | Action |
| --- | --- | --- |
| 401 | Missing or wrong TKEN key | Recheck server environment and avoid client-side key reads |
| 404 | Base URL missing `/v1` or wrong path | Use `https://www.tken.shop/v1` |
| Model not found | App used a provider model ID not returned by TKEN | Pick from `/v1/models` |
| Streaming hangs or returns no deltas | Selected route does not stream or proxy buffers output | Use non-streaming for that route |
| Tool or structured output shape differs | Selected route does not support the optional feature | Use a fallback route or app-side validation |

## Related Guides

- `docs/endpoint-preflight-playbook.md`
- `docs/openai-sdk-capability-smoke.md`
- `docs/production-readiness-checklist.md`
- TKEN developer hub: https://www.tken.shop/developers/?utm_source=github&utm_medium=developer_repo&utm_campaign=tken_github_v190&utm_content=vercel_ai_sdk&utm_id=gh_v190

