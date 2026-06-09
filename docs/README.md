# TKEN Developer Docs

These docs are for developers testing TKEN as an independent OpenAI-compatible API gateway.

Start with the CLI tester, then migrate one SDK call, then add cost and reliability guardrails before routing production traffic.

## Recommended Order

1. Run `node tools/endpoint-tester.mjs --skip-chat` to confirm `/v1/models`.
2. Pick one model ID returned by `/v1/models`.
3. Run a non-streaming chat completion with the tester.
4. Switch one OpenAI SDK integration to `https://www.tken.shop/v1`.
5. Add timeouts, retries, token caps, logging, and budget limits.
6. Test streaming, tool calls, JSON output, and embeddings only if your app uses them.

## Guides

| Need | Guide |
| --- | --- |
| Evaluate an API gateway before adoption | `docs/api-gateway-evaluation.md` |
| Move an existing SDK app | `docs/sdk-migration-guide.md` |
| Check endpoint behavior before launch | `docs/compatibility-checklist.md` |
| Debug setup errors | `docs/troubleshooting.md` |
| Select model routes from pricing and `/v1/models` | `docs/pricing-model-selection.md` |
| Control spend and routing | `docs/cost-guardrails.md` |
| Prepare production rollout, alerts, budgets, and rollback | `docs/production-readiness-checklist.md` |
| Connect Open WebUI directly to TKEN | `docs/openwebui-direct-tken.md` |
| Preflight agent and MCP-capable workflows | `docs/agent-mcp-gateway-preflight.md` |
| Run Open WebUI through LiteLLM to TKEN | `docs/openwebui-litellm-tken-stack.md` |
| Issue LiteLLM virtual keys with budgets and rate limits | `docs/litellm-virtual-keys-spend-control.md` |
| Wire Continue and Cursor-style coding tools | `docs/continue-cursor-coding-tools.md` |
| Add a manual GitHub Actions endpoint smoke test | `docs/ci-endpoint-smoke-tests.md` |
| Configure tools and agents | `docs/tool-integration-guide.md` |
| Prepare a demo or launch recording | `docs/demo-script.md` |
| Share or launch transparently | `docs/community-disclosure.md` |

## Site Links

- Developer hub: https://www.tken.shop/developers/?utm_source=github&utm_medium=developer_repo&utm_campaign=tken_github_v070&utm_content=docs_index&utm_id=gh_v070
- Quickstart: https://www.tken.shop/quickstart/?utm_source=github&utm_medium=developer_repo&utm_campaign=tken_github_v070&utm_content=docs_index&utm_id=gh_v070
- SDK base URL guide: https://www.tken.shop/openai-sdk-base-url/?utm_source=github&utm_medium=developer_repo&utm_campaign=tken_github_v070&utm_content=docs_index&utm_id=gh_v070
- Pricing: https://www.tken.shop/pricing/?utm_source=github&utm_medium=developer_repo&utm_campaign=tken_github_v070&utm_content=docs_index&utm_id=gh_v070
- API pricing guide: https://www.tken.shop/api-pricing-guide/?utm_source=github&utm_medium=developer_repo&utm_campaign=tken_github_v070&utm_content=docs_index&utm_id=gh_v070
- Tool integration: https://www.tken.shop/developers/?utm_source=github&utm_medium=developer_repo&utm_campaign=tken_github_v070&utm_content=docs_tool_integration&utm_id=gh_v070
- Agent and MCP gateway preflight: https://www.tken.shop/developers/?utm_source=github&utm_medium=developer_repo&utm_campaign=tken_github_v080&utm_content=docs_agent_mcp_preflight&utm_id=gh_v080
- Open WebUI + LiteLLM stack: https://www.tken.shop/developers/?utm_source=github&utm_medium=developer_repo&utm_campaign=tken_github_v090&utm_content=docs_openwebui_litellm_stack&utm_id=gh_v090
- Continue and Cursor coding tools: https://www.tken.shop/developers/?utm_source=github&utm_medium=developer_repo&utm_campaign=tken_github_v100&utm_content=docs_continue_cursor&utm_id=gh_v100
- CI endpoint smoke tests: https://www.tken.shop/developers/?utm_source=github&utm_medium=developer_repo&utm_campaign=tken_github_v110&utm_content=docs_ci_smoke&utm_id=gh_v110
- Production readiness checklist: https://www.tken.shop/developers/?utm_source=github&utm_medium=developer_repo&utm_campaign=tken_github_v120&utm_content=docs_production_readiness&utm_id=gh_v120
- Direct Open WebUI setup: https://www.tken.shop/openwebui-openai-compatible-api/?utm_source=github&utm_medium=developer_repo&utm_campaign=tken_github_v130&utm_content=docs_openwebui_direct&utm_id=gh_v130
- LiteLLM virtual keys: https://www.tken.shop/litellm-openai-compatible-gateway/?utm_source=github&utm_medium=developer_repo&utm_campaign=tken_github_v140&utm_content=docs_litellm_virtual_keys&utm_id=gh_v140

Disclosure: TKEN is an independent third-party API gateway and is not officially affiliated with model providers.
