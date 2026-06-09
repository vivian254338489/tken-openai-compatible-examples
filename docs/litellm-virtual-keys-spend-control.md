# LiteLLM Virtual Keys and Spend Control for TKEN

Use this guide when a team wants internal apps, Open WebUI, coding tools, or agents to call TKEN through LiteLLM without sharing the upstream TKEN key with every user.

Recommended stack:

```text
Apps, Open WebUI, or internal tools
  -> LiteLLM proxy virtual key
  -> LiteLLM route such as tken-chat
  -> TKEN base URL https://www.tken.shop/v1
```

TKEN is the upstream OpenAI-compatible model API gateway. LiteLLM owns proxy-side authentication, virtual keys, budgets, rate limits, spend tracking, and optional team controls.

Disclosure: TKEN is an independent third-party API gateway and is not officially affiliated with LiteLLM, OpenAI, Open WebUI, or other model providers.

## Official References

- LiteLLM's getting started page describes the proxy as a central LLM gateway with authentication, authorization, virtual keys, and spend management: https://docs.litellm.ai/
- LiteLLM's virtual key docs require a Postgres database and a proxy admin master key before `/key/generate` can create managed keys: https://docs.litellm.ai/docs/proxy/virtual_keys
- LiteLLM's budget docs cover personal budgets, team budgets, team member budgets, and rate limits: https://docs.litellm.ai/docs/proxy/users

## Files In This Repo

| Purpose | File |
| --- | --- |
| Virtual key and budget config template | `configs/litellm-virtual-keys-tken.yaml` |
| Open WebUI through LiteLLM stack guide | `docs/openwebui-litellm-tken-stack.md` |
| General cost guardrails | `docs/cost-guardrails.md` |
| Endpoint tester | `tools/endpoint-tester.mjs` |

## Step 1: Keep The Upstream Key Server-Side

Set the TKEN key only in the LiteLLM runtime environment. Do not paste it into Open WebUI, browser JavaScript, screenshots, support tickets, or repo files.

```bash
export TKEN_API_KEY="sk-your-tken-key"
export TKEN_BASE_URL="https://www.tken.shop/v1"
export DATABASE_URL="postgresql://example-user:example-pass@example-host:5432/example-db"
export LITELLM_MASTER_KEY="replace-with-local-litellm-master-key"
```

PowerShell:

```powershell
$env:TKEN_API_KEY="sk-your-tken-key"
$env:TKEN_BASE_URL="https://www.tken.shop/v1"
$env:DATABASE_URL="postgresql://example-user:example-pass@example-host:5432/example-db"
$env:LITELLM_MASTER_KEY="replace-with-local-litellm-master-key"
```

LiteLLM's virtual key docs require the proxy admin master key to start with `sk-`; keep the real value in a secret manager or local environment only.

Preflight TKEN before starting the proxy:

```bash
curl "$TKEN_BASE_URL/models" \
  -H "Authorization: Bearer $TKEN_API_KEY"
```

Pick a model ID returned by `/v1/models`, then replace `openai/replace-with-an-available-model` in the config template.

## Step 2: Start LiteLLM With A Key-Management Config

Start from `configs/litellm-virtual-keys-tken.yaml`:

```bash
litellm --config configs/litellm-virtual-keys-tken.yaml --port 4000
```

Confirm the proxy can expose the TKEN route:

```bash
curl "http://localhost:4000/v1/models" \
  -H "Authorization: Bearer $LITELLM_MASTER_KEY"
```

Then run one low-volume non-streaming chat request through the master key before issuing user keys:

```bash
curl "http://localhost:4000/v1/chat/completions" \
  -H "Authorization: Bearer $LITELLM_MASTER_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "model": "tken-chat",
    "messages": [{"role": "user", "content": "Reply with one short sentence."}]
  }'
```

## Step 3: Generate A Limited Virtual Key

Use the LiteLLM master key only from an admin shell, CI secret, or admin UI. The user-facing key returned by `/key/generate` is the only key that should be pasted into Open WebUI or internal tools.

```bash
curl "http://localhost:4000/key/generate" \
  -H "Authorization: Bearer $LITELLM_MASTER_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "models": ["tken-chat"],
    "max_budget": 5.0,
    "budget_duration": "30d",
    "duration": "30d",
    "rpm_limit": 60,
    "tpm_limit": 60000,
    "max_parallel_requests": 5,
    "metadata": {
      "owner": "openwebui-eval",
      "source": "tken-github-example"
    }
  }'
```

Use the returned virtual key with the LiteLLM OpenAI-compatible base URL:

