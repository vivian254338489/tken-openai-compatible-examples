# Cursor and Continue Setup Notes

Use these as account-side setup notes. Do not commit API keys.

## Cursor

Cursor's public API key documentation currently focuses on supported provider API keys. It does not present a stable generic OpenAI-compatible `apiBase` config path for every installation.

Use TKEN in Cursor only if your installed Cursor version exposes a compatible custom endpoint or base URL setting.

1. Open model/provider settings.
2. Choose an OpenAI-compatible custom endpoint if available in your Cursor version.
3. Set base URL to:

```text
https://www.tken.shop/v1
```

4. Paste a TKEN API key from the TKEN console.
5. Use a model ID returned by `/v1/models`.
6. Run a small prompt before using an agentic coding workflow.
7. Keep a separate low-limit TKEN key for experiments.

If your Cursor version only accepts provider keys without a custom base URL, use Continue or LiteLLM for the OpenAI-compatible endpoint test instead.

## Continue

Example `config.yaml` entry:

```yaml
name: TKEN Continue
version: 0.0.1
schema: v1

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

For team use, prefer Continue secrets, environment-variable, or secret-manager injection instead of storing keys in config files. See `configs/continue-tken.config.yaml` for a reusable starting point.
