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
