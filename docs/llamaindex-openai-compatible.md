# LlamaIndex With TKEN

Use this guide when a LlamaIndex application needs an OpenAI-compatible LLM endpoint and you want to route the LLM call through TKEN.

TKEN base URL:

```text
https://www.tken.shop/v1
```

Disclosure: TKEN is an independent third-party API gateway. It is not officially affiliated with LlamaIndex, OpenAI, or other model providers. Model availability, context limits, tool/function support, streaming behavior, and embeddings support can vary by selected TKEN route.

## Before You Change Indexes Or Agents

1. Run `/v1/models` first.
2. Pick one model ID returned by TKEN.
3. Run one non-streaming chat completion outside LlamaIndex.
4. Wire one direct LlamaIndex LLM call.
5. Test streaming, function calling, structured output, embeddings, retrievers, query engines, and agents separately.

```bash
node tools/endpoint-tester.mjs --skip-chat
node tools/endpoint-tester.mjs --model "$TKEN_MODEL"
```

## Environment

```bash
export TKEN_API_KEY="sk-your-tken-key"
export TKEN_BASE_URL="https://www.tken.shop/v1"
export TKEN_MODEL="replace-with-an-available-model"
export TKEN_CONTEXT_WINDOW="8192"
export TKEN_MAX_TOKENS="256"
```

PowerShell:

```powershell
$env:TKEN_API_KEY="sk-your-tken-key"
$env:TKEN_BASE_URL="https://www.tken.shop/v1"
$env:TKEN_MODEL="replace-with-an-available-model"
$env:TKEN_CONTEXT_WINDOW="8192"
$env:TKEN_MAX_TOKENS="256"
```

## Python

Install:

```bash
python -m pip install -U llama-index llama-index-llms-openai-like
```

Minimal LLM check:

```python
import os
from llama_index.llms.openai_like import OpenAILike

llm = OpenAILike(
    model=os.environ["TKEN_MODEL"],
    api_base=os.environ.get("TKEN_BASE_URL", "https://www.tken.shop/v1"),
    api_key=os.environ["TKEN_API_KEY"],
    is_chat_model=True,
    is_function_calling_model=False,
    context_window=int(os.environ.get("TKEN_CONTEXT_WINDOW", "8192")),
    max_tokens=int(os.environ.get("TKEN_MAX_TOKENS", "256")),
)

response = llm.complete("Reply with one short sentence for a LlamaIndex endpoint test.")
print(response)
```

Full runnable example: `examples/llamaindex-openai-compatible.py`.

## Query Engine Guardrail

Do not jump directly from an LLM smoke test to a production `VectorStoreIndex` or agent.

LlamaIndex query engines can involve multiple components:

- LLM route
- embedding model
- vector store
- chunking strategy
- retriever settings
- response synthesizer
- optional tool/function calling

Configure embeddings explicitly before building indexes. Do not assume the same TKEN chat model route also supports embeddings. If your app needs embeddings, validate a returned embedding-capable model route or use a separate approved embedding provider.

## Function Calling And Agents

Keep `is_function_calling_model=False` until the selected route passes a tool-call smoke test. Then test a single read-only tool before enabling multi-step agents.

Recommended sequence:

1. Direct `llm.complete` with a short prompt.
2. Direct streaming call if your UI requires streaming.
3. Structured-output or tool-call smoke test with a low-limit key.
4. Query engine on a tiny private test document.
5. Read-only agent tool with loop limits.
6. Production rollout with request logs, spend limits, and rollback.

## Failure Map

| Symptom | Likely Cause | Action |
| --- | --- | --- |
| 401 | Missing or wrong TKEN key | Recheck local environment and secret injection |
| 404 | Base URL missing `/v1` or wrong route | Use `https://www.tken.shop/v1` |
| Model not found | LlamaIndex config uses an ID not returned by TKEN | Pick from `/v1/models` |
| Embedding errors | Query engine needs an embedding model that was not configured | Configure and validate embeddings separately |
| Tool agent fails | Selected route is not proven for function calling | Keep `is_function_calling_model=False` or choose a tested route |
| Excess cost during indexing | Too many chunks or agent loops | Add token caps, chunk limits, key limits, and small test corpora first |

## Related Guides

- `docs/endpoint-preflight-playbook.md`
- `docs/openai-sdk-capability-smoke.md`
- `docs/agent-mcp-gateway-preflight.md`
- `docs/production-readiness-checklist.md`
- TKEN developer hub: https://www.tken.shop/developers/?utm_source=github&utm_medium=developer_repo&utm_campaign=tken_github_v200&utm_content=llamaindex&utm_id=gh_v200

