# Cursor vs Continue vs Open WebUI vs LiteLLM With TKEN

Use this guide when you know you want an OpenAI-compatible model gateway, but you are deciding where TKEN should sit in your developer workflow.

TKEN fits at the model API layer:

```text
Developer tool, chat UI, proxy, or internal app
  -> OpenAI-compatible base URL
  -> TKEN https://www.tken.shop/v1
```

The right integration depends on whether you are optimizing for IDE coding, chat UI evaluation, team key control, proxy-side budgets, or production routing.

Disclosure: TKEN is an independent third-party API gateway and is not officially affiliated with Cursor, Continue, Open WebUI, LiteLLM, OpenAI, or other model providers.

## Official References Checked

References checked on 2026-06-09:

- Continue documents YAML configuration, model roles, secret references, and `apiBase` for OpenAI-compatible providers: https://docs.continue.dev/yaml-reference
- Cursor documents bring-your-own provider API keys in Cursor Settings > Models, with custom API keys limited to standard chat models and specialized features continuing on built-in models: https://cursor.com/help/models-and-usage/api-keys
- Open WebUI documents OpenAI-compatible provider setup from Admin Settings -> Connections and recommends `/v1/models` for model discovery: https://docs.openwebui.com/getting-started/quick-start/connect-a-provider/starting-with-openai-compatible/
- Open WebUI documents `OPENAI_API_BASE_URL`, `OPENAI_API_BASE_URLS`, `OPENAI_API_KEY`, `OPENAI_API_KEYS`, `DEFAULT_MODELS`, and `TASK_MODEL_EXTERNAL`: https://docs.openwebui.com/reference/env-configuration/
- LiteLLM documents virtual keys, proxy key management, budgets, users, teams, and rate limits: https://docs.litellm.ai/docs/proxy/virtual_keys and https://docs.litellm.ai/docs/proxy/users

## Fast Recommendation

| Situation | Start here | Why |
| --- | --- | --- |
| One developer wants an IDE assistant with explicit OpenAI-compatible `apiBase` support | Continue -> TKEN | Continue has documented YAML config for `apiBase`, roles, and secret references. |
| A Cursor installation exposes a compatible custom endpoint setting | Cursor -> TKEN | Useful for chat-model experiments, but verify the installed Cursor settings first. |
| One person wants a browser chat UI quickly | Open WebUI -> TKEN | Lowest moving parts for a personal or low-volume evaluation. |
| A team wants one chat UI plus central routing | Open WebUI -> LiteLLM -> TKEN | LiteLLM can own route names, proxy auth, logs, retries, and spend controls. |
| Internal apps, agents, or multiple tools need separate keys and budgets | Tools -> LiteLLM virtual keys -> TKEN | LiteLLM virtual keys isolate users and workflows without sharing the upstream TKEN key. |
| You are evaluating production readiness | Endpoint tester -> route map -> chosen tool | Prove `/v1/models`, one chat completion, limits, logging, and rollback before rollout. |

## Decision Matrix

| Criterion | Cursor | Continue | Open WebUI direct | Open WebUI + LiteLLM | LiteLLM virtual keys |
| --- | --- | --- | --- | --- | --- |
| Primary use | IDE coding assistant | IDE coding assistant | Browser chat UI | Team chat UI with proxy | Shared proxy for apps, UI, agents, and teams |
| TKEN base URL path | Only when the installed build exposes compatible custom endpoint settings | Documented through OpenAI-compatible `apiBase` | Direct `https://www.tken.shop/v1` provider URL | Open WebUI calls LiteLLM; LiteLLM calls TKEN | Clients call LiteLLM; LiteLLM calls TKEN |
| First proof | One short chat request in Cursor | One chat or edit request with a low-limit key | `/v1/models`, then one chat in UI | TKEN curl, LiteLLM curl, then UI chat | TKEN curl, proxy route curl, generated key curl |
| Key handling | Local app setting; avoid screenshots and issue logs | Secret references or local settings | Server-side Open WebUI env/admin setting | Open WebUI uses LiteLLM key, not upstream TKEN key | Each user/tool gets a limited virtual key |
| Team control | Limited by installed Cursor behavior | Good for individual or small workspace rollout | Weak unless the Open WebUI deployment adds access controls | Stronger through LiteLLM routes and keys | Strongest option in this set |
| Budget control | Use a low-limit TKEN key | Use a low-limit TKEN key | Use a low-limit TKEN key and UI defaults | LiteLLM route controls plus TKEN key limits | Per-key budgets, RPM/TPM limits, duration, and owner metadata |
| Model discovery | Depends on Cursor settings | Use `/v1/models`, then set model in YAML | Open WebUI can use `/models` or manual model IDs | LiteLLM exposes route names such as `tken-chat` | Virtual keys can restrict which route names are available |
| Production readiness | Test carefully on disposable repos first | Good after limits and file-write approvals are clear | Good for low-volume UI use | Better for team chat rollout | Best for multi-tool governance |

## Integration Patterns

### Continue -> TKEN

Use Continue when your goal is a coding assistant with a documented OpenAI-compatible `apiBase` configuration.

```yaml
models:
  - name: TKEN Chat
    provider: openai
    model: replace-with-an-available-model
    apiBase: https://www.tken.shop/v1
    apiKey: ${{ secrets.TKEN_API_KEY }}
    roles:
      - chat
      - edit
      - apply
```

Before enabling edit or apply roles on a real repository:

- check `https://www.tken.shop/v1/models` with the same key
- run one non-streaming chat completion outside the IDE
- use a low-limit key for first rollout
- keep file-write or agent mode behind human approval
- redact prompts, source snippets, keys, and account data from screenshots or issues

Focused guide: `docs/continue-cursor-coding-tools.md`

