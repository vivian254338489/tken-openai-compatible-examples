# TKEN Integration Decision Map

Use this map when you know you want an OpenAI-compatible API gateway but have not chosen the first integration path yet.

The fastest safe route is usually not "wire every tool." Pick one workflow, prove `/v1/models`, run one non-streaming chat request, save redacted evidence, then expand to SDKs, UI tools, proxies, CI, or agents.

Disclosure: TKEN is an independent third-party API gateway and is not officially affiliated with OpenAI, Anthropic, DeepSeek, MiniMax, Alibaba, Google, xAI, Open WebUI, LiteLLM, Cursor, Continue, Vercel, LangChain, LlamaIndex, Postman, Bruno, or other model providers and tools.

## 5-Minute Path Picker

| Situation | Start Here | Next Check | Do Not Start With |
| --- | --- | --- | --- |
| You want to verify the endpoint without writing code | `docs/api-client-collections.md` | Import Postman or Bruno, run `/models`, then one non-streaming chat request | Streaming, tool calls, or agents |
| You already have an OpenAI SDK app | `docs/openai-sdk-base-url-quickcheck.md` | Run `node tools/openai-sdk-base-url-quickcheck.mjs`, then `docs/sdk-migration-guide.md` | Large refactors before a one-call smoke test |
| You use Vercel AI SDK, LangChain, or LlamaIndex | The matching framework guide | Run one direct server-side call before chains, query engines, streaming, tools, or agents | Browser-exposed API keys |
| You want a team chat UI | `docs/openwebui-direct-tken.md` for simple setups, or `docs/openwebui-litellm-tken-stack.md` for shared control | Validate a returned model ID before adding users | Exposing the upstream key in client-side code |
| You need per-user budgets or virtual keys | `docs/litellm-virtual-keys-spend-control.md` | Create one low-limit route and verify `/key/info` or equivalent budget visibility | Unlimited shared keys |
| You want coding-tool support | `docs/continue-cursor-coding-tools.md` | Use a low-limit key and one known model before enabling broad file edits | Agentic workflows with uncapped spend |
| You are preparing MCP or agent hosts | `docs/agent-mcp-gateway-preflight.md` and `docs/mcp-host-gateway-config.md` | Separate MCP server permissions from model gateway settings | Combining tool permissions and model migration in one step |
| You need CI or production rollout confidence | `docs/ci-endpoint-smoke-tests.md` and `docs/production-readiness-checklist.md` | Add manual `/models` checks, timeouts, alerting, rollback, and redacted logs | Scheduled tests that burn quota without owner review |

## Default Sequence

Use this sequence unless you have a specific tool-driven reason to do otherwise:

1. Confirm the base URL is `https://www.tken.shop/v1`.
2. Run a no-network config check if you are using OpenAI SDK conventions.
3. Run `GET /v1/models` before choosing a model ID.
4. Run one non-streaming `POST /v1/chat/completions` request.
5. Save redacted status, latency, model count, selected model, and failure class with `tools/smoke-evidence.mjs`.
6. Add your real SDK, UI, proxy, CI, or agent only after the basic call passes.
7. Test optional features separately: streaming, structured output, tool calls, embeddings, vision, long context, and agent loops.

## Which Asset Should You Open First?

| Goal | Asset |
| --- | --- |
| Neutral evaluation before adoption | `docs/api-gateway-evaluation.md` |
| No-code smoke test | `docs/api-client-collections.md` |
| Redacted evidence artifact | `docs/smoke-evidence-runner.md` |
| OpenAI SDK migration | `docs/sdk-migration-guide.md` |
| OpenAI SDK config check | `docs/openai-sdk-base-url-quickcheck.md` |
| Capability checks after basic chat passes | `docs/openai-sdk-capability-smoke.md` |
| Framework integration | `docs/vercel-ai-sdk-openai-compatible.md`, `docs/langchain-openai-compatible.md`, or `docs/llamaindex-openai-compatible.md` |
| Browser chat UI | `docs/openwebui-direct-tken.md` |
| Team proxy and virtual keys | `docs/openwebui-litellm-tken-stack.md`, `docs/openwebui-litellm-docker-compose.md`, and `docs/litellm-virtual-keys-spend-control.md` |
| Coding assistants | `docs/continue-cursor-coding-tools.md` and `docs/cursor-continue-openwebui-litellm-comparison.md` |
| Agent and MCP hosts | `docs/agent-mcp-gateway-preflight.md` and `docs/mcp-host-gateway-config.md` |
| Production rollout | `docs/production-readiness-checklist.md` and `docs/ci-endpoint-smoke-tests.md` |

## Risk Signals

Pause and narrow the rollout if you see any of these signals:

| Signal | Likely Issue | Safer Next Step |
| --- | --- | --- |
| `/models` fails | Base URL, key, network, or account route issue | Fix endpoint and auth before testing chat |
| `/models` works but chat fails | Model ID, request shape, quota, or route support issue | Pick a returned model ID and run a non-streaming tester |
| Basic chat works but streaming fails | SSE or route capability mismatch | Keep non-streaming in production until streaming is separately proven |
| Basic chat works but tools fail | Tool-call shape or selected model support issue | Run capability smoke tests on one low-risk prompt |
| UI works for admin but not users | Key scope, model filter, or shared account config issue | Add LiteLLM or another server-side proxy layer before user rollout |
| Agent costs spike | Missing budget, max token, retry, or permission boundary | Disable agent loops and add route-level caps before retrying |

## Evidence To Capture

Keep evidence useful but non-sensitive:

- Endpoint path and status code.
- Elapsed milliseconds.
- Model count and selected model ID.
- Failure class such as auth, model discovery, model not found, quota, timeout, upstream, or response shape.
- Short sanitized response-shape preview.
- Tool or SDK name and version if relevant.

Do not store API keys, bearer tokens, account IDs, order IDs, IP addresses, full prompts, private response text, provider dashboards, billing screens, or customer data.

## Example Adoption Paths

### Existing SDK App

1. Run `node tools/openai-sdk-base-url-quickcheck.mjs`.
2. Follow `docs/sdk-migration-guide.md`.
3. Run one SDK chat completion.
4. Run `docs/openai-sdk-capability-smoke.md` only for the optional features your app uses.

### Open WebUI Team Rollout

1. Start with `docs/openwebui-direct-tken.md` for a single-admin proof.
2. Move to `docs/openwebui-litellm-tken-stack.md` if multiple users need budget or key separation.
3. Use `docs/litellm-virtual-keys-spend-control.md` before inviting broader users.
4. Save redacted smoke evidence before changing defaults.

### Agent Or MCP Host

1. Validate TKEN as a model gateway with `/models` and one non-streaming chat request.
2. Review host config boundaries with `docs/mcp-host-gateway-config.md`.
3. Enable one read-only MCP tool before any write-capable tool.
4. Add spend caps, max tokens, tool permissions, and logging redaction before broader use.

## Decision Rule

Ship the smallest integration that proves real value:

- If you only need endpoint confidence, stop after the tester and redacted evidence.
- If you need one app migrated, stop after one SDK call and the capability checks your app actually uses.
- If you need team governance, add LiteLLM or another proxy layer before more UI users.
- If you need agent workflows, treat model gateway setup and tool permissions as separate rollouts.
