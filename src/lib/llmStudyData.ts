// Standalone LLM curriculum. Public metadata contains no chapter answer payloads.
export interface LlmTopic { id: string; title: string; summary: string; keyPoints: string[]; interviewPrompt: string; }
export interface LlmPart { id: string; number: string; title: string; description: string; color: string; icon: string; topics: LlmTopic[]; quizQuestionCount: number; }
export const LLM_DOMAIN = "Large Language Models (LLM)";
export const llmParts: LlmPart[] = [
  {
    "id": "foundations",
    "number": "1",
    "title": "Foundations",
    "description": "Understand tokens, probabilities, representations, and how a language model learns. No other topic is required.",
    "color": "#4285F4",
    "icon": "Blocks",
    "topics": [
      {
        "id": "language-models",
        "title": "What a large language model learns",
        "summary": "A language model predicts distributions over text continuations; useful behavior and factual reliability require separate evaluation.",
        "keyPoints": [
          "A token is a text unit, not necessarily a word.",
          "Sequence probabilities depend on earlier tokens.",
          "Fluent completion does not establish truth."
        ],
        "interviewPrompt": "Why can a fluent answer be wrong even when the model predicts every token confidently?"
      },
      {
        "id": "tokenization",
        "title": "Tokens and tokenization",
        "summary": "Tokenization chooses the discrete units a language model reads and predicts.",
        "keyPoints": [
          "Token IDs identify entries rather than numerical meaning.",
          "Vocabulary size trades against sequence length.",
          "Tokenizer and model must use the same vocabulary and special tokens."
        ],
        "interviewPrompt": "Why can two tokenizers assign very different costs to the same multilingual document?"
      },
      {
        "id": "vectors-and-tensors",
        "title": "Vectors, matrices, and tensor shapes",
        "summary": "Shapes and vector operations explain the numerical objects used by a language model.",
        "keyPoints": [
          "Shapes determine whether transformations are compatible.",
          "A dot product combines matching coordinates.",
          "Cosine compares direction rather than magnitude."
        ],
        "interviewPrompt": "A batch has shape [8,20,64]. What does each axis describe, and what changes if sequence length doubles?"
      },
      {
        "id": "vectors-and-embeddings",
        "title": "Token embeddings and vocabulary outputs",
        "summary": "An embedding lookup maps IDs to learned features; the output head scores possible next tokens.",
        "keyPoints": [
          "An embedding table has one learned row per token ID.",
          "Contextual states can differ even when initial token IDs match.",
          "Weight tying shares storage between lookup and output scoring."
        ],
        "interviewPrompt": "Why can the same initial embedding support both a financial bank and a river bank?"
      },
      {
        "id": "probabilities-and-loss",
        "title": "Probabilities, softmax, and cross-entropy",
        "summary": "Softmax turns logits into probabilities; cross-entropy trains the model to assign probability to observed targets.",
        "keyPoints": [
          "Relative logits determine probabilities.",
          "Cross-entropy penalizes confidently wrong predictions.",
          "Perplexity comparisons require compatible tokenization and scoring."
        ],
        "interviewPrompt": "A model assigns 0.01 probability to the correct token. What does the loss reward changing?"
      },
      {
        "id": "uncertainty-and-divergence",
        "title": "Entropy, cross-entropy, and KL divergence",
        "summary": "Entropy measures uncertainty; cross-entropy and KL compare predictions against a target distribution.",
        "keyPoints": [
          "Entropy measures spread within one distribution.",
          "Cross-entropy includes uncertainty in the target plus mismatch.",
          "KL is directional and requires probability support."
        ],
        "interviewPrompt": "Can two confident distributions have low entropy but disagree sharply? Explain with two possible tokens."
      },
      {
        "id": "neural-networks",
        "title": "How a neural network works",
        "summary": "Neural networks combine learned maps and nonlinear activations to build useful features.",
        "keyPoints": [
          "Nonlinear activations make depth useful.",
          "Weights transform features and biases shift them.",
          "A prediction head maps hidden features to task outputs."
        ],
        "interviewPrompt": "Why do two linear layers without a nonlinear activation fail to create a more expressive mapping?"
      },
      {
        "id": "gradients-and-learning",
        "title": "Gradients, backpropagation, and learning",
        "summary": "Backpropagation computes loss sensitivities; an optimizer turns them into parameter updates.",
        "keyPoints": [
          "Token-loss gradients push probability toward the observed target.",
          "Shared parameters add gradient contributions across uses.",
          "An optimizer changes weights; inference normally does not."
        ],
        "interviewPrompt": "A weight appears at every token position. How should its gradient contributions combine?"
      }
    ],
    "quizQuestionCount": 8
  },
  {
    "id": "transformers",
    "number": "2",
    "title": "Transformer architecture",
    "description": "Separate token mixing, head structure, legal access, positions, feature transformations, and complete architectures.",
    "color": "#A142F4",
    "icon": "Blocks",
    "topics": [
      {
        "id": "self-attention",
        "title": "Self-attention",
        "summary": "Self-attention uses learned query–key comparisons to mix content from value vectors.",
        "keyPoints": [
          "Query and key projections determine source weights.",
          "A [T,T] score matrix mixes T source value vectors.",
          "Scaling moderates saturation without guaranteeing factual support."
        ],
        "interviewPrompt": "Keep the values fixed and swap their attention scores. What changes in the output?"
      },
      {
        "id": "heads-and-masks",
        "title": "Attention heads and shared keys/values",
        "summary": "Multiple heads learn separate mixtures; GQA shares key/value state while preserving distinct query heads.",
        "keyPoints": [
          "Heads split feature width, not the sequence into independent pieces.",
          "An output projection combines head results.",
          "GQA and MQA reduce key/value storage."
        ],
        "interviewPrompt": "With four query heads, why does sharing two KV heads not force the queries to use identical attention weights?"
      },
      {
        "id": "attention-masks",
        "title": "Causal masks, padding, and information leakage",
        "summary": "Masks specify legal attention links independently of which targets contribute to loss.",
        "keyPoints": [
          "Causal masking blocks access to future target information.",
          "Padding masks exclude filler positions.",
          "Known training inputs permit parallel position scoring without leakage."
        ],
        "interviewPrompt": "Why is removing a future token from the loss insufficient if an earlier position can still attend to it?"
      },
      {
        "id": "position-information",
        "title": "Position information",
        "summary": "Position signals make token order available to attention and influence behavior at longer contexts.",
        "keyPoints": [
          "Absolute positions attach location to content; RoPE rotates query/key pairs.",
          "Holding content fixed, equal relative gaps preserve the rotary dot product.",
          "Supported context length does not guarantee reliable evidence use."
        ],
        "interviewPrompt": "If query and key content stay fixed, why can shifting both positions preserve their RoPE comparison?"
      },
      {
        "id": "feed-forward-networks",
        "title": "Feed-forward networks and SwiGLU",
        "summary": "An FFN transforms each position’s feature vector; gated variants multiply learned feature branches.",
        "keyPoints": [
          "Attention mixes positions; FFNs transform features at each position.",
          "Expansion and nonlinear activation add expressive capacity.",
          "SwiGLU combines a smooth gate with a second feature branch."
        ],
        "interviewPrompt": "Why can an FFN process all token positions together without directly mixing their information?"
      },
      {
        "id": "transformer-blocks",
        "title": "A complete Transformer block",
        "summary": "Transformer blocks alternate information mixing and feature transformation, supported by normalization and residual paths.",
        "keyPoints": [
          "Residual additions preserve an identity route around transformations.",
          "LayerNorm and RMSNorm normalize feature scale differently.",
          "The full decoder maps token states into next-token vocabulary scores."
        ],
        "interviewPrompt": "What must remain compatible for a residual addition, and why is that useful for optimization?"
      },
      {
        "id": "architectures-and-objectives",
        "title": "Encoders, decoders, and language-model objectives",
        "summary": "Information access and training objectives distinguish encoders, causal decoders, and encoder–decoder models.",
        "keyPoints": [
          "Bidirectional context suits representation tasks.",
          "Autoregressive decoding needs a target-side causal mask.",
          "Architectural names alone do not establish training behavior."
        ],
        "interviewPrompt": "Can a bidirectional masked-language model directly replace a causal decoder for left-to-right generation?"
      },
      {
        "id": "mixture-of-experts",
        "title": "Mixture-of-experts and sparse activation",
        "summary": "A learned router selects a few expert transformations per token, separating total capacity from active computation.",
        "keyPoints": [
          "Experts usually replace feed-forward transformations.",
          "Sparse activation lowers active work relative to using every expert.",
          "Routing balance and communication affect real serving cost."
        ],
        "interviewPrompt": "Why can an MoE model with fewer active parameters still require more memory than a dense model?"
      }
    ],
    "quizQuestionCount": 8
  },
  {
    "id": "pretraining",
    "number": "3",
    "title": "Pretraining and training systems",
    "description": "Align targets, curate data, allocate compute, and diagnose large-scale training.",
    "color": "#0F9D58",
    "icon": "Blocks",
    "topics": [
      {
        "id": "next-token-training",
        "title": "Next-token targets and teacher forcing",
        "summary": "Causal language modeling trains many next-token predictions from one known sequence without leaking future targets.",
        "keyPoints": [
          "Inputs and labels differ by one position.",
          "Teacher forcing supplies true prefixes during training.",
          "Boundary masks and loss masks solve different problems."
        ],
        "interviewPrompt": "A model has near-zero training loss from the first step. Which target and attention mistakes would you inspect?"
      },
      {
        "id": "data-curation",
        "title": "Data curation, deduplication, and contamination",
        "summary": "The training mixture determines what the model sees; clean separation is necessary to measure what it learns.",
        "keyPoints": [
          "Repeated data changes training weights.",
          "Split related documents before evaluating.",
          "A benchmark appearing in training undermines interpretation."
        ],
        "interviewPrompt": "Validation loss improves after adding crawled data, but a benchmark jumps unusually far. What would you audit?"
      },
      {
        "id": "scaling-and-compute",
        "title": "Scaling laws and compute allocation",
        "summary": "Training compute must be divided among model size, token exposure, and the eventual serving workload.",
        "keyPoints": [
          "A larger model trained on too few tokens can waste a fixed training budget.",
          "Scaling trends are empirical, not exact laws.",
          "Serving cost can change the preferred training allocation."
        ],
        "interviewPrompt": "Under a fixed training budget, why might a smaller model trained on more tokens win?"
      },
      {
        "id": "optimization",
        "title": "Optimizers and training schedules",
        "summary": "An optimizer uses gradients to update parameters under a chosen learning-rate and regularization strategy.",
        "keyPoints": [
          "Momentum smooths sampled gradients; Adam also tracks squared gradients.",
          "AdamW applies weight decay separately from its adaptive gradient update.",
          "Warmup, learning-rate decay, and clipping address different problems."
        ],
        "interviewPrompt": "Training loss oscillates sharply after a learning-rate increase. What would you inspect and change?"
      },
      {
        "id": "training-memory-and-parallelism",
        "title": "Training memory and numerical precision",
        "summary": "Inventory training state before choosing precision or activation recomputation.",
        "keyPoints": [
          "Weights alone do not determine training memory.",
          "BF16 and FP16 differ in range; loss scaling protects small gradients.",
          "Recomputation saves activations by repeating work."
        ],
        "interviewPrompt": "Out-of-memory occurs only during backward computation. Which state would you inspect before reducing parameter count?"
      },
      {
        "id": "distributed-training",
        "title": "Data, tensor, and pipeline parallelism",
        "summary": "Distribute examples, operations, or stored state according to the resource that limits training.",
        "keyPoints": [
          "Data parallelism combines gradients from different examples.",
          "ZeRO shards selected training state across workers.",
          "Tensor and pipeline parallelism divide model computation differently."
        ],
        "interviewPrompt": "If Adam state is the memory bottleneck, why might adding ordinary data-parallel replicas fail to help?"
      },
      {
        "id": "training-validation",
        "title": "Validation, loss curves, and training failures",
        "summary": "Controlled checks separate data errors, optimization failures, and real generalization changes.",
        "keyPoints": [
          "Compare losses under the same scoring rules.",
          "Slice the validation set before trusting the average.",
          "A tiny-batch fit is a diagnostic, not evidence of generalization."
        ],
        "interviewPrompt": "Training loss falls while held-out code loss rises. Which hypotheses would you distinguish first?"
      }
    ],
    "quizQuestionCount": 8
  },
  {
    "id": "post-training",
    "number": "4",
    "title": "Adaptation and post-training",
    "description": "Learn task behavior, reward-based updates, preference objectives, distillation, and reliable training data.",
    "color": "#DB4437",
    "icon": "Blocks",
    "topics": [
      {
        "id": "supervised-adaptation",
        "title": "Supervised fine-tuning and domain adaptation",
        "summary": "Demonstrations teach response behavior, while raw domain text supports continued pretraining.",
        "keyPoints": [
          "Demonstrations teach response behavior.",
          "Continued pretraining learns from raw domain text.",
          "Adaptation can overfit or erase useful earlier behavior."
        ],
        "interviewPrompt": "You have technical manuals but no good question–answer pairs. What adaptation signal do you actually have?"
      },
      {
        "id": "lora-and-qlora",
        "title": "Efficient adaptation with LoRA and QLoRA",
        "summary": "LoRA restricts learned updates to low-rank branches; QLoRA also compresses frozen base-weight storage.",
        "keyPoints": [
          "LoRA learns a constrained update beside frozen weights.",
          "Rank controls update capacity rather than context length.",
          "QLoRA quantizes base storage while training adapters."
        ],
        "interviewPrompt": "Why does freezing a large base model not eliminate activation memory during adapter training?"
      },
      {
        "id": "reinforcement-learning",
        "title": "Reinforcement learning for language models",
        "summary": "Treat token generation as actions sampled by a policy and use outcome feedback to change their probabilities.",
        "keyPoints": [
          "A policy maps a state to action probabilities.",
          "Returns evaluate sampled continuations.",
          "Advantage compares a return with a state-dependent baseline."
        ],
        "interviewPrompt": "A response receives reward one against a value baseline of 0.4. What signal should its sampled actions receive?"
      },
      {
        "id": "rlhf-and-policy-learning",
        "title": "RLHF, reward models, and PPO",
        "summary": "RLHF trains a generation policy using a learned reward; the reward remains a proxy for the intended behavior.",
        "keyPoints": [
          "Pairwise judgments train relative reward scores.",
          "PPO clipping and reference KL restrain different changes.",
          "Reward gains need independent factuality and safety checks."
        ],
        "interviewPrompt": "Why can a rising reward-model score accompany declining factual accuracy?"
      },
      {
        "id": "direct-preference-optimization",
        "title": "Direct preference optimization",
        "summary": "DPO learns directly from comparison pairs by changing relative response probabilities against a reference policy.",
        "keyPoints": [
          "DPO learns from preferred and rejected response pairs.",
          "Reference-relative sequence log probabilities determine the pairwise score.",
          "Preference gains require independent checks of correctness and drift."
        ],
        "interviewPrompt": "How can a DPO update favor a preferred response even if both responses become less probable?"
      },
      {
        "id": "reasoning-and-verifiable-rewards",
        "title": "Verifiable rewards and GRPO",
        "summary": "Use checkable outcomes to train behavior and compare attempts within a prompt without a separate value model.",
        "keyPoints": [
          "A verifier is only as useful as the properties it checks.",
          "Outcome and process rewards provide different granularity.",
          "GRPO uses within-group advantage estimates and clipped policy updates."
        ],
        "interviewPrompt": "Every sampled response to a prompt receives the same reward. What learning signal is missing, and what would you inspect?"
      },
      {
        "id": "distillation-and-data",
        "title": "Distillation: transferring teacher behavior",
        "summary": "A student learns from teacher distributions or responses; what transfers depends on the data and learning signal.",
        "keyPoints": [
          "Soft targets express relative alternatives.",
          "Temperature changes the matching signal.",
          "A smaller student needs independent checks of capability and total task cost."
        ],
        "interviewPrompt": "Why can matching a teacher on common requests fail to preserve its rare capabilities?"
      },
      {
        "id": "synthetic-training-data",
        "title": "Synthetic data and instruction-data quality",
        "summary": "Generated examples can fill coverage gaps, but their labels need checking and their lineage must remain separate from tests.",
        "keyPoints": [
          "Generate for identified gaps rather than raw volume.",
          "Independent checks prevent teacher errors becoming labels.",
          "Duplicates and test-derived variants can inflate apparent gains."
        ],
        "interviewPrompt": "A million generated examples improve training loss but not held-out accuracy. What would you inspect before generating more?"
      }
    ],
    "quizQuestionCount": 8
  },
  {
    "id": "generation-and-grounding",
    "number": "5",
    "title": "Generation, context, and grounding",
    "description": "Understand search and sampling, task instructions, structured answers, reasoning budgets, and external evidence.",
    "color": "#00897B",
    "icon": "Blocks",
    "topics": [
      {
        "id": "decoding-and-sampling",
        "title": "Sequence decoding and beam search",
        "summary": "Choose a complete output by searching conditional token probabilities under explicit scoring and stopping rules.",
        "keyPoints": [
          "Greedy decoding makes local choices.",
          "Beam search retains several partial paths but can prune the best completion.",
          "Length normalization changes the scoring objective."
        ],
        "interviewPrompt": "Why can the best first token fail to begin the highest-probability complete response?"
      },
      {
        "id": "sampling-controls",
        "title": "Temperature, top-k, and nucleus sampling",
        "summary": "Sampling controls transform token distributions to balance concentration and variety.",
        "keyPoints": [
          "Temperature rescales positive-temperature softmax.",
          "Top-k fixes set size; top-p fixes a cumulative probability threshold.",
          "Filtering and temperature order can change the resulting distribution."
        ],
        "interviewPrompt": "With probabilities [4/7,2/7,1/7], what does top-p 0.8 keep, and how are the retained probabilities normalized?"
      },
      {
        "id": "instructions-and-structured-output",
        "title": "Prompting, chat templates, and in-context learning",
        "summary": "Task instructions and examples condition behavior without changing model parameters.",
        "keyPoints": [
          "A chat template serializes roles as trained token patterns.",
          "Few-shot examples demonstrate both outputs and edge cases.",
          "In-context learning changes behavior through input rather than optimization."
        ],
        "interviewPrompt": "Why can changing a model’s chat template alter behavior even when the message text is unchanged?"
      },
      {
        "id": "structured-output",
        "title": "Structured output and constrained decoding",
        "summary": "Constrain serialization while validating meaning and handling unsupported fields explicitly.",
        "keyPoints": [
          "Schema validity is separate from factual correctness.",
          "Constrained decoding excludes syntactically illegal continuations.",
          "Bounded repairs must preserve evidence and missing-value rules."
        ],
        "interviewPrompt": "A generated JSON object has all required fields but invents a customer ID. Which additional check is needed?"
      },
      {
        "id": "inference-time-reasoning",
        "title": "Inference-time reasoning and candidate verification",
        "summary": "Spend extra inference computation on reasoning, alternatives, or checks only when it improves delivered task success.",
        "keyPoints": [
          "Intermediate reasoning and final correctness need separate checks.",
          "Pass@N measures available successes, not a selector’s accuracy.",
          "Candidate diversity and verifier quality determine the benefit of extra attempts."
        ],
        "interviewPrompt": "Three candidates include one correct answer, but the selector returns a wrong one. Which metric would reveal the gap?"
      },
      {
        "id": "long-context",
        "title": "Long context, positions, and evidence placement",
        "summary": "A large context window increases available text but does not guarantee the model can use all of it reliably.",
        "keyPoints": [
          "Context capacity and effective evidence use are different capabilities.",
          "Position interpolation compresses RoPE indices but still needs validation.",
          "Truncation and summarization can remove decisive qualifiers."
        ],
        "interviewPrompt": "An answer changes when the same evidence moves from the beginning to the middle. What would you test?"
      },
      {
        "id": "retrieval-mechanisms",
        "title": "Lexical search, dense retrieval, and reranking",
        "summary": "Find candidate evidence with lexical or learned-vector search, then refine the set with more expensive joint scoring.",
        "keyPoints": [
          "Lexical matching is useful for exact names and identifiers.",
          "Dense retrieval can connect paraphrases.",
          "A reranker scores candidates; it cannot recover evidence never proposed."
        ],
        "interviewPrompt": "Why might hybrid search beat dense retrieval on questions containing exact product codes?"
      },
      {
        "id": "retrieval-and-grounding",
        "title": "Retrieval-augmented generation and grounding",
        "summary": "RAG supplies external evidence at inference; separate retrieval, evidence selection, and supported generation.",
        "keyPoints": [
          "RAG supplies external evidence without changing weights.",
          "Context construction must preserve qualifications and source identity.",
          "Verified-evidence tests isolate retrieval from generation failures."
        ],
        "interviewPrompt": "The answer is wrong despite a relevant document in the index. Which stages would you isolate?"
      },
      {
        "id": "tools-and-execution",
        "title": "Tool calling and verified execution",
        "summary": "An LLM can propose structured tool requests, while an external executor validates and authorizes the actual operation.",
        "keyPoints": [
          "A tool call is a proposed action, not execution itself.",
          "Evidence and tool results remain untrusted inputs.",
          "Idempotency protects against duplicate effects during retries."
        ],
        "interviewPrompt": "The model proposes a valid transfer call for the wrong account. Where should the request be stopped?"
      }
    ],
    "quizQuestionCount": 10
  },
  {
    "id": "evaluation-and-safety",
    "number": "6",
    "title": "Evaluation, reliability, and safety",
    "description": "Measure task performance, judge uncertainty, and protect data and tool boundaries.",
    "color": "#F29900",
    "icon": "Blocks",
    "topics": [
      {
        "id": "evaluation-design",
        "title": "Designing an LLM evaluation",
        "summary": "A useful evaluation fixes a task contract, uses independent examples, and measures both quality and operating cost.",
        "keyPoints": [
          "Token loss and application success answer different questions.",
          "Paired comparisons reduce example-mix differences.",
          "Report slices and uncertainty, not just one average."
        ],
        "interviewPrompt": "An overall score improves while the highest-risk user group regresses. How should you report the result?"
      },
      {
        "id": "answer-quality",
        "title": "Scoring answers, evidence, and exact tasks",
        "summary": "Match metrics to what makes an answer useful; overlap and model likelihood are incomplete proxies.",
        "keyPoints": [
          "Exact answers need normalization rules.",
          "Overlap does not establish semantic correctness.",
          "Grounding requires evidence-supported claims, not decorative citations."
        ],
        "interviewPrompt": "Two summaries have similar word overlap, but one reverses a negation. Which evaluation catches that?"
      },
      {
        "id": "judges-and-preferences",
        "title": "Human evaluation and model judges",
        "summary": "Judges make subjective criteria measurable only when their rubric, reliability, and biases are checked.",
        "keyPoints": [
          "A rubric turns vague preference into explicit criteria.",
          "Blind and swap candidate order in pairwise judgments.",
          "Validate automated judges against independent human examples."
        ],
        "interviewPrompt": "A judge always prefers the longer answer, even when the shorter one is correct. How would you test and fix the evaluation?"
      },
      {
        "id": "confidence-and-abstention",
        "title": "Confidence, calibration, and abstention",
        "summary": "Reliable confidence must predict actual correctness on representative cases, with an explicit policy for unanswered requests.",
        "keyPoints": [
          "Token probability is not whole-answer confidence.",
          "Calibration compares stated confidence with observed success.",
          "Coverage and accuracy must be reported together."
        ],
        "interviewPrompt": "A model is 95% accurate on answered requests but answers only 10% of them. What else must you measure?"
      },
      {
        "id": "prompt-injection-and-security",
        "title": "Prompt injection and authorization boundaries",
        "summary": "Untrusted text can redirect a model; independent authorization and restricted execution limit the resulting damage.",
        "keyPoints": [
          "Direct user requests and retrieved instructions have different authority.",
          "Content filters do not replace access control.",
          "Evaluate attempted actions as well as final text."
        ],
        "interviewPrompt": "A retrieved page tells the assistant to send a private document elsewhere. Which controls should stop the action?"
      },
      {
        "id": "privacy-and-bias",
        "title": "Privacy, memorization, and data removal",
        "summary": "Distinguish private-data exposure through weights from exposure through context, tools, caches, and logs.",
        "keyPoints": [
          "A copied passage does not identify where it came from.",
          "Membership inference and extraction test different threats.",
          "Index deletion and removal of training influence require different checks."
        ],
        "interviewPrompt": "Why does deleting a document from retrieval fail to establish that its contents can no longer be exposed?"
      },
      {
        "id": "bias-and-safety",
        "title": "Bias, harmful behavior, and over-refusal",
        "summary": "Evaluate harmful outcomes and uneven task performance without treating blanket refusal as a reliable solution.",
        "keyPoints": [
          "Define a harm criterion before scoring differences.",
          "Compare equivalent requests across relevant slices.",
          "Measure appropriate refusal and legitimate-task success together."
        ],
        "interviewPrompt": "A safety update blocks more harmful requests but also rejects benign requests in one dialect. How should it be evaluated?"
      }
    ],
    "quizQuestionCount": 8
  },
  {
    "id": "inference-and-serving",
    "number": "7",
    "title": "Inference and serving",
    "description": "Understand caches, memory, attention kernels, batching, and the cost of a successful request.",
    "color": "#5C6BC0",
    "icon": "Blocks",
    "topics": [
      {
        "id": "prefill-and-kv-cache",
        "title": "Prefill, decoding, and the key–value cache",
        "summary": "Causal decoding reuses past keys and values while computing each newly selected token.",
        "keyPoints": [
          "Prefill processes the available prompt.",
          "Decoding appends one chosen token at a time.",
          "Caching reuses past keys and values rather than past answers."
        ],
        "interviewPrompt": "Why can caching accelerate autoregressive generation without letting every future token be generated in parallel?"
      },
      {
        "id": "memory-and-quantization",
        "title": "Inference memory: weights, states, and KV cache",
        "summary": "Estimate weights and growing sequence state independently before selecting a serving configuration.",
        "keyPoints": [
          "Weight storage scales with parameter count and bytes per value.",
          "KV memory grows with active sequences and cached positions.",
          "Peak memory includes working buffers and allocation overhead."
        ],
        "interviewPrompt": "Why can a model load successfully but run out of memory while generating several long responses?"
      },
      {
        "id": "inference-quantization",
        "title": "Inference quantization and calibration",
        "summary": "Reduce storage by mapping values to numerical levels, then check whether quality and execution actually improve.",
        "keyPoints": [
          "Scale and clipping determine reconstruction error.",
          "Weight, activation, and cache precision are separate decisions.",
          "Calibration chooses numerical ranges; evaluation checks task behavior."
        ],
        "interviewPrompt": "A four-bit model uses less memory but runs slower. What implementation and workload factors could explain the result?"
      },
      {
        "id": "attention-and-cache-systems",
        "title": "FlashAttention and paged caches",
        "summary": "Attention kernels and cache allocation optimize different bottlenecks without changing which evidence a model is allowed to read.",
        "keyPoints": [
          "FlashAttention reduces memory traffic without removing pairwise attention work.",
          "Projection/FFN and attention computation scale differently with context length.",
          "Paged caches reduce allocation waste; GQA reduces KV state."
        ],
        "interviewPrompt": "Why does FlashAttention not make full-attention prefill linear in sequence length?"
      },
      {
        "id": "batching-and-prefix-caching",
        "title": "Serving multiple requests",
        "summary": "Scheduling and compatible prefix reuse improve utilization while changing latency, isolation, and freshness requirements.",
        "keyPoints": [
          "Batching improves utilization while adding scheduling tradeoffs.",
          "KV prefix reuse requires compatible tokens, model configuration, and access.",
          "Answer caches also need evidence-freshness checks."
        ],
        "interviewPrompt": "Why can a larger batch improve tokens per second while making a short request feel slower?"
      },
      {
        "id": "speculative-decoding",
        "title": "Speculative decoding",
        "summary": "A cheap draft proposes tokens that a target verifies, with correction rules preserving the intended output distribution.",
        "keyPoints": [
          "A cheap model proposes several tokens.",
          "The target verifies proposals together.",
          "Distribution-preserving sampling requires acceptance correction and residual resampling."
        ],
        "interviewPrompt": "Why is accepting a draft token whenever the target gives it a high probability insufficient for exact sampling?"
      },
      {
        "id": "serving-diagnosis",
        "title": "Choosing and diagnosing an LLM deployment",
        "summary": "Use the mechanisms from this topic to select a quality, latency, and cost tradeoff and isolate regressions.",
        "keyPoints": [
          "Compare complete successful-task cost.",
          "Queueing, prefill, and decoding require different remedies.",
          "Change one component at a time and preserve rollback evidence."
        ],
        "interviewPrompt": "First-token latency doubles while inter-token latency stays stable. What would you investigate first?"
      }
    ],
    "quizQuestionCount": 7
  }
];
export const llmTopics = llmParts.flatMap(part => part.topics);
export const llmTopicCount = llmTopics.length;
export const llmPartsById = Object.fromEntries(llmParts.map(part => [part.id, part])) as Record<string, LlmPart>;
export const llmTopicsById = Object.fromEntries(llmTopics.map(topic => [topic.id, topic]));
export const llmPartIdForTopic = Object.fromEntries(llmParts.flatMap(part => part.topics.map(topic => [topic.id, part.id])));
export const llmLessonNumbers = Object.fromEntries(llmParts.flatMap(part => part.topics.map((topic, i) => [topic.id, `${part.number}.${i + 1}`])));
