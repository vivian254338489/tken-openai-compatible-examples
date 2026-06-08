# TKEN Developer Docs

These docs are for developers testing TKEN as an independent OpenAI-compatible API gateway.

Start with the CLI tester, then migrate one SDK call, then add cost and reliability guardrails before routing production traffic.

## Recommended Order

1. Run `node tools/endpoint-tester.mjs --skip-chat` to confirm `/v1/models`.
2. Pick one model ID returned by `/v1/models`.
3. Run a non-streaming chat completion with the tester.
4. Switch one OpenAI SDK integration to `https://www.tken.shop/v1`.
5. Add timeouts, retries, token caps, logging, and budget limits.
6. Test streaming, tool calls, JSON output, and embeddings only if your app uses them.

## Guides

| Need | Guide |
| --- | --- |
| Move an existing SDK app | `docs/sdk-migration-guide.md` |
| Check endpoint behavior before launch | `docs/compatibility-checklist.md` |
| Debug setup errors | `docs/troubleshooting.md` |
| Control spend and routing | `docs/cost-guardrails.md` |
| Configure tools and agents | `docs/tool-integration-guide.md` |
| Prepare a demo or launch recording | `docs/demo-script.md` |
| Share or launch transparently | `docs/community-disclosure.md` |

## Site Links

- Developer hub: https://www.tken.shop/developers/?utm_source=github&utm_medium=developer_repo&utm_campaign=tken_dev_assets&utm_content=docs_index
- Quickstart: https://www.tken.shop/quickstart/?utm_source=github&utm_medium=developer_repo&utm_campaign=tken_dev_assets&utm_content=docs_index
- SDK base URL guide: https://www.tken.shop/openai-sdk-base-url/?utm_source=github&utm_medium=developer_repo&utm_campaign=tken_dev_assets&utm_content=docs_index
- Pricing: https://www.tken.shop/pricing?utm_source=github&utm_medium=developer_repo&utm_campaign=tken_dev_assets&utm_content=docs_index
- Tool integration: https://www.tken.shop/developers/?utm_source=github&utm_medium=developer_repo&utm_campaign=tken_dev_assets&utm_content=docs_tool_integration

Disclosure: TKEN is an independent third-party API gateway and is not officially affiliated with model providers.
