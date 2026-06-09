#!/usr/bin/env node

import fs from "node:fs";
import path from "node:path";

const DEFAULT_BASE_URL = "https://www.tken.shop/v1";
const DEFAULT_PROMPT = "Reply with one short sentence for an API endpoint compatibility test.";

function printHelp() {
  console.log(`TKEN smoke evidence runner

Usage:
  node tools/smoke-evidence.mjs [options]

Options:
  --base-url <url>       OpenAI-compatible base URL. Defaults to TKEN_BASE_URL or ${DEFAULT_BASE_URL}
  --api-key-env <name>   Environment variable that contains the API key. Defaults to TKEN_API_KEY
  --model <id>           Model ID to test. If omitted, the first /models id is used
  --skip-chat            Check /models only
  --timeout-ms <number>  Per-request timeout. Defaults to 20000
  --prompt <text>        Chat prompt to send, never stored in evidence output
  --format <type>        Output format: markdown or json. Defaults to markdown
  --json                 Shortcut for --format json
  --out <file>           Write evidence to a file instead of stdout
  --sample               Generate offline sample evidence without network calls or API keys
  --help                 Print this help

The runner reads API keys from environment variables only. Evidence output redacts keys, bearer tokens, long IDs, and private prompt text.`);
}

function parseArgs(argv) {
  const options = {
    baseUrl: process.env.TKEN_BASE_URL || DEFAULT_BASE_URL,
    apiKeyEnv: "TKEN_API_KEY",
    model: process.env.TKEN_MODEL || "",
    skipChat: false,
    timeoutMs: 20000,
    prompt: DEFAULT_PROMPT,
    promptSource: "default",
    format: "markdown",
    out: "",
    sample: false,
  };

  for (let i = 0; i < argv.length; i += 1) {
    const arg = argv[i];
    const next = () => {
      const value = argv[i + 1];
      if (!value || value.startsWith("--")) {
        throw new Error(`Missing value for ${arg}`);
      }
      i += 1;
      return value;
    };

    switch (arg) {
      case "--base-url":
        options.baseUrl = next();
        break;
      case "--api-key-env":
        options.apiKeyEnv = next();
        break;
      case "--model":
        options.model = next();
        break;
      case "--skip-chat":
        options.skipChat = true;
        break;
      case "--timeout-ms":
        options.timeoutMs = Number(next());
        if (!Number.isFinite(options.timeoutMs) || options.timeoutMs <= 0) {
          throw new Error("--timeout-ms must be a positive number");
        }
        break;
      case "--prompt":
        options.prompt = next();
        options.promptSource = "custom";
        break;
      case "--format":
        options.format = next().toLowerCase();
        if (!["markdown", "json"].includes(options.format)) {
          throw new Error("--format must be markdown or json");
        }
        break;
      case "--json":
        options.format = "json";
        break;
      case "--out":
        options.out = next();
        break;
      case "--sample":
        options.sample = true;
        break;
      case "--help":
      case "-h":
        options.help = true;
        break;
      default:
        throw new Error(`Unknown option: ${arg}`);
    }
  }

  options.baseUrl = options.baseUrl.replace(/\/+$/, "");
  return options;
}

function nowIso() {
  return new Date().toISOString();
}

function makeBaseResult(options) {
  return {
    schemaVersion: "tken-smoke-evidence/v1",
    generatedAt: nowIso(),
    target: {
      baseUrl: options.baseUrl,
      apiKeyEnv: options.apiKeyEnv,
      requestedModel: options.model || null,
      selectedModel: null,
      skipChat: options.skipChat,
      timeoutMs: options.timeoutMs,
    },
    safety: {
      apiKeyStored: false,
      apiKeyPrinted: false,
      promptStored: false,
      responseTextStored: false,
      promptSource: options.promptSource,
      redaction: [
        "API keys and bearer tokens",
        "long account, user, order, project, request, trace, and customer IDs",
        "private prompt text",
        "long opaque identifiers in error previews",
      ],
    },
    checks: [],
    summary: {
      ok: false,
      modelsOk: false,
      chatOk: null,
      failureClass: null,
    },
  };
}