### Cursor -> TKEN

Use Cursor only when your installed Cursor version exposes a compatible custom endpoint or base URL setting for the chat model flow.

```text
Base URL: https://www.tken.shop/v1
API key: use a local low-limit TKEN key
Model: choose a model returned by /v1/models
```

Cursor's public API-key documentation is more specific about bring-your-own provider keys than about a universal OpenAI-compatible base URL setting, so validate the installed UI before planning a team rollout.

If your Cursor build only accepts direct provider keys, use Continue or LiteLLM for the OpenAI-compatible endpoint flow.

Focused guide: `docs/continue-cursor-coding-tools.md`

### Open WebUI -> TKEN

Use direct Open WebUI setup when you want the fastest personal or low-volume chat UI test.

```env
ENABLE_OPENAI_API=True
OPENAI_API_BASE_URL=https://www.tken.shop/v1
OPENAI_API_KEY=sk-your-tken-key
```

Direct setup is easiest, but it puts key management and model filtering close to the UI. Before shared use, confirm:

- the same key passes `/v1/models`
- the selected model ID is visible or manually allowed
- a low-cost task model is configured when needed
- passthrough features are not enabled without an access-control review
- logs and screenshots do not expose keys, usage records, or private prompts

Focused guide: `docs/openwebui-direct-tken.md`

### Open WebUI -> LiteLLM -> TKEN

Use LiteLLM between Open WebUI and TKEN when a team needs a central proxy.

```text
Open WebUI
  -> LiteLLM base URL such as http://localhost:4000/v1
  -> LiteLLM route such as tken-chat
  -> TKEN https://www.tken.shop/v1
```

This keeps the upstream TKEN key on the LiteLLM host and lets Open WebUI use a LiteLLM key or virtual key.

Choose this path when you need:

- one UI connection for a team
- stable model aliases such as `tken-chat`
- proxy-side retries, fallbacks, logging, and spend controls
- a route that other internal tools can reuse

Focused guide: `docs/openwebui-litellm-tken-stack.md`

### Tools -> LiteLLM Virtual Keys -> TKEN

Use LiteLLM virtual keys when multiple people, apps, or agents need separate access controls.

```text
App, Open WebUI, Continue, or internal agent
  -> LiteLLM virtual key
  -> LiteLLM route such as tken-chat
  -> TKEN https://www.tken.shop/v1
```

For evaluation keys, set at least:

| Control | Recommended default |
| --- | --- |
| Models | One tested route, such as `tken-chat` |
| Budget | Small fixed amount |
| Duration | Short evaluation window |
| RPM/TPM | Low enough to stop loops |
| Metadata | Owner, environment, source, and use case |

Focused guide: `docs/litellm-virtual-keys-spend-control.md`

## Preflight Flow For Any Choice

Run the same first checks before configuring any UI, IDE, proxy, or agent:

```bash
export TKEN_API_KEY="sk-your-tken-key"
export TKEN_BASE_URL="https://www.tken.shop/v1"
export TKEN_MODEL="replace-with-an-available-model"
```

```bash
curl "$TKEN_BASE_URL/models" \
  -H "Authorization: Bearer $TKEN_API_KEY"
```

Then run the repo tester:

```bash
node tools/endpoint-tester.mjs \
  --base-url "$TKEN_BASE_URL" \
  --api-key-env TKEN_API_KEY \
  --model "$TKEN_MODEL"
```

Do not move to team rollout until:

- `/v1/models` returns the model route you plan to use
- one non-streaming chat completion succeeds
- the tool reads the key from a secret, environment variable, or local setting
- the selected workflow has a daily budget or token stop
- logs and screenshots redact keys, account IDs, private prompts, source code, and usage records
- 401, 404, 429, timeout, and repeated 5xx stop rules are defined

## Which Guide To Read Next

| If you chose | Next guide |
| --- | --- |
| Continue or Cursor | `docs/continue-cursor-coding-tools.md` |
| Open WebUI direct | `docs/openwebui-direct-tken.md` |
| Open WebUI through LiteLLM | `docs/openwebui-litellm-tken-stack.md` |
| LiteLLM virtual keys | `docs/litellm-virtual-keys-spend-control.md` |
| Production rollout | `docs/production-readiness-checklist.md` |
| General evaluation | `docs/api-gateway-evaluation.md` |

## Related Site Guides

- Developer hub: https://www.tken.shop/developers/?utm_source=github&utm_medium=developer_repo&utm_campaign=tken_github_v150&utm_content=tool_selection_comparison&utm_id=gh_v150
- Open WebUI setup: https://www.tken.shop/openwebui-openai-compatible-api/?utm_source=github&utm_medium=developer_repo&utm_campaign=tken_github_v150&utm_content=tool_selection_comparison&utm_id=gh_v150
- LiteLLM setup: https://www.tken.shop/litellm-openai-compatible-gateway/?utm_source=github&utm_medium=developer_repo&utm_campaign=tken_github_v150&utm_content=tool_selection_comparison&utm_id=gh_v150
- Cursor guide: https://www.tken.shop/cursor-openai-compatible-base-url/?utm_source=github&utm_medium=developer_repo&utm_campaign=tken_github_v150&utm_content=tool_selection_comparison&utm_id=gh_v150
- Continue guide: https://www.tken.shop/continue-openai-compatible-api/?utm_source=github&utm_medium=developer_repo&utm_campaign=tken_github_v150&utm_content=tool_selection_comparison&utm_id=gh_v150
- Cost guardrails: https://www.tken.shop/llm-cost-guardrails/?utm_source=github&utm_medium=developer_repo&utm_campaign=tken_github_v150&utm_content=tool_selection_comparison&utm_id=gh_v150
