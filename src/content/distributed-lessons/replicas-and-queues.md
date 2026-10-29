# 6.1 Serving Replicas, Queues, and Latency–Throughput Tradeoffs

## 1. Inference has an external arrival process

Training usually controls its next batch. Serving receives requests at times and sizes chosen by clients. A fast forward pass can still produce slow responses if requests wait in queues.

A **replica** is a complete executable model instance, possibly distributed over several devices. Independent replicas increase aggregate request capacity; they do not split a single request's computation.

## 2. Follow the request path

```text
request → routing → waiting queue → batch formation
                                    ↓
                            model execution → response
                                    ↑
                         replica capacity and memory
```

End-to-end latency includes routing, waiting, input/output processing, and execution. Network streaming adds observable milestones rather than one final completion time.

For ordinary classifiers or embedding models, a response usually needs one forward computation. Generative models retain request state across many iterations.

## 3. Define the measurements

| Metric | Meaning |
|---|---|
| Request throughput | Completed requests per second |
| Token throughput | Tokens processed/generated per second, with counting convention stated |
| End-to-end latency | Arrival until response completion |
| Tail latency | High percentile, such as the 99th percentile |
| Goodput | Completed useful work meeting the specified quality/service constraints |

Requests vary in size. Ten short requests per second and ten very long requests per second are different loads. State input/output distributions when comparing systems.

## 4. Utilization leaves less room for bursts

Let lambda be average request arrival rate and mu sustainable service rate under a defined workload. A simple utilization ratio is rho=lambda/mu.

As rho approaches one, small bursts or long requests can build persistent queues. Mean arrival below mean capacity is necessary for many stable systems, but does not by itself guarantee acceptable tail latency.

Capacity measured with unlimited waiting is often larger than capacity that satisfies a strict latency objective.

## 5. Little's law connects concurrency and residence time

For a stable system with consistent boundaries:

\[
L=\lambda W
\]

L is the average number of requests in the system, lambda the average completed/accepted rate in steady state, and W average time from entry to exit.

At 80 requests per second and 0.1 seconds average residence, average in-flight concurrency is 8. This does not say every request takes 0.1 seconds or that a concurrency cap of 8 will satisfy burst traffic.

If measuring only the waiting queue, use queue residence time rather than full response time.

## 6. Batching trades waiting for efficient execution

**Dynamic batching** waits briefly to combine compatible requests into one forward operation. Larger batches can improve arithmetic and weight reuse, but consume memory and add batching delay.

The best batch depends on request shape, latency budget, and arrival rate. A batch-size maximum should be paired with a waiting-time policy so low-traffic requests are not delayed indefinitely.

Long requests can cause **head-of-line blocking** when they prevent short requests behind them from using available capacity.

## 7. Routing and backpressure control overload

Routing may use queue length, estimated work, replica health, or cache locality. Equal request counts are not balanced work when sizes differ.

**Backpressure** slows or rejects admission when downstream capacity is exhausted. Bounded queues, deadlines, and cancellation prevent unlimited waiting and memory growth. Retrying every rejected request immediately can intensify overload rather than recover it.

## 8. Keep capacity headroom

One replica failing removes its capacity while requests may be rerouted. A service planned at full aggregate utilization has little room for that event.

Measure representative burstiness, request lengths, batch policy, and failure conditions. Compare tail latency and accepted goodput, not just saturated throughput.

**Technical takeaway:** serving capacity is the amount of useful traffic a system can admit and complete within its response objectives, not simply its fastest forward-pass rate.
