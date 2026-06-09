import os
import sys

try:
    from langchain_openai import ChatOpenAI
except ImportError:
    print(
        "Install dependency first: python -m pip install -U langchain-openai",
        file=sys.stderr,
    )
    raise SystemExit(1)


api_key = os.environ.get("TKEN_API_KEY")
base_url = os.environ.get("TKEN_BASE_URL", "https://www.tken.shop/v1")
model = os.environ.get("TKEN_MODEL", "replace-with-an-available-model")

if not api_key:
    print("Set TKEN_API_KEY first.", file=sys.stderr)
    raise SystemExit(1)

if model == "replace-with-an-available-model":
    print("Set TKEN_MODEL to a model id returned by /v1/models.", file=sys.stderr)
    raise SystemExit(1)

chat = ChatOpenAI(
    api_key=api_key,
    base_url=base_url,
    model=model,
    temperature=0,
)

response = chat.invoke("Reply with one short sentence for a LangChain endpoint test.")
print(response.content)

