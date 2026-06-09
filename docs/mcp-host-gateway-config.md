# MCP Host Gateway Config Review

Use this guide when an MCP-capable host, agent desktop app, IDE assistant, or internal workflow runner needs both:

- MCP servers for tools, resources, or prompts
- an OpenAI-compatible model API base URL such as TKEN

TKEN fits at the model gateway layer. It does not replace MCP servers.

```text
MCP servers -> MCP host or agent app -> model provider/client setting -> TKEN OpenAI-compatible base URL
```

Reference: the [Model Context Protocol introduction](https://modelcontextprotocol.io/docs/getting-started/intro) describes MCP as a way for AI applications to connect to external systems. The [local server connection guide](https://modelcontextprotocol.io/docs/develop/connect-local-servers) covers host-to-server connection and permission review concepts.

Disclosure: TKEN is an independent third-party OpenAI-compatible API gateway and is not officially affiliated with OpenAI, Anthropic, the Model Context Protocol project, MCP hosts, IDE vendors, or model providers.

## What To Review

Review model settings and MCP server settings separately.

| Area | Review | TKEN guidance |
| --- | --- | --- |
| Model base URL | OpenAI-compatible API base URL used by the host or model client | Use `https://www.tken.shop/v1` only in the model-provider/client setting. |
| Model key | Secret used by the host or model client to call the gateway | Read from `TKEN_API_KEY` or a host secret store. |
| Model ID | Model selected for agent responses | Use one ID returned by `/v1/models`. |
| MCP servers | Tool/resource/prompt servers connected to the host | Keep server credentials separate from TKEN model credentials. |
| Tool permissions | Read/write/network/shell permissions granted by the host | Start read-only, then add write-capable tools after spend and audit limits. |
| Logging | Host, gateway, and MCP-server logs | Redact prompts, keys, account IDs, tool results, and private data. |

Do not put a TKEN API key in MCP server config unless that MCP server itself is making model API calls. In most workflows, the model key belongs in the host's model-provider configuration, not in the MCP server entries.

## Environment

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

## Preflight Before Host Wiring

1. Confirm the gateway returns models.

```bash
curl "$TKEN_BASE_URL/models" \
  -H "Authorization: Bearer $TKEN_API_KEY"
```

2. Select one model ID returned by `/v1/models`.

3. Run one non-streaming chat completion.

```bash
curl "$TKEN_BASE_URL/chat/completions" \
  -H "Authorization: Bearer $TKEN_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "model": "'"$TKEN_MODEL"'",
    "messages": [{"role": "user", "content": "Reply with one short sentence."}]
  }'
```

4. Run the local endpoint tester.

```bash
node tools/endpoint-tester.mjs \
  --base-url "$TKEN_BASE_URL" \
  --api-key-env TKEN_API_KEY \
  --model "$TKEN_MODEL" \
  --json
```

5. Only then wire the host's model-provider setting.

Start with one low-risk prompt that does not call tools. Then enable one read-only MCP server. Add write-capable tools only after tool permissions, usage caps, logging, and rollback behavior are clear.

## Generic Host Config Review Pattern

Host config formats vary. Use this pattern as a review checklist, not as a universal config file:

```json
{
  "modelProvider": {
    "type": "openai-compatible",
    "baseUrlEnv": "TKEN_BASE_URL",
    "apiKeyEnv": "TKEN_API_KEY",
    "modelEnv": "TKEN_MODEL"
  },
  "mcpServers": {
    "readOnlyDocs": {
      "transport": "stdio",
      "command": "replace-with-server-command",
      "riskLevel": "read-only",
      "credentials": "managed-by-host-or-server-not-tken"
    }
  }
}
```

The important boundary is not the exact field names. It is whether the TKEN model key is only used by the model client and whether MCP server credentials stay scoped to the tool server.

## Review Template

Copy `configs/mcp-host-gateway-review.json` into your internal rollout notes and fill it out before enabling tool calls.

The template captures:

- host name and owner
- model gateway environment variables
- selected model and preflight evidence
- connected MCP servers and risk levels
- tool permission plan
- logging and redaction expectations
- rollout and rollback gates

## Failure Map

| Symptom | Likely boundary | Check |
| --- | --- | --- |
| `/models` fails | model gateway or key | Confirm `TKEN_BASE_URL`, `TKEN_API_KEY`, network access, and account status. |
| Chat works in curl but not host | host model-provider setting | Check base URL field, model field, headers, path handling, and process environment. |
| MCP server connects but model does not answer | model client setting | Test one no-tool prompt before using MCP tools. |
| Model answers but tool call fails | MCP server or host permissioning | Test the MCP server independently from the model gateway. |
| Agent spends too much | host or gateway guardrail gap | Add max turns, max tokens, timeouts, daily budget, and rate limits. |
| Secrets appear in logs | logging/redaction gap | Rotate exposed keys and fix host, server, and gateway logging before continuing. |

## Safe Evidence To Keep

For issue reports and internal rollout notes, keep only:

- HTTP status
- model count
- selected model ID
- timeout setting
- host name and version
- MCP server names and risk levels
- failure class
- redacted command or config shape

Do not include:

- API keys
- account IDs
- customer identifiers
- private prompts
- tool outputs containing private data
- provider admin screenshots
- billing, order, or payment details

## Related Guides

- Endpoint preflight playbook: `docs/endpoint-preflight-playbook.md`
- Agent and MCP gateway preflight: `docs/agent-mcp-gateway-preflight.md`
- Tool integration guide: `docs/tool-integration-guide.md`
- Production readiness checklist: `docs/production-readiness-checklist.md`
- Cost guardrails: `docs/cost-guardrails.md`