function redactText(value) {
  return String(value)
    .replace(/Bearer\s+[A-Za-z0-9._~+/-]+=*/gi, "Bearer [REDACTED]")
    .replace(/sk-[A-Za-z0-9_-]{8,}/g, "sk-[REDACTED]")
    .replace(
      /\b(account|acct|user|order|org|project|customer|request|trace)[_-]?(?:id)?["':=\s]+[A-Za-z0-9_-]{12,}/gi,
      "$1_id=[REDACTED]",
    )
    .replace(/\b[A-Za-z0-9_-]{36,}\b/g, "[REDACTED_LONG_ID]");
}

function truncateError(text) {
  const redacted = redactText(text || "");
  return redacted.length > 800 ? `${redacted.slice(0, 800)}...` : redacted;
}

function classifyFailure(status, bodyText, error) {
  const message = `${bodyText || ""} ${error?.message || ""}`.toLowerCase();
  if (error?.name === "AbortError" || /abort|timeout|timed out/.test(message)) {
    return "timeout";
  }
  if (status === 401) return "auth";
  if (status === 403) return "permission";
  if (status === 404) return "base_url_or_route";
  if (status === 408) return "timeout";
  if (status === 429) return "rate_or_quota";
  if (status >= 500) return "upstream_or_gateway";
  if (/model.*not.*found|invalid.*model|unknown.*model/.test(message)) return "model_selection";
  if (!status) return "network";
  return `http_${status}`;
}

async function fetchWithTimeout(url, init, timeoutMs) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);
  const started = Date.now();
  try {
    const response = await fetch(url, { ...init, signal: controller.signal });
    return { response, durationMs: Date.now() - started };
  } catch (error) {
    return { error, durationMs: Date.now() - started };
  } finally {
    clearTimeout(timer);
  }
}

async function readJsonOrText(response) {
  const text = await response.text();
  if (!text) {
    return { text: "", json: null };
  }
  try {
    return { text, json: JSON.parse(text) };
  } catch {
    return { text, json: null };
  }
}

function addFailedCheck(result, check) {
  result.checks.push(check);
  result.summary.failureClass ||= check.failureClass;
}

async function runRequestEvidence(options) {
  if (typeof fetch !== "function") {
    throw new Error("This runner requires Node.js 18+ with global fetch support.");
  }

  const apiKey = process.env[options.apiKeyEnv];
  if (!apiKey) {
    throw new Error(`Set ${options.apiKeyEnv} first. API keys are read from environment variables only.`);
  }

  const result = makeBaseResult(options);
  const headers = {
    Authorization: `Bearer ${apiKey}`,
    "Content-Type": "application/json",
  };

  const modelsUrl = `${options.baseUrl}/models`;
  const modelsFetch = await fetchWithTimeout(modelsUrl, { headers }, options.timeoutMs);
  const modelsCheck = {
    name: "GET /models",
    ok: false,
    status: null,
    durationMs: modelsFetch.durationMs,
    modelCount: 0,
    sampleModelIds: [],
  };

  if (modelsFetch.error) {
    modelsCheck.failureClass = classifyFailure(null, "", modelsFetch.error);
    modelsCheck.errorPreview = truncateError(modelsFetch.error.message);
    addFailedCheck(result, modelsCheck);
    return result;
  }

  modelsCheck.status = modelsFetch.response.status;
  const modelsBody = await readJsonOrText(modelsFetch.response);
  if (!modelsFetch.response.ok) {
    modelsCheck.failureClass = classifyFailure(modelsFetch.response.status, modelsBody.text);
    modelsCheck.errorPreview = truncateError(modelsBody.text);
    addFailedCheck(result, modelsCheck);
    return result;
  }

  const modelItems = Array.isArray(modelsBody.json?.data) ? modelsBody.json.data : [];
  const modelIds = modelItems.map((item) => item?.id).filter(Boolean);
  modelsCheck.ok = true;
  modelsCheck.modelCount = modelIds.length;
  modelsCheck.sampleModelIds = modelIds.slice(0, 10);
  result.checks.push(modelsCheck);
  result.summary.modelsOk = true;

  const selectedModel = options.model || modelIds[0] || null;
  result.target.selectedModel = selectedModel;

  if (options.skipChat) {
    result.summary.chatOk = null;
    result.summary.ok = true;
    return result;
  }

  if (!selectedModel) {
    const check = {
      name: "POST /chat/completions",
      ok: false,
      status: null,
      durationMs: 0,
      failureClass: "model_selection",
      errorPreview: "No model specified and /models did not return a model id.",
    };
    addFailedCheck(result, check);
    result.summary.chatOk = false;
    return result;
  }

  const chatUrl = `${options.baseUrl}/chat/completions`;
  const chatFetch = await fetchWithTimeout(
    chatUrl,
    {
      method: "POST",
      headers,
      body: JSON.stringify({
        model: selectedModel,
        messages: [{ role: "user", content: options.prompt }],
      }),
    },
    options.timeoutMs,
  );

  const chatCheck = {
    name: "POST /chat/completions",
    ok: false,
    status: null,
    durationMs: chatFetch.durationMs,
    model: selectedModel,
    choiceCount: 0,
    finishReason: null,
    usagePresent: false,
  };

  if (chatFetch.error) {
    chatCheck.failureClass = classifyFailure(null, "", chatFetch.error);
    chatCheck.errorPreview = truncateError(chatFetch.error.message);
    addFailedCheck(result, chatCheck);
    result.summary.chatOk = false;
    return result;
  }

  chatCheck.status = chatFetch.response.status;
  const chatBody = await readJsonOrText(chatFetch.response);
  if (!chatFetch.response.ok) {
    chatCheck.failureClass = classifyFailure(chatFetch.response.status, chatBody.text);
    chatCheck.errorPreview = truncateError(chatBody.text);
    addFailedCheck(result, chatCheck);
    result.summary.chatOk = false;
    return result;
  }

  const choices = Array.isArray(chatBody.json?.choices) ? chatBody.json.choices : [];
  chatCheck.ok = true;
  chatCheck.choiceCount = choices.length;
  chatCheck.finishReason = choices[0]?.finish_reason ?? null;
  chatCheck.usagePresent = Boolean(chatBody.json?.usage);
  result.checks.push(chatCheck);
  result.summary.chatOk = true;
  result.summary.ok = true;
  return result;
}

