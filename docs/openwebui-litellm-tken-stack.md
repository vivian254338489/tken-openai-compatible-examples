# Open WebUI + LiteLLM + TKEN Stack

Use this guide when Open WebUI should talk to LiteLLM, and LiteLLM should route requests to TKEN as an OpenAI-compatible model API gateway.

Recommended stack:

```text
Open WebUI -> LiteLLM proxy -> TKEN base URL -> selected model route
```

TKEN is the model API gateway in this stack. LiteLLM owns proxy-side routing, virtual keys, logging, budgets, and team access controls. Open WebUI owns the chat UI, user experience, and OpenAI-compatible connection settings.

Disclosure: TKEN is an independent third-party API gateway and is not officially affiliated with Open WebUI, LiteLLM, OpenAI, or other model providers.

## Why Put LiteLLM Between Open WebUI And TKEN

Use the direct Open WebUI-to-TKEN setup when you only need a personal UI test.

Add LiteLLM in the middle when you need:

- one Open WebUI connection shared by a team
- route names such as `tken-chat` instead of provider-specific model IDs in the UI
- a central place for retries, fallback rules, logging, and spend caps
- LiteLLM virtual keys instead of exposing the upstream TKEN key to every UI user
- a proxy endpoint that other internal tools can reuse

## Official References

- Open WebUI documents OpenAI-compatible provider setup through the Connections UI and notes that `/v1/models` is recommended for model discovery: https://docs.openwebui.com/getting-started/quick-start/connect-a-provider/starting-with-openai-compatible
- LiteLLM describes itself as an OpenAI-format gateway/proxy with support for virtual keys, spend management, routing, and an OpenAI-compatible proxy endpoint: https://github.com/BerriAI/litellm

## Files In This Repo

| Purpose | File |
| --- | --- |
| LiteLLM route config for TKEN | `configs/litellm-openwebui-tken.yaml` |
| LiteLLM virtual key and budget config | `configs/litellm-virtual-keys-tken.yaml` |
| Open WebUI environment example for calling LiteLLM | `configs/openwebui-litellm.env.example` |
| Generic LiteLLM config | `configs/litellm-config.yaml` |
| Direct Open WebUI config | `configs/openwebui.env.example` |
| Endpoint tester | `tools/endpoint-tester.mjs` |

## Step 1: Check TKEN Directly

Set the upstream key in the LiteLLM host or container environment. Do not store real keys in source control.

```bash
export TKEN_API_KEY="sk-your-tken-key"
export TKEN_BASE_URL="https://www.tken.shop/v1"
```

PowerShell:

```powershell
$env:TKEN_API_KEY="sk-your-tken-key"
$env:TKEN_BASE_URL="https://www.tken.shop/v1"
```

Confirm model discovery:

```bash
curl "$TKEN_BASE_URL/models" \
  -H "Authorization: Bearer $TKEN_API_KEY"
```

Pick a model ID returned by `/v1/models`, then put it in the LiteLLM config:

```yaml
model_list:
  - model_name: tken-chat
    litellm_params:
      model: openai/replace-with-an-available-model
      api_key: os.environ/TKEN_API_KEY
      api_base: https://www.tken.shop/v1
```

Use the `openai/` prefix so LiteLLM treats the upstream as an OpenAI-compatible provider.

## Step 2: Start LiteLLM

Use `configs/litellm-openwebui-tken.yaml` as the starting config.

If you need managed virtual keys, key-level budgets, or default key-generation limits, use `docs/litellm-virtual-keys-spend-control.md` and `configs/litellm-virtual-keys-tken.yaml` instead of the minimal route-only config.

```bash
export LITELLM_MASTER_KEY="replace-with-a-local-master-key"
litellm --config configs/litellm-openwebui-tken.yaml --port 4000
```

PowerShell:

```powershell
$env:LITELLM_MASTER_KEY="replace-with-a-local-master-key"
litellm --config configs/litellm-openwebui-tken.yaml --port 4000
```

Then verify the LiteLLM endpoint that Open WebUI will call:

