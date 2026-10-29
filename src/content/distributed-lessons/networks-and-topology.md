# 1.5 Networks, Topology, and Communication Cost

## 1. A transfer consumes time and shared capacity

Communication is not a free edge between compute boxes. It involves moving bytes through links, adapters, memory systems, and software queues.

Two devices on the same node may have a fast direct accelerator link. Devices across nodes commonly traverse network adapters and switches. Their bandwidth and contention can differ substantially.

## 2. Start with latency plus bytes

For a message of M bytes, effective bandwidth B bytes per second, and startup latency alpha:

\[
T_{\text{message}}\approx\alpha+\frac{M}{B}
\]

Alpha includes fixed overhead in this simplified model. B is sustainable bandwidth on the actual path, not necessarily its advertised link rate.

A 1-megabyte message at 25 gigabytes/second takes 40 microseconds for its bytes alone. With alpha=10 microseconds, the estimate becomes 50 microseconds. Decimal units are used here: one megabyte is one million bytes.

## 3. Many small messages expose latency

For k sequential messages with total payload M:

\[
T\approx k\alpha+\frac{M}{B}
\]

Combining messages can reduce k without changing useful payload. However, waiting to combine them may delay communication that could otherwise overlap with computation.

For 100 messages of 10 kilobytes, the total payload is still 1 megabyte, but 10-microsecond startups contribute 1 millisecond. One combined message avoids most of those startups under the model.

## 4. Shared links limit aggregate throughput

Two transfers each measured at 25 gigabytes/second in isolation may share one 25-gigabyte/second adapter. Running both concurrently does not create 50 gigabytes/second of capacity.

**Contention** occurs when transfers compete for a resource. **Bisection bandwidth** is the aggregate capacity across a cut dividing the network into two parts; it limits traffic that must cross that cut.

```text
GPU 0 ─┐                      ┌─ GPU 0
GPU 1 ─┼→ shared adapter → switch → shared adapter ┼─ GPU 1
GPU 2 ─┘                      └─ GPU 2
          inter-node traffic competes here
```

## 5. Topology is more than distance

A topology describes which resources are connected and how traffic shares paths. A logical ring used by an algorithm may traverse a physical tree or switched fabric.

| Placement | Potential advantage | Question to check |
|---|---|---|
| Same device | No inter-device transfer | Does the work fit? |
| Same node, direct links | High local bandwidth | Are all pairs equally connected? |
| Different nodes | More aggregate resources | Which adapters and switches are shared? |
| Hierarchical groups | Localize frequent exchange | What must still cross nodes? |

Topology-aware placement maps heavy communication to suitable physical paths.

## 6. Count the right bytes

Distinguish a tensor's logical size, bytes sent by one rank, bytes received by one rank, and aggregate traffic across all ranks.

If each of four workers sends 100 megabytes, total sent traffic is 400 megabytes. Adding receives to that count double-counts each end-to-end payload unless a send-plus-receive accounting convention is explicitly intended.

Full-duplex links can send and receive simultaneously. Their time model should not automatically add the two directions.

## 7. Transfers also touch memory

Communication can consume device-memory bandwidth and require packing, temporary buffers, or host staging. **Remote Direct Memory Access (RDMA)** lets a network adapter access registered memory without routing each payload through CPU copying; accelerator-aware paths can also avoid host staging when supported.

These mechanisms reduce overhead but do not remove link capacity, ordering requirements, or resource contention.

## 8. Predict, then measure the actual path

Use the latency–bandwidth model to distinguish plausible costs from impossible expectations. Measure message sizes, worker count, topology, and concurrent traffic representative of the target application.

**Technical takeaway:** communication cost depends on message count, payload, placement, and shared resources; a device count alone cannot predict scaling.
