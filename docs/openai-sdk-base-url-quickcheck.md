# OpenAI SDK Base URL Quickcheck

Use this guide when an app already uses the official OpenAI SDK and you want to test whether the same code path can point at TKEN's OpenAI-compatible base URL.

TKEN base URL:

```text
https://www.tken.shop/v1
```

Disclosure: TKEN is an independent third-party OpenAI-compatible API gateway and is not officially affiliated with OpenAI or other model providers. Passing a basic SDK call does not prove every endpoint or every optional feature is available for every selected model route.

## What This Checks

The quickcheck is a no-network config guard. It validates the base URL shape, confirms the configured API-key environment variable exists in the current shell, and reminds you to select a model from `/v1/models`.

```bash
node tools/openai-sdk-base-url-quickcheck.mjs
```

PowerShell:

```powershell
node tools/openai-sdk-base-url-quickcheck.mjs
```

JSON output:

```bash
node tools/openai-sdk-base-url-quickcheck.mjs --json
```

Strict CI-style output:

```bash
node tools/openai-sdk-base-url-quickcheck.mjs --strict
```

The command never makes network requests and never prints API key values.

## Environment

Use a low-limit test key for first checks:

```bash
export TKEN_API_KEY="sk-your-tken-key"
export TKEN_BASE_URL="https://www.tken.shop/v1"
export TKEN_MODEL="replace-with-an-available-model"
```

PowerShell:

```powershell
$env:TKEN_API_KEY="sk-your-tken-key"
$env:TKEN_BASE_URL="https://www.tken.shop/v1"
$env:TKEN_MODEL="replace-with-an-available-model"
```

Pick `TKEN_MODEL` only after `GET /v1/models` returns available IDs for your account.

## SDK Setting Matrix

| Runtime | Official SDK package | Base URL option | TKEN value |
| --- | --- | --- | --- |
| Node.js | `openai` | `baseURL` | `process.env.TKEN_BASE_URL || "https://www.tken.shop/v1"` |
| Python | `openai` | `base_url` | `os.environ.get("TKEN_BASE_URL", "https://www.tken.shop/v1")` |

The OpenAI Node SDK also supports the `OPENAI_BASE_URL` environment variable in its client defaults, and the Python SDK supports `OPENAI_BASE_URL` when `base_url` is not passed directly. TKEN examples prefer `TKEN_BASE_URL` so test traffic is visibly separated from direct provider traffic.

Primary references:

- OpenAI Node SDK client source: https://github.com/openai/openai-node/blob/master/src/client.ts
- OpenAI Python SDK client source: https://github.com/openai/openai-python/blob/main/src/openai/_client.py

## Migration Sequence

1. Run the no-network quickcheck:

```bash
node tools/openai-sdk-base-url-quickcheck.mjs
```

2. Validate model discovery:

```bash
node tools/endpoint-tester.mjs --base-url "$TKEN_BASE_URL" --api-key-env TKEN_API_KEY --skip-chat
```

3. Choose a returned model ID and run one non-streaming chat check:

```bash
node tools/endpoint-tester.mjs --base-url "$TKEN_BASE_URL" --api-key-env TKEN_API_KEY --model "$TKEN_MODEL"
```

4. Switch one SDK call.

Node.js:

```js
import OpenAI from "openai";

const client = new OpenAI({
  apiKey: process.env.TKEN_API_KEY,
  baseURL: process.env.TKEN_BASE_URL || "https://www.tken.shop/v1",
});

const completion = await client.chat.completions.create({
  model: process.env.TKEN_MODEL,
  messages: [{ role: "user", content: "Reply with one short sentence." }],
});
```

Python:

```python
import os
from openai import OpenAI

client = OpenAI(
    api_key=os.environ["TKEN_API_KEY"],
    base_url=os.environ.get("TKEN_BASE_URL", "https://www.tken.shop/v1"),
)

completion = client.chat.completions.create(
    model=os.environ["TKEN_MODEL"],
    messages=[{"role": "user", "content": "Reply with one short sentence."}],
)
```

## Compatibility Matrix

| SDK area | First check | Follow-up before production |
| --- | --- | --- |
| Model discovery | `GET /v1/models` with `tools/endpoint-tester.mjs --skip-chat` | Save model ID and route ownership in your app config |
| Non-streaming chat | `POST /v1/chat/completions` with one short prompt | Add timeout, retry limit, logging, and token cap |
| Streaming chat | `node examples/node-openai-sdk-capability-smoke.mjs stream` | Verify client parser behavior and timeout handling |
| JSON mode | `node examples/node-openai-sdk-capability-smoke.mjs json` | Keep a fallback when route output is not parseable JSON |
| Tool calls | `node examples/node-openai-sdk-capability-smoke.mjs tools` | Run one end-to-end app workflow with low limits |
| Embeddings | Test the exact embedding route and vector dimension separately | Version index metadata before production writes |
| Files, images, audio, realtime, assistants, batches, responses-specific features | Treat as endpoint-specific support, not implied by chat compatibility | Validate only if your TKEN account and selected route expose the endpoint |

## Common Failure Map

| Symptom | Likely cause | Next check |
| --- | --- | --- |
| 404 on `/models` | Base URL missing `/v1` or points at the homepage | Run `node tools/openai-sdk-base-url-quickcheck.mjs --base-url "$TKEN_BASE_URL"` |
| 401 or unauthorized | Wrong key, missing key env, or key scoped to another route | Confirm `TKEN_API_KEY` is set without printing it |
| Model not found | `TKEN_MODEL` was copied from another provider or old docs | Re-run `/v1/models` and select a returned ID |
| Basic chat works but streaming fails | Selected route does not support streaming or proxy buffers output | Keep non-streaming for that route or test another returned model |
| SDK works locally but not in CI | Environment variables differ | Add the no-network quickcheck before the live endpoint test |

## Related Guides

- `docs/sdk-migration-guide.md`
- `docs/endpoint-preflight-playbook.md`
- `docs/openai-sdk-capability-smoke.md`
- `docs/compatibility-checklist.md`
- OpenAI SDK base URL guide: https://www.tken.shop/openai-sdk-base-url/?utm_source=github&utm_medium=developer_repo&utm_campaign=tken_github_v240&utm_content=sdk_base_url_quickcheck&utm_id=gh_v240
- Developer hub: https://www.tken.shop/developers/?utm_source=github&utm_medium=developer_repo&utm_campaign=tken_github_v240&utm_content=sdk_base_url_quickcheck&utm_id=gh_v240
