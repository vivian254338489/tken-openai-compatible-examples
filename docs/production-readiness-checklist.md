# Production Readiness Checklist

Use this checklist before sending user-facing traffic, agents, batch jobs, or paid workloads through TKEN or another OpenAI-compatible gateway.

Disclosure: TKEN is an independent third-party API gateway. It is not officially affiliated with OpenAI, Anthropic, DeepSeek, MiniMax, Alibaba, Google, xAI, or other model providers. Model availability, pricing, context limits, streaming behavior, tool support, and rate limits can vary by account, channel, and provider status.

## Goal

Move from "the endpoint works once" to "the application can fail predictably, control spend, and be rolled back."

Use the template in `configs/production-readiness.template.json` as a versioned checklist for your own route map, budgets, alerts, and rollback owners.

## 1. Endpoint Gate

Do not start with an SDK, UI, or agent. Start with the base URL and one test key.

Required:

- `GET /v1/models` succeeds with the same base URL your app will use.
- `/v1/models` returns at least one model ID.
- One known model ID returns a non-streaming chat completion.
- The app has an explicit timeout for every request.
- The app has a visible error path for 401, 404, 429, 5xx, timeout, and invalid JSON.

Suggested commands:

```bash
node tools/endpoint-tester.mjs \
  --base-url "$TKEN_BASE_URL" \
  --api-key-env TKEN_API_KEY \
  --skip-chat \
  --json
```

```bash
node tools/endpoint-tester.mjs \
  --base-url "$TKEN_BASE_URL" \
  --api-key-env TKEN_API_KEY \
  --model "$TKEN_MODEL" \
  --json
```

Use the manual GitHub Actions workflow only after repository secrets and key limits are clear.

## 2. Route Map

Do not hard-code provider model IDs throughout business logic. Use route names in your app, then map each route to a model ID returned by `/v1/models`.

Example:

| Route | Use Case | Required Controls |
| --- | --- | --- |
| `fast-summary` | summaries, extraction, tagging | low `max_tokens`, short timeout, one retry |
| `balanced-chat` | user-facing chat and drafts | fallback route, latency alert, usage logging |
| `coding-reasoning` | coding, hard reasoning, analysis | no blind retries, stricter budget owner |
| `fallback-chat` | temporary fallback for critical paths | tested separately, lower max output |

Review this map whenever pricing, model availability, context limits, or provider status changes.

## 3. Spend Controls

Before production traffic:

- Set `max_tokens` per route.
- Set concurrency limits for jobs and agents.
- Set a per-user or per-job request cap.
- Stop retrying on auth, quota, balance, and model-not-found errors.
- Put batch jobs behind a hard stop time.
- Put agents behind a max-iteration limit.
- Review the live pricing page before large runs.

Avoid hidden spend paths:

- background retries
- scheduled checks without budget owners
- agent loops
- structured-output repair loops
- long prompt history reuse
- screenshots or logs that trigger repeated debug calls

## 4. Observability

Log enough to debug routing and cost without storing private prompt content.

Recommended fields:

```text
timestamp
route_name
model
http_status
latency_ms
retry_count
prompt_tokens
completion_tokens
total_tokens
user_or_job_id_hash
```

Do not log:

- API keys
- full authorization headers
- raw private prompts
- customer personal data
- provider account screens
- unredacted issue reports or screenshots

## 5. Alerts

Create alerts before scaling traffic.

| Alert | Why It Matters |
| --- | --- |
| Empty `/models` response | Detects account or provider availability problems before app deploys. |
| 401 rate above baseline | Catches expired keys or wrong environment wiring. |
| 429 or quota errors | Catches rate, balance, or usage limit failures. |
| 5xx rate | Detects endpoint or upstream instability. |
| p95 latency above threshold | Protects user-facing workflows and agents. |
| daily spend reaches threshold | Prevents runaway jobs or agent loops. |

Use a low threshold at first. Raise it only after real traffic patterns are understood.

## 6. Rollout Plan

Use a staged rollout:

1. Local smoke test with `/models`.
2. Local non-streaming chat test with one model ID.
3. Staging SDK integration.
4. One low-risk internal route.
5. One user-facing route with strict token and timeout limits.
6. Optional streaming, tool calls, JSON output, embeddings, or multimodal tests only if your app uses them.
7. Agent or batch traffic last.

Rollback rule:

- Disable agents and batch jobs first.
- Switch route map back to the previous tested model route.
- Keep the previous route map and config available.
- Rotate keys if logs, screenshots, or issue reports expose sensitive context.

## Go / No-Go

Go only when:

- endpoint smoke tests pass
- model route map is documented
- keys are server-side only
- token, timeout, retry, and concurrency limits are configured
- logs capture status, latency, route, model, and usage without private prompts
- owner knows how to disable jobs, agents, and route changes

No-go when:

- `/v1/models` is empty or inconsistent
- selected model ID was copied from a dashboard but not verified through the API
- app retries blindly on 401, 404, 429, or balance errors
- API keys are in browser code, command history, screenshots, or repo files
- nobody owns spend alerts or rollback

## Links

- Developer hub: https://www.tken.shop/developers/?utm_source=github&utm_medium=developer_repo&utm_campaign=tken_github_v120&utm_content=production_readiness&utm_id=gh_v120
- Pricing: https://www.tken.shop/pricing/?utm_source=github&utm_medium=developer_repo&utm_campaign=tken_github_v120&utm_content=production_readiness_pricing&utm_id=gh_v120
- Cost guardrails: https://www.tken.shop/llm-cost-guardrails/?utm_source=github&utm_medium=developer_repo&utm_campaign=tken_github_v120&utm_content=production_readiness_cost&utm_id=gh_v120
- Fallback and retries: https://www.tken.shop/fallback-retry-openai-compatible-api/?utm_source=github&utm_medium=developer_repo&utm_campaign=tken_github_v120&utm_content=production_readiness_retries&utm_id=gh_v120
