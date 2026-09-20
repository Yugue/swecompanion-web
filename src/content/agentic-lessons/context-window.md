## The context window as working memory

The context window is the only memory the model has. It is rebuilt from scratch on every single turn, it is finite, and it is the resource that most often decides whether an agent is fast, cheap, and correct. Context is an engineering budget, not an afterthought.

---

## 1. What gets re-sent every turn

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

### Intuition

A 40-step run with 1,500-token observations sends roughly a million input tokens, even though the "conversation" is only 60,000 tokens long.

---

## 2. The two separate costs

| Cost | Scales with | Felt as |
|---|---|---|
| Money | Total input tokens across turns | Bill |
| Latency | Sequence length within a turn (attention is quadratic) | Slow later steps |
| Accuracy | Ratio of relevant to irrelevant context | Quiet wrongness |

The third row is the one people miss. A long context does not merely cost more - it measurably **degrades** answer quality, because the relevant fact now competes with thousands of tokens of plausible distractors. Retrieval quality also sags in the middle of very long inputs.

### Rule of thumb

> Adding context "just in case" is not free. It costs money, latency, and accuracy at the same time.

---

## 3. Budget the window by line item

Decide the shape before you write the retriever:

```text
  32k budget
  ├── system prompt + rules        1.5k   never evicted
  ├── tool schemas                 2.0k   pruned by relevance
  ├── task state / goal            0.5k   never evicted
  ├── retrieved evidence           8k     re-selected each turn
  ├── recent steps (verbatim)     12k     sliding window
  └── compacted older steps        4k     summarized (Chapter 4)
                                  ────
                         headroom  4k     for the next observation
```

### Rule of thumb

Explicit headroom matters: an agent that fills its window has no room for the observation that would have told it what to do.

---

## 4. The quadratic, with real numbers

A 20-step run. Base prompt 3k, each step adds a 1.5k observation:

```text
turn    what is re-sent                              input tokens
  1     base                                            3,000
  5     base + 4 steps                                   9,000
 10     base + 9 steps                                  16,500
 15     base + 14 steps                                 24,000
 20     base + 19 steps                                 31,500
                                                       ───────
                              total across all turns   345,000
```

The conversation itself is only 33,000 tokens long. You paid for 345,000, because turn 20 re-reads everything turns 1 through 19 produced.

That ratio gets worse as runs get longer:

```text
 5 steps   →   ~2.0× the transcript length
20 steps   →  ~10.5×
40 steps   →  ~20.5×
```

### Core intuition

So the cost of a step is not the step - it is the step plus its contribution to every step after it. An observation you trim at step 3 saves tokens seventeen more times.

---

## 5. Three levers when you run out

1. **Select** - retrieve fewer, better passages instead of more.
2. **Compact** - summarize old turns, keeping identifiers verbatim.
3. **Externalize** - write findings to a file or state store and keep a pointer.

### Rule of thumb

Externalizing is the most under-used and usually the best: a 20-line path plus summary replaces 30,000 tokens of raw output, and the full content is still retrievable.

---

## 6. Order matters for caching

Put stable content first and volatile content last:

```text
[system][tools][static docs]  ←── identical every turn, cacheable
[history][current turn]       ←── changes every turn
```

### Common issue

A timestamp in the system prompt invalidates the entire cached prefix on every call. This is covered fully under prompt caching.

---

## Interview mental model

The model is stateless, so every turn re-sends the whole transcript. Input tokens are therefore the sum of *prefixes*, not the sum of steps:

```text
turn 1:  [system][tools][user]
turn 2:  [system][tools][user][call 1][obs 1]
turn n:  [system][tools][user][ ......... every prior step ......... ]
                                          → grows quadratically
```

That single fact explains three separate costs: **money** (input tokens dominate), **latency** (attention is quadratic in length), and **accuracy** - a long, noisy context measurably degrades answers because the needed fact competes with plausible distractors.

So budget the window by line item, and keep explicit headroom for the next observation. Then reach for three levers in order:

```text
select      retrieve fewer, better passages
compact     summarize old turns, keeping identifiers verbatim
externalize write big artifacts to a file, keep only a pointer
``` Order stable content first so the cache can hit.

Next topic is **System prompts and instruction hierarchy**.
