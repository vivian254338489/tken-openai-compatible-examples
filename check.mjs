import fs from "node:fs";

const required = [
  "README.md",
  "LICENSE",
  "PROMOTION.md",
  ".env.example",
  "examples/curl-chat.sh",
  "examples/node-chat.mjs",
  "examples/python-chat.py",
  "examples/web-ui-config.js",
  "configs/codex.tken.json",
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

console.log(JSON.stringify({ ok: true, checked: required.length }, null, 2));
