#!/usr/bin/env node

const DEFAULT_BASE_URL = "https://www.tken.shop/v1";
const DEFAULT_API_KEY_ENV = "TKEN_API_KEY";
const DEFAULT_MODEL = "replace-with-an-available-model";

const usage = `OpenAI SDK base URL quickcheck

Usage:
  node tools/openai-sdk-base-url-quickcheck.mjs [options]

Options:
  --base-url <url>       OpenAI-compatible base URL. Defaults to TKEN_BASE_URL, OPENAI_BASE_URL, or ${DEFAULT_BASE_URL}
  --api-key-env <name>   Environment variable that contains the API key. Defaults to ${DEFAULT_API_KEY_ENV}
  --model <id>           Model ID selected from /v1/models. Defaults to TKEN_MODEL
  --json                 Print machine-readable JSON.
  --strict               Exit non-zero when warnings are present.
  --help                 Print this help.

This command does not make network requests and never prints API key values.`;

function parseArgs(argv) {
  const options = {
    baseUrl: process.env.TKEN_BASE_URL || process.env.OPENAI_BASE_URL || DEFAULT_BASE_URL,
    apiKeyEnv: DEFAULT_API_KEY_ENV,
    model: process.env.TKEN_MODEL || DEFAULT_MODEL,
    json: false,
    strict: false,
    help: false,
  };

  for (let index = 0; index < argv.length; index += 1) {
    const arg = argv[index];
    if (arg === "--help" || arg === "-h") {
      options.help = true;
    } else if (arg === "--json") {
      options.json = true;
    } else if (arg === "--strict") {
      options.strict = true;
    } else if (arg === "--base-url") {
      options.baseUrl = requireValue(argv, index, arg);
      index += 1;
    } else if (arg === "--api-key-env") {
      options.apiKeyEnv = requireValue(argv, index, arg);
      index += 1;
    } else if (arg === "--model") {
      options.model = requireValue(argv, index, arg);
      index += 1;
    } else {
      throw new Error(`Unknown option: ${arg}`);
    }
  }

  return options;
}

function requireValue(argv, index, name) {
  const value = argv[index + 1];
  if (!value || value.startsWith("--")) {
    throw new Error(`Missing value for ${name}`);
  }
  return value;
}

function normalizeBaseUrl(value) {
  return value.trim().replace(/\/+$/, "");
}

function buildReport(options) {
  const errors = [];
  const warnings = [];
  const normalizedBaseUrl = normalizeBaseUrl(options.baseUrl || "");
  let parsedUrl = null;

  try {
    parsedUrl = new URL(normalizedBaseUrl);
  } catch {
    errors.push("Base URL is not a valid absolute URL.");
  }

  if (parsedUrl) {
    if (parsedUrl.protocol !== "https:") {
      warnings.push("Use https for remote gateway traffic unless you are testing a local proxy.");
    }

    if (!parsedUrl.pathname.endsWith("/v1")) {
      errors.push("Base URL should end with /v1 for OpenAI SDK compatibility.");
    }

    if (parsedUrl.search || parsedUrl.hash) {
      warnings.push("Base URL should not include query strings or fragments.");
    }
  }

  const apiKeyPresent = Boolean(process.env[options.apiKeyEnv]);
  if (!apiKeyPresent) {
    warnings.push(`API key environment variable ${options.apiKeyEnv} is not set in this shell.`);
  }

  const modelConfigured = Boolean(options.model && options.model !== DEFAULT_MODEL);
  if (!modelConfigured) {
    warnings.push("Model is still a placeholder. Pick a model ID returned by GET /v1/models before running chat.");
  }

  return {
    ok: errors.length === 0 && (!options.strict || warnings.length === 0),
    networkRequests: 0,
    baseURL: normalizedBaseUrl,
    apiKeyEnv: options.apiKeyEnv,
    apiKeyPresent,
    model: modelConfigured ? options.model : null,
    checks: {
      validAbsoluteUrl: Boolean(parsedUrl),
      usesHttps: parsedUrl ? parsedUrl.protocol === "https:" : false,
      endsWithV1: parsedUrl ? parsedUrl.pathname.endsWith("/v1") : false,
      noQueryOrHash: parsedUrl ? !parsedUrl.search && !parsedUrl.hash : false,
      apiKeyEnvConfigured: apiKeyPresent,
      modelConfigured,
    },
    errors,
    warnings,
    nextCommands: [
      `node tools/endpoint-tester.mjs --base-url "${normalizedBaseUrl}" --api-key-env ${options.apiKeyEnv} --skip-chat`,
      `node tools/endpoint-tester.mjs --base-url "${normalizedBaseUrl}" --api-key-env ${options.apiKeyEnv} --model "<model-from-/models>"`,
    ],
    sdkSettings: {
      node: {
        package: "openai",
        option: "baseURL",
        apiKey: `process.env.${options.apiKeyEnv}`,
      },
      python: {
        package: "openai",
        option: "base_url",
        apiKey: `os.environ["${options.apiKeyEnv}"]`,
      },
    },
  };
}

function printText(report) {
  const status = report.ok ? "PASS" : "CHECK";
  console.log(`OpenAI SDK base URL quickcheck: ${status}`);
  console.log(`Base URL: ${report.baseURL}`);
  console.log(`API key env: ${report.apiKeyEnv} (${report.apiKeyPresent ? "set" : "not set"})`);
  console.log(`Model: ${report.model || "not selected"}`);
  console.log(`Network requests: ${report.networkRequests}`);

  if (report.errors.length) {
    console.log("\nErrors:");
    for (const error of report.errors) {
      console.log(`- ${error}`);
    }
  }

  if (report.warnings.length) {
    console.log("\nWarnings:");
    for (const warning of report.warnings) {
      console.log(`- ${warning}`);
    }
  }

  console.log("\nSDK settings:");
  console.log("- Node.js openai: set client option baseURL");
  console.log("- Python openai: set client option base_url");

  console.log("\nNext commands:");
  for (const command of report.nextCommands) {
    console.log(`- ${command}`);
  }
}

try {
  const options = parseArgs(process.argv.slice(2));
  if (options.help) {
    console.log(usage);
    process.exit(0);
  }

  const report = buildReport(options);
  if (options.json) {
    console.log(JSON.stringify(report, null, 2));
  } else {
    printText(report);
  }

  process.exit(report.ok ? 0 : 1);
} catch (error) {
  console.error(error.message);
  console.error("\n" + usage);
  process.exit(1);
}
