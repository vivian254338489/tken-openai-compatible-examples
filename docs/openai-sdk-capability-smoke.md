# OpenAI SDK Capability Smoke Tests

Use this guide after the basic `/v1/models` and non-streaming chat checks pass. It helps you verify the SDK features that most often fail later in rollout: streaming, JSON-mode responses, and tool calls.

TKEN exposes an OpenAI-compatible base URL:

```text
https://www.tken.shop/v1
```

Disclosure: TKEN is an independent third-party API gateway. It is not officially affiliated with OpenAI or other model providers. Feature behavior can vary by selected model, provider route, account limits, and current provider status.

## When To Use This

Run these checks before you enable any of these features in an app:

- streaming chat output
- JSON-mode response parsing
- tool or function-call routing
- agents that depend on tool-call arguments
- production logging or dashboards that assume a specific response shape

Do not treat one successful basic chat completion as proof that every feature is available for every model.

## Environment

Set the same variables used by the basic examples:

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

Pick `TKEN_MODEL` from `/v1/models` first. Do not assume that a model ID from another provider is available or that it supports the same optional features.

## Node.js SDK Check

Install the OpenAI SDK if needed:

```bash
npm install openai
```

Run every capability check:

```bash
node examples/node-openai-sdk-capability-smoke.mjs
```

Run one mode at a time:

```bash
node examples/node-openai-sdk-capability-smoke.mjs stream
node examples/node-openai-sdk-capability-smoke.mjs json
node examples/node-openai-sdk-capability-smoke.mjs tools
```

You can also use:

```bash
TKEN_CAPABILITY_MODES="stream,json" node examples/node-openai-sdk-capability-smoke.mjs
```

## Python SDK Check

Install the OpenAI SDK if needed:

```bash
python -m pip install openai
```

Run every capability check:

```bash
python examples/python-openai-sdk-capability-smoke.py
```

Run one mode at a time:

```bash
python examples/python-openai-sdk-capability-smoke.py stream
python examples/python-openai-sdk-capability-smoke.py json
python examples/python-openai-sdk-capability-smoke.py tools
```

## What The Checks Verify

| Mode | Request Feature | Pass Signal | Common Failure |
| --- | --- | --- | --- |
| `stream` | `stream: true` / `stream=True` chat completions | At least one streamed content delta is returned | Endpoint or model does not stream, proxy buffers output, timeout too short |
| `json` | `response_format: {"type": "json_object"}` | The SDK returns parseable JSON content | Model ignores JSON instruction, selected route does not support JSON mode, response is plain text |
| `tools` | `tools` plus forced `tool_choice` | The response contains at least one `tool_calls` entry | Model does not support tools, route strips tool fields, argument JSON is malformed |

Feature failures are useful evidence. They do not always mean the gateway is down. They usually mean the chosen model, route, or provider capability needs a fallback path.

## Rollout Decision

Use this decision table after the checks:

| Result | Next Action |
| --- | --- |
| Basic chat passes, feature check fails | Keep the app on non-streaming chat for that route; try another model only after `/v1/models` confirms availability |
| Streaming passes, JSON fails | Stream plain text but do not wire strict JSON parsers to that model |
| JSON passes, tools fail | Use JSON output or app-side routing instead of tool-call dependent agents |
| Tools pass | Still run one end-to-end app workflow with low limits before enabling user-facing tool calls |
| Intermittent timeout or 429 | Reduce concurrency, increase timeout for pre-production only, and review usage limits before retry loops |

## Safe Evidence Template

When filing an issue or sharing results internally, include:

```text
Base URL: https://www.tken.shop/v1
SDK: Node.js openai or Python openai
Script: examples/node-openai-sdk-capability-smoke.mjs
Mode: stream | json | tools
Model ID: redacted-or-non-sensitive model id from /v1/models
HTTP status or SDK error class: ...
Sanitized output shape: ...
What worked before this check: /models, non-streaming chat, etc.
```

Never include API keys, account IDs, provider dashboard screenshots, private prompts, customer data, or usage records.

## Related Guides

- `docs/endpoint-preflight-playbook.md`
- `docs/sdk-migration-guide.md`
- `docs/compatibility-checklist.md`
- `docs/production-readiness-checklist.md`
- OpenAI SDK base URL guide: https://www.tken.shop/openai-sdk-base-url/?utm_source=github&utm_medium=developer_repo&utm_campaign=tken_github_v180&utm_content=sdk_capability_smoke&utm_id=gh_v180
