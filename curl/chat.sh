#!/usr/bin/env sh
set -eu

: "${OPENAI_BASE_URL:=https://www.tken.shop/v1}"
: "${MODEL:=tken-free-model}"

if [ -z "${OPENAI_API_KEY:-}" ]; then
  echo "Set OPENAI_API_KEY first." >&2
  exit 1
fi

curl "$OPENAI_BASE_URL/chat/completions" \
  -H "Authorization: Bearer $OPENAI_API_KEY" \
  -H "Content-Type: application/json" \
  -d "{
    \"model\": \"$MODEL\",
    \"messages\": [
      {\"role\":\"system\",\"content\":\"You are a concise assistant.\"},
      {\"role\":\"user\",\"content\":\"Give me three use cases for low-cost AI models.\"}
    ]
  }"
