## Serving inside a latency budget

## 1. Deliver the whole recommendation

A **serving architecture** turns a request into a response through features, retrieval, scoring, and selection.

Model execution is only part of request latency.

## 2. Find the critical path

The **critical path** is the chain of dependencies determining completion time.

```rrp-visual
serving-path
```

Independent sources can overlap. The request waits for required results or deadlines, not the sum of every parallel source's duration.

## 3. Measure the slow tail

**p99 latency** is the time within which 99% of measured requests finish.

Measure it end to end under realistic load. Adding stage p99 values does not produce the request's p99 because slow stages need not occur on the same requests.

## 4. Move reusable work earlier

| Work | Possible placement |
|---|---|
| Item vectors / neighbor lists | Offline or incremental update |
| Broad user interests | Periodic summary |
| Current query / session | Request or recent-event path |

Whole-list caching saves work only when requests reuse it. It can also freeze responses or precompute lists nobody requests.

## 5. Bound dependency failures

A **deadline** limits how long a dependency can delay the request. A **fallback** is a defined alternative when the usual path fails.

Batch feature reads where helpful. Test missing inputs and fallback quality; returning fewer valid items can beat filling slots with unavailable ones.

## 6. Preserve the displayed decision

Log request and impression IDs, positions, versions, and fallback use. Server selection and screen rendering are separate events.

Keep a compatible previous model/data bundle for rollback. Outcome linkage belongs to the rendered opportunity, as established in the data chapter.

## 7. Interview reasoning

**Question:** Why can fast model inference coexist with slow recommendations?

**Answer:** Feature fetching, source deadlines, communication, and queueing can dominate the critical path. Profile the whole request before optimizing one model stage.
