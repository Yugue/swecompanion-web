# Transformer architectures and expert routing

## 1. Choose an information pattern

**Transformer architectures** organize blocks around the information available for a task. Encoders read an available input sequence; causal decoders generate a sequence from its prefix. Encoder–decoder models combine these roles.

The key distinction is allowed information flow, not simply the name attached to a checkpoint.

## 2. Compare the architectures

| Architecture | Reads | Typical use |
|---|---|---|
| Encoder | All valid input positions | Representations and classification |
| Causal decoder | Current and earlier positions | Open-ended generation |
| Encoder–decoder | Full source and target prefix | Conditional sequence generation |

Training objectives determine capabilities alongside architecture.

## 3. Connect source and target

**Cross-attention** takes queries from one sequence and keys/values from another. In translation, the target decoder can consult the fully available source while masking future target positions.

```genai-visual
encoder-decoder
```

## 4. Introduce expert routing

A **mixture-of-experts (MoE)** layer uses a learned router to select a few feed-forward experts for each token. Each expert is a parameterized transformation; selected outputs are combined using routing weights.

A **dense** feed-forward layer runs its full map for each token; the expert layer selects a subset of available maps.

## 5. Separate total and active parameters

```genai-visual
expert-routing
```

A layer with four experts that selects two can store all four while running only two per token. Shared attention, routing, and communication still cost resources.

**Load balancing** encourages traffic to spread across experts. An expert’s **capacity** is its allowed assignments per batch; capacity-limited routing can drop or reroute excess assignments, depending on the design.

## 6. Account for the tradeoff

Sparse activation can add capacity at lower active compute, but total weight memory remains large. Moving tokens between devices adds communication and tail latency.

Choose architecture from task requirements, measured quality, memory, and serving behavior. Parameter count alone does not settle the comparison.