```text
Base URL: http://localhost:4000/v1
API key: <returned-litellm-virtual-key>
Model: tken-chat
```

For Open WebUI, paste the LiteLLM virtual key into the OpenAI-compatible connection, not the upstream TKEN key.

## Step 4: Check Spend Without Exposing Prompts

Use `/key/info` from an admin context to inspect spend for a virtual key:

```bash
curl "http://localhost:4000/key/info?key=<returned-litellm-virtual-key>" \
  -H "Authorization: Bearer $LITELLM_MASTER_KEY"
```

Keep operational logs focused on route and cost signals:

```text
timestamp
route_name
model
http_status
latency_ms
total_tokens
virtual_key_alias_or_owner
```

Do not store private prompts, API keys, order IDs, account IDs, or raw customer data in logs or public issue reports.

## Safe Defaults For Evaluation Keys

| Control | Suggested evaluation default | Reason |
| --- | --- | --- |
| `models` | `["tken-chat"]` | Prevents users from selecting untested routes |
| `max_budget` | Small fixed amount | Limits damage from retry loops or wrong model choice |
| `budget_duration` | `30d` | Makes spend review predictable |
| `duration` | `30d` | Forces key rotation during evaluation |
| `rpm_limit` | Low double digits | Stops accidental request floods |
| `tpm_limit` | Match expected prompt size | Limits runaway agent loops |
| `max_parallel_requests` | Small integer | Controls batch and UI concurrency |
| `metadata` | owner, environment, source | Makes cost attribution possible |

Use stricter limits for agents than for human chat. Agents can create hidden loops even when each individual request looks small.

## Failure Map

| Symptom | Likely cause | Check |
| --- | --- | --- |
| `/key/generate` returns auth error | wrong LiteLLM master key | verify the admin request uses `LITELLM_MASTER_KEY` |
| `/key/generate` cannot store keys | missing `DATABASE_URL` or database migration problem | confirm the LiteLLM process can reach Postgres |
| Virtual key gets 401 | app pasted the wrong key or called TKEN directly | use `http://localhost:4000/v1`, not `https://www.tken.shop/v1`, when using LiteLLM keys |
| LiteLLM gets upstream 401 | missing or invalid `TKEN_API_KEY` | check only the LiteLLM runtime environment |
| User sees model not found | virtual key model list excludes the route | verify `models` includes `tken-chat` and the config maps it to a real TKEN model |
| Spend grows unexpectedly | missing budget, retry, or concurrency cap | lower `max_budget`, `rpm_limit`, `tpm_limit`, and `max_parallel_requests` |
| Team spend attribution is unclear | keys lack metadata or team/user IDs | add owner, source, environment, team, or user metadata before rollout |

## Rollout Checklist

- The upstream `TKEN_API_KEY` exists only on the LiteLLM host or secret manager.
- LiteLLM has a reachable Postgres database before managed keys are issued.
- `/v1/models` succeeds directly against TKEN and through LiteLLM.
- One non-streaming chat completion succeeds through the virtual key.
- Every shared key has `models`, `max_budget`, `budget_duration`, `duration`, `rpm_limit`, `tpm_limit`, and owner metadata.
- Logs and screenshots redact keys, account identifiers, customer data, and private prompt content.
- Automated agents have stricter limits than human chat users.
- There is a defined stop rule for upstream 401, quota, balance, 429, and repeated 5xx errors.

## Related Site Guides

- Developer hub: https://www.tken.shop/developers/?utm_source=github&utm_medium=developer_repo&utm_campaign=tken_github_v140&utm_content=litellm_virtual_keys&utm_id=gh_v140
- LiteLLM setup: https://www.tken.shop/litellm-openai-compatible-gateway/?utm_source=github&utm_medium=developer_repo&utm_campaign=tken_github_v140&utm_content=litellm_virtual_keys&utm_id=gh_v140
- Open WebUI setup: https://www.tken.shop/openwebui-openai-compatible-api/?utm_source=github&utm_medium=developer_repo&utm_campaign=tken_github_v140&utm_content=litellm_virtual_keys&utm_id=gh_v140
- Cost guardrails: https://www.tken.shop/llm-cost-guardrails/?utm_source=github&utm_medium=developer_repo&utm_campaign=tken_github_v140&utm_content=litellm_virtual_keys&utm_id=gh_v140
- Live pricing: https://www.tken.shop/pricing/?utm_source=github&utm_medium=developer_repo&utm_campaign=tken_github_v140&utm_content=litellm_virtual_keys&utm_id=gh_v140
