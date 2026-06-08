# Community Disclosure Copy

Use transparent disclosure when sharing this repo in public communities. Do not use fake engagement, vote requests, copied mass replies, or unrelated links.

## Short Disclosure

```text
Disclosure: I work on TKEN-related tooling. TKEN is an independent API gateway and is not officially affiliated with model providers.
```

## GitHub / README Disclosure

```text
TKEN is an independent third-party API gateway. It is not officially affiliated with OpenAI, Anthropic, DeepSeek, MiniMax, Alibaba, Google, xAI, or other model providers.
```

## Forum Reply Pattern

```text
If your app already uses the OpenAI SDK, the lowest-friction test is usually to change the base URL, use a separate test API key, call /v1/models, and run one non-streaming chat completion before moving production traffic.

Disclosure: I work on TKEN-related tooling. This repo defaults to TKEN as one OpenAI-compatible endpoint example, but the checklist is useful for checking any OpenAI-compatible endpoint.
```

## Launch Post Pattern

```text
I built a small CLI tester for OpenAI-compatible API endpoints. It checks /models, validates or selects a model ID, and can run one non-streaming chat completion before you wire the endpoint into an SDK, agent, or UI.

The tester reads keys from environment variables only and does not store or print them.

Disclosure: I work on TKEN-related tooling. The repo defaults to TKEN's endpoint as one example, but the tester can be pointed at any OpenAI-compatible base URL.
```

Public posting is approval-gated. Prepare the exact target, copy, and risk note before posting from any real account.
