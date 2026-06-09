# Smoke Evidence Runner

Use `tools/smoke-evidence.mjs` when you need a safe artifact for an issue, rollout note, release checklist, or team handoff after testing a TKEN-compatible endpoint.

It records status, latency, model discovery, selected model, failure class, and shape-level chat evidence without storing API keys, bearer tokens, private prompt text, full response text, or provider account data.

## Quick Start

```bash
export TKEN_API_KEY="sk-your-tken-key"
export TKEN_BASE_URL="https://www.tken.shop/v1"
export TKEN_MODEL="replace-with-an-available-model"

node tools/smoke-evidence.mjs \
  --base-url "$TKEN_BASE_URL" \
  --api-key-env TKEN_API_KEY \
  --model "$TKEN_MODEL" \
  --out smoke-evidence.md
```

PowerShell:

```powershell
$env:TKEN_API_KEY="sk-your-tken-key"
$env:TKEN_BASE_URL="https://www.tken.shop/v1"
$env:TKEN_MODEL="replace-with-an-available-model"

node tools/smoke-evidence.mjs `
  --base-url $env:TKEN_BASE_URL `
  --api-key-env TKEN_API_KEY `
  --model $env:TKEN_MODEL `
  --out smoke-evidence.md
```

## Common Runs

Models-only evidence:

```bash
node tools/smoke-evidence.mjs --skip-chat --out models-evidence.md
```

Machine-readable evidence:

```bash
node tools/smoke-evidence.mjs --format json --out smoke-evidence.json
```

Offline sample for testing the renderer without an API key:

```bash
node tools/smoke-evidence.mjs --sample --json
```

## What The Evidence Contains

| Field | Purpose |
| --- | --- |
| `baseUrl` | Confirms the OpenAI-compatible endpoint, usually ending in `/v1`. |
| `apiKeyEnv` | Shows which environment variable supplied the key without printing the key. |
| `modelCount` | Confirms `/models` returned usable model IDs. |
| `sampleModelIds` | Gives a short list of model IDs for follow-up selection. |
| `selectedModel` | Records the model used for chat, or the auto-selected first model. |
| `durationMs` | Gives rough latency evidence per request. |
| `failureClass` | Maps common failures such as `auth`, `base_url_or_route`, `rate_or_quota`, `timeout`, and `upstream_or_gateway`. |
| `choiceCount`, `finishReason`, `usagePresent` | Confirms chat response shape without storing generated text. |

## Redaction Rules

The runner does not store or print:

- API keys.
- Bearer tokens.
- Prompt text.
- Full response text.
- Provider account screens or usage records.

Error previews are truncated and redacted for key-like values, bearer tokens, long account/user/order/project/request/trace/customer IDs, and long opaque identifiers.

## Suggested Rollout Flow

1. Run `GET /models` evidence first with `--skip-chat`.
2. Choose a model ID from `sampleModelIds`.
3. Run one non-streaming `POST /chat/completions` evidence check.
4. Paste the Markdown evidence into your issue, rollout note, or internal approval record.
5. Use JSON evidence for automation or comparison across environments.

## Disclosure

TKEN is an independent third-party OpenAI-compatible API gateway and is not officially affiliated with OpenAI or other model providers.
