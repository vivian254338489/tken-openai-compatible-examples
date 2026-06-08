import fs from "node:fs";

const required = [
  "README.md",
  "LICENSE",
  "PROMOTION.md",
  ".env.example",
  "examples/curl-chat.sh",
  "examples/curl-quickstart.sh",
  "examples/node-chat.mjs",
  "examples/node-openai-sdk.mjs",
  "examples/python-chat.py",
  "examples/python-openai-sdk.py",
  "examples/smoke-test.mjs",
  "examples/web-ui-config.js",
  "configs/codex.tken.json",
  "configs/cursor-continue-config.md",
  "configs/litellm-config.yaml",
  "configs/openwebui.env.example",
  "configs/openclaw.tken.json",
];

const missing = required.filter((file) => !fs.existsSync(file));
if (missing.length) {
  console.error(`Missing files: ${missing.join(", ")}`);
  process.exit(1);
}

for (const file of ["configs/codex.tken.json", "configs/openclaw.tken.json"]) {
  JSON.parse(fs.readFileSync(file, "utf8"));
}

const forbiddenRealKeyPattern = /sk-[A-Za-z0-9_-]{20,}/;
for (const file of required) {
  const content = fs.readFileSync(file, "utf8");
  if (forbiddenRealKeyPattern.test(content)) {
    console.error(`Possible real API key found in ${file}`);
    process.exit(1);
  }
}

console.log(JSON.stringify({ ok: true, checked: required.length }, null, 2));
