# TKEN OpenAI-Compatible Examples

Copy-paste examples for using an OpenAI-compatible API base URL with TKEN.

Default API base:

```text
https://www.tken.shop/v1
```

Get an API key:

```text
https://www.tken.shop/?utm_source=github&utm_medium=readme&utm_campaign=tken_openai_compatible_examples
```

## Examples

| Example | File |
| --- | --- |
| curl chat completion | `examples/curl-chat.sh` |
| Node.js chat completion | `examples/node-chat.mjs` |
| Python chat completion | `examples/python-chat.py` |
| Browser/Web UI config | `examples/web-ui-config.js` |
| Codex-style config | `configs/codex.tken.json` |
| OpenClaw-style config | `configs/openclaw.tken.json` |

## Environment

```env
TKEN_API_KEY=your_tken_api_key
TKEN_BASE_URL=https://www.tken.shop/v1
TKEN_MODEL=free-model
```

## Model Routing Pattern

Use local route names in your application:

```text
free-model    -> summaries, extraction, drafts, batch work
premium-gpt   -> coding, hard reasoning, final answers
```

## Disclosure

This project is TKEN-related tooling. It is not affiliated with OpenAI, Anthropic, ChatGPT, Claude, Codex, or OpenClaw.
