## The context window as working memory

The context window is the only memory the model has. It is rebuilt from scratch on every single turn, it is finite, and it is the resource that most often decides whether an agent is fast, cheap, and correct. Context is an engineering budget, not an afterthought.

### 1. What gets re-sent every turn

```text
turn 1:  [system][tools][user]
turn 2:  [system][tools][user][call 1][obs 1]
turn 3:  [system][tools][user][call 1][obs 1][call 2][obs 2]
turn n:  [system][tools][user][ ................ all prior steps ................ ]
```

Nothing is remembered by the model between calls. Continuity is an illusion produced by resending the transcript.

So the input tokens for a run are not the sum of the steps - they are the sum of the **prefixes**:

\[
\text{input tokens} \approx \sum_{i=1}^{n} \big(\text{base} + \textstyle\sum_{j<i} s_j\big) \;=\; O(n^2)
\]

A 40-step run with 1,500-token observations sends roughly a million input tokens, even though the "conversation" is only 60,000 tokens long.

---

### 2. The two separate costs

| Cost | Scales with | Felt as |
|---|---|---|
| Money | Total input tokens across turns | Bill |
| Latency | Sequence length within a turn (attention is quadratic) | Slow later steps |
| Accuracy | Ratio of relevant to irrelevant context | Quiet wrongness |

The third row is the one people miss. A long context does not merely cost more - it measurably **degrades** answer quality, because the relevant fact now competes with thousands of tokens of plausible distractors. Retrieval quality also sags in the middle of very long inputs.

### Rule of thumb

> Adding context "just in case" is not free. It costs money, latency, and accuracy at the same time.

---

### 3. Budget the window by line item

Decide the shape before you write the retriever:

```text
  32k budget
  ├── system prompt + rules        1.5k   never evicted
  ├── tool schemas                 2.0k   pruned by relevance
  ├── task state / goal            0.5k   never evicted
  ├── retrieved evidence           8k     re-selected each turn
  ├── recent steps (verbatim)     12k     sliding window
  └── compacted older steps        4k     summarized
                                  ────
                         headroom  4k     for the next observation
```

Explicit headroom matters: an agent that fills its window has no room for the observation that would have told it what to do.

---

### 4. Three levers when you run out

1. **Select** - retrieve fewer, better passages instead of more.
2. **Compact** - summarize old turns, keeping identifiers verbatim.
3. **Externalize** - write findings to a file or state store and keep a pointer.

Externalizing is the most under-used and usually the best: a 20-line path plus summary replaces 30,000 tokens of raw output, and the full content is still retrievable.

---

### 5. Order matters for caching

Put stable content first and volatile content last:

```text
[system][tools][static docs]  ←── identical every turn, cacheable
[history][current turn]       ←── changes every turn
```

A timestamp in the system prompt invalidates the entire cached prefix on every call. This is covered fully under prompt caching.

---

## What you should say in an interview

For "your 40-step agent run costs 12x your estimate":

> Almost certainly the prefix effect. The model is stateless, so every turn re-sends the whole transcript - system prompt, tool schemas, and every prior call and observation. That means input tokens grow with the sum of prefixes, which is quadratic in step count, not linear. I'd confirm it from traces by plotting input tokens per step rather than totals. The fixes in order of payoff: cut the number of steps, shrink what each observation contributes - returning the three fields the agent needs instead of the whole API payload - then compact older turns into a summary that keeps identifiers verbatim, and externalize large artifacts to a file with a pointer in context. I'd also check prompt-cache hit rate, because if anything volatile sits early in the prompt we're paying full price for a prefix that should be nearly free.

Next topic is **Structured output and schemas**.
