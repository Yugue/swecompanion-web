## ReAct: interleaving reasoning and acting

**ReAct** interleaves reasoning about current evidence with actions and observations.

## 1. The cycle

```text
decide what is missing → call tool → observe → update next decision
```

A short decision note can explain the selected action; private reasoning need not be exposed.

## 2. One task, three approaches

“Is order 48812 refundable?”

- Guess from common retail rules: unsupported.
- Follow a fixed path without checking exceptions: incomplete.
- Read order and policy, then inspect the relevant exception: evidence-driven.

```text
order → final_sale tag → policy → manager approval required
```

## 3. Ground decisions

An observation should inform the next choice. It may confirm the plan rather than change it.

Tool results can also be stale, incorrect, or untrusted. Check source and meaning before treating them as facts.

## 4. Plan first or interleave

| Pattern | Strength | Risk |
|---|---|---|
| Up-front plan | Reviewable dependencies | Stale assumptions |
| Interleaving | Adapts to evidence | Local wandering |
| Coarse plan + interleaving | Goal plus flexibility | More state to manage |

Either can batch independent actions.

## 5. Myopia

Repeated searches can each look sensible while producing no answer.

Track what was learned, remaining questions, repeated actions, and remaining budget. A checkpoint can reveal lack of progress.

## 6. Compact iterations

Keep current state, concise observations, and the next evidence need.

Parallelize only ready independent work. Avoid returning large raw payloads.

## 7. When it is unnecessary

If every successful run follows the same known sequence, encode that sequence as a workflow.

Use interleaving when fresh observations can materially affect the path.

## What matters most

> Navigate with the latest observation while keeping the destination visible.
