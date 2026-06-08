# GitHub Actions Endpoint Smoke Tests

This guide shows how to run a manual GitHub Actions smoke test for TKEN or another OpenAI-compatible endpoint before wiring it into production code.

The workflow in `.github/workflows/tken-endpoint-smoke.yml` is intentionally manual only. It does not run on push, pull requests, or schedules. A maintainer must trigger it from GitHub Actions after adding a low-limit test key as a repository secret.

Disclosure: TKEN is an independent third-party API gateway. It is not officially affiliated with OpenAI or other model providers. Model availability, pricing, context limits, streaming behavior, tool support, and rate limits can vary by account, channel, and provider status.

## What It Checks

Default run:

- `GET /v1/models`
- model ID discovery
- JSON output suitable for CI logs
- timeout behavior
- no API key printing

Optional chat run:

- one non-streaming `POST /v1/chat/completions`
- selected model ID from the input or first `/models` result
- basic response-shape preview without printing secrets

The default `run_chat` input is `false` so teams can confirm endpoint reachability before spending completion tokens.

## Workflow Inputs

| Input | Default | Purpose |
| --- | --- | --- |
| `base_url` | `https://www.tken.shop/v1` | OpenAI-compatible base URL to test. |
| `model` | empty | Optional model ID. If empty, the tester uses the first `/models` result. |
| `run_chat` | `false` | Whether to run one non-streaming chat completion. |
| `timeout_ms` | `20000` | Per-request timeout in milliseconds. |

## Required Secret

Create a repository secret named:

```text
TKEN_API_KEY
```

Use a low-limit test key. Do not commit real API keys to workflow YAML, README files, screenshots, or issue comments.

The workflow exposes the secret only as an environment variable:

```yaml
env:
  TKEN_API_KEY: ${{ secrets.TKEN_API_KEY }}
```

The CLI reads the key from `TKEN_API_KEY` and never prints it.

## Suggested Rollout

1. Run the workflow with `run_chat=false`.
2. Confirm `/models` returns at least one model ID.
3. Run again with a known model ID and `run_chat=true`.
4. Keep the timeout strict enough to catch endpoint regressions.
5. Store the GitHub Actions run URL in your deployment notes.
6. Rotate the test key if logs, screenshots, or issue comments ever expose sensitive account context.

## Failure Map

| Symptom | Likely Cause | First Check |
| --- | --- | --- |
| `Missing TKEN_API_KEY repository secret` | Secret is absent or named differently. | Confirm the repository secret name is exactly `TKEN_API_KEY`. |
| `/models failed with HTTP 401` | Invalid, expired, or unauthorized key. | Test locally with the same low-limit key. |
| `/models failed with HTTP 404` | Wrong base URL or missing `/v1`. | Confirm `base_url` ends in `/v1`. |
| `No model specified and /models did not return a model id` | Empty model list. | Check account access and current provider availability. |
| `/chat/completions failed with HTTP 404` | Selected model ID is not available for chat completions. | Use a model ID returned by `/models` and confirm it supports chat. |
| Request timeout | Endpoint, network, or upstream latency. | Increase `timeout_ms` only after checking status and retries. |

## Security Notes

- Keep API keys server-side and in secrets only.
- Prefer low-limit test keys for CI checks.
- Do not use production customer prompts in CI.
- Redact account IDs, usage records, private prompts, and provider account screens in artifacts.
- Avoid scheduled endpoint checks until spend limits, alerting, and failure ownership are clear.

## Local Equivalent

Run the same tester locally when debugging a failed workflow:

```bash
export TKEN_API_KEY="sk-your-tken-key"
export TKEN_BASE_URL="https://www.tken.shop/v1"
export TKEN_MODEL="replace-with-an-available-model"

node tools/endpoint-tester.mjs \
  --base-url "$TKEN_BASE_URL" \
  --api-key-env TKEN_API_KEY \
  --model "$TKEN_MODEL" \
  --json
```

For a reachability-only run:

```bash
node tools/endpoint-tester.mjs \
  --base-url "$TKEN_BASE_URL" \
  --api-key-env TKEN_API_KEY \
  --skip-chat \
  --json
```
