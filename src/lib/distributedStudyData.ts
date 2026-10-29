import type { MlPart, MlTopic } from "./mlStudyData";

export const DISTRIBUTED_DOMAIN = "Distributed Machine Learning";
export interface DistributedTopic extends MlTopic { prerequisites: string[] }
export interface DistributedPart extends Omit<MlPart, "topics"> { topics: DistributedTopic[] }

// Empty interviewPrompt fields preserve the shared topic shape; this guide has no interview sections.
export const distributedParts: DistributedPart[] = [
  {
    "id": "execution-foundations",
    "number": "1",
    "title": "Foundations of Distributed ML Execution",
    "description": "Build the neural, accelerator, process, and network foundations needed to reason about distributed execution.",
    "color": "#4285F4",
    "icon": "Blocks",
    "topics": [
      {
        "id": "computation-graphs",
        "title": "Tensors, Neural Networks, and Computation Graphs",
        "summary": "Distributed execution partitions a dependency graph; tensor shapes determine which intermediate values and gradients must move.",
        "keyPoints": [
          "Tensor shapes specify which values can be partitioned.",
          "Backward dependencies determine when gradients are ready."
        ],
        "interviewPrompt": "",
        "prerequisites": []
      },
      {
        "id": "optimization-state",
        "title": "Gradient-Based Learning and Optimizer State",
        "summary": "An optimizer changes parameters and persistent historical state using gradients of a precisely weighted objective.",
        "keyPoints": [
          "Optimizer state persists across training steps.",
          "Averaging losses and summing losses imply different gradient scales."
        ],
        "interviewPrompt": "",
        "prerequisites": [
          "computation-graphs"
        ]
      },
      {
        "id": "gpu-execution",
        "title": "GPU Computation and the Memory Hierarchy",
        "summary": "GPU performance depends on arithmetic, memory traffic, launch overhead, and the dependencies between asynchronous operations.",
        "keyPoints": [
          "Device memory capacity and memory bandwidth are different constraints.",
          "Asynchronous kernel submission makes host timing misleading."
        ],
        "interviewPrompt": "",
        "prerequisites": [
          "computation-graphs"
        ]
      },
      {
        "id": "workers-and-synchronization",
        "title": "Processes, Workers, and Synchronization",
        "summary": "Workers run on separate timelines and address spaces; ranks, groups, and synchronization define how they cooperate.",
        "keyPoints": [
          "A rank identifies a worker inside a process group.",
          "Correct execution requires matching communication and compatible dependencies."
        ],
        "interviewPrompt": "",
        "prerequisites": [
          "gpu-execution"
        ]
      },
      {
        "id": "networks-and-topology",
        "title": "Networks, Topology, and Communication Cost",
        "summary": "Message startup, payload, topology, and shared-link contention determine the cost of moving tensors.",
        "keyPoints": [
          "Small messages pay latency; large messages expose bandwidth limits.",
          "Within-node and between-node links have different shared bottlenecks."
        ],
        "interviewPrompt": "",
        "prerequisites": [
          "workers-and-synchronization"
        ]
      }
    ],
    "quizQuestionCount": 0
  },
  {
    "id": "data-and-optimization",
    "number": "2",
    "title": "Distributed Data and Optimization",
    "description": "Trace data ownership, gradient communication, synchronization, and the optimization objective.",
    "color": "#34A853",
    "icon": "Share2",
    "topics": [
      {
        "id": "collective-communication",
        "title": "Collective Communication and Data Movement",
        "summary": "Collective operations combine or redistribute tensors with specific output ownership and communication costs.",
        "keyPoints": [
          "Collectives specify both a mathematical result and a distributed layout.",
          "Ring communication volume is measured per rank, not as a single global message."
        ],
        "interviewPrompt": "",
        "prerequisites": [
          "networks-and-topology"
        ]
      },
      {
        "id": "synchronous-data-parallelism",
        "title": "Synchronous Data Parallelism and Gradient Aggregation",
        "summary": "Synchronous data parallelism combines gradients from different examples before each replica makes a consistent update.",
        "keyPoints": [
          "Equal local mean gradients can be averaged directly only with equal objective weights.",
          "Identical gradients preserve replicas only when optimizer state and updates also agree."
        ],
        "interviewPrompt": "",
        "prerequisites": [
          "optimization-state",
          "collective-communication"
        ]
      },
      {
        "id": "distributed-input-pipelines",
        "title": "Distributed Input Pipelines and Evaluation",
        "summary": "Distributed input and evaluation pipelines must preserve record ownership, supply workers efficiently, and aggregate valid metric ingredients.",
        "keyPoints": [
          "Training sharding and evaluation sharding have different duplication constraints.",
          "A global metric requires its sufficient statistics, not always local score averages."
        ],
        "interviewPrompt": "",
        "prerequisites": [
          "synchronous-data-parallelism"
        ]
      },
      {
        "id": "global-batch-and-convergence",
        "title": "Global Batch Size, Accumulation, and Convergence",
        "summary": "Global batch size and accumulation determine the gradient estimator and update frequency, changing both system throughput and learning.",
        "keyPoints": [
          "Effective batch size counts independent data replicas, not model-parallel devices.",
          "A larger batch changes optimization as well as throughput."
        ],
        "interviewPrompt": "",
        "prerequisites": [
          "synchronous-data-parallelism",
          "distributed-input-pipelines"
        ]
      },
      {
        "id": "parameter-servers-and-staleness",
        "title": "Parameter Servers, Staleness, and Local Updates",
        "summary": "Parameter ownership and synchronization frequency determine which model version a gradient describes and how much communication it requires.",
        "keyPoints": [
          "Parameter servers separate parameter ownership from gradient computation.",
          "Stale gradients and local updates change the optimization trajectory."
        ],
        "interviewPrompt": "",
        "prerequisites": [
          "global-batch-and-convergence"
        ]
      }
    ],
    "quizQuestionCount": 0
  },
  {
    "id": "memory-and-partitioning",
    "number": "3",
    "title": "Memory Efficiency and Model Partitioning",
    "description": "Fit larger models by choosing which states and operations to distribute, retain, or recompute.",
    "color": "#A142F4",
    "icon": "Layers",
    "topics": [
      {
        "id": "memory-and-precision",
        "title": "Training Memory Budgets and Numerical Precision",
        "summary": "Peak training memory includes persistent state, live activations, temporary tensors, and precision-dependent numerical behavior.",
        "keyPoints": [
          "Peak memory includes transient gathered parameters and communication buffers.",
          "Storage, compute, and reduction precision can differ."
        ],
        "interviewPrompt": "",
        "prerequisites": [
          "optimization-state",
          "gpu-execution"
        ]
      },
      {
        "id": "state-sharding",
        "title": "Sharding Parameters, Gradients, and Optimizer State",
        "summary": "State sharding reduces redundant persistent storage by assigning parameter, gradient, and optimizer ownership to different workers.",
        "keyPoints": [
          "Persistent shards do not eliminate temporary unsharded memory.",
          "State sharding preserves data-parallel semantics while changing state ownership."
        ],
        "interviewPrompt": "",
        "prerequisites": [
          "memory-and-precision",
          "collective-communication"
        ]
      },
      {
        "id": "tensor-sequence-context-parallelism",
        "title": "Tensor, Sequence, and Context Parallelism",
        "summary": "Tensor and sequence partitions divide different axes of layer computation and require explicit forward and backward layout conversions.",
        "keyPoints": [
          "Tensor partitions require matching forward and backward layouts.",
          "Sequence activation sharding differs from distributing attention over context."
        ],
        "interviewPrompt": "",
        "prerequisites": [
          "computation-graphs",
          "collective-communication"
        ]
      },
      {
        "id": "pipeline-parallelism",
        "title": "Pipeline Parallelism and Microbatch Scheduling",
        "summary": "Pipeline parallelism partitions successive layers and schedules microbatches while preserving the intended parameter version and update boundary.",
        "keyPoints": [
          "Pipeline stages exchange activations forward and activation gradients backward.",
          "Microbatches reduce bubbles but introduce scheduling and memory tradeoffs."
        ],
        "interviewPrompt": "",
        "prerequisites": [
          "tensor-sequence-context-parallelism",
          "global-batch-and-convergence"
        ]
      },
      {
        "id": "recomputation-and-offloading",
        "title": "Activation Recomputation, Offloading, and Memory Traffic",
        "summary": "Recomputation, offloading, and tiled execution trade retained device memory for arithmetic, transfers, and scheduling complexity.",
        "keyPoints": [
          "Recomputation spends compute to avoid retaining intermediates.",
          "Offloading must fit transfer bandwidth and staging-memory budgets."
        ],
        "interviewPrompt": "",
        "prerequisites": [
          "memory-and-precision",
          "tensor-sequence-context-parallelism"
        ]
      },
      {
        "id": "expert-parallelism",
        "title": "Expert Parallelism and Conditional Computation",
        "summary": "Expert parallelism executes selected networks for each token, trading dense arithmetic for routing, communication, and variable work.",
        "keyPoints": [
          "Only selected experts execute for each token.",
          "Routing imbalance and token exchange can dominate sparse arithmetic savings."
        ],
        "interviewPrompt": "",
        "prerequisites": [
          "tensor-sequence-context-parallelism",
          "collective-communication"
        ]
      }
    ],
    "quizQuestionCount": 0
  },
  {
    "id": "scaling-training",
    "number": "4",
    "title": "Composing and Scaling Training Systems",
    "description": "Compose parallel strategies and measure useful scale, overlap, and load balance.",
    "color": "#F9AB00",
    "icon": "TrendingUp",
    "topics": [
      {
        "id": "hybrid-parallelism",
        "title": "Hybrid Parallelism and Topology-Aware Placement",
        "summary": "Hybrid parallelism composes explicit device groups so the model fits and frequent exchanges use suitable physical links.",
        "keyPoints": [
          "Each parallel axis needs a precise process-group membership.",
          "Frequent communication should remain on the strongest available links when possible."
        ],
        "interviewPrompt": "",
        "prerequisites": [
          "state-sharding",
          "pipeline-parallelism",
          "expert-parallelism"
        ]
      },
      {
        "id": "scaling-efficiency",
        "title": "Scaling Efficiency, Time to Quality, and Cost",
        "summary": "Useful scaling depends on fixed work, parallel efficiency, time to target quality, and the resources consumed to reach it.",
        "keyPoints": [
          "Strong scaling holds work fixed; weak scaling grows work with the system.",
          "Time to quality and accelerator-hours reveal costs hidden by throughput."
        ],
        "interviewPrompt": "",
        "prerequisites": [
          "hybrid-parallelism",
          "global-batch-and-convergence"
        ]
      },
      {
        "id": "profiling-and-overlap",
        "title": "Profiling and Communication–Computation Overlap",
        "summary": "Execution traces expose the critical path and show whether communication is hidden or merely competing with compute.",
        "keyPoints": [
          "Only work off the critical path can hide communication.",
          "Concurrent streams can still compete for the same bandwidth."
        ],
        "interviewPrompt": "",
        "prerequisites": [
          "scaling-efficiency",
          "gpu-execution"
        ]
      },
      {
        "id": "stragglers-and-scheduling",
        "title": "Stragglers, Load Imbalance, and Work Scheduling",
        "summary": "Stragglers determine synchronous completion time; balancing actual work must preserve data weights and collective participation.",
        "keyPoints": [
          "Synchronous completion is determined by the slowest participating worker.",
          "Balance actual work while preserving sample weights and collective order."
        ],
        "interviewPrompt": "",
        "prerequisites": [
          "profiling-and-overlap",
          "distributed-input-pipelines"
        ]
      }
    ],
    "quizQuestionCount": 0
  },
  {
    "id": "correctness-and-recovery",
    "number": "5",
    "title": "Correctness, Reliability, and Recovery",
    "description": "Validate the computation, diagnose coordinated failures, and recover consistent training state.",
    "color": "#EA4335",
    "icon": "Wrench",
    "topics": [
      {
        "id": "numerical-correctness",
        "title": "Validating Distributed Numerical Correctness",
        "summary": "Distributed correctness preserves the intended objective and state transition within justified numerical tolerances.",
        "keyPoints": [
          "Reference comparisons require the same objective, data, and update boundary.",
          "Global clipping must count each unique gradient element exactly once."
        ],
        "interviewPrompt": "",
        "prerequisites": [
          "memory-and-precision",
          "state-sharding",
          "global-batch-and-convergence"
        ]
      },
      {
        "id": "multi-node-failure-diagnosis",
        "title": "Multi-Node Execution and Failure Diagnosis",
        "summary": "Multi-node execution depends on consistent membership, device placement, communication contracts, and coordinated failure handling.",
        "keyPoints": [
          "Rendezvous discovers workers but does not guarantee network connectivity.",
          "One failed rank can strand all peers waiting on a collective."
        ],
        "interviewPrompt": "",
        "prerequisites": [
          "workers-and-synchronization",
          "collective-communication"
        ]
      },
      {
        "id": "checkpointing-and-recovery",
        "title": "Consistent Checkpoints and Fault Recovery",
        "summary": "Reliable restart restores a consistent, fully committed snapshot of model, optimizer, randomness, and consumed data.",
        "keyPoints": [
          "A resumable checkpoint includes optimizer, randomness, and data progress.",
          "Publish a checkpoint only after all required shards are durable."
        ],
        "interviewPrompt": "",
        "prerequisites": [
          "numerical-correctness",
          "multi-node-failure-diagnosis"
        ]
      }
    ],
    "quizQuestionCount": 0
  },
  {
    "id": "distributed-inference",
    "number": "6",
    "title": "Distributed Inference and Serving",
    "description": "Serve ordinary predictions and generative models under memory, latency, capacity, and reliability constraints.",
    "color": "#00ACC1",
    "icon": "Network",
    "topics": [
      {
        "id": "replicas-and-queues",
        "title": "Serving Replicas, Queues, and Latency–Throughput Tradeoffs",
        "summary": "Inference capacity depends on queueing, batching, request shape, and response objectives as well as model execution speed.",
        "keyPoints": [
          "Queueing latency rises near saturation.",
          "Replication increases aggregate capacity without splitting a single request."
        ],
        "interviewPrompt": "",
        "prerequisites": [
          "scaling-efficiency"
        ]
      },
      {
        "id": "prefill-decode-and-kv-cache",
        "title": "Autoregressive Inference: Prefill, Decode, and Cached State",
        "summary": "Autoregressive generation separates prompt prefill from repeated decoding and retains key–value state for each active history.",
        "keyPoints": [
          "Prefill processes a known prompt; decode advances each sequence one token at a time.",
          "KV-cache memory grows with retained tokens and key–value heads."
        ],
        "interviewPrompt": "",
        "prerequisites": [
          "tensor-sequence-context-parallelism",
          "replicas-and-queues"
        ]
      },
      {
        "id": "model-parallel-inference",
        "title": "Model-Parallel Inference and Replica Placement",
        "summary": "Model-parallel inference trades per-request memory and arithmetic against communication and the capacity of independent replicas.",
        "keyPoints": [
          "Training placement is not automatically optimal for inference.",
          "A distributed replica forms a joint scheduling and failure unit."
        ],
        "interviewPrompt": "",
        "prerequisites": [
          "hybrid-parallelism",
          "prefill-decode-and-kv-cache"
        ]
      },
      {
        "id": "continuous-batching",
        "title": "Continuous Batching and Inference Memory Management",
        "summary": "Continuous batching schedules token iterations while managing growing cache state, allocation efficiency, and latency fairness.",
        "keyPoints": [
          "Continuous batching changes membership at token-iteration boundaries.",
          "Paging improves allocation efficiency but does not remove live cache bytes."
        ],
        "interviewPrompt": "",
        "prerequisites": [
          "prefill-decode-and-kv-cache",
          "model-parallel-inference"
        ]
      },
      {
        "id": "disaggregated-serving",
        "title": "Serving Across Nodes: Disaggregation, Scaling, and Recovery",
        "summary": "Disaggregated serving separates prefill and decode when better resource allocation outweighs state-transfer and coordination costs.",
        "keyPoints": [
          "Disaggregation trades interference reduction for cache-transfer and scheduling costs.",
          "Scaling stateful requests requires draining, migration, or recomputation."
        ],
        "interviewPrompt": "",
        "prerequisites": [
          "continuous-batching",
          "checkpointing-and-recovery"
        ]
      }
    ],
    "quizQuestionCount": 0
  }
];

export const distributedTopics = distributedParts.flatMap((part) => part.topics);
export const distributedTopicCount = distributedTopics.length;
export const distributedTopicsById: Record<string, DistributedTopic> = Object.fromEntries(distributedTopics.map((t) => [t.id, t]));
export const distributedPartsById: Record<string, DistributedPart> = Object.fromEntries(distributedParts.map((p) => [p.id, p]));
export const distributedPartIdForTopic: Record<string, string> = Object.fromEntries(distributedParts.flatMap((p) => p.topics.map((t) => [t.id, p.id])));
export const distributedLessonNumbers: Record<string, string> = Object.fromEntries(distributedParts.flatMap((p) => p.topics.map((t, i) => [t.id, `${p.number}.${i + 1}`])));
