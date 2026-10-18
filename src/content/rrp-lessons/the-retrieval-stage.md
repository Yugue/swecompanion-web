## What retrieval has to do

## 1. Pack the ranker's work tray

Retrieval supplies a bounded pool for the expensive ranker. Its practical question is: **which useful eligible items fit within the candidate budget?**

The funnel chapter introduced the stages; here we evaluate the retrieval handoff.

## 2. State the budget

Specify catalogue size, maximum returned candidates, request latency, and downstream scoring cost.

For example, “return up to 500 eligible videos” is a constraint to test, not a universally correct setting.

## 3. Recover reference positives

Five reference-relevant items exist; retrieval returns four in 500 candidates. Recall@500 is **4/5 = 80%**.

With one held-out next item, each request scores either a hit or miss. This does not measure every unknown item the user might enjoy.

## 4. Decide what can be reused

| Source | Ahead of request | During request |
|---|---|---|
| Item neighbors | Build neighbor lists | Look up history neighbors |
| Vector search | Compute item vectors and index | Encode request and search |
| Contextual popularity | Refresh segment lists | Fetch matching list |

Precomputation moves work; updates and memory still cost resources.

## 5. Count after filtering

Returning 500 items and removing 450 unavailable ones leaves only **50** candidates.

Use supported search filters or deliberate over-retrieval, then measure the eligible pool. Useless candidates also consume the cap, so candidate quality matters alongside recall.

## 6. Test the marginal candidates

Compare 200, 500, and 1,000 candidates on identical requests. Measure added useful coverage, final-list quality, feature-fetch work, and end-to-end latency.

Inspect new items and niche interests separately; an average can hide a missing group.

## 7. Interview reasoning

**Question:** Why can high recall@500 coexist with poor serving results?

**Answer:** The reference labels may be narrow, filtering may shrink the pool, or extra candidates may add cost without useful final selections. Inspect the actual handoff.
