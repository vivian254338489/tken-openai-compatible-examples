import fs from "node:fs";

const required = [
  "README.md",
  "LICENSE",
  "CHANGELOG.md",
  "PROMOTION.md",
  ".env.example",
  "examples/curl-chat.sh",
  "examples/curl-quickstart.sh",
  "examples/node-chat.mjs",
  "examples/node-openai-sdk.mjs",
  "examples/node-openai-sdk-capability-smoke.mjs",
  "examples/vercel-ai-sdk-openai-compatible.mjs",
  "examples/langchain-js-openai-compatible.mjs",
  "examples/python-chat.py",
  "examples/python-openai-sdk.py",
  "examples/python-openai-sdk-capability-smoke.py",
  "examples/langchain-python-openai-compatible.py",
  "examples/llamaindex-openai-compatible.py",
  "examples/smoke-test.mjs",
  "examples/model-router.mjs",
  "examples/web-ui-config.js",
  "configs/codex.tken.json",
  "configs/cursor-continue-config.md",
  "configs/continue-tken.config.yaml",
  "configs/litellm-config.yaml",
  "configs/litellm-openwebui-tken.yaml",
  "configs/litellm-openwebui-tken.compose.yaml",
  "configs/litellm-virtual-keys-tken.yaml",
  "configs/openwebui-direct-tken.env.example",
  "configs/openwebui.env.example",
  "configs/openwebui-litellm.env.example",
  "configs/openwebui-litellm-docker-compose.env.example",
  "configs/openclaw.tken.json",
  "configs/agent-gateway-preflight.json",
  "configs/mcp-host-gateway-review.json",
  "configs/production-readiness.template.json",
  ".github/workflows/tken-endpoint-smoke.yml",
  "tools/README.md",
  "tools/endpoint-tester.mjs",
  "docs/README.md",
  "docs/api-gateway-evaluation.md",
  "docs/sdk-migration-guide.md",
  "docs/openai-sdk-capability-smoke.md",
  "docs/vercel-ai-sdk-openai-compatible.md",
  "docs/langchain-openai-compatible.md",
  "docs/llamaindex-openai-compatible.md",
  "docs/endpoint-preflight-playbook.md",
  "docs/compatibility-checklist.md",
  "docs/troubleshooting.md",
  "docs/pricing-model-selection.md",
  "docs/cost-guardrails.md",
  "docs/production-readiness-checklist.md",
  "docs/openwebui-direct-tken.md",
  "docs/agent-mcp-gateway-preflight.md",
  "docs/mcp-host-gateway-config.md",
  "docs/openwebui-litellm-tken-stack.md",
  "docs/openwebui-litellm-docker-compose.md",
  "docs/litellm-virtual-keys-spend-control.md",
  "docs/continue-cursor-coding-tools.md",
  "docs/cursor-continue-openwebui-litellm-comparison.md",
  "docs/ci-endpoint-smoke-tests.md",
  "docs/tool-integration-guide.md",
  "docs/demo-script.md",
  "docs/community-disclosure.md",
  ".github/ISSUE_TEMPLATE/bug-report.md",
  ".github/ISSUE_TEMPLATE/compatibility-question.md",
  "docker-compose.openwebui-litellm-tken.yml",
];

const missing = required.filter((file) => !fs.existsSync(file));
if (missing.length) {
  console.error(`Missing files: ${missing.join(", ")}`);
  process.exit(1);
}

for (const file of [
  "configs/codex.tken.json",
  "configs/openclaw.tken.json",
  "configs/agent-gateway-preflight.json",
  "configs/mcp-host-gateway-review.json",
  "configs/production-readiness.template.json",
]) {
  JSON.parse(fs.readFileSync(file, "utf8"));
}

const forbiddenRealKeyPattern = /sk-(?!your-tken-key\b)[A-Za-z0-9_-]{20,}/;
for (const file of required) {
  const content = fs.readFileSync(file, "utf8");
  if (forbiddenRealKeyPattern.test(content)) {
    console.error(`Possible real API key found in ${file}`);
    process.exit(1);
  }
}

console.log(JSON.stringify({ ok: true, checked: required.length }, null, 2));
