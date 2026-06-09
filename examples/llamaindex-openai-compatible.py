import os
import sys

try:
    from llama_index.llms.openai_like import OpenAILike
except ImportError:
    print(
        "Install dependencies first: python -m pip install -U llama-index llama-index-llms-openai-like",
        file=sys.stderr,
    )
    raise SystemExit(1)


api_key = os.environ.get("TKEN_API_KEY")
base_url = os.environ.get("TKEN_BASE_URL", "https://www.tken.shop/v1")
model = os.environ.get("TKEN_MODEL", "replace-with-an-available-model")
context_window = int(os.environ.get("TKEN_CONTEXT_WINDOW", "8192"))
max_tokens = int(os.environ.get("TKEN_MAX_TOKENS", "256"))

if not api_key:
    print("Set TKEN_API_KEY first.", file=sys.stderr)
    raise SystemExit(1)

if model == "replace-with-an-available-model":
    print("Set TKEN_MODEL to a model id returned by /v1/models.", file=sys.stderr)
    raise SystemExit(1)

llm = OpenAILike(
    model=model,
    api_base=base_url,
    api_key=api_key,
    is_chat_model=True,
    is_function_calling_model=False,
    context_window=context_window,
    max_tokens=max_tokens,
)

response = llm.complete(
    "Reply with one short sentence for a LlamaIndex endpoint test."
)
print(response)

