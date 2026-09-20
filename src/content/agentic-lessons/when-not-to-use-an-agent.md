## When not to build an agent

Proposing an agent where a workflow would do is one of the fastest ways to look inexperienced in a design interview. Autonomy is expensive, and most production "agents" are - correctly - workflows with one agentic step.

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

## What you should say in an interview

For "a PM wants an agent to process invoices":

> I'd ask three questions before designing anything. First, walk me through three real invoices end to end - if the steps are the same each time, this is a workflow, and a workflow is cheaper, faster, deterministic, and testable with ordinary methods. Second, what happens when it's wrong - if the failure mode is paying the wrong vendor, then whatever we build needs an approval gate on the irreversible step regardless of the architecture. Third, what's the budget per invoice in cents and seconds, because that sets the step cap and the model tier before I draw anything. My prior is that invoice processing is extraction plus validation plus a routing decision, which is one model call and a pipeline. I'd reserve the agentic step for the genuinely open part - the exceptions queue, where the path depends on what the document turns out to be - and I'd keep it bounded with a small tool set and a step cap rather than giving it the whole task.

That completes **Chapter 1 — Agent foundations**. Next topic is **Function calling mechanics**.
