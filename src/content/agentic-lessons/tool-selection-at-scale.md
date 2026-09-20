## Tool selection at scale

**Give a model five tools and it chooses well. Give it three hundred and it starts guessing.**

Accuracy falls as the catalogue grows. Somewhere between twenty and a few dozen tools, picking the right one stops being a prompting problem and becomes a **retrieval** problem - you have to find the handful of plausible tools before you even ask.

### 1. Why it degrades

Every tool schema sits in the prompt on every turn, so growth costs on three axes at once:

```text
10 tools  →  ~1.5k tokens/turn   selection is easy
50 tools  →  ~8k tokens/turn     near-duplicates get confused
200 tools →  ~30k tokens/turn    most of the window is a menu
```

- **Cost and latency** grow linearly with catalogue size, per step.
- **Accuracy** falls, because near-duplicate descriptions become hard to distinguish.
- **The window shrinks**, leaving less room for the evidence the agent actually needs.

Symptoms to name: two similar tools chosen at random across runs, and a rising rate of "called the right family, wrong tool."

---

### 2. Retrieve tools, then expose them

```text
task ──► embed ──► search tool index ──► top-k schemas ──► model sees only those
```

```python
candidates = tool_index.search(task_description, k=12)
response = model(context, tools=[t.schema for t in candidates])
```

The tool index is built from names, descriptions, and example invocations. This is ordinary retrieval, with the same failure modes - which is why tool descriptions should be written to be *retrievable* as well as readable.

Keep a small set of **always-on** tools (search, finish, escalate) outside the retrieval so the agent is never stranded.

---

### 3. Alternatives that work

| Approach | How | Best when |
|---|---|---|
| Namespacing | `github.*`, `drive.*`; expose one namespace at a time | Tools cluster by system |
| Hierarchical selection | A cheap model picks the domain, then the domain's tools are exposed | Clear domain boundaries |
| Domain subagents | One subagent owns one system's tools and returns findings | Domains are deep, not just wide |
| Consolidation | Merge near-duplicates; delete unused ones | Almost always worth doing first |

Consolidation is the step people skip. Traces usually show a long tail of tools that are never selected, and a handful that are chronically confused with each other.

### Rule of thumb

> Before building tool retrieval, delete the tools nothing ever calls and merge the ones that get confused.

---

### 4. Measure selection on its own

Task success hides where the failure is. Track separately:

```text
selection accuracy   = right tool chosen / decisions
argument accuracy    = right args given the right tool
recall of candidates = true tool present in the retrieved top-k
```

The third is the one that indicts your retriever: if the correct tool wasn't in the candidate set, no prompt change can help.

---

### 5. The 300-API design

```text
1. group APIs by system → one MCP-style server or namespace each
2. write descriptions for retrieval: intent, when-not-to-use, returns
3. build a tool index; retrieve ~10-15 candidates per turn
4. keep always-on: search_tools, escalate, finish
5. for deep domains, route to a subagent that owns that namespace
6. monitor: candidate recall, selection accuracy, tokens per step
```

Note that step 1 is organizational and step 6 is what tells you whether the rest worked.

---

## What matters most

- **Accuracy is not constant in catalogue size.** Past a few dozen tools, near-duplicates get chosen at random and most of the window becomes a menu.
- **Consolidate first.** Traces almost always show a long tail nothing calls and a few pairs that get confused - merging those is free accuracy before any engineering.
- **Then treat selection as retrieval:** index tool descriptions, expose the top ten or fifteen per turn, and keep a few always-on tools so the agent is never stranded.
- **Write tool descriptions to be retrievable,** not just readable, since the same failure modes as document search now apply.
- **Measure candidate recall separately** - whether the right tool was even in the retrieved set. That separates a retriever problem from a model problem, and no prompt fixes the former.

That completes **Chapter 2 — Tool use and function calling**. Next topic is **Chain of thought and its limits**.
