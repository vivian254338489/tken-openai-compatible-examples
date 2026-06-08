# Troubleshooting TKEN OpenAI-Compatible API Setup

This page maps common setup symptoms to likely causes and checks.

## Quick Diagnosis

Run:

```bash
node tools/endpoint-tester.mjs --json
```

The tester reads the API key from `TKEN_API_KEY` and does not print the key.

## Common Errors

| Symptom | Likely Cause | Next Check |
| --- | --- | --- |
| `401 Unauthorized` | Missing, expired, or wrong API key | Confirm `TKEN_API_KEY` is set in the same shell |
| `404 Not Found` | Wrong base URL path | Use `https://www.tken.shop/v1`, not the homepage URL |
| Model not found | The selected model ID is unavailable | Run `/v1/models` and copy one returned ID |
| `429` or quota error | Rate, balance, or usage limit hit | Reduce concurrency and check account limits |
| Timeout | Network, endpoint, or model latency | Increase timeout and test a simpler prompt |
| Empty response | App parsing expects a different response shape | Print raw JSON once in a safe debug environment |
| Browser CORS issue | API key is being used from browser JavaScript | Move requests to a server-side route |
| Streaming works poorly | Streaming format or client parser mismatch | Test non-streaming first, then streaming separately |

## Environment Pitfalls

- Setting an env var in one terminal does not set it in another terminal.
- PowerShell and Bash use different env var syntax.
- Command-line API key arguments can leak into shell history; prefer env vars.
- Some SDKs use `baseURL`, others use `base_url`, `apiBase`, or `api_base`.
- Some tools need the base URL without a trailing slash.

## Safe Debug Pattern

1. Run `/models` only.
2. Copy one returned model ID.
3. Run one non-streaming chat completion.
4. Add the SDK or tool config.
5. Add streaming, JSON output, embeddings, and tool calls one at a time.

## Links

- Quickstart: https://www.tken.shop/quickstart/?utm_source=github&utm_medium=developer_repo&utm_campaign=tken_github_v070&utm_content=troubleshooting&utm_id=gh_v070
- OpenAI SDK base URL: https://www.tken.shop/openai-sdk-base-url/?utm_source=github&utm_medium=developer_repo&utm_campaign=tken_github_v070&utm_content=troubleshooting&utm_id=gh_v070
- Fallback and retries: https://www.tken.shop/fallback-retry-openai-compatible-api/?utm_source=github&utm_medium=developer_repo&utm_campaign=tken_github_v070&utm_content=troubleshooting&utm_id=gh_v070

Disclosure: TKEN is an independent third-party API gateway and is not officially affiliated with model providers.
