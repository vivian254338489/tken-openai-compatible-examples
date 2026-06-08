# TKEN OpenAI-Compatible Gateway Examples

TKEN is an independent OpenAI-compatible API gateway for developers who want to test multiple model families from one base URL:

```text
https://www.tken.shop/v1
```

This repository shows how to point common SDKs and developer tools at the TKEN endpoint without storing API keys in source control.

Disclosure: TKEN is an independent third-party API gateway. It is not officially affiliated with OpenAI, Anthropic, DeepSeek, MiniMax, Alibaba, Google, xAI, or other model providers. Model availability, pricing, context limits, streaming behavior, tool support, and rate limits can vary by account, channel, and provider status.

## Quick Links

- Developer hub: https://www.tken.shop/developers/?utm_source=github&utm_medium=developer_repo&utm_campaign=tken_github_v070&utm_content=readme_developer_hub&utm_id=gh_v070
- Quickstart: https://www.tken.shop/quickstart/?utm_source=github&utm_medium=developer_repo&utm_campaign=tken_github_v070&utm_content=readme_quickstart&utm_id=gh_v070
- OpenAI SDK base URL: https://www.tken.shop/openai-sdk-base-url/?utm_source=github&utm_medium=developer_repo&utm_campaign=tken_github_v070&utm_content=readme_openai_sdk&utm_id=gh_v070
- Live pricing: https://www.tken.shop/pricing/?utm_source=github&utm_medium=developer_repo&utm_campaign=tken_github_v070&utm_content=readme_pricing&utm_id=gh_v070
- Open WebUI setup: https://www.tken.shop/openwebui-openai-compatible-api/?utm_source=github&utm_medium=developer_repo&utm_campaign=tken_github_v070&utm_content=readme_openwebui&utm_id=gh_v070
- LiteLLM setup: https://www.tken.shop/litellm-openai-compatible-gateway/?utm_source=github&utm_medium=developer_repo&utm_campaign=tken_github_v070&utm_content=readme_litellm&utm_id=gh_v070
- Cost guardrails: https://www.tken.shop/llm-cost-guardrails/?utm_source=github&utm_medium=developer_repo&utm_campaign=tken_github_v070&utm_content=readme_cost_guardrails&utm_id=gh_v070

## Local Guides

| Need | Guide |
| --- | --- |
| Evaluate an OpenAI-compatible gateway before adoption | `docs/api-gateway-evaluation.md` |
| Move an existing SDK app to a custom base URL | `docs/sdk-migration-guide.md` |
| Check endpoint behavior before launch | `docs/compatibility-checklist.md` |
| Debug 401, 404, model, quota, timeout, and CORS errors | `docs/troubleshooting.md` |
| Select model routes using current pricing and `/v1/models` | `docs/pricing-model-selection.md` |
| Add route-level model selection and spend controls | `docs/cost-guardrails.md` |
| Preflight TKEN for agent and MCP-capable workflows | `docs/agent-mcp-gateway-preflight.md` |
| Configure Open WebUI, LiteLLM, Cursor, Continue, and agents | `docs/tool-integration-guide.md` |
| Record a short demo or launch asset without exposing secrets | `docs/demo-script.md` |
| Share this repo transparently in communities | `docs/community-disclosure.md` |

## Environment

Set your key locally. Do not commit real API keys.

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

## Examples

| Example | File |
| --- | --- |
| curl chat completion | `examples/curl-chat.sh` |
| curl quickstart with `/models` check | `examples/curl-quickstart.sh` |
| Node.js no-dependency chat completion | `examples/node-chat.mjs` |
| Node.js OpenAI SDK chat completion | `examples/node-openai-sdk.mjs` |
| Python no-dependency chat completion | `examples/python-chat.py` |
| Python OpenAI SDK chat completion | `examples/python-openai-sdk.py` |
| Node.js `/models` and chat smoke test | `examples/smoke-test.mjs` |
| Cost-aware route-level model selection | `examples/model-router.mjs` |
| Reusable OpenAI-compatible endpoint tester | `tools/endpoint-tester.mjs` |
| Browser/Web UI config | `examples/web-ui-config.js` |

## Tool Configs

| Tool | File |
| --- | --- |
| Open WebUI | `configs/openwebui.env.example` |
| LiteLLM | `configs/litellm-config.yaml` |
| Cursor and Continue | `configs/cursor-continue-config.md` |
| Codex-style config | `configs/codex.tken.json` |
| OpenClaw-style config | `configs/openclaw.tken.json` |
| Agent gateway preflight profile | `configs/agent-gateway-preflight.json` |

For setup notes across these tools, see `docs/tool-integration-guide.md`. For agent and MCP-capable host preflight, see `docs/agent-mcp-gateway-preflight.md`.

## Smoke Test Without SDKs

```bash
curl "$TKEN_BASE_URL/models" \
  -H "Authorization: Bearer $TKEN_API_KEY"
```

```bash
curl "$TKEN_BASE_URL/chat/completions" \
  -H "Authorization: Bearer $TKEN_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "model": "'"$TKEN_MODEL"'",
    "messages": [{"role": "user", "content": "Reply with one short sentence."}]
  }'
```

## Endpoint Tester CLI

Use the reusable tester when you want a structured compatibility check before wiring an endpoint into an app:

```bash
node tools/endpoint-tester.mjs \
  --base-url "$TKEN_BASE_URL" \
  --api-key-env TKEN_API_KEY \
  --model "$TKEN_MODEL"
```

It checks:

- `GET /models`
- model ID discovery
- optional non-streaming `POST /chat/completions`
- timeout handling
- JSON output for CI or diagnostics

The tester reads API keys from environment variables only. It does not store keys or print keys.

## Node.js OpenAI SDK

Install:

```bash
npm install openai
```

Run:

```bash
node examples/node-openai-sdk.mjs
```

## Python OpenAI SDK

Install:

```bash
python -m pip install openai
```

Run:

```bash
python examples/python-openai-sdk.py
```

## Model Routing Pattern

Use local route names in your application:

```text
free-model    -> summaries, extraction, drafts, batch work
premium-gpt   -> coding, hard reasoning, final answers
```

Validate `/v1/models` before choosing a production model ID.

Example:

```bash
node examples/model-router.mjs fast "Summarize this request in one sentence."
```

Set `TKEN_MODEL_FAST`, `TKEN_MODEL_BALANCED`, or `TKEN_MODEL_REASONING` when you want route-specific model IDs.

## Safety Notes

- Keep API keys server-side. Do not put TKEN keys in public browser JavaScript.
- Prefer environment-variable key injection over command-line key arguments.
- Validate `/v1/models` before choosing a model ID.
- Test non-streaming before streaming.
- Add retries and timeouts before sending production traffic.
- Add budget and usage limits before connecting automated agents.
- Do not expose real keys, account identifiers, usage records, or private prompts in demos, issue reports, screenshots, or community posts.
