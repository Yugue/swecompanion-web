## Deployment and versioning

Prompts, tool schemas, and model choice are production dependencies. They change behavior as surely as code does, and they need the same discipline: version control, pinning, canaries, and a cheap rollback.

### 1. What is versioned

```json
{"agent": "refunds",
 "prompt": "v7",
 "tools": "v3",
 "model": "pinned-id",
 "params": {"temperature": 0.2, "thinking_budget": "low"},
 "limits": {"steps": 12, "usd": 0.20}}
```

All five belong in source control and in every trace. The most common gap is a prompt edited through an admin UI with no version, which makes every subsequent regression unattributable.

### Rule of thumb

> If it changes behavior and isn't in git, you cannot debug the next regression.

---

### 2. Model upgrades are breaking changes

A newer model that scores higher on public benchmarks can still be worse **for your agent**: it may be more verbose, more cautious about a tool you rely on, format arguments differently, or need a different thinking budget.

```text
before switching:
  1. replay recorded traces → diff tool choices, arguments, cost, steps
  2. run the full eval suite, several runs per case, compare pass rates
  3. canary a small traffic slice
  4. compare quality AND cost AND latency AND step count
```

Pin model versions explicitly. Being auto-upgraded underneath a production agent is the scenario this discipline exists to prevent.

---

### 3. Roll out behind a flag

```text
1%  canary   → watch step count, cost, tool error rate, escalations
10% ramp     → quality metrics accumulate enough signal
50% / 100%   → keep the old config warm for one release cycle
```

Watch operational metrics during the canary, not just quality: step count and cost move faster and with less noise than success rate, so they surface a bad rollout first.

---

### 4. Rollback must be cheap

```text
✗  prompt is a string literal in the service → rollback = full deploy = 25 min
✓  config is data, versioned, hot-swappable  → rollback = flip a pointer
```

If reverting takes a deploy pipeline, you will hesitate at exactly the moment you shouldn't. Rollback also has to consider in-flight runs: either let them finish on the old config (they were started under it) or make resumption pin the config version recorded in the run.

---

### 5. Changing tools is riskier than changing prompts

Removing or renaming a tool breaks running agents and invalidates prompt caches. Prefer additive changes, deprecate with an overlap period, and keep the old tool answering with a deprecation note in its observation so the agent is nudged rather than broken.

---

## What you should say in an interview

For "your model is deprecated with 30 days' notice":

> I'd treat it as a breaking dependency change, not a swap. First, replay: take a representative sample of recorded production traces and run them against the new model with the same mocked tools, then diff tool choices, argument construction, step count, and cost. That tells me the shape of the behavior change on real inputs rather than curated ones. Second, the full eval suite with several runs per case, comparing pass rates rather than single runs, plus cost and latency, since a model can be more accurate and still break my budget or my p95. Where behavior differs I'd adjust the prompt and thinking budget for the new model rather than assuming the old settings transfer. Then a canary at one percent watching step count, cost, and tool error rate - those move faster than quality metrics - ramping to ten and fifty percent, keeping the old config hot-swappable so rollback is a pointer flip rather than a deploy. And I'd make sure the model id, prompt version, and tool version are recorded in every trace, so if something does regress mid-migration I can attribute it immediately.

Next topic is **From traces to improvements**.
