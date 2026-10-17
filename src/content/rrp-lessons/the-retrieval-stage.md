## What retrieval has to do

**Retrieval**, or candidate generation, finds a manageable pool of eligible items for later scoring and selection. Its goal is useful coverage within a latency and compute budget.

A later ranker can change candidate order. It cannot choose an item absent from that pool.

## 1. Define recall against an explicit reference

If a request has five reference-relevant items and retrieval finds four in 500 candidates, recall@500 is 4/5 = 80%.

For a next-item benchmark with one held-out watched item, the per-request value is 1 or 0. That measures recovery of the recorded item, not recall of every item the user would have enjoyed.

Track relevant slices: new items, niche interests, language, surface, and history length. Average recall can hide a source that fails to admit fresh inventory.

## 2. Use computation that fits the stage

| Source | Ahead of the request | During the request |
|---|---|---|
| Item-neighbor lists | Compute item relationships | Look up neighbors of history items |
| Vector retrieval | Compute item vectors and build an index | Encode the request and search |
| Contextual popularity | Update eligible lists by segment | Select the matching list |

Precomputation moves work; it does not remove it. Index builds, updates, memory, and version compatibility remain part of the cost.

A time budget divided by catalogue size is not a measured per-item runtime: indexed retrieval avoids inspecting every item in the first place.

## 3. Measure the pool after filtering

**Eligibility** means an item is allowed and available for this request. A system retrieving 500 items but removing 450 unavailable ones leaves only 50 candidates.

Use supported filters, partitions, or deliberate over-retrieval, then validate the final eligible set. Recheck hard requirements before display because stock and policy metadata can change after indexing.

Precision is not irrelevant. With a fixed candidate cap, useless entries crowd out useful ones and increase ranking work. Retrieval balances recall, candidate quality, coverage, and cost rather than maximizing one number without limits.

## 4. Tune the handoff empirically

Compare candidate budgets on the same requests. Record held-out-positive recall, final-list quality, downstream feature cost, and end-to-end latency.

When a useful item is missing, ask whether it was eligible, represented, indexed, and searched before blaming the embedding model. When it is present but never selected, inspect its features and scores downstream.

> **Mental image:** retrieval packs the ranker's work tray. A larger tray helps only when its extra contents justify the time needed to inspect them.
