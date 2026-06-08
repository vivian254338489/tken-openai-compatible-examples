# Pricing and Model Selection Guide

Use this guide when you are deciding which model route to use before sending real traffic through an OpenAI-compatible gateway.

TKEN pricing and model availability can change by account, channel, model family, and provider status. Treat the live pricing table and `/v1/models` response as the source of truth before you deploy.

Site links:

- Live pricing: https://www.tken.shop/pricing/?utm_source=github&utm_medium=developer_repo&utm_campaign=tken_github_v070&utm_content=pricing_model_selection&utm_id=gh_v070
- API pricing guide: https://www.tken.shop/api-pricing-guide/?utm_source=github&utm_medium=developer_repo&utm_campaign=tken_github_v070&utm_content=pricing_model_selection&utm_id=gh_v070
- Cost guardrails: https://www.tken.shop/llm-cost-guardrails/?utm_source=github&utm_medium=developer_repo&utm_campaign=tken_github_v070&utm_content=pricing_model_selection&utm_id=gh_v070
- Developer hub: https://www.tken.shop/developers/?utm_source=github&utm_medium=developer_repo&utm_campaign=tken_github_v070&utm_content=pricing_model_selection&utm_id=gh_v070

Disclosure: TKEN is an independent third-party API gateway. It is not officially affiliated with OpenAI, Anthropic, Google, DeepSeek, Qwen, Kimi, MiniMax, GLM, xAI, or other model providers.

## Selection Workflow

1. Check the live pricing page for the current model list and billing unit.
2. Call `/v1/models` from the same account and key you plan to use.
3. Pick one default model for each application route instead of hard-coding one model everywhere.
4. Run one low-volume smoke test for each route.
5. Add token caps, request timeouts, retry limits, and budget alerts before automation.
6. Re-check pricing and model availability before major releases or batch jobs.

## Suggested Route Map

| Route | Common use | Selection criteria | Guardrail |
| --- | --- | --- | --- |
| `fast` | Classification, extraction, tagging, short drafts | Low latency and low cost for routine work | Short prompts, small max tokens, no hidden retry loops |
| `balanced` | Chat, summarization, support replies, general app flows | Acceptable quality and predictable latency | Request timeout, fallback model, per-user usage cap |
| `reasoning` | Coding, analysis, planning, complex decisions | Higher quality for hard prompts | Require explicit route use, stricter budget cap |
| `embedding` | Search, clustering, retrieval indexing | Stable embedding dimensions and index compatibility | Versioned index metadata and rebuild plan |
| `vision` | Image understanding or multimodal checks | Supported media input shape and response quality | Limit file size and redact private images |

Do not assume one model is best for every request. Start with the lowest-cost acceptable route only after you have tested output quality, latency, and failure modes for your own workload.

## Minimal `/models` Check

```bash
curl "$TKEN_BASE_URL/models" \
  -H "Authorization: Bearer $TKEN_API_KEY"
```

Record the model IDs that are available to your account, then choose route defaults with environment variables:

```bash
export TKEN_MODEL_FAST="replace-with-fast-model-id"
export TKEN_MODEL_BALANCED="replace-with-balanced-model-id"
export TKEN_MODEL_REASONING="replace-with-reasoning-model-id"
```

## Example Route Config

```js
const routes = {
  fast: {
    model: process.env.TKEN_MODEL_FAST,
    maxTokens: 300,
    timeoutMs: 20000,
    retries: 1
  },
  balanced: {
    model: process.env.TKEN_MODEL_BALANCED,
    maxTokens: 900,
    timeoutMs: 45000,
    retries: 2
  },
  reasoning: {
    model: process.env.TKEN_MODEL_REASONING,
    maxTokens: 1800,
    timeoutMs: 90000,
    retries: 0
  }
};
```

Use route names inside your app so you can change model IDs without rewriting business logic.

## Pre-Production Checklist

- The pricing page and `/v1/models` both show the models you plan to use.
- Each route has a named model ID, token cap, timeout, retry limit, and fallback decision.
- Logs include route name, status, latency, and token count, but never API keys or private prompts.
- Batch jobs have a dry-run mode and a maximum request count.
- Agents have a hard budget or usage limit before they can loop.
- The support team has a short troubleshooting path for quota, model unavailable, timeout, and billing errors.

## When to Re-Evaluate

Re-check model selection when:

- A model is renamed, removed, slowed down, or returns new error patterns.
- A new workflow moves from manual testing to scheduled automation.
- A route starts producing unexpected cost, latency, or quality regressions.
- You add streaming, tool calls, structured output, embeddings, or multimodal input.

Pricing pages and model APIs are operational signals, not static marketing copy. Build your app so model IDs and budget limits can be changed quickly.
