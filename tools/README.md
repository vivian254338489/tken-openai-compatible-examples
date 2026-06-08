# OpenAI-Compatible Endpoint Tester

Use this CLI to validate an OpenAI-compatible base URL before wiring it into an SDK, agent, proxy, or UI.

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

## Security Notes

- The tester reads API keys from environment variables only.
- It does not store keys and does not print keys.
- Prefer a test key with low limits.
- Run `/models` before selecting a production model ID.
- Test non-streaming chat before streaming, tool calls, or agentic workflows.

## GitHub Actions

For a manual CI smoke test, see `../docs/ci-endpoint-smoke-tests.md` and `../.github/workflows/tken-endpoint-smoke.yml`.

The workflow is triggered with `workflow_dispatch`, reads `TKEN_API_KEY` from repository secrets, and defaults to a `/models`-only check unless `run_chat` is enabled.
