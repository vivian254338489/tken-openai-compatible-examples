# TKEN Developer Docs

These docs are for developers testing TKEN as an independent OpenAI-compatible API gateway.

Start with the CLI tester, then migrate one SDK call, then add cost and reliability guardrails before routing production traffic.

## Recommended Order

1. Follow `docs/endpoint-preflight-playbook.md` and run `node tools/endpoint-tester.mjs --skip-chat` to confirm `/v1/models`.
2. Pick one model ID returned by `/v1/models`.
3. Run a non-streaming chat completion with the tester.
4. Save redacted status and latency evidence with `docs/smoke-evidence-runner.md`.
5. Run `docs/openai-sdk-base-url-quickcheck.md` before switching one OpenAI SDK integration to `https://www.tken.shop/v1`.
6. If you prefer API-client imports before code, use `docs/api-client-collections.md`.
7. If your app uses Vercel AI SDK, LangChain, or LlamaIndex, wire one direct non-streaming call before chains, query engines, tools, or agents.
8. Run `docs/openai-sdk-capability-smoke.md` for streaming, JSON mode, and tool calls only if your app uses those features.
9. Add timeouts, retries, token caps, logging, and budget limits.
10. Test embeddings, vision, and other feature-specific routes separately if your app uses them.

## Guides

| Need | Guide |
| --- | --- |
| Evaluate an API gateway before adoption | `docs/api-gateway-evaluation.md` |
| Move an existing SDK app | `docs/sdk-migration-guide.md` |
| Quickcheck OpenAI SDK base URL config | `docs/openai-sdk-base-url-quickcheck.md` |
| Smoke-test SDK streaming, JSON mode, and tool calls | `docs/openai-sdk-capability-smoke.md` |
| Use Vercel AI SDK with TKEN | `docs/vercel-ai-sdk-openai-compatible.md` |
| Use LangChain with TKEN | `docs/langchain-openai-compatible.md` |
| Use LlamaIndex with TKEN | `docs/llamaindex-openai-compatible.md` |
| Import Postman or Bruno smoke tests | `docs/api-client-collections.md` |
| Capture redacted endpoint evidence | `docs/smoke-evidence-runner.md` |
| Run endpoint preflight and interpret tester output | `docs/endpoint-preflight-playbook.md` |
| Check endpoint behavior before launch | `docs/compatibility-checklist.md` |
| Debug setup errors | `docs/troubleshooting.md` |
| Select model routes from pricing and `/v1/models` | `docs/pricing-model-selection.md` |
| Control spend and routing | `docs/cost-guardrails.md` |
| Prepare production rollout, alerts, budgets, and rollback | `docs/production-readiness-checklist.md` |
| Connect Open WebUI directly to TKEN | `docs/openwebui-direct-tken.md` |
| Preflight agent and MCP-capable workflows | `docs/agent-mcp-gateway-preflight.md` |
| Review MCP host config boundaries | `docs/mcp-host-gateway-config.md` |
| Run Open WebUI through LiteLLM to TKEN | `docs/openwebui-litellm-tken-stack.md` |
| Start Open WebUI and LiteLLM with Docker Compose | `docs/openwebui-litellm-docker-compose.md` |
| Issue LiteLLM virtual keys with budgets and rate limits | `docs/litellm-virtual-keys-spend-control.md` |
| Wire Continue and Cursor-style coding tools | `docs/continue-cursor-coding-tools.md` |
| Choose between Cursor, Continue, Open WebUI, and LiteLLM | `docs/cursor-continue-openwebui-litellm-comparison.md` |
| Add a manual GitHub Actions endpoint smoke test | `docs/ci-endpoint-smoke-tests.md` |
| Configure tools and agents | `docs/tool-integration-guide.md` |
| Prepare a demo or launch recording | `docs/demo-script.md` |
| Share or launch transparently | `docs/community-disclosure.md` |

## Site Links

