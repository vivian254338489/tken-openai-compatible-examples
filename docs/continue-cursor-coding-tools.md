# Continue and Cursor Coding Tool Setup

Use this guide when a coding assistant or IDE should call TKEN through an OpenAI-compatible model API.

TKEN fits at the model API layer:

```text
IDE or coding assistant -> OpenAI-compatible model client -> TKEN base URL
```

Disclosure: TKEN is an independent third-party API gateway and is not officially affiliated with Continue, Cursor, OpenAI, or other model providers.

## Official References Checked

- Continue documents `config.yaml`, the OpenAI provider, `apiBase` for OpenAI-compatible providers, model roles, and secret references: https://docs.continue.dev/customize/model-providers/top-level/openai and https://docs.continue.dev/reference
- Cursor documents bring-your-own provider API keys in Cursor Settings > Models, with custom API keys limited to standard chat models and specialized features continuing on built-in models: https://cursor.com/help/models-and-usage/api-keys

## Preflight First

Set the model API key outside source control:

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

Check model discovery:

```bash
curl "$TKEN_BASE_URL/models" \
  -H "Authorization: Bearer $TKEN_API_KEY"
```

Pick a model ID returned by `/v1/models`, then run one non-streaming chat completion:

```bash
curl "$TKEN_BASE_URL/chat/completions" \
  -H "Authorization: Bearer $TKEN_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "model": "'"$TKEN_MODEL"'",
    "messages": [{"role": "user", "content": "Reply with one short sentence."}]
  }'
```

Or use the repo tester:

```bash
node tools/endpoint-tester.mjs \
  --base-url "$TKEN_BASE_URL" \
  --api-key-env TKEN_API_KEY \
  --model "$TKEN_MODEL"
```

## Continue Setup

Start from `configs/continue-tken.config.yaml`:

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

Replace `replace-with-an-available-model` with a model ID returned by `/v1/models`.

For local secrets, Continue supports secret references such as `${{ secrets.TKEN_API_KEY }}`. Keep the real key in a workspace, Continue, global, or process environment secret location instead of committing it.

Before using Continue on a real repository:

- run a one-prompt chat test with no file edits
- confirm the selected model handles the `chat`, `edit`, and `apply` roles you plan to use
- keep autocomplete disabled unless you have tested latency and cost
- set request limits or use a low-limit TKEN key for first rollout
- redact prompts, source snippets, account IDs, and keys from bug reports

## Cursor Setup

Cursor's public API-key page currently documents supported provider keys rather than a stable generic OpenAI-compatible `apiBase` config for every installation.

Use TKEN in Cursor only when your installed Cursor version exposes a compatible custom endpoint or base URL setting:

```text
Base URL: https://www.tken.shop/v1
API key: use a local TKEN key
Model: choose a model returned by /v1/models
```

Then:

1. verify the key in Cursor
2. run one short chat request
3. keep agentic coding off until the chat request succeeds
4. test on a disposable repository before a production codebase
5. keep a separate low-limit key for coding-tool experiments

If your Cursor build only accepts direct provider keys and does not expose a base URL override, use Continue or LiteLLM for the OpenAI-compatible endpoint flow.

## Coding Tool Rollout Checklist

Before connecting a real codebase:

- `/v1/models` returned the selected model ID
- non-streaming chat worked outside the IDE
- the IDE reads the key from a secret or local setting, not from committed files
- the selected model route has daily spend or usage limits
- file-write or agent mode has a separate approval step
- logs and screenshots do not expose keys, account IDs, private prompts, or source code
- 401, 404, 429, timeout, and 5xx handling is understood before team rollout

## Related Site Guides

- Developer hub: https://www.tken.shop/developers/?utm_source=github&utm_medium=developer_repo&utm_campaign=tken_github_v100&utm_content=continue_cursor&utm_id=gh_v100
- Continue guide: https://www.tken.shop/continue-openai-compatible-api/?utm_source=github&utm_medium=developer_repo&utm_campaign=tken_github_v100&utm_content=continue_cursor&utm_id=gh_v100
- Cursor guide: https://www.tken.shop/cursor-openai-compatible-base-url/?utm_source=github&utm_medium=developer_repo&utm_campaign=tken_github_v100&utm_content=continue_cursor&utm_id=gh_v100
- OpenAI SDK base URL: https://www.tken.shop/openai-sdk-base-url/?utm_source=github&utm_medium=developer_repo&utm_campaign=tken_github_v100&utm_content=continue_cursor&utm_id=gh_v100
- Live pricing: https://www.tken.shop/pricing/?utm_source=github&utm_medium=developer_repo&utm_campaign=tken_github_v100&utm_content=continue_cursor&utm_id=gh_v100
