# Endpoint Preflight Playbook

Use this playbook before pointing an SDK, agent host, proxy, or UI at TKEN or another OpenAI-compatible base URL.

The goal is to prove the endpoint, key, model list, selected model, and basic response shape with the smallest safe request set.

Disclosure: TKEN is an independent third-party API gateway. It is not officially affiliated with OpenAI or other model providers. Model availability, pricing, context limits, streaming behavior, tool support, and rate limits can vary by account, channel, and provider status.

## What To Prove First

| Proof | Why It Matters | Evidence To Save |
| --- | --- | --- |
| Base URL includes `/v1` | Avoids 404s from using a homepage or dashboard URL | `baseUrl` value, without keys |
| API key is loaded from an env var | Keeps secrets out of source, shell history, and screenshots | env var name only, such as `TKEN_API_KEY` |
| `/models` returns IDs | Confirms account access and discoverable model names | status, model count, 3-5 sample IDs |
| Selected model came from `/models` | Prevents stale marketing names or unavailable IDs | selected model ID |
| One non-streaming chat works | Confirms request shape before streaming or agents | status, latency, redacted preview |
| Failure class is understood | Keeps debugging focused | 401, 404, empty list, 429, timeout, 5xx, or parse error |

Do not save or share API keys, account IDs, order IDs, usage records, private prompts, provider account screens, or full response bodies from sensitive tests.

## Baseline Environment

Bash:

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

Use a low-limit test key when possible.

## Step 1: Check `/models` Only

Run the lowest-cost reachability check first:

```bash
node tools/endpoint-tester.mjs \
  --base-url "$TKEN_BASE_URL" \
  --api-key-env TKEN_API_KEY \
  --skip-chat \
  --json
```

PowerShell:

```powershell
node tools/endpoint-tester.mjs `
  --base-url $env:TKEN_BASE_URL `
  --api-key-env TKEN_API_KEY `
  --skip-chat `
  --json
```

Expected result shape:

```json
{
  "baseUrl": "https://www.tken.shop/v1",
  "apiKeyEnv": "TKEN_API_KEY",
  "models": {
    "ok": true,
    "status": 200,
    "count": 3,
    "sampleIds": ["example-model-id"]
  },
  "chat": null,
  "selectedModel": "example-model-id"
}
```

Treat `count: 0` as a rollout blocker unless the account is intentionally limited.

## Step 2: Select A Returned Model ID

Choose a model ID from `models.sampleIds` or from the full `/models` response.

Do not hard-code a name copied from marketing copy, a provider website, or another account. Model IDs can vary by account, channel, provider status, and release timing.

Store the selected model in an environment variable:

```bash
export TKEN_MODEL="model-id-from-models"
```

PowerShell:

```powershell
$env:TKEN_MODEL="model-id-from-models"
```

## Step 3: Run One Non-Streaming Chat

Run one small chat request before testing streaming, JSON output, tool calls, embeddings, agent loops, or UI rollout:

```bash
node tools/endpoint-tester.mjs \
  --base-url "$TKEN_BASE_URL" \
  --api-key-env TKEN_API_KEY \
  --model "$TKEN_MODEL" \
  --json
```

PowerShell:

```powershell
node tools/endpoint-tester.mjs `
  --base-url $env:TKEN_BASE_URL `
  --api-key-env TKEN_API_KEY `
  --model $env:TKEN_MODEL `
  --json
```

Optional stricter timeout:

```bash
node tools/endpoint-tester.mjs \
  --base-url "$TKEN_BASE_URL" \
  --api-key-env TKEN_API_KEY \
  --model "$TKEN_MODEL" \
  --timeout-ms 10000 \
  --json
```

Expected success:

```json
{
  "models": {
    "ok": true,
    "status": 200
  },
  "selectedModel": "model-id-from-models",
  "chat": {
    "ok": true,
    "status": 200,
    "preview": "Short response preview"
  }
}
```

The preview is for shape validation only. Do not use private prompts or paste sensitive output into issue reports.

## Failure Classes

| Class | What It Usually Means | First Action |
| --- | --- | --- |
| Missing key env var | The shell or process cannot read the key | Set `TKEN_API_KEY` in the same terminal or CI job |
| 401 | Missing, expired, invalid, or unauthorized key | Verify key scope with a low-limit test key |
| 404 on `/models` | Wrong base URL, often missing `/v1` | Use `https://www.tken.shop/v1` as the base URL |
| Empty model list | Account access, provider availability, or channel restriction | Check account access before choosing a model |
| Model not found | Selected model was not returned by `/models` | Copy a current returned model ID |
| 429 or quota | Rate limit, balance, usage cap, or concurrency limit | Reduce concurrency and check account limits |
| Timeout | Network, endpoint, or upstream latency | Test `/models`, then a simpler prompt, then review timeouts |
| 5xx | Upstream or gateway service error | Retry later with backoff and save the redacted status evidence |
| Non-JSON or parse mismatch | Endpoint returned an unexpected body shape | Capture status and a short redacted preview |

## Safe Evidence Template

Use this template for issue reports, internal rollout notes, or handoff docs:

```text
Base URL: https://www.tken.shop/v1
Tool: node tools/endpoint-tester.mjs
API key handling: TKEN_API_KEY env var, key not printed
/models status: 200
Model count: 3
Sample model IDs: example-model-a, example-model-b
Selected model: example-model-a
Chat status: 200
Timeout: 20000 ms
Failure class: none
Preview: redacted or one non-sensitive sentence
Notes: no account IDs, usage records, private prompts, or provider screens included
```

For failures:

```text
Base URL: https://www.tken.shop/v1
Tool: node tools/endpoint-tester.mjs
API key handling: TKEN_API_KEY env var, key not printed
/models status: 404
Chat status: not run
Failure class: wrong base URL or missing /v1
Redacted error preview: HTTP 404 from /models
Next check: confirm the configured base URL ends in /v1
```

## Rollout Gate

Do not connect production user traffic until these are true:

- `/models` succeeds with the deployment key.
- The selected model ID was returned by `/models`.
- One non-streaming chat completion succeeds.
- The app has request timeouts, retry caps, token caps, and error logging.
- Logs and screenshots redact keys, account IDs, private prompts, usage records, and provider account screens.
- Spend limits, owner alerts, and rollback route maps are documented.

For the next stage, use `docs/production-readiness-checklist.md`.

## Related Guides

- `tools/README.md`
- `docs/compatibility-checklist.md`
- `docs/troubleshooting.md`
- `docs/ci-endpoint-smoke-tests.md`
- `docs/production-readiness-checklist.md`
