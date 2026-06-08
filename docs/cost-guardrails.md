# LLM Cost Guardrails for TKEN Gateway Users

Use these guardrails before connecting automated agents, batch jobs, or user-facing production traffic.

For a complete rollout gate with alerts, rollback, and a versioned JSON template, see `docs/production-readiness-checklist.md` and `configs/production-readiness.template.json`.

## Route By Task Class

Create route names in your app instead of hard-coding provider model IDs everywhere.

```text
fast-summary     -> short summaries, extraction, tagging
balanced-chat    -> normal chat and drafts
coding-reasoning -> coding, analysis, hard reasoning
fallback-chat    -> backup model for temporary failures
```

Then map each route to a model ID returned by `/v1/models`.

## Add Request Limits

- Set `max_tokens` for each route.
- Cap concurrency for batch jobs.
- Add request timeouts.
- Add retry limits with backoff.
- Stop retrying when errors indicate quota, auth, or balance problems.

## Log Cost Signals

Log these fields where available:

```text
timestamp
route_name
model
http_status
latency_ms
prompt_tokens
completion_tokens
total_tokens
user_or_job_id_hash
```

Use hashes or internal IDs instead of storing private user content.

## Watch For Cost Drift

- New prompts can be longer than old prompts.
- Agent loops can create many hidden calls.
- Streaming does not automatically reduce token use.
- Structured output retries can multiply spend.
- Batch jobs should have a hard stop condition.

## Links

- TKEN cost guardrails: https://www.tken.shop/llm-cost-guardrails/?utm_source=github&utm_medium=developer_repo&utm_campaign=tken_github_v070&utm_content=cost_guardrails&utm_id=gh_v070
- Pricing: https://www.tken.shop/pricing/?utm_source=github&utm_medium=developer_repo&utm_campaign=tken_github_v070&utm_content=cost_guardrails&utm_id=gh_v070
- Pricing guide: https://www.tken.shop/api-pricing-guide/?utm_source=github&utm_medium=developer_repo&utm_campaign=tken_github_v070&utm_content=cost_guardrails&utm_id=gh_v070
- Production readiness: https://www.tken.shop/developers/?utm_source=github&utm_medium=developer_repo&utm_campaign=tken_github_v120&utm_content=cost_guardrails_production_readiness&utm_id=gh_v120

Disclosure: TKEN is an independent third-party API gateway and is not officially affiliated with model providers.
