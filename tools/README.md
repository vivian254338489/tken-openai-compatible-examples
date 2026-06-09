# OpenAI-Compatible Endpoint Tester

Use these CLIs to validate an OpenAI-compatible base URL before wiring it into an SDK, agent, proxy, or UI.

## Endpoint Tester

```bash
export TKEN_API_KEY="sk-your-tken-key"
export TKEN_BASE_URL="https://www.tken.shop/v1"
export TKEN_MODEL="replace-with-an-available-model"

node tools/endpoint-tester.mjs \
  --base-url "$TKEN_BASE_URL" \
  --api-key-env TKEN_API_KEY \
  --model "$TKEN_MODEL"
```

PowerShell:

```powershell
$env:TKEN_API_KEY="sk-your-tken-key"
$env:TKEN_BASE_URL="https://www.tken.shop/v1"
$env:TKEN_MODEL="replace-with-an-available-model"

node tools/endpoint-tester.mjs `
  --base-url $env:TKEN_BASE_URL `
  --api-key-env TKEN_API_KEY `
  --model $env:TKEN_MODEL
```

## Options

```text
--base-url <url>       OpenAI-compatible base URL. Defaults to TKEN_BASE_URL or https://www.tken.shop/v1.
--api-key-env <name>   Environment variable that contains the API key. Defaults to TKEN_API_KEY.
--model <id>           Model ID to test. If omitted, the first /models id is used.
--skip-chat            Check /models only.
--json                 Print machine-readable JSON.
--timeout-ms <number>  Per-request timeout. Defaults to 20000.
--prompt <text>        Chat test prompt.
--help                 Print help.
```

## Preflight Playbook

For a rollout-ready sequence, start with `../docs/endpoint-preflight-playbook.md`.

For no-code imports, use `../docs/api-client-collections.md` with the Postman or Bruno collections under `../collections/`.

Recommended order:

1. Confirm the base URL ends in `/v1`.
2. Run `/models` only with `--skip-chat --json`.
3. Choose a model ID returned by `/models`.
4. Run one non-streaming chat completion.
5. Save only redacted evidence: status, model count, selected model, timeout, failure class, and a non-sensitive preview.

## Security Notes

- The tester reads API keys from environment variables only.
- It does not store keys and does not print keys.
- Prefer a test key with low limits.
- Run `/models` before selecting a production model ID.
- Test non-streaming chat before streaming, tool calls, or agentic workflows.

## GitHub Actions

For a manual CI smoke test, see `../docs/ci-endpoint-smoke-tests.md` and `../.github/workflows/tken-endpoint-smoke.yml`.

The workflow is triggered with `workflow_dispatch`, reads `TKEN_API_KEY` from repository secrets, and defaults to a `/models`-only check unless `run_chat` is enabled.

## Smoke Evidence Runner

Use `smoke-evidence.mjs` when you need a redacted Markdown or JSON artifact for an issue, rollout note, release checklist, or team handoff.

```bash
node tools/smoke-evidence.mjs \
  --base-url "$TKEN_BASE_URL" \
  --api-key-env TKEN_API_KEY \
  --model "$TKEN_MODEL" \
  --out smoke-evidence.md
```

JSON:

```bash
node tools/smoke-evidence.mjs --format json --out smoke-evidence.json
```

Offline sample without an API key:

```bash
node tools/smoke-evidence.mjs --sample --json
```

The runner records status, latency, model discovery, selected model, failure class, and shape-level chat evidence. It does not store API keys, bearer tokens, private prompt text, or full response text.

For fields and redaction rules, see `../docs/smoke-evidence-runner.md`.