function makeSampleEvidence(options) {
  const result = makeBaseResult(options);
  result.target.selectedModel = options.model || "sample-model-id";
  result.checks.push({
    name: "GET /models",
    ok: true,
    status: 200,
    durationMs: 123,
    modelCount: 3,
    sampleModelIds: ["sample-model-id", "sample-fast-model", "sample-reasoning-model"],
  });
  if (!options.skipChat) {
    result.checks.push({
      name: "POST /chat/completions",
      ok: true,
      status: 200,
      durationMs: 456,
      model: result.target.selectedModel,
      choiceCount: 1,
      finishReason: "stop",
      usagePresent: true,
    });
    result.summary.chatOk = true;
  }
  result.summary.modelsOk = true;
  result.summary.ok = true;
  result.summary.sample = true;
  return result;
}

function formatMarkdown(result) {
  const rows = result.checks.map((check) => {
    const status = check.status === null ? "" : String(check.status);
    const detail = check.ok
      ? [
          check.modelCount !== undefined ? `models=${check.modelCount}` : "",
          check.choiceCount !== undefined ? `choices=${check.choiceCount}` : "",
          check.finishReason ? `finish=${check.finishReason}` : "",
          check.usagePresent ? "usage_present=true" : "",
        ]
          .filter(Boolean)
          .join(", ")
      : `${check.failureClass || "failed"}${check.errorPreview ? `: ${check.errorPreview}` : ""}`;
    return `| ${check.name} | ${check.ok ? "pass" : "fail"} | ${status} | ${check.durationMs} | ${detail.replace(/\|/g, "\\|")} |`;
  });

  const modelLines = result.checks.find((check) => check.name === "GET /models")?.sampleModelIds || [];
  const modelList = modelLines.length ? modelLines.map((id) => `- ${id}`).join("\n") : "- none recorded";

  return `# TKEN Smoke Evidence

- Generated: ${result.generatedAt}
- Base URL: ${result.target.baseUrl}
- API key source: ${result.target.apiKeyEnv}
- Requested model: ${result.target.requestedModel || "auto"}
- Selected model: ${result.target.selectedModel || "none"}
- Chat check: ${result.target.skipChat ? "skipped" : "enabled"}
- Overall result: ${result.summary.ok ? "pass" : "fail"}
- Failure class: ${result.summary.failureClass || "none"}

## Checks

| Check | Result | HTTP | Duration ms | Detail |
| --- | --- | --- | ---: | --- |
${rows.join("\n")}

## Sample Model IDs

${modelList}

## Redaction Notes

- API keys and bearer tokens are not stored or printed.
- Prompt text is not stored; prompt source is \`${result.safety.promptSource}\`.
- Response text is not stored.
- Error previews are truncated and redacted for keys, bearer tokens, long IDs, and opaque identifiers.

Disclosure: TKEN is an independent third-party OpenAI-compatible API gateway and is not officially affiliated with OpenAI or other model providers.
`;
}

function formatOutput(result, format) {
  if (format === "json") {
    return `${JSON.stringify(result, null, 2)}\n`;
  }
  return formatMarkdown(result);
}

function writeOutput(output, outPath) {
  if (!outPath) {
    process.stdout.write(output);
    return;
  }

  const dir = path.dirname(path.resolve(outPath));
  fs.mkdirSync(dir, { recursive: true });
  fs.writeFileSync(outPath, output, "utf8");
  console.log(`Wrote smoke evidence to ${outPath}`);
}

async function main() {
  const options = parseArgs(process.argv.slice(2));
  if (options.help) {
    printHelp();
    return;
  }

  const result = options.sample ? makeSampleEvidence(options) : await runRequestEvidence(options);
  writeOutput(formatOutput(result, options.format), options.out);

  if (!result.summary.ok) {
    process.exitCode = 1;
  }
}

main().catch((error) => {
  console.error(`Error: ${error.message}`);
  process.exitCode = 1;
});
