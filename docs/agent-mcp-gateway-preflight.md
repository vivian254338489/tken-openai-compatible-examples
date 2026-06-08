# Agent and MCP Gateway Preflight

Use this guide when an agent workflow, IDE assistant, or MCP-capable host needs an OpenAI-compatible model API base URL.

TKEN fits at the model gateway layer:

```text
MCP servers and tools -> agent host or IDE -> OpenAI-compatible model client -> TKEN base URL
```

TKEN does not replace MCP servers. MCP servers still expose tools, resources, and prompts to the host application. TKEN provides the model API endpoint the host or agent client can call when it supports an OpenAI-compatible provider.

Reference: the [Model Context Protocol documentation](https://modelcontextprotocol.io/docs/getting-started/intro) describes MCP as a protocol for connecting AI applications with external systems, tools, data sources, and workflows.

Disclosure: TKEN is an independent third-party API gateway and is not officially affiliated with model providers or the Model Context Protocol project.

## When This Helps

Run this preflight before connecting TKEN to:

- agentic coding tools
- MCP-capable desktop hosts
- internal workflow agents
- LiteLLM or proxy stacks that call MCP tools through a host
- CI or batch agents that need model routing and spend controls

## Layer Boundary

Keep these responsibilities separate:

| Layer | Owns | TKEN role |
| --- | --- | --- |
| MCP server | Tools, resources, prompts, server credentials | None |
| Agent host | MCP server config, tool permissioning, prompt flow | Selects model provider if supported |
| Model client | `base_url`, API key env var, model ID, timeouts | Calls `https://www.tken.shop/v1` |
| Application guardrails | budgets, logs, retries, fallbacks, rate handling | Uses TKEN responses as one upstream signal |

Do not put TKEN API keys in MCP server config unless that server itself is making model API calls. In most agent workflows, the model key belongs in the host or model-provider configuration.

## Environment Setup

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

## Preflight Steps

1. Confirm the model API is reachable.

```bash
curl "$TKEN_BASE_URL/models" \
  -H "Authorization: Bearer $TKEN_API_KEY"
```

2. Pick a model ID returned by `/v1/models`.

Do not hard-code a marketing name. Store the selected model ID in an environment variable or deployment secret.

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
  --model "$TKEN_MODEL"
```

5. Connect one low-risk agent prompt before enabling tool use.

Start with a prompt that does not call MCP tools. Then enable one read-only MCP tool. Add write-capable tools only after logging, permissioning, and spend limits are working.

## Agent Host Checklist

Before production traffic, confirm:

- the host supports an OpenAI-compatible `base_url` or equivalent provider setting
- `TKEN_API_KEY` is read from an environment variable or secret store
- the host model field uses a model ID returned by `/v1/models`
- MCP server credentials are stored separately from the model API key
- browser-facing code cannot read the TKEN key
- logs redact prompts, keys, account IDs, and private tool results
- agent runs have max tokens, timeout, retry, and daily usage limits
- tool calls are permissioned by risk level
- streaming is tested separately if the host uses streaming
- fallback behavior is defined for 401, 404, 429, and 5xx responses

## Example Gateway Profile

See `configs/agent-gateway-preflight.json` for a portable profile you can adapt to internal tools.

The profile intentionally does not include MCP server definitions. Keep MCP server entries in the host's MCP config and keep the model gateway profile focused on the OpenAI-compatible endpoint.

## Failure Map

| Symptom | Likely cause | Check |
| --- | --- | --- |
| 401 | missing or invalid TKEN key | confirm `TKEN_API_KEY` is set in the same process as the host |
| 404 or model not found | model ID was not returned by `/v1/models` | refresh the model list and update the route map |
| Tool call fails before model response | MCP server or host config issue | test the MCP server independently from the model gateway |
| Agent loops or burns tokens | missing budget and retry caps | add max turns, max tokens, timeout, and daily usage limits |
| Works in curl but not the host | host provider setting mismatch | verify base URL field, path handling, headers, and model field |
| Key appears in logs or screenshots | secret redaction missing | rotate the key and fix logging before continuing |

## Related Site Guides

- Developer hub: https://www.tken.shop/developers/?utm_source=github&utm_medium=developer_repo&utm_campaign=tken_github_v080&utm_content=agent_mcp_preflight&utm_id=gh_v080
- Quickstart: https://www.tken.shop/quickstart/?utm_source=github&utm_medium=developer_repo&utm_campaign=tken_github_v080&utm_content=agent_mcp_preflight&utm_id=gh_v080
- OpenAI SDK base URL: https://www.tken.shop/openai-sdk-base-url/?utm_source=github&utm_medium=developer_repo&utm_campaign=tken_github_v080&utm_content=agent_mcp_preflight&utm_id=gh_v080
- Live pricing: https://www.tken.shop/pricing/?utm_source=github&utm_medium=developer_repo&utm_campaign=tken_github_v080&utm_content=agent_mcp_preflight&utm_id=gh_v080
