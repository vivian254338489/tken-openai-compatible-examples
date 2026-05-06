# TKEN OpenAI-Compatible Examples

Minimal examples for calling an OpenAI-compatible multi-model gateway from Node.js, Python, and cURL.

Use these examples to test premium GPT models, selected free/low-cost Chinese models, and model routing through one API format.

## Quick Start

1. Copy `.env.example` to `.env`.
2. Set your gateway base URL and API key.
3. Run one of the examples.

```env
OPENAI_BASE_URL=https://www.tken.shop/v1
OPENAI_API_KEY=your_api_key_here
MODEL=tken-free-model
```

Replace the base URL and model names with the actual values from your TKEN dashboard.

## Examples

| Language | File |
| --- | --- |
| Node.js | `node/chat.js` |
| Python | `python/chat.py` |
| cURL | `curl/chat.sh` |

## Publishing Assets

Use `docs/screenshot-gif-brief.md` to capture terminal screenshots and a short GIF before public launch. Do not expose a real API key in any image.

## Why Use A Multi-Model Gateway?

- Test selected free/low-cost models before paying.
- Use premium GPT only when a task needs stronger reasoning.
- Keep one OpenAI-compatible client in your app.
- Route simple tasks to lower-cost models.

## Try TKEN

https://www.tken.shop/?utm_source=github&utm_medium=readme&utm_campaign=openai_compatible_examples

## License

MIT
