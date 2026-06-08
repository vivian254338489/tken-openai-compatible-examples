# Promotion Pack

## GitHub Topics

```text
openai-compatible
ai-api
api-gateway
curl
nodejs
python
openai-sdk
litellm
openwebui
cursor
continue
developer-tools
llm
```

## Short Description

```text
Examples and smoke tests for using TKEN as an independent OpenAI-compatible multi-model API gateway.
```

## Release Notes

```text
v0.12.0 adds a production readiness pack for teams moving from endpoint testing to controlled rollout:

- production readiness checklist covering endpoint gates, route maps, spend controls, observability, alerts, staged rollout, and rollback
- versionable JSON template for gateway base URL checks, route limits, budgets, alert thresholds, and rollback ownership
- cross-links from compatibility and cost guardrail docs so developers can move from smoke tests to production evaluation
- README and docs navigation updates for production rollout planning

Disclosure: TKEN is an independent third-party API gateway and is not officially affiliated with OpenAI or other model providers.
```

```text
v0.11.0 adds a manual GitHub Actions endpoint smoke-test pack for teams validating an OpenAI-compatible API gateway before production use:

- workflow_dispatch-only GitHub Actions workflow, so checks do not run on push, pull request, or schedule
- /v1/models reachability check by default, with optional non-streaming chat completion test
- TKEN_API_KEY repository secret handling with no key committed or printed
- CI guide covering workflow inputs, failure mapping, rollout order, and redaction hygiene
- README, docs, and tools navigation updates for CI validation

Disclosure: TKEN is an independent third-party API gateway and is not officially affiliated with GitHub, OpenAI, or other model providers.
```

```text
v0.10.0 adds a Continue and Cursor coding-tool migration pack for developers who want an IDE assistant to call an OpenAI-compatible model gateway:

- Continue config.yaml example using provider: openai, apiBase, roles, and secret-based key injection
- focused guide for validating /v1/models and one non-streaming chat completion before enabling coding-agent workflows
- Cursor setup notes that distinguish API-key support from base URL override availability in the installed version
- rollout checklist for low-limit keys, file-write approval, spend caps, and redacted logs/screenshots
- README and docs navigation updates for coding-tool evaluation

Disclosure: TKEN is an independent third-party API gateway and is not officially affiliated with Continue, Cursor, OpenAI, or other model providers.
```

```text
v0.9.0 adds an Open WebUI + LiteLLM + TKEN stack guide for developers who want a chat UI, a proxy layer, and an OpenAI-compatible model gateway in one workflow:

- guide for the flow Open WebUI -> LiteLLM proxy -> TKEN base URL
- LiteLLM config that maps a UI-facing route name to a TKEN model ID
- Open WebUI environment example for connecting to LiteLLM instead of exposing the upstream TKEN key
- pre-production checklist for virtual keys, model discovery, streaming tests, logging hygiene, retry caps, and spend controls
- failure map for model discovery, 401, 404, streaming, and cost drift

Disclosure: TKEN is an independent third-party API gateway and is not officially affiliated with Open WebUI, LiteLLM, OpenAI, or other model providers.
```

```text
v0.8.0 adds an agent and MCP gateway preflight pack for developers wiring OpenAI-compatible model APIs into agent workflows:

- guide that separates MCP server responsibilities from TKEN's model API gateway role
- preflight flow for /v1/models, non-streaming chat completions, host model settings, and secret handling
- JSON gateway profile for internal tools and agent host configuration reviews
- failure map for 401, 404, MCP server config, runaway agent loops, host provider mismatch, and secret exposure
- README and docs navigation updates for agent and MCP-capable workflow setup

Disclosure: TKEN is an independent third-party API gateway and is not officially affiliated with model providers or the Model Context Protocol project.
```

```text
v0.7.0 adds a pricing and model selection guide for developers deciding which OpenAI-compatible model routes to use before production:

- workflow for checking live pricing and /v1/models before deployment
- suggested fast, balanced, reasoning, embedding, and vision route map
- route-level environment-variable pattern so model IDs can change without business-logic rewrites
- pre-production checklist for token caps, timeouts, retry limits, fallback decisions, logging hygiene, and budget controls
- README and docs navigation updates pointing to live pricing, API pricing, model selection, and cost guardrails

Disclosure: TKEN is an independent third-party API gateway and is not officially affiliated with model providers.
```

```text
v0.6.0 adds an API gateway evaluation guide for developers comparing OpenAI-compatible endpoints:

- compatibility checklist for base URL, /models, chat completions, streaming, structured output, tool calls, and embeddings
- integration-fit checklist for Node.js, Python, Open WebUI, LiteLLM, Cursor, Continue, and internal agents
- reliability, cost-control, security, and decision-matrix sections designed for pre-production evaluation
- README and docs navigation updates for developers who need a neutral evaluation workflow before adopting a gateway

Disclosure: TKEN is an independent third-party API gateway and is not officially affiliated with model providers.
```

```text
v0.5.0 adds launch-ready tool integration and demo assets:

- tool integration guide for Open WebUI, LiteLLM, Cursor, Continue, and agent-style configs
- demo script for Product Hunt, DEV, HN follow-ups, and short screen recordings
- screenshot checklist that avoids exposing API keys, account IDs, usage records, private prompts, or provider account screens
- README and docs navigation updates for developers evaluating OpenAI-compatible gateway setup

Disclosure: TKEN is an independent third-party API gateway and is not officially affiliated with model providers.
```

```text
v0.4.0 adds migration and compatibility docs for developers evaluating OpenAI-compatible endpoints:

- SDK migration guide for Node.js and Python OpenAI SDK base URL changes
- endpoint compatibility checklist for /models, chat completions, streaming, JSON output, tool calls, and embeddings
- troubleshooting guide for 401, 404, model ID, quota, timeout, CORS, and streaming issues
- route-level model selection example for cost-aware application code
- cost guardrails guide for limits, logging, retries, and fallbacks
- GitHub issue templates that ask users to redact secrets and private data

Disclosure: TKEN is an independent third-party API gateway and is not officially affiliated with model providers.
```

```text
v0.3.0 adds a reusable OpenAI-compatible endpoint tester:

- CLI tester for /models and non-streaming chat completions
- environment-variable API key handling only
- timeout handling
- JSON output for CI or diagnostics
- docs for using the tester before wiring an endpoint into an app
- Open WebUI, LiteLLM, Cursor, and Continue setup snippets
- UTM links to TKEN developer guides

Disclosure: TKEN is an independent third-party API gateway and is not officially affiliated with model providers.
```

## Soft Launch Draft

```text
I updated a small set of examples for OpenAI-compatible API base URLs: curl, Node.js, Python, OpenAI SDK base URL overrides, Open WebUI, LiteLLM, Cursor, Continue, and a reusable endpoint tester that checks /models and chat completions without storing API keys.

Disclosure: I work on TKEN-related tooling. The examples default to TKEN, an independent API gateway, but the base URL pattern is useful for checking any OpenAI-compatible endpoint. TKEN is not officially affiliated with model providers.
```

## HN Draft After Tester Is Public

```text
Title: Show HN: CLI tester for OpenAI-compatible API endpoints

I built a small CLI tester for OpenAI-compatible APIs. It checks /models, picks or validates a model ID, and optionally runs a non-streaming chat completion before you wire an endpoint into an app.

The tester reads API keys from environment variables only and does not store or print keys.

Disclosure: I work on TKEN-related tooling. The repo defaults to TKEN's endpoint as one example, but the tester can be pointed at any OpenAI-compatible base URL. TKEN is an independent API gateway and is not officially affiliated with model providers.
```
