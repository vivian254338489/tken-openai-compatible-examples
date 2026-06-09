import json
import os
import sys

from openai import OpenAI


api_key = ""
base_url = ""
model = ""
client = None


def normalize_mode(value):
    value = value.strip().lower()
    if value in {"tool", "tool-calls"}:
        return "tools"
    if value in {"structured", "json-mode"}:
        return "json"
    return value


def run_check(name, check):
    try:
        return {"name": name, "ok": True, "detail": check()}
    except Exception as exc:
        return {"name": name, "ok": False, "error": sanitize_error(exc)}


def run_streaming_check():
    stream = client.chat.completions.create(
        model=model,
        stream=True,
        max_tokens=80,
        messages=[
            {
                "role": "user",
                "content": "Reply with one short sentence for a streaming API smoke test.",
            }
        ],
    )

    chunks = 0
    content = ""
    for part in stream:
        delta = part.choices[0].delta.content or ""
        if delta:
            chunks += 1
            content += delta

    if chunks == 0 or not content.strip():
        raise RuntimeError("Streaming completed without content chunks.")

    return {"chunks": chunks, "chars": len(content.strip())}


def run_json_check():
    completion = client.chat.completions.create(
        model=model,
        response_format={"type": "json_object"},
        max_tokens=120,
        messages=[
            {"role": "system", "content": "Return only valid JSON."},
            {
                "role": "user",
                "content": "Return an object with keys ok, feature, and note for a JSON-mode smoke test.",
            },
        ],
    )

    content = completion.choices[0].message.content or ""
    parsed = json.loads(content)
    return {"keys": sorted(parsed.keys()), "chars": len(content)}


def run_tool_call_check():
    completion = client.chat.completions.create(
        model=model,
        max_tokens=120,
        tools=[
            {
                "type": "function",
                "function": {
                    "name": "record_gateway_capability",
                    "description": "Record one OpenAI-compatible gateway capability smoke result.",
                    "parameters": {
                        "type": "object",
                        "properties": {
                            "feature": {"type": "string"},
                            "status": {"type": "string", "enum": ["pass", "review"]},
                            "note": {"type": "string"},
                        },
                        "required": ["feature", "status", "note"],
                        "additionalProperties": False,
                    },
                },
            }
        ],
        tool_choice={
            "type": "function",
            "function": {"name": "record_gateway_capability"},
        },
        messages=[
            {
                "role": "user",
                "content": 'Call the tool with feature "tool_calls", status "pass", and a short note.',
            }
        ],
    )

    tool_calls = completion.choices[0].message.tool_calls or []
    if not tool_calls:
        raise RuntimeError("No tool_calls returned.")

    return {
        "tool_calls": len(tool_calls),
        "names": [call.function.name for call in tool_calls if call.function],
    }


def sanitize_error(exc):
    message = str(exc).replace(api_key or "", "[redacted]")
    status = getattr(exc, "status_code", None) or getattr(exc, "code", None) or "unknown"
    return {"status": status, "message": message[:500]}


def main():
    global api_key, base_url, model, client

    api_key = os.environ.get("TKEN_API_KEY", "")
    base_url = os.environ.get("TKEN_BASE_URL", "https://www.tken.shop/v1")
    model = os.environ.get("TKEN_MODEL", "replace-with-an-available-model")
    modes = {
        normalize_mode(item)
        for item in (
            " ".join(sys.argv[1:]) or os.environ.get("TKEN_CAPABILITY_MODES", "stream,json,tools")
        ).replace(",", " ").split()
    }
    modes = {item for item in modes if item in {"stream", "json", "tools"}}

    if not api_key:
        print("Set TKEN_API_KEY first.", file=sys.stderr)
        raise SystemExit(1)

    if model == "replace-with-an-available-model":
        print("Set TKEN_MODEL to a model id returned by /v1/models.", file=sys.stderr)
        raise SystemExit(1)

    if not modes:
        print("Choose at least one mode: stream, json, tools.", file=sys.stderr)
        raise SystemExit(1)

    client = OpenAI(
        api_key=api_key,
        base_url=base_url,
        timeout=float(os.environ.get("TKEN_SDK_TIMEOUT_SECONDS", "30")),
        max_retries=int(os.environ.get("TKEN_SDK_MAX_RETRIES", "0")),
    )

    results = []
    if "stream" in modes:
        results.append(run_check("stream", run_streaming_check))
    if "json" in modes:
        results.append(run_check("json", run_json_check))
    if "tools" in modes:
        results.append(run_check("tools", run_tool_call_check))

    ok = all(item["ok"] for item in results)
    print(json.dumps({"ok": ok, "base_url": base_url, "model": model, "results": results}, indent=2))

    if not ok:
        raise SystemExit(1)


if __name__ == "__main__":
    main()
