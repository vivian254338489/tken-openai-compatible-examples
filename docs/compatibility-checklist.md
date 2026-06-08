# OpenAI-Compatible Endpoint Compatibility Checklist

Use this checklist before connecting an OpenAI-compatible endpoint to an app, agent, SDK wrapper, or UI.

## Required Checks

| Check | Why It Matters | How To Test |
| --- | --- | --- |
| `GET /v1/models` | Confirms base URL, key, and discoverable model IDs | `node tools/endpoint-tester.mjs --skip-chat` |
| Non-streaming chat | Confirms request shape and model selection | `node tools/endpoint-tester.mjs --model "$TKEN_MODEL"` |
| Error body format | Helps your app show actionable errors | Test with a low-limit or invalid test key |
| Timeouts | Prevents stalled agents and batch jobs | Set `--timeout-ms 10000` and app-level timeouts |
| Token limits | Controls spend and response length | Set `max_tokens` in application requests |
| Usage logging | Supports cost attribution | Log model, status, latency, tokens, and route |

## Feature-Specific Checks

Run these only when your app uses the feature.

| Feature | What To Verify |
| --- | --- |
| Streaming | Server-sent events format, partial chunks, timeout handling |
| JSON output | Whether the selected model follows strict JSON instructions |
| Structured output | Schema support and fallback behavior |
| Tool calls | Tool-call shape, argument JSON, and model support |
| Embeddings | Vector size, model ID, batching limit, and error behavior |
| Vision or multimodal | Media payload format, size limits, and model support |
| Retries and fallbacks | Backoff, idempotency, and failure routing |

## Production Readiness

- Use environment variables or a secret manager for keys.
- Keep keys server-side; do not put API keys in public browser code.
- Use separate keys for development, staging, and production when available.
- Route simple tasks to cheaper or faster models first.
- Keep a tested fallback model for critical workflows.
- Review pricing and recharge rules before large batch jobs.

## Links

- Developer hub: https://www.tken.shop/developers/?utm_source=github&utm_medium=developer_repo&utm_campaign=tken_dev_assets&utm_content=compatibility_checklist
- Streaming guide: https://www.tken.shop/streaming-chat-completions-api/?utm_source=github&utm_medium=developer_repo&utm_campaign=tken_dev_assets&utm_content=compatibility_checklist
- Structured output guide: https://www.tken.shop/structured-output-json-schema/?utm_source=github&utm_medium=developer_repo&utm_campaign=tken_dev_assets&utm_content=compatibility_checklist
- Embeddings guide: https://www.tken.shop/embeddings-openai-compatible-api/?utm_source=github&utm_medium=developer_repo&utm_campaign=tken_dev_assets&utm_content=compatibility_checklist

Disclosure: TKEN is an independent third-party API gateway and is not officially affiliated with model providers.
