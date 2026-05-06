const baseURL = process.env.OPENAI_BASE_URL || "https://www.tken.shop/v1";
const apiKey = process.env.OPENAI_API_KEY;
const model = process.env.MODEL || "tken-free-model";

if (!apiKey) {
  console.error("Set OPENAI_API_KEY first.");
  process.exit(1);
}

async function main() {
  const response = await fetch(`${baseURL}/chat/completions`, {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${apiKey}`,
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      model,
      messages: [
        { role: "system", content: "You are a concise assistant." },
        { role: "user", content: "Give me three use cases for low-cost AI models." }
      ]
    })
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Request failed: ${response.status} ${errorText}`);
  }

  const data = await response.json();
  console.log(data.choices?.[0]?.message?.content || data);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
