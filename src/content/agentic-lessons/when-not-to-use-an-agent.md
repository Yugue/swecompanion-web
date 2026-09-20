## When not to build an agent

**An agent decides its own steps. A workflow has the steps written down in advance.** The second is cheaper, faster, testable, and predictable - so it wins unless you genuinely need the first.

Proposing an agent where a workflow would do is one of the fastest ways to look inexperienced in a design interview. Most production "agents" are - correctly - workflows with one agentic step.

### 1. The decision, in one diagram

```text
Is the sequence of steps the same every time?
        │ yes                          │ no
        ↓                              ↓
    workflow                 Do you know the step count in advance?
                                   │ yes                │ no
                                   ↓                    ↓
                          bounded workflow      Does recovery need judgment?
                          with a model step          │ no        │ yes
                                                     ↓           ↓
                                              retry logic      agent
```

Three of the four leaves are not agents.

---

### 2. What each option actually costs

| Design | Latency | Cost per request | Debuggability | Handles the unforeseen |
|---|---|---|---|---|
| Single model call | One round trip | Lowest, fixed | Trivial | No |
| Workflow | Fixed, predictable | Fixed | Ordinary tests | Only enumerated cases |
| Workflow + one agentic step | Mostly fixed | Bounded | Good | In that one stage |
| Autonomous agent | Variable | Variable, unbounded without caps | Traces only | Yes |

The "variable" entries are the real story. A product with a p50 of 4 seconds and a p99 of 90 seconds is a different product than one that always takes 6.

---

### 3. Cases that are not agents

- **Classify, extract, rewrite, summarize** - one transformation, one call.
- **Fixed pipeline** - parse, then enrich, then validate, then format. Write the four steps.
- **Known branching** - a router picking one of five handlers is a switch statement with a model condition.
- **Bulk processing** - the same operation over 10,000 rows is a map, and an agent per row is a bill.

### Rule of thumb

> If you can draw the flowchart, ship the flowchart.

---

### 4. What genuinely justifies an agent

All three should hold, not just one:

1. The path is **data-dependent** - what you do at step 3 depends on what step 2 returned.
2. The step count is **unknown in advance** - it might be 2 or 20.
3. Recovery requires **judgment** - a failure has several reasonable responses, and choosing needs context.

Debugging a failing test, investigating an alert, and open-ended research all satisfy all three. "Process invoices" usually satisfies none of them.

---

### 5. The three questions to ask the PM

```text
1. "Walk me through three real examples end to end."
      → if the three look the same, it's a workflow

2. "What happens when it's wrong?"
      → if the answer is 'a customer is charged', autonomy needs gates

3. "What's the budget per request, in cents and seconds?"
      → this sets the step cap and the model tier before any design
```

Asking these is itself part of what's being graded - it shows you cost a design before building it.

---

### 6. Start low, and move the dial with evidence

Begin at the lowest autonomy that could plausibly work: few tools, small step cap, approval on side effects. Then let traces tell you which dial to turn. Every increase should be traceable to a specific run that the previous setting could not handle.

---

## Interview mental model

Three of the four leaves on this tree are not agents:

```text
Are the steps the same every time?
   yes → workflow
   no  → Do you know the step count in advance?
            yes → bounded workflow with a model step
            no  → Does recovery need judgment?
                     no  → retry logic
                     yes → agent
```

All three of these should hold before you reach for autonomy: the path is **data-dependent**, the step count is **unknown**, and recovery requires **judgment**.

Ask the three questions that cost the design before you draw it: walk me through three real examples end to end; what happens when it is wrong; and what is the budget per request in cents and seconds. Then start at the lowest autonomy that could work and turn each dial up only when a trace shows the lower setting failing.

Next topic is **Workflows versus autonomous agents**.
