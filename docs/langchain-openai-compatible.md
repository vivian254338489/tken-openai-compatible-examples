# LangChain With TKEN

Use this guide when a LangChain application needs an OpenAI-compatible chat model endpoint and you want to route it through TKEN.

TKEN base URL:

```text
https://www.tken.shop/v1
```

Disclosure: TKEN is an independent third-party API gateway. It is not officially affiliated with LangChain, OpenAI, or other model providers. LangChain's OpenAI wrappers target official OpenAI API shapes, so non-standard provider fields may not be preserved.

## Before You Change Chains Or Agents

1. Run `/v1/models` first.
2. Pick one model ID returned by TKEN.
3. Run one non-streaming chat completion.
4. Test streaming, tool calling, JSON parsing, embeddings, and agent behavior separately.

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

## JavaScript

Install:

```bash
npm install @langchain/openai
```

Minimal check:

```js
import { ChatOpenAI } from "@langchain/openai";

const model = new ChatOpenAI({
  apiKey: process.env.TKEN_API_KEY,
  model: process.env.TKEN_MODEL,
  temperature: 0,
  configuration: {
    baseURL: process.env.TKEN_BASE_URL || "https://www.tken.shop/v1",
  },
});

const response = await model.invoke("Reply with one short sentence.");
console.log(response.content);
```

Full runnable example: `examples/langchain-js-openai-compatible.mjs`.

## Python

Install:

```bash
python -m pip install -U langchain-openai
```

Minimal check:

```python
import os
from langchain_openai import ChatOpenAI

model = ChatOpenAI(
    api_key=os.environ["TKEN_API_KEY"],
    base_url=os.environ.get("TKEN_BASE_URL", "https://www.tken.shop/v1"),
    model=os.environ["TKEN_MODEL"],
    temperature=0,
)

response = model.invoke("Reply with one short sentence.")
print(response.content)
```

Full runnable example: `examples/langchain-python-openai-compatible.py`.

## Chain And Agent Guardrails

- Start with one direct `ChatOpenAI.invoke` call before using chains, tools, retrievers, or agents.
- Keep agent test keys low-limit until loop controls, logging, and rollback are proven.
- If a model route fails tool calls, do not use tool-dependent agents on that route.
- If structured output fails, validate JSON in the application or choose another tested route.
- Do not rely on non-standard response fields unless you have tested that the selected LangChain wrapper preserves them.
- Redact keys, account IDs, private prompts, usage records, and provider dashboard details from traces and issues.

## Failure Map

| Symptom | Likely Cause | Action |
| --- | --- | --- |
| 401 | Missing or wrong TKEN key | Recheck server environment and secret injection |
| 404 | Base URL missing `/v1` or wrong route | Use `https://www.tken.shop/v1` |
| Model not found | Chain uses a model ID not returned by TKEN | Pick from `/v1/models` |
| Tool agent stalls | Selected route does not support tool calls reliably | Use non-tool chain or tested tool-capable route |
| Extra provider fields missing | LangChain wrapper keeps official OpenAI-shaped fields | Use app-side raw SDK checks if you need non-standard fields |

## Related Guides

- `docs/endpoint-preflight-playbook.md`
- `docs/openai-sdk-capability-smoke.md`
- `docs/agent-mcp-gateway-preflight.md`
- `docs/production-readiness-checklist.md`
- TKEN developer hub: https://www.tken.shop/developers/?utm_source=github&utm_medium=developer_repo&utm_campaign=tken_github_v190&utm_content=langchain&utm_id=gh_v190

