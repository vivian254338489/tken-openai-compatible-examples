import os
import requests


base_url = os.getenv("OPENAI_BASE_URL", "https://api.tken.shop/v1")
api_key = os.getenv("OPENAI_API_KEY")
model = os.getenv("MODEL", "tken-free-model")

if not api_key:
    raise SystemExit("Set OPENAI_API_KEY first.")

response = requests.post(
    f"{base_url}/chat/completions",
    headers={
        "Authorization": f"Bearer {api_key}",
        "Content-Type": "application/json",
    },
    json={
        "model": model,
        "messages": [
            {"role": "system", "content": "You are a concise assistant."},
            {"role": "user", "content": "Give me three use cases for low-cost AI models."},
        ],
    },
    timeout=60,
)

response.raise_for_status()
data = response.json()
print(data.get("choices", [{}])[0].get("message", {}).get("content", data))
