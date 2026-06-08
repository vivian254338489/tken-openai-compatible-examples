# Cursor and Continue Setup Notes

Use these as account-side setup notes. Do not commit API keys.

## Cursor

1. Open model/provider settings.
2. Choose an OpenAI-compatible custom endpoint if available in your Cursor version.
3. Set base URL to:

```text
https://www.tken.shop/v1
```

4. Paste a TKEN API key from the TKEN console.
5. Use a model ID returned by `/v1/models`.
6. Run a small prompt before using an agentic coding workflow.

## Continue

Example `config.json` style entry:

```json
{
  "models": [
    {
      "title": "TKEN OpenAI-compatible",
      "provider": "openai",
      "model": "replace-with-an-available-model",
      "apiBase": "https://www.tken.shop/v1",
      "apiKey": "YOUR_TKEN_API_KEY"
    }
  ]
}
```

For team use, prefer environment-variable or secret-manager injection instead of storing keys in config files.
