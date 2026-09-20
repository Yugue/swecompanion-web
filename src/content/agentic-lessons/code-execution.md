## Code execution as a universal tool

Giving an agent a sandbox collapses an unbounded set of operations into one tool. It is the single largest capability jump available, and the single largest security surface. A good interview answer argues both sides.

### 1. Why it is so effective

```text
without code:  parse CSV tool, filter tool, join tool, aggregate tool,
               date-math tool, format tool, chart tool ...  (never complete)

with code:     run_python(src)                               (complete)
```

Two distinct gains:

1. **Coverage.** You cannot enumerate every transformation a user might want. Code can express all of them, including the glue between other tools' outputs.
2. **Exactness.** Arithmetic, date math, sorting, and aggregation move out of token prediction into an interpreter. This repairs the model's weakest area rather than prompting around it.

---

### 2. It also compresses context

```text
tool returns 50,000 rows ──► into the context ──► window gone

code reads 50,000 rows ──► prints 3 numbers ──► into the context
```

Letting the agent write code that processes data *outside* the window, and return only the result, is one of the most effective context-engineering techniques there is.

---

### 3. The sandbox is the control

Generated code is untrusted input. The prompt cannot restrict it, so the environment must.

| Control | Default |
|---|---|
| Network | Off. Allowlist per run if genuinely needed |
| Filesystem | A scratch directory scoped to the run; no host mounts |
| Credentials | None in the environment - no ambient API keys, no cloud metadata access |
| CPU / memory / wall clock | Hard limits, enforced by the sandbox |
| Process isolation | Container or microVM, destroyed after the run |
| Output | Size-capped, so a print loop can't flood the context |

### Rule of thumb

> Assume the code was written by a stranger who read the input data. Because, in the injection case, it was.

---

### 4. The specific risk that makes people nervous

```text
untrusted document ──► agent reads it ──► document contains instructions
                                                  │
                                    agent writes code that follows them
                                                  │
                          code has network + credentials ──► exfiltration
```

The sandbox breaks the chain at the last link: no credentials in the environment and no outbound network means the worst case is a wasted run. This is why "no network, no secrets" is the default and not a hardening step.

---

### 5. Code vs. many narrow tools

| | Code tool | Narrow tools |
|---|---|---|
| Coverage | Open-ended | Only what you built |
| Auditability | Must review generated code | Every call is a named, logged operation |
| Permissioning | Coarse - sandbox-level | Fine - per tool, per argument |
| Failure mode | Silent wrong computation | Explicit tool error |
| Context cost | One schema | Grows with catalogue size |

The common production shape uses both: narrow, permissioned tools for anything with side effects, and a sandboxed code tool for computation over the data those tools return.

---

### 6. Make it debuggable

Log the source, stdout, stderr, exit code, and wall time for every execution. Generated code is the part of a trace you will most often need to read, and an agent that "computed the total" without a visible program is not auditable.

---

## What you should say in an interview

For "argue both sides of giving an agent a code tool":

> In favor: it's the only tool with open-ended coverage, so I don't have to enumerate every transformation a user might want, and it moves exact computation - arithmetic, date math, aggregation - out of token prediction into an interpreter, which fixes the model's weakest area rather than prompting around it. It's also a context-engineering win, because code can process fifty thousand rows outside the window and return three numbers. Against: generated code is untrusted input, and if the agent has read anything from the outside world, the code may be doing what that content asked rather than what the user asked. So the sandbox is the control, not the prompt - no ambient credentials, no outbound network by default, a scratch filesystem scoped to the run, hard CPU and wall-clock limits, and capped output. In production I'd use both shapes: narrow permissioned tools for anything with side effects, where I want per-argument authorization and a named audit entry, and the code tool for computation over what those tools return.

Next topic is **Tool servers and the Model Context Protocol**.
