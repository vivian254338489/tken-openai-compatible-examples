# Changelog

## v0.20.0

- Added a LlamaIndex integration guide for using `llama-index-llms-openai-like` with TKEN through `api_base`.
- Added a runnable Python LlamaIndex example for a direct LLM smoke test before query engines, retrievers, or agents.
- Added guardrails for embeddings, function calling, query engines, low-limit agent tests, and redacted evidence.
- Updated README, docs navigation, tool integration notes, promotion copy, package scripts, and release checks for LlamaIndex adoption.

## v0.19.0

- Added Vercel AI SDK and LangChain integration guides for using TKEN through OpenAI-compatible base URL settings.
- Added runnable Node.js examples for `@ai-sdk/openai-compatible` and `@langchain/openai`.
- Added a runnable Python `langchain-openai` example.
- Updated README, docs navigation, tool integration notes, promotion copy, package scripts, and release checks for framework-level adoption.

## v0.18.0

- Added OpenAI SDK capability smoke tests for streaming, JSON-mode responses, and tool calls in Node.js and Python.
- Added a guide for deciding whether optional SDK features are ready for a selected TKEN model route after basic chat passes.
- Added safe evidence and rollout decision tables for feature failures without exposing keys, account IDs, private prompts, or usage records.
- Updated README, docs navigation, compatibility notes, migration notes, promotion copy, and release checks for the capability smoke pack.

## v0.17.0

- Added an MCP host gateway config review guide for separating MCP server settings from OpenAI-compatible model gateway settings.
- Added a JSON review profile for MCP-capable host rollouts using `TKEN_BASE_URL`, `TKEN_API_KEY`, and a model ID selected from `/v1/models`.
- Added permission, logging, safe evidence, and rollout checks for MCP hosts before enabling read/write tool calls.
- Updated README, docs navigation, promotion copy, and release checks for the MCP host config asset.

## v0.16.0

- Added an endpoint preflight playbook for running `/models` and one non-streaming chat check before SDK, UI, proxy, agent, or CI rollout.
- Added output interpretation guidance for 401, 404, empty model lists, model-not-found errors, 429/quota, timeouts, 5xx responses, and response-shape mismatches.
- Added a safe evidence template for issue reports and internal rollout notes that avoids exposing keys, account IDs, private prompts, usage records, or provider account screens.
- Updated README, docs navigation, tools documentation, promotion copy, and release checks for the preflight playbook.

## v0.15.0

- Added a tool selection comparison guide for choosing between Cursor, Continue, Open WebUI direct setup, Open WebUI behind LiteLLM, and LiteLLM virtual keys with TKEN.
- Added a decision matrix covering base URL support, key handling, team control, budget control, model discovery, and production readiness.
- Updated README, docs navigation, tool integration notes, promotion copy, and release checks for the comparison asset.

## v0.14.0

- Added a LiteLLM virtual keys and spend-control guide for teams proxying TKEN through LiteLLM.
- Added a LiteLLM key-management config template with Postgres, per-key budget defaults, rate limits, and key-generation upper bounds.
- Updated README, docs navigation, cost guardrails, tool integration notes, and promotion copy for shared team rollout evaluation.

## v0.13.0

- Added a direct Open WebUI to TKEN setup guide for developers configuring an OpenAI-compatible base URL without an intermediate proxy.
- Added an Open WebUI direct environment template covering `OPENAI_API_BASE_URL`, `OPENAI_API_KEY`, default model hints, task model hints, and passthrough safety.
- Updated README, docs navigation, tool integration notes, and promotion copy for the Open WebUI direct setup asset.

## v0.12.0

- Added a production readiness checklist for route maps, endpoint gates, spend controls, observability, alerts, staged rollout, and rollback.
- Added a versionable production readiness JSON template for teams preparing TKEN gateway adoption.
- Updated README, docs navigation, compatibility, cost guardrails, and promotion copy for production rollout evaluation.

## v0.11.0

- Added a manual GitHub Actions endpoint smoke-test workflow for `/v1/models` and optional non-streaming chat checks.
- Added a CI endpoint smoke-test guide covering workflow inputs, `TKEN_API_KEY` secret handling, failure mapping, and rollout safety.
- Updated README, docs navigation, tools documentation, and promotion copy for teams validating TKEN before production use.

## v0.10.0

- Added a Continue and Cursor coding-tool migration guide for developers wiring IDE assistants to an OpenAI-compatible gateway.
- Added a Continue `config.yaml` example that uses `provider: openai`, `apiBase`, and secret-based key injection.
- Reworked Cursor notes to be explicit about current documented API-key limits and to recommend preflight validation before coding-agent use.
- Updated README, docs navigation, and promotion copy for the coding-tool integration asset.

## v0.9.0

- Added an Open WebUI + LiteLLM + TKEN stack guide for developers who want Open WebUI to call a LiteLLM proxy that routes to TKEN.
- Added LiteLLM and Open WebUI config examples for the stack without storing upstream keys in the UI config.
- Updated README and docs navigation for the Open WebUI behind LiteLLM workflow.

## v0.8.0

- Added an agent and MCP gateway preflight guide that separates MCP server responsibilities from TKEN's OpenAI-compatible model gateway role.
- Added an agent gateway preflight JSON profile for internal tools and host configuration reviews.
- Updated README and docs navigation for agent and MCP-capable workflow setup.

## v0.7.0

- Added a pricing and model selection guide for choosing route-level model defaults from the live pricing page and `/v1/models`.
- Added README and docs navigation to pricing, API pricing, model selection, and cost guardrail resources.

## v0.6.0

- Added an OpenAI-compatible API gateway evaluation guide covering compatibility, tool fit, reliability, cost control, security hygiene, and decision criteria.
- Added README and docs navigation for the gateway evaluation guide.

## v0.5.0

- Added a tool integration guide for Open WebUI, LiteLLM, Cursor, Continue, and agent-style configs.
- Added a demo script for Product Hunt, DEV, HN, and short screen recordings without exposing secrets.
- Expanded README and docs navigation for tool setup and launch assets.

## v0.4.0

- Added SDK migration, compatibility, troubleshooting, cost guardrail, and disclosure guides.
- Added a route-level model selection example for cost-aware application code.
- Added GitHub issue templates that ask users to redact secrets and private data.
- Expanded README navigation for developers evaluating OpenAI-compatible gateways.

## v0.3.0

- Added a reusable CLI endpoint tester for `/models` and non-streaming chat checks.
- Added JSON output, timeout handling, and environment-variable API key handling.

## v0.2.0

- Expanded OpenAI SDK, Open WebUI, LiteLLM, Cursor, Continue, curl, Node.js, and Python examples.

## v0.1.0

- Initial public examples for using TKEN as an OpenAI-compatible API gateway.
