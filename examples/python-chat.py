import json
import os
import sys
import urllib.request

api_key = os.environ.get("TKEN_API_KEY")
base_url = os.environ.get("TKEN_BASE_URL", "https://www.tken.shop/v1")
model = os.environ.get("TKEN_MODEL", "free-model")

if not api_key:
    print("Set TKEN_API_KEY first.", file=sys.stderr)
    raise SystemExit(1)

payload = json.dumps({
    "model": model,
    "messages": [{"role": "user", "content": "Write one sentence about model routing."}],
}).encode("utf-8")

request = urllib.request.Request(
    f"{base_url}/chat/completions",
    data=payload,
    headers={
        "Authorization": f"Bearer {api_key}",
        "Content-Type": "application/json",
    },
    method="POST",
)

with urllib.request.urlopen(request) as response:
    print(response.read().decode("utf-8"))