- Developer hub: https://www.tken.shop/developers/?utm_source=github&utm_medium=developer_repo&utm_campaign=tken_github_v070&utm_content=docs_index&utm_id=gh_v070
- Quickstart: https://www.tken.shop/quickstart/?utm_source=github&utm_medium=developer_repo&utm_campaign=tken_github_v070&utm_content=docs_index&utm_id=gh_v070
- SDK base URL guide: https://www.tken.shop/openai-sdk-base-url/?utm_source=github&utm_medium=developer_repo&utm_campaign=tken_github_v070&utm_content=docs_index&utm_id=gh_v070
- SDK base URL quickcheck: https://www.tken.shop/openai-sdk-base-url/?utm_source=github&utm_medium=developer_repo&utm_campaign=tken_github_v240&utm_content=docs_sdk_base_url_quickcheck&utm_id=gh_v240
- Pricing: https://www.tken.shop/pricing/?utm_source=github&utm_medium=developer_repo&utm_campaign=tken_github_v070&utm_content=docs_index&utm_id=gh_v070
- API pricing guide: https://www.tken.shop/api-pricing-guide/?utm_source=github&utm_medium=developer_repo&utm_campaign=tken_github_v070&utm_content=docs_index&utm_id=gh_v070
- Tool integration: https://www.tken.shop/developers/?utm_source=github&utm_medium=developer_repo&utm_campaign=tken_github_v070&utm_content=docs_tool_integration&utm_id=gh_v070
- Agent and MCP gateway preflight: https://www.tken.shop/developers/?utm_source=github&utm_medium=developer_repo&utm_campaign=tken_github_v080&utm_content=docs_agent_mcp_preflight&utm_id=gh_v080
- MCP host gateway config review: https://www.tken.shop/developers/?utm_source=github&utm_medium=developer_repo&utm_campaign=tken_github_v170&utm_content=docs_mcp_host_gateway_config&utm_id=gh_v170
- Vercel AI SDK integration: https://www.tken.shop/developers/?utm_source=github&utm_medium=developer_repo&utm_campaign=tken_github_v190&utm_content=docs_vercel_ai_sdk&utm_id=gh_v190
- LangChain integration: https://www.tken.shop/developers/?utm_source=github&utm_medium=developer_repo&utm_campaign=tken_github_v190&utm_content=docs_langchain&utm_id=gh_v190
- LlamaIndex integration: https://www.tken.shop/developers/?utm_source=github&utm_medium=developer_repo&utm_campaign=tken_github_v200&utm_content=docs_llamaindex&utm_id=gh_v200
- Postman and Bruno smoke-test collections: https://www.tken.shop/developers/?utm_source=github&utm_medium=developer_repo&utm_campaign=tken_github_v220&utm_content=docs_api_client_collections&utm_id=gh_v220
- Smoke evidence runner: https://www.tken.shop/developers/?utm_source=github&utm_medium=developer_repo&utm_campaign=tken_github_v230&utm_content=docs_smoke_evidence_runner&utm_id=gh_v230
- Open WebUI + LiteLLM Docker Compose: https://www.tken.shop/developers/?utm_source=github&utm_medium=developer_repo&utm_campaign=tken_github_v210&utm_content=docs_openwebui_litellm_compose&utm_id=gh_v210
- Open WebUI + LiteLLM stack: https://www.tken.shop/developers/?utm_source=github&utm_medium=developer_repo&utm_campaign=tken_github_v090&utm_content=docs_openwebui_litellm_stack&utm_id=gh_v090
- Continue and Cursor coding tools: https://www.tken.shop/developers/?utm_source=github&utm_medium=developer_repo&utm_campaign=tken_github_v100&utm_content=docs_continue_cursor&utm_id=gh_v100
- CI endpoint smoke tests: https://www.tken.shop/developers/?utm_source=github&utm_medium=developer_repo&utm_campaign=tken_github_v110&utm_content=docs_ci_smoke&utm_id=gh_v110
- Production readiness checklist: https://www.tken.shop/developers/?utm_source=github&utm_medium=developer_repo&utm_campaign=tken_github_v120&utm_content=docs_production_readiness&utm_id=gh_v120
- Direct Open WebUI setup: https://www.tken.shop/openwebui-openai-compatible-api/?utm_source=github&utm_medium=developer_repo&utm_campaign=tken_github_v130&utm_content=docs_openwebui_direct&utm_id=gh_v130
- LiteLLM virtual keys: https://www.tken.shop/litellm-openai-compatible-gateway/?utm_source=github&utm_medium=developer_repo&utm_campaign=tken_github_v140&utm_content=docs_litellm_virtual_keys&utm_id=gh_v140
- Tool selection comparison: https://www.tken.shop/developers/?utm_source=github&utm_medium=developer_repo&utm_campaign=tken_github_v150&utm_content=docs_tool_selection_comparison&utm_id=gh_v150

Disclosure: TKEN is an independent third-party API gateway and is not officially affiliated with model providers.
