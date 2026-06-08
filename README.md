# TKEN OpenAI-Compatible Gateway Examples

TKEN is an independent OpenAI-compatible API gateway for developers who want to test multiple model families from one base URL:

```text
https://www.tken.shop/v1
```

This repository shows how to point common SDKs and developer tools at the TKEN endpoint without storing API keys in source control.

Disclosure: TKEN is an independent third-party API gateway. It is not officially affiliated with OpenAI, Anthropic, DeepSeek, MiniMax, Alibaba, Google, xAI, or other model providers. Model availability, pricing, context limits, streaming behavior, tool support, and rate limits can vary by account, channel, and provider status.

## Quick Links

- Developer hub: https://www.tken.shop/developers/?utm_source=github&utm_medium=developer_repo&utm_campaign=tken_dev_assets&utm_content=readme_developer_hub
- Quickstart: https://www.tken.shop/quickstart/?utm_source=github&utm_medium=developer_repo&utm_campaign=tken_dev_assets&utm_content=readme_quickstart
- OpenAI SDK base URL: https://www.tken.shop/openai-sdk-base-url/?utm_source=github&utm_medium=developer_repo&utm_campaign=tken_dev_assets&utm_content=readme_openai_sdk
- Open WebUI setup: https://www.tken.shop/openwebui-openai-compatible-api/?utm_source=github&utm_medium=developer_repo&utm_campaign=tken_dev_assets&utm_content=readme_openwebui
- LiteLLM setup: https://www.tken.shop/litellm-openai-compatible-gateway/?utm_source=github&utm_medium=developer_repo&utm_campaign=tken_dev_assets&utm_content=readme_litellm
- Cost guardrails: https://www.tken.shop/llm-cost-guardrails/?utm_source=github&utm_medium=developer_repo&utm_campaign=tken_dev_assets&utm_content=readme_cost_guardrails

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
| Browser/Web UI config | `examples/web-ui-config.js` |

## Tool Configs

| Tool | File |
| --- | --- |
| Open WebUI | `configs/openwebui.env.example` |
| LiteLLM | `configs/litellm-config.yaml` |
| Cursor and Continue | `configs/cursor-continue-config.md` |
| Codex-style config | `configs/codex.tken.json` |
| OpenClaw-style config | `configs/openclaw.tken.json` |

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

## Safety Notes

- Keep API keys server-side. Do not put TKEN keys in public browser JavaScript.
- Validate `/v1/models` before choosing a model ID.
- Test non-streaming before streaming.
- Add retries and timeouts before sending production traffic.
- Add budget and usage limits before connecting automated agents.
