# Tool Integration Guide

Use this guide when you want to point an OpenAI-compatible tool, agent, or UI at TKEN.

The common pattern is:

1. Keep the API key server-side or in a local secret store.
2. Set the base URL to `https://www.tken.shop/v1`.
3. Call `/v1/models` before choosing a model ID.
4. Run one non-streaming chat completion.
5. Add timeouts, retries, logging, and budget controls before production use.

Disclosure: TKEN is an independent third-party API gateway and is not officially affiliated with model providers.

## Open WebUI

Use a server-side environment file or deployment secret:

```env
OPENAI_API_BASE_URL=https://www.tken.shop/v1
OPENAI_API_KEY=sk-your-tken-key
```

Before starting Open WebUI, check a model ID:

```bash
curl "$OPENAI_API_BASE_URL/models" \
  -H "Authorization: Bearer $OPENAI_API_KEY"
```

Then set the default model to an ID returned by `/v1/models`.

## LiteLLM

Example config:

```yaml
model_list:
  - model_name: tken-model
    litellm_params:
      model: openai/replace-with-an-available-model
      api_key: os.environ/TKEN_API_KEY
      api_base: https://www.tken.shop/v1

general_settings:
  master_key: os.environ/LITELLM_MASTER_KEY
```

Run a low-volume test route first. Add LiteLLM budget, retry, and logging settings before connecting shared team traffic.

## Cursor

Use a custom OpenAI-compatible endpoint if your Cursor version supports one:

```text
Base URL: https://www.tken.shop/v1
API key: use a local TKEN key
Model: choose a model returned by /v1/models
```

Run a small prompt before enabling agentic coding workflows. Keep a separate low-limit key for experiments.

## Continue

Example `config.json` style entry:

```json
{
  "models": [
    {
      "title": "TKEN OpenAI-compatible",
      "provider": "openai",
      "model": "replace-with-an-available-model",
      "apiBase": "https://www.tken.shop/v1",
      "apiKey": "YOUR_TKEN_API_KEY"
    }
  ]
}
```

For team use, inject the key through a secret manager or environment variable instead of storing it in config files.

## Codex-Style Agent Config

Use a provider block like:

```json
{
  "provider": "tken",
  "base_url": "https://www.tken.shop/v1",
  "api_key_env": "TKEN_API_KEY",
  "models": {
    "default": "free-model",
    "premium": "premium-gpt"
  }
}
```

Keep route names stable in your application, then map them to model IDs after checking `/v1/models`.

## Preflight Checklist

Run these before any tool gets production traffic:

- `/v1/models` returns usable model IDs.
- One non-streaming chat completion succeeds.
- The tool does not expose API keys in browser JavaScript, logs, screenshots, or issue reports.
- Timeouts are configured.
- Retries have a cap and backoff.
- 401, 404, 429, and 5xx errors are logged with enough detail to debug.
- Daily spend or token limits exist for agentic and batch workflows.

## Related Site Guides

- Developer hub: https://www.tken.shop/developers/?utm_source=github&utm_medium=developer_repo&utm_campaign=tken_dev_assets&utm_content=tool_integration
- Open WebUI guide: https://www.tken.shop/openwebui-openai-compatible-api/?utm_source=github&utm_medium=developer_repo&utm_campaign=tken_dev_assets&utm_content=tool_integration
- LiteLLM guide: https://www.tken.shop/litellm-openai-compatible-gateway/?utm_source=github&utm_medium=developer_repo&utm_campaign=tken_dev_assets&utm_content=tool_integration
- Cursor guide: https://www.tken.shop/cursor-openai-compatible-base-url/?utm_source=github&utm_medium=developer_repo&utm_campaign=tken_dev_assets&utm_content=tool_integration
- Continue guide: https://www.tken.shop/continue-openai-compatible-api/?utm_source=github&utm_medium=developer_repo&utm_campaign=tken_dev_assets&utm_content=tool_integration
