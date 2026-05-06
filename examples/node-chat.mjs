const apiKey = process.env.TKEN_API_KEY;
const baseUrl = process.env.TKEN_BASE_URL || "https://www.tken.shop/v1";
const model = process.env.TKEN_MODEL || "free-model";

if (!apiKey) {
  console.error("Set TKEN_API_KEY first.");
  process.exit(1);
}

const response = await fetch(`${baseUrl}/chat/completions`, {
  method: "POST",
  headers: {
    Authorization: `Bearer ${apiKey}`,
    "Content-Type": "application/json",
  },
  body: JSON.stringify({
    model,
    messages: [{ role: "user", content: "Write one sentence about model routing." }],
  }),
});

console.log(await response.text());
