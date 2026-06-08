# How To Evaluate an OpenAI-Compatible API Gateway

Use this checklist when you are comparing an OpenAI-compatible gateway, proxy, or model router for an application that already speaks the OpenAI API shape.

The goal is not to pick a provider from a marketing page. The goal is to prove that the endpoint works for your real SDK, tools, failure modes, and budget before you send production traffic.

Disclosure: TKEN is an independent third-party API gateway and is not officially affiliated with OpenAI, Anthropic, DeepSeek, MiniMax, Alibaba, Google, xAI, or other model providers.

## 1. Compatibility

Start with the API surface your app actually uses.

| Area | What To Check | Why It Matters |
| --- | --- | --- |
| Base URL | SDK accepts a custom `baseURL` / `base_url` | Some tools support custom endpoints cleanly; others need adapters. |
| Models | `GET /v1/models` returns usable IDs | Hard-coded provider model names can fail or route unexpectedly. |
| Chat completions | One non-streaming request succeeds | This is the smallest proof that auth, JSON shape, and model choice work. |
| Streaming | SSE chunks match your parser | Streaming failures often appear only after the simple request works. |
| Structured output | JSON or schema behavior matches your app | Model and gateway support can differ by route. |
| Tool calls | Tool-call argument shape is stable | Agents break when tool-call payloads drift. |
| Embeddings | Vector dimensions and batching limits are known | Retrieval apps need fixed dimensions and predictable errors. |

Run:

```bash
node tools/endpoint-tester.mjs --base-url "$TKEN_BASE_URL" --api-key-env TKEN_API_KEY --skip-chat
```

Then test a real model ID:

```bash
node tools/endpoint-tester.mjs --base-url "$TKEN_BASE_URL" --api-key-env TKEN_API_KEY --model "$TKEN_MODEL"
```

## 2. Integration Fit

Validate the exact tools your team uses.

| Tool Type | Recommended First Test |
| --- | --- |
| Node.js OpenAI SDK | Set `baseURL` and run one chat completion. |
| Python OpenAI SDK | Set `base_url` and run one chat completion. |
| Open WebUI | Configure server-side `OPENAI_API_BASE_URL`, then select a returned model ID. |
| LiteLLM | Create one low-volume route with explicit budget and retry settings. |
| Cursor / Continue | Use a low-limit key and one known model before enabling agentic workflows. |
| Internal agents | Add per-route model IDs, max token limits, timeouts, and logging first. |

Do not put gateway keys in public browser JavaScript. If a UI needs model access, proxy it through your own backend.

## 3. Reliability

Measure reliability with the same request classes you plan to run.

| Signal | Minimum Useful Record |
| --- | --- |
| Latency | Status, model ID, route name, elapsed milliseconds |
| Errors | HTTP status, redacted error body, request ID when available |
| Retries | Retry count, backoff, final status |
| Timeouts | Client timeout and server timeout behavior |
| Fallbacks | Original model, fallback model, fallback reason |
| Quotas | 429 frequency and recovery behavior |

For production traffic, use capped retries with backoff. Avoid unbounded retry loops around agents or batch jobs.

## 4. Cost And Control

Treat model choice as an application routing decision, not a string scattered across source code.

Use route names:

```text
fast       -> summaries, extraction, simple drafts
balanced   -> support, analysis, normal chat
reasoning  -> coding, harder planning, final review
```

Then map those routes to model IDs after checking `/v1/models`. This lets you change models without rewriting business logic.

Before high-volume use, verify:

- recharge rules and any minimum balance requirements
- per-model price differences
- daily spend or token caps
- usage reporting delay
- alerting when traffic exceeds normal volume
- separate keys for development, staging, and production when available

## 5. Security And Data Handling

Before sharing logs, screenshots, issue reports, or demos, redact:

- API keys
- account IDs
- order IDs
- request IDs if they can identify a customer
- private prompts
- usage records
- IP addresses and other customer identifiers
- provider account screens

Prefer environment variables or a secret manager. Keep a separate low-limit key for demos and first tests.

## 6. Decision Matrix

Score each gateway with evidence from tests, not assumptions.

| Criterion | Evidence To Collect |
| --- | --- |
| SDK compatibility | Passing Node.js and Python SDK calls |
| Tool compatibility | Passing Open WebUI, LiteLLM, Cursor, or Continue setup |
| Model coverage | `/v1/models` output for required model families |
| Reliability | Latency, error, retry, timeout, and quota logs |
| Cost control | Route-level model mapping and budget guardrails |
| Security hygiene | No keys in source, screenshots, logs, or browser code |
| Support readiness | Reproducible issue template and redacted diagnostics |

## Related TKEN Guides

- Developer hub: https://www.tken.shop/developers/?utm_source=github&utm_medium=developer_repo&utm_campaign=tken_dev_assets&utm_content=gateway_evaluation
- OpenAI SDK base URL: https://www.tken.shop/openai-sdk-base-url/?utm_source=github&utm_medium=developer_repo&utm_campaign=tken_dev_assets&utm_content=gateway_evaluation
- Structured output guide: https://www.tken.shop/structured-output-json-schema/?utm_source=github&utm_medium=developer_repo&utm_campaign=tken_dev_assets&utm_content=gateway_evaluation
- Cost guardrails: https://www.tken.shop/llm-cost-guardrails/?utm_source=github&utm_medium=developer_repo&utm_campaign=tken_dev_assets&utm_content=gateway_evaluation
- Pricing: https://www.tken.shop/pricing?utm_source=github&utm_medium=developer_repo&utm_campaign=tken_dev_assets&utm_content=gateway_evaluation
