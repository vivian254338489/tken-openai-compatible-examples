# Open WebUI + LiteLLM + TKEN Docker Compose

Use this guide when you want a local Compose stack where Open WebUI talks to LiteLLM, and LiteLLM routes requests to TKEN as an OpenAI-compatible API gateway.

```text
Open WebUI container -> LiteLLM container -> https://www.tken.shop/v1
```

Disclosure: TKEN is an independent third-party API gateway and is not officially affiliated with Open WebUI, LiteLLM, OpenAI, or other model providers.

## What This Adds

| Purpose | File |
| --- | --- |
| Docker Compose stack | `docker-compose.openwebui-litellm-tken.yml` |
| LiteLLM route config | `configs/litellm-openwebui-tken.compose.yaml` |
| Local environment template | `configs/openwebui-litellm-docker-compose.env.example` |

The Compose stack keeps `TKEN_API_KEY` in the LiteLLM service. Open WebUI receives `OPENWEBUI_LITELLM_KEY`, which should be a LiteLLM virtual key for shared users.

## Step 1: Prepare The Environment File

Copy the example values into a local `.env` file at the repository root:

```bash
cp configs/openwebui-litellm-docker-compose.env.example .env
```

PowerShell:

```powershell
Copy-Item configs\openwebui-litellm-docker-compose.env.example .env
```

Edit `.env` locally:

```env
TKEN_API_KEY=sk-your-tken-key
TKEN_LITELLM_MODEL=openai/replace-with-an-available-model
LITELLM_MASTER_KEY=sk-dev-key
OPENWEBUI_LITELLM_KEY=sk-dev-key
OPENWEBUI_DEFAULT_MODEL=tken-chat
```

Replace `replace-with-an-available-model` with a model ID returned by TKEN `/v1/models`. Keep the `openai/` prefix in `TKEN_LITELLM_MODEL` so LiteLLM treats the upstream as OpenAI-compatible.

For a private local smoke test, `OPENWEBUI_LITELLM_KEY` can match `LITELLM_MASTER_KEY`. For shared users, create a LiteLLM virtual key and use that value instead.

## Step 2: Start The Stack

```bash
docker compose -f docker-compose.openwebui-litellm-tken.yml up
```

Open WebUI listens on:

```text
http://localhost:3000
```

LiteLLM listens on:

```text
http://localhost:4000
```

Inside the Compose network, Open WebUI calls LiteLLM at:

```text
http://litellm:4000/v1
```

## Step 3: Verify LiteLLM Before Using The UI

In a second terminal, confirm that LiteLLM exposes the route Open WebUI will use:

```bash
curl "http://localhost:4000/v1/models" \
  -H "Authorization: Bearer $LITELLM_MASTER_KEY"
```

PowerShell:

```powershell
curl.exe "http://localhost:4000/v1/models" `
  -H "Authorization: Bearer $env:LITELLM_MASTER_KEY"
```

Then run one non-streaming chat request:

```bash
curl "http://localhost:4000/v1/chat/completions" \
  -H "Authorization: Bearer $LITELLM_MASTER_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "model": "tken-chat",
    "messages": [{"role": "user", "content": "Reply with one short sentence."}]
  }'
```

Only connect users after `/v1/models` and one non-streaming chat request both pass.

## Step 4: Check Open WebUI

Open `http://localhost:3000`, create or sign in to the local Open WebUI account, and confirm `tken-chat` appears as the default model.

If it does not appear:

1. Confirm `docker compose` logs show LiteLLM loaded `configs/litellm-openwebui-tken.compose.yaml`.
2. Confirm `curl http://localhost:4000/v1/models` returns `tken-chat`.
3. Confirm Open WebUI has `OPENAI_API_BASE_URL=http://litellm:4000/v1`.
4. Restart Open WebUI if an old persistent connection setting was saved in the local data volume.

## Production Notes

Before a shared or public deployment:

- replace `sk-dev-key` with a strong secret value that still starts with `sk-`
- issue LiteLLM virtual keys for Open WebUI users instead of using the master key
- add Postgres-backed LiteLLM key management before relying on spend tracking
- set per-key RPM, TPM, and budget limits
- avoid storing private prompts, keys, account IDs, usage records, or provider dashboards in logs or screenshots
- validate streaming separately before enabling streaming-heavy workflows

For key management and budgets, see `docs/litellm-virtual-keys-spend-control.md`.

## Official References Checked

- Open WebUI OpenAI-compatible provider setup: https://docs.openwebui.com/getting-started/quick-start/connect-a-provider/starting-with-openai-compatible/
- Open WebUI environment variables: https://docs.openwebui.com/reference/env-configuration/
- LiteLLM config.yaml model list and general settings: https://docs.litellm.ai/docs/proxy/configs
- LiteLLM Docker and Docker Compose quick start: https://docs.litellm.ai/docs/proxy/docker_quick_start
