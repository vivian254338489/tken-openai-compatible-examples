# Demo Script

Use this script for a short screen recording, Product Hunt gallery asset, DEV article GIF, or HN follow-up comment.

Do not show real API keys, account IDs, order IDs, customer identifiers, balances, usage records, private prompts, IP addresses, or provider account screens.

## Demo Goal

Show a developer that TKEN can be tested like an OpenAI-compatible endpoint before wiring it into an app.

## Setup

Use placeholder values on screen:

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

If recording a real run, hide the API key setup and show only the command and redacted output.

## 60-Second Flow

### Scene 1: Repo Overview

Show the repo name and README quick links.

Voiceover:

```text
This repo shows how to test TKEN as an independent OpenAI-compatible API gateway using curl, Node.js, Python, Open WebUI, LiteLLM, Cursor, Continue, and a reusable endpoint tester.
```

### Scene 2: Check `/models`

Run:

```bash
node tools/endpoint-tester.mjs --skip-chat --json
```

Voiceover:

```text
Start with `/v1/models` so you choose a model ID that is actually available for your account.
```

Expected output shape:

```json
{
  "ok": true,
  "checks": [
    {
      "name": "models",
      "ok": true
    }
  ]
}
```

### Scene 3: One Non-Streaming Chat

Run:

```bash
node tools/endpoint-tester.mjs --model "$TKEN_MODEL"
```

Voiceover:

```text
After `/models` works, run one non-streaming chat completion before testing streaming, tool calls, structured output, or agent workflows.
```

### Scene 4: OpenAI SDK Migration

Show:

```js
const client = new OpenAI({
  apiKey: process.env.TKEN_API_KEY,
  baseURL: process.env.TKEN_BASE_URL || "https://www.tken.shop/v1",
});
```

Voiceover:

```text
For many existing OpenAI SDK apps, the first migration test is just a base URL and API key change.
```

### Scene 5: Guardrails

Show `docs/cost-guardrails.md`.

Voiceover:

```text
Before production, add timeouts, retry caps, logging, and daily spend or token limits.
```

## 15-Second Product Hunt Clip

```text
TKEN gives developers one OpenAI-compatible base URL for testing multiple model families. This repo shows the safe path: check `/models`, run one chat completion, switch an SDK base URL, then add reliability and cost guardrails.
```

## HN Follow-Up Comment If Asked "What Makes This Useful?"

```text
The useful part is the preflight workflow, not a new SDK. A lot of OpenAI-compatible endpoint issues are wrong base URL, missing `/v1`, unavailable model ID, a key scoped to the wrong route, or a tool that starts with streaming before a basic non-streaming chat works. The tester makes those checks explicit and reads keys from environment variables only.
```

## Screenshot Checklist

- Repo README with quick links.
- Endpoint tester command with no visible key.
- `/models` JSON output with model IDs blurred if needed.
- OpenAI SDK `baseURL` snippet.
- Tool integration guide table or section.
- Cost guardrails checklist.

## Tracking Links For Demo Descriptions

- Developer hub: https://www.tken.shop/developers/?utm_source=github&utm_medium=developer_repo&utm_campaign=tken_dev_assets&utm_content=demo_script
- Quickstart: https://www.tken.shop/quickstart/?utm_source=github&utm_medium=developer_repo&utm_campaign=tken_dev_assets&utm_content=demo_script
- Pricing: https://www.tken.shop/pricing?utm_source=github&utm_medium=developer_repo&utm_campaign=tken_dev_assets&utm_content=demo_script
