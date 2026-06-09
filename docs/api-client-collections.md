# API Client Collections For Endpoint Smoke Tests

Use these collections when you want a quick, no-code preflight before wiring TKEN into an SDK, proxy, UI, or agent.

Disclosure: TKEN is an independent third-party API gateway. It is not officially affiliated with Postman, Bruno, OpenAI, or other model providers. Model availability, pricing, context limits, streaming behavior, tool support, and rate limits can vary by account, channel, and provider status.

## What Is Included

| Client | Files |
| --- | --- |
| Postman | `collections/postman/tken-openai-compatible-smoke.postman_collection.json`, `collections/postman/tken-local.postman_environment.json` |
| Bruno | `collections/bruno/tken-openai-compatible-smoke/` |

Both collections use the same two-step smoke test:

1. `GET {{tken_base_url}}/models`
2. `POST {{tken_base_url}}/chat/completions`

Run `/models` first. Choose a model ID returned by that response before running the chat request.

## Variables

| Variable | Default | Notes |
| --- | --- | --- |
| `tken_base_url` | `https://www.tken.shop/v1` | Keep the `/v1` suffix. |
| `tken_api_key` | `sk-your-tken-key` | Replace locally only. Do not commit a real key. |
| `tken_model` | `replace-with-an-available-model` | Use a model ID returned by `/models`. |
| `tken_prompt` | non-sensitive compatibility prompt | Keep test prompts non-sensitive. |

## Postman Flow

Import both files:

- `collections/postman/tken-openai-compatible-smoke.postman_collection.json`
- `collections/postman/tken-local.postman_environment.json`

Then:

1. Select the `TKEN Local` environment.
2. Set `tken_api_key` to a low-limit TKEN key.
3. Run `01 GET /models`.
4. If `/models` returns a model ID, the collection test stores the first ID in `tken_model`.
5. Review or override `tken_model`.
6. Run `02 POST /chat/completions`.

This repo ships Postman collection v2.1 JSON because it is portable, easy to inspect, and useful for import/export and Newman-style local runs.

## Bruno Flow

Open this folder as a Bruno collection:

```text
collections/bruno/tken-openai-compatible-smoke/
```

Set the key through a process environment variable:

```bash
export TKEN_API_KEY="sk-your-tken-key"
```

PowerShell:

```powershell
$env:TKEN_API_KEY="sk-your-tken-key"
```

Then select the `local` environment and run:

1. `01 GET models`
2. `02 POST chat completions`

Bruno stores requests as local `.bru` files, so the collection can be reviewed in pull requests. The included `local.bru` references `{{process.env.TKEN_API_KEY}}` so real keys stay outside the repo.

## Safe Evidence To Save

Use this evidence shape for issue reports or internal rollout notes:

```text
Client: Postman or Bruno
Base URL: https://www.tken.shop/v1
API key handling: local environment variable or local secret, key not printed
/models status: 200
Model count: 3
Selected model: model-id-from-models
Chat status: 200
Prompt: non-sensitive compatibility prompt
Preview: redacted or one non-sensitive sentence
```

Do not include API keys, account IDs, order IDs, usage records, private prompts, provider dashboard screenshots, full sensitive response bodies, or raw logs with credentials.

## Failure Map

| Result | Likely Cause | First Fix |
| --- | --- | --- |
| Missing key | Environment or collection variable not set | Set `tken_api_key` locally or `TKEN_API_KEY` for Bruno. |
| 401 | Invalid, expired, or unauthorized key | Use a current low-limit key. |
| 404 | Base URL missing `/v1` | Set `tken_base_url` to `https://www.tken.shop/v1`. |
| Empty model list | Account access or route availability issue | Check account access before choosing a model. |
| Model not found | `tken_model` was not returned by `/models` | Copy a current returned model ID. |
| 429 | Rate, balance, or concurrency limit | Reduce test frequency and check account limits. |
| Timeout or 5xx | Network, gateway, or upstream provider issue | Retry later with backoff and save only redacted status evidence. |

For CLI-based testing and rollout gates, see `docs/endpoint-preflight-playbook.md` and `tools/endpoint-tester.mjs`.
