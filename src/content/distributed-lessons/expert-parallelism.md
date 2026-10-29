# 3.6 Expert Parallelism and Conditional Computation

## 1. Execute a subset of a larger model

A **mixture-of-experts (MoE)** layer contains multiple learned expert networks and a router that selects which experts process each token. A token may activate only k of E experts.

This increases available parameter capacity without executing every expert for every token. Total parameter storage still includes all experts, and routing introduces computation, communication, and balancing costs.

## 2. The router defines a sparse computation graph

A router maps each token representation to scores over experts, often converts them to probabilities, and selects a small top-k set. The layer combines selected expert outputs using routing weights.

\[
y(x)=\sum_{e\in\mathcal T(x)}w_e(x)f_e(x)
\]

The token vector is x, expert e computes f_e, T(x) is the selected expert set, and w_e is its combination weight. The selected weights may be renormalized depending on the design.

This is conditional computation, not a permanent assignment of each token position to one device.

## 3. Distribute experts among workers

**Expert parallelism** places different experts on different workers. Tokens are grouped by destination, dispatched, processed by the owners, and returned for combination.

```text
local tokens → router → pack by destination
                         │ All-to-All
                         ↓
                 expert owners compute
                         │ All-to-All
                         ↓
           restore token order → weighted combine
```

The implementation retains routing indices, counts, and token-to-output mappings for both forward and backward.

## 4. Account for routed activation traffic

For N tokens in an expert group, top-k routing, hidden width H, and b bytes per activation element, logical forward dispatch plus return payload is approximately:

\[
V_{\text{forward,total}}\approx2NkHb
\]

This counts payload endpoints before accounting for local destinations, routing metadata, protocol costs, or padding. It is not automatically bytes sent by each rank. Backward introduces corresponding activation-gradient transfers.

More experts need not increase k, but can spread destinations and increase coordination or small-message costs.

## 5. Capacity bounds the work assigned to an expert

A simple capacity policy uses:

\[
C=\left\lceil c\frac{Nk}{E}\right\rceil
\]

C is token assignments allowed per expert, c a capacity factor, and E expert count. Uniform routing would give Nk/E assignments per expert on average.

With N=12, k=1, E=4, and c=1.25, capacity is 4. Loads [6,2,2,2] overload the first expert by two assignments despite unused capacity elsewhere.

Overflow policies include dropping routed contributions, rerouting, or using variable-sized execution. Each changes quality, work, or system requirements.

## 6. Balance is statistical and operational

An overloaded expert makes other workers wait. Router regularization or auxiliary balancing losses encourage more even assignments, but balanced token counts do not guarantee balanced time on heterogeneous devices.

A **dropless** design retains all assignments, avoiding capacity-based omission but requiring efficient variable work and potentially larger memory peaks. Padding every expert to a fixed capacity simplifies shapes while wasting arithmetic on empty slots.

## 7. Backward follows the routes

Gradient contributions must return to the correct token and selected expert weights. Repeated token assignments from top-k routing require combination, not accidental duplication of the objective.

Expert parameters may themselves be replicated or tensor-sharded. Their gradient synchronization groups must match that ownership. The router and shared dense layers can have different replication patterns from expert weights.

## 8. Sparse arithmetic is not a free speedup

| Bottleneck | Why sparsity may not help |
|---|---|
| Parameter memory | Inactive experts still need storage somewhere |
| Token exchange | Network traffic can dominate local expert compute |
| Small expert batches | Too little matrix work for efficient kernels |
| Routing skew | A few owners determine completion time |
| Inference latency | Small request batches make dispatch harder to amortize |

**Technical takeaway:** expert parallelism trades dense arithmetic for conditional routing; evaluate parameter capacity, useful expert batch size, network exchange, and the slowest owner together.
