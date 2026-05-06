# Simple Model Routing Pattern

Use task type to choose a model route.

| Task | Suggested Route |
| --- | --- |
| Simple formatting | Free/low-cost model |
| Summaries | Low-cost Chinese model |
| Extraction | Low-cost Chinese model |
| Code reasoning | Premium GPT |
| Final user-facing answer | Premium GPT or balanced route |

## Example Logic

```js
function chooseModel(task) {
  if (task.includes("reason") || task.includes("code")) {
    return "premium-gpt-model";
  }
  return "tken-free-model";
}
```

Try a multi-model gateway:

https://www.tken.shop/?utm_source=github&utm_medium=docs&utm_campaign=model_routing_examples
