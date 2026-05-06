#!/usr/bin/env sh
set -eu

: "${TKEN_API_KEY:?Set TKEN_API_KEY first}"
TKEN_BASE_URL="${TKEN_BASE_URL:-https://www.tken.shop/v1}"
TKEN_MODEL="${TKEN_MODEL:-free-model}"

curl "$TKEN_BASE_URL/chat/completions" \
  -H "Authorization: Bearer $TKEN_API_KEY" \
  -H "Content-Type: application/json" \
  -d "{\"model\":\"$TKEN_MODEL\",\"messages\":[{\"role\":\"user\",\"content\":\"Write one sentence about model routing.\"}]}"