```bash
curl "http://localhost:4000/v1/models" \
  -H "Authorization: Bearer $LITELLM_MASTER_KEY"
```

Run one non-streaming chat request before connecting users:

```bash
curl "http://localhost:4000/v1/chat/completions" \
  -H "Authorization: Bearer $LITELLM_MASTER_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "model": "tken-chat",
    "messages": [{"role": "user", "content": "Reply with one short sentence."}]
  }'
```

## Step 3: Connect Open WebUI To LiteLLM

In Open WebUI:

1. Open Admin Settings.
2. Open Connections.
3. Add an OpenAI-compatible connection.
4. Set the URL to the LiteLLM proxy endpoint.
5. Set the API key to the LiteLLM master key or a LiteLLM virtual key.
6. If model discovery does not show `tken-chat`, add `tken-chat` to the model allowlist.

Use this URL when Open WebUI runs on the same host as LiteLLM:

```text
http://localhost:4000/v1
```

Use this URL when Open WebUI runs in Docker and LiteLLM runs on the host:

```text
http://host.docker.internal:4000/v1
```

Use this URL when Open WebUI and LiteLLM are services on the same Docker network:

```text
http://litellm:4000/v1
```

If you prefer environment variables, start from `configs/openwebui-litellm.env.example`.

## Pre-Production Checklist

Before shared users or automated workflows use the stack, confirm:

- Open WebUI cannot read the upstream `TKEN_API_KEY`.
- Open WebUI users receive LiteLLM virtual keys or a limited shared key, not the upstream key.
- `tken-chat` maps to a model ID returned by TKEN `/v1/models`.
- Non-streaming chat works through LiteLLM before streaming is enabled.
- LiteLLM logs do not store private prompts, keys, account IDs, or private tool results.
- Token caps, request timeouts, retry limits, and daily spend limits are set before agentic traffic.
- 401, 404, 429, and 5xx errors have a defined fallback or stop rule.

## Failure Map

| Symptom | Likely cause | Check |
| --- | --- | --- |
| Open WebUI shows no models | Open WebUI cannot reach LiteLLM or `/v1/models` is blocked | run `curl http://localhost:4000/v1/models` with the LiteLLM key |
| Open WebUI gets 401 | wrong LiteLLM master key or virtual key | verify the Open WebUI key matches the LiteLLM key used in curl |
| LiteLLM gets 401 upstream | missing or invalid `TKEN_API_KEY` | check the environment in the LiteLLM process |
| LiteLLM gets 404 or model not found | placeholder model was not replaced | refresh TKEN `/v1/models` and update `configs/litellm-openwebui-tken.yaml` |
| Chat works but streaming fails | streaming behavior was not separately tested | keep streaming off until a streaming smoke test passes |
| Costs rise unexpectedly | missing token, retry, or user limits | add max tokens, retry caps, user budgets, and daily stops |

## Related Site Guides

- Developer hub: https://www.tken.shop/developers/?utm_source=github&utm_medium=developer_repo&utm_campaign=tken_github_v090&utm_content=openwebui_litellm_stack&utm_id=gh_v090
- Open WebUI setup: https://www.tken.shop/openwebui-openai-compatible-api/?utm_source=github&utm_medium=developer_repo&utm_campaign=tken_github_v090&utm_content=openwebui_litellm_stack&utm_id=gh_v090
- LiteLLM setup: https://www.tken.shop/litellm-openai-compatible-gateway/?utm_source=github&utm_medium=developer_repo&utm_campaign=tken_github_v090&utm_content=openwebui_litellm_stack&utm_id=gh_v090
- Cost guardrails: https://www.tken.shop/llm-cost-guardrails/?utm_source=github&utm_medium=developer_repo&utm_campaign=tken_github_v090&utm_content=openwebui_litellm_stack&utm_id=gh_v090
- Live pricing: https://www.tken.shop/pricing/?utm_source=github&utm_medium=developer_repo&utm_campaign=tken_github_v090&utm_content=openwebui_litellm_stack&utm_id=gh_v090
