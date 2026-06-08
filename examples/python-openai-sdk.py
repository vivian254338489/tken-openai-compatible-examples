import os
import sys

from openai import OpenAI


api_key = os.environ.get("TKEN_API_KEY")
base_url = os.environ.get("TKEN_BASE_URL", "https://www.tken.shop/v1")
model = os.environ.get("TKEN_MODEL", "replace-with-an-available-model")

if not api_key:
    print("Set TKEN_API_KEY first.", file=sys.stderr)
    raise SystemExit(1)

if model == "replace-with-an-available-model":
    print("Set TKEN_MODEL to a model id returned by /v1/models.", file=sys.stderr)
    raise SystemExit(1)

client = OpenAI(api_key=api_key, base_url=base_url)

completion = client.chat.completions.create(
    model=model,
    messages=[
        {
            "role": "user",
            "content": "Reply with one short sentence for an API SDK test.",
        }
    ],
)

print(completion.choices[0].message.content)
