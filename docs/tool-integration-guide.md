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

Cursor's public API key documentation currently focuses on supported provider API keys. It notes that custom API keys work for standard chat models and that specialized features such as Tab Completion continue using Cursor's built-in models.

Use a TKEN endpoint only if your installed Cursor version exposes a compatible custom base URL or OpenAI-compatible endpoint setting:

```text
Base URL: https://www.tken.shop/v1
API key: use a local TKEN key
Model: choose a model returned by /v1/models
```

Run a small prompt before enabling agentic coding workflows. Keep a separate low-limit key for experiments. If your Cursor build does not expose a custom base URL, use Continue, LiteLLM, or another host that explicitly supports OpenAI-compatible `apiBase` settings.

## Continue

Example `config.yaml` entry:

```yaml
name: TKEN Continue
version: 0.0.1
schema: v1

models:
  - name: TKEN Chat
    provider: openai
    model: replace-with-an-available-model
    apiBase: https://www.tken.shop/v1
    apiKey: ${{ secrets.TKEN_API_KEY }}
    roles:
      - chat
      - edit
      - apply
```

Continue's current config docs describe `config.yaml`, the OpenAI provider, `apiBase` for OpenAI-compatible providers, model roles, and secret references. For team use, inject the key through secrets or environment variables instead of storing it in config files.

For a focused coding-tool migration flow, see `docs/continue-cursor-coding-tools.md`.

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

- Developer hub: https://www.tken.shop/developers/?utm_source=github&utm_medium=developer_repo&utm_campaign=tken_github_v070&utm_content=tool_integration&utm_id=gh_v070
- Open WebUI guide: https://www.tken.shop/openwebui-openai-compatible-api/?utm_source=github&utm_medium=developer_repo&utm_campaign=tken_github_v070&utm_content=tool_integration&utm_id=gh_v070
- LiteLLM guide: https://www.tken.shop/litellm-openai-compatible-gateway/?utm_source=github&utm_medium=developer_repo&utm_campaign=tken_github_v070&utm_content=tool_integration&utm_id=gh_v070
- Cursor guide: https://www.tken.shop/cursor-openai-compatible-base-url/?utm_source=github&utm_medium=developer_repo&utm_campaign=tken_github_v070&utm_content=tool_integration&utm_id=gh_v070
- Continue guide: https://www.tken.shop/continue-openai-compatible-api/?utm_source=github&utm_medium=developer_repo&utm_campaign=tken_github_v070&utm_content=tool_integration&utm_id=gh_v070

For agent and MCP-capable host setup, also see `docs/agent-mcp-gateway-preflight.md`.
