# Direct Open WebUI To TKEN Setup

Use this guide when you want Open WebUI to call TKEN directly as an OpenAI-compatible API gateway.

Recommended flow:

```text
Open WebUI -> TKEN base URL -> selected model route
```

For a personal or low-volume evaluation, direct setup is the fastest path. For shared teams, virtual keys, central budgets, or proxy-side routing, use `docs/openwebui-litellm-tken-stack.md` instead.

Disclosure: TKEN is an independent third-party API gateway and is not officially affiliated with Open WebUI, OpenAI, or other model providers.

## Current Open WebUI Behavior Checked

References checked on 2026-06-09:

- Open WebUI's OpenAI-compatible provider guide says to add a provider from Admin Settings -> Connections -> OpenAI, enter the provider URL and API key, and add Model IDs manually if `/models` discovery is not available: https://docs.openwebui.com/getting-started/quick-start/connect-a-provider/starting-with-openai-compatible/
- Open WebUI's environment reference documents `OPENAI_API_BASE_URL`, `OPENAI_API_BASE_URLS`, `OPENAI_API_KEY`, `OPENAI_API_KEYS`, `DEFAULT_MODELS`, and `TASK_MODEL_EXTERNAL`: https://docs.openwebui.com/reference/env-configuration/
- The same reference warns that OpenAI-compatible backends and proxies should use least-privilege keys for regular user traffic and avoid management or master keys unless that trust level is required.

## Files In This Repo

| Purpose | File |
| --- | --- |
| Direct Open WebUI environment template | `configs/openwebui-direct-tken.env.example` |
| Existing minimal Open WebUI template | `configs/openwebui.env.example` |
| Open WebUI behind LiteLLM guide | `docs/openwebui-litellm-tken-stack.md` |
| Open WebUI behind LiteLLM environment template | `configs/openwebui-litellm.env.example` |
| Endpoint tester | `tools/endpoint-tester.mjs` |

## Step 1: Check TKEN Before Opening The UI

Set the key locally. Do not commit real API keys.

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

Pick one model ID returned by `/v1/models`, then run one non-streaming chat completion:

```bash
curl "$TKEN_BASE_URL/chat/completions" \
  -H "Authorization: Bearer $TKEN_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "model": "replace-with-an-available-model",
    "messages": [{"role": "user", "content": "Reply with one short sentence."}]
  }'
```

If this direct curl check fails, fix the key, base URL, model ID, or account limits before changing Open WebUI settings.

## Step 2: Configure Open WebUI From The Admin UI

In Open WebUI:

1. Open Admin Settings.
2. Open Connections.
3. Open the OpenAI connection area.
4. Add a connection.
5. Set URL to:

```text
https://www.tken.shop/v1
```

6. Set API Key to a limited TKEN key.
7. Save and verify the connection.
8. If model discovery is noisy or incomplete, add only the model IDs you want users to see in Model IDs (Filter).

Do not paste API keys into screenshots, issue reports, public chat logs, or browser JavaScript.

## Step 3: Configure Open WebUI From Environment Variables

Use `configs/openwebui-direct-tken.env.example` as the starting point:

```env
ENABLE_OPENAI_API=True
OPENAI_API_BASE_URL=https://www.tken.shop/v1
OPENAI_API_KEY=sk-your-tken-key

# Optional after /v1/models returns the route you want as the default.
# DEFAULT_MODELS=replace-with-an-available-model
# TASK_MODEL_EXTERNAL=replace-with-a-fast-low-cost-model
```

If you run multiple OpenAI-compatible backends, Open WebUI also documents semicolon-separated `OPENAI_API_BASE_URLS` and `OPENAI_API_KEYS`. Keep route ownership clear if you use multiple URLs, because a wrong key-to-URL pairing creates confusing 401 or model errors.

## Docker Notes

For direct TKEN setup, keep the base URL as:

```text
https://www.tken.shop/v1
```

The `host.docker.internal` substitution in Open WebUI docs is for local providers running on the Docker host. TKEN is a remote HTTPS endpoint, so it does not need that host substitution.

## Preflight Checklist

Before shared users or automated workflows use Open WebUI through TKEN, confirm:

- `/v1/models` succeeds with the same key that Open WebUI will use.
- One non-streaming chat completion succeeds before streaming is tested.
- The selected model ID is visible in Open WebUI or explicitly added to Model IDs (Filter).
- The key is limited for UI traffic and is not a provider management key.
- `ENABLE_OPENAI_API_PASSTHROUGH` stays disabled unless you have a specific, reviewed need for upstream passthrough.
- Logs, screenshots, issue reports, and demos do not expose API keys, account IDs, usage records, or private prompts.
- Token caps, timeout expectations, and a daily spend stop are defined before agentic or batch use.

## Failure Map

| Symptom | Likely cause | Check |
| --- | --- | --- |
| No models appear | `/v1/models` failed or model filtering is too strict | run the curl `/models` check with the same key |
| 401 from Open WebUI | missing, expired, or wrong TKEN key | compare the Open WebUI key with the key used in curl |
| 404 or model not found | placeholder model ID or stale model route | refresh `/v1/models` and update the selected model ID |
| Chat works but streaming fails | streaming was not separately validated | keep non-streaming as the first gate, then test streaming at low volume |
| Costs rise unexpectedly | no default model, token cap, or usage limit | add a lower-cost task model, token caps, and daily stops |
| Users can reach unexpected upstream paths | passthrough enabled without access-control review | keep `ENABLE_OPENAI_API_PASSTHROUGH` disabled |

## Related Site Guides

- Developer hub: https://www.tken.shop/developers/?utm_source=github&utm_medium=developer_repo&utm_campaign=tken_github_v130&utm_content=openwebui_direct_tken&utm_id=gh_v130
- Open WebUI setup: https://www.tken.shop/openwebui-openai-compatible-api/?utm_source=github&utm_medium=developer_repo&utm_campaign=tken_github_v130&utm_content=openwebui_direct_tken&utm_id=gh_v130
- OpenAI SDK base URL: https://www.tken.shop/openai-sdk-base-url/?utm_source=github&utm_medium=developer_repo&utm_campaign=tken_github_v130&utm_content=openwebui_direct_tken&utm_id=gh_v130
- Cost guardrails: https://www.tken.shop/llm-cost-guardrails/?utm_source=github&utm_medium=developer_repo&utm_campaign=tken_github_v130&utm_content=openwebui_direct_tken&utm_id=gh_v130
- Live pricing: https://www.tken.shop/pricing/?utm_source=github&utm_medium=developer_repo&utm_campaign=tken_github_v130&utm_content=openwebui_direct_tken&utm_id=gh_v130
