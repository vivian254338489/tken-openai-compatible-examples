# Migrate an OpenAI SDK App to TKEN

This guide shows the smallest useful migration path for an app that already uses OpenAI-style chat completions.

## 1. Keep Keys Out Of Source Control

Use environment variables:

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

Never commit real keys. Prefer a low-limit test key for first checks.

## 2. Validate `/models`

```bash
node tools/endpoint-tester.mjs --skip-chat
```

Pick a model ID returned by `/v1/models`. Do not assume that a model name from another provider is available under the same ID.

## 3. Switch Node.js OpenAI SDK

```js
import OpenAI from "openai";

const client = new OpenAI({
  apiKey: process.env.TKEN_API_KEY,
  baseURL: process.env.TKEN_BASE_URL || "https://www.tken.shop/v1",
});

const completion = await client.chat.completions.create({
  model: process.env.TKEN_MODEL,
  messages: [{ role: "user", content: "Reply with one short sentence." }],
});

console.log(completion.choices[0]?.message?.content);
```

Full example: `examples/node-openai-sdk.mjs`.

## 4. Switch Python OpenAI SDK

```python
import os
from openai import OpenAI

client = OpenAI(
    api_key=os.environ["TKEN_API_KEY"],
    base_url=os.environ.get("TKEN_BASE_URL", "https://www.tken.shop/v1"),
)

completion = client.chat.completions.create(
    model=os.environ["TKEN_MODEL"],
    messages=[{"role": "user", "content": "Reply with one short sentence."}],
)

print(completion.choices[0].message.content)
```

Full example: `examples/python-openai-sdk.py`.

## 5. Roll Out Safely

- Start with non-streaming chat completions.
- Run `docs/openai-sdk-capability-smoke.md` before enabling streaming, JSON-mode parsers, or tool-call dependent agents.
- Log request IDs, model IDs, HTTP status, latency, and token usage when available.
- Add timeouts before using agentic tools or batch jobs.
- Add retry limits and backoff for transient 429 or 5xx responses.
- Put a daily spend or token cap in your application.
- Test streaming, structured output, tool calls, and embeddings separately.

## Related TKEN Guides

- OpenAI SDK base URL: https://www.tken.shop/openai-sdk-base-url/?utm_source=github&utm_medium=developer_repo&utm_campaign=tken_github_v070&utm_content=sdk_migration&utm_id=gh_v070
- Quickstart: https://www.tken.shop/quickstart/?utm_source=github&utm_medium=developer_repo&utm_campaign=tken_github_v070&utm_content=sdk_migration&utm_id=gh_v070
- Cost guardrails: https://www.tken.shop/llm-cost-guardrails/?utm_source=github&utm_medium=developer_repo&utm_campaign=tken_github_v070&utm_content=sdk_migration&utm_id=gh_v070

Disclosure: TKEN is an independent third-party API gateway and is not officially affiliated with model providers.
