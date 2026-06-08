# Changelog

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
