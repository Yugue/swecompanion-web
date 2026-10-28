// Standalone Generative AI curriculum. Only summaries and quiz counts are public.
export interface GenaiTopic { id: string; title: string; summary: string; keyPoints: string[]; interviewPrompt: string; }
export interface GenaiPart { id: string; number: string; title: string; description: string; color: string; icon: string; topics: GenaiTopic[]; quizQuestionCount: number; }
export const GENAI_DOMAIN = "Generative AI";
export const genaiParts: GenaiPart[] = [
  {
    "id": "foundations",
    "number": "1",
    "title": "Foundations",
    "description": "Build the mathematical and learning foundations used throughout this standalone topic.",
    "color": "#4285F4",
    "icon": "Blocks",
    "topics": [
      {
        "id": "generative-foundations",
        "title": "What generative AI does",
        "summary": "Generative models learn distributions and sample new outputs, optionally guided by an input.",
        "keyPoints": [
          "Generation learns patterns across possible outputs.",
          "Conditioning steers a distribution rather than specifying one answer.",
          "Fluency and realism do not establish correctness."
        ],
        "interviewPrompt": "A model produces convincing but repetitive examples. Which aspects of generation should you measure?"
      },
      {
        "id": "vectors-and-tensors",
        "title": "Vectors, matrices, and tensors",
        "summary": "Shapes and vector operations explain how model inputs become learned representations.",
        "keyPoints": [
          "Shapes determine which transformations are valid.",
          "A dot product combines matching coordinates.",
          "Cosine similarity compares direction rather than magnitude."
        ],
        "interviewPrompt": "Two document vectors point in the same direction but have different lengths. How do dot product and cosine compare them?"
      },
      {
        "id": "probability-essentials",
        "title": "Probability and conditional reasoning",
        "summary": "Conditional probability describes uncertainty given evidence and factors a sequence into prediction steps.",
        "keyPoints": [
          "Conditional probability changes the population being considered.",
          "Sequence probability factors into conditional terms.",
          "Expectation describes an average, not a guaranteed outcome."
        ],
        "interviewPrompt": "Why does multiplying independent word frequencies usually give a poor sentence model?"
      },
      {
        "id": "softmax-and-losses",
        "title": "Softmax, entropy, and learning objectives",
        "summary": "Softmax produces probabilities; entropy, cross-entropy, and KL measure uncertainty and prediction mismatch.",
        "keyPoints": [
          "Softmax converts scores into a normalized distribution.",
          "Cross-entropy penalizes low probability on observed targets.",
          "KL divergence is directional and compares distributions."
        ],
        "interviewPrompt": "Can a model be very confident and still have a large training loss? Explain with two classes."
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
        "id": "backpropagation",
        "title": "Gradients and backpropagation",
        "summary": "Backpropagation applies the derivative chain rule to compute how parameters affect a scalar loss.",
        "keyPoints": [
          "A gradient measures local loss sensitivity.",
          "Multiply derivatives along paths and add across paths.",
          "Backpropagation computes gradients; the optimizer applies updates."
        ],
        "interviewPrompt": "A shared weight affects the loss through two branches. How should its two gradient contributions combine?"
      },
      {
        "id": "optimization",
        "title": "Training a neural network",
        "summary": "An optimizer uses gradients to update parameters under a chosen learning-rate and regularization strategy.",
        "keyPoints": [
          "Learning rate controls update size.",
          "AdamW combines adaptive updates with separate weight decay.",
          "Inspect gradients and actual updates when training stalls."
        ],
        "interviewPrompt": "Training loss oscillates sharply after a learning-rate increase. What would you inspect and change?"
      },
      {
        "id": "generalization",
        "title": "Generalization and learning curves",
        "summary": "Useful learning transfers to unseen examples; validation curves help distinguish overfitting from other failures.",
        "keyPoints": [
          "Training data fits parameters; validation chooses settings.",
          "A widening loss gap can indicate overfitting.",
          "Regularization and data quality must match the observed failure."
        ],
        "interviewPrompt": "Both training and validation loss remain high. Would stronger regularization be your first intervention?"
      }
    ],
    "quizQuestionCount": 8
  },
  {
    "id": "language-and-transformers",
    "number": "2",
    "title": "Language models and Transformers",
    "description": "Follow text from tokens and vectors through attention to complete Transformer architectures.",
    "color": "#EA4335",
    "icon": "Braces",
    "topics": [
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
        "id": "embeddings-and-outputs",
        "title": "Embeddings and language-model outputs",
        "summary": "Embedding lookup represents input tokens; the output head scores possible next tokens.",
        "keyPoints": [
          "Embedding lookup maps each token ID to a learned row.",
          "The language head maps hidden states to vocabulary logits.",
          "Input and output tables may share weights without sharing their roles."
        ],
        "interviewPrompt": "If a vocabulary grows from 30,000 to 60,000 at fixed hidden width, which parameter tables grow?"
      },
      {
        "id": "self-attention",
        "title": "Self-attention",
        "summary": "Self-attention uses learned query–key comparisons to mix content from value vectors.",
        "keyPoints": [
          "Queries and keys determine mixture weights.",
          "Values provide the content being mixed.",
          "Attention weights alone are not a faithful explanation of the final answer."
        ],
        "interviewPrompt": "Keep the values fixed and swap their attention scores. What changes in the output?"
      },
      {
        "id": "multihead-attention",
        "title": "Multiple attention heads",
        "summary": "Multiple attention heads form separate information mixtures before a learned output projection combines them.",
        "keyPoints": [
          "Heads use separate projections of the same input.",
          "Concatenation preserves separate head outputs.",
          "Head specialization is learned and need not match human categories."
        ],
        "interviewPrompt": "Why is averaging several attention distributions different from concatenating their head outputs?"
      },
      {
        "id": "attention-masks",
        "title": "Attention masks",
        "summary": "Masks enforce legal information flow independently of which predictions receive training loss.",
        "keyPoints": [
          "A mask defines which positions can exchange information.",
          "A causal position may read itself with shifted next-token targets.",
          "Padding masks and loss masks solve different problems."
        ],
        "interviewPrompt": "Why is blocking padding from the loss insufficient to stop real tokens from attending to it?"
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
        "id": "transformer-blocks",
        "title": "A complete Transformer block",
        "summary": "Transformer blocks alternate information mixing and feature transformation, supported by normalization and residual paths.",
        "keyPoints": [
          "Attention mixes positions while the feed-forward network transforms features.",
          "Residual paths add matching-shape states.",
          "LayerNorm and RMSNorm normalize each token’s features in different ways."
        ],
        "interviewPrompt": "What must remain compatible for a residual addition, and why is that useful for optimization?"
      },
      {
        "id": "transformer-architectures",
        "title": "Transformer architectures and expert routing",
        "summary": "Architecture determines available information and how computation is shared across tokens and experts.",
        "keyPoints": [
          "Encoders and decoders differ in available information.",
          "Cross-attention connects different source and target sequences.",
          "Expert routing separates total capacity from active computation."
        ],
        "interviewPrompt": "Why can a model with more total parameters cost less per token than a smaller dense model?"
      }
    ],
    "quizQuestionCount": 8
  },
  {
    "id": "training-and-adaptation",
    "number": "3",
    "title": "Training and adapting models",
    "description": "Choose data, objectives, and parameter updates that match the change you need.",
    "color": "#00897B",
    "icon": "CircuitBoard",
    "topics": [
      {
        "id": "next-token-pretraining",
        "title": "Pretraining through next-token prediction",
        "summary": "Next-token prediction creates training targets from text while causal masking protects the intended prediction task.",
        "keyPoints": [
          "Shift targets and use causal attention for next-token training.",
          "Teacher forcing and generated prefixes create different input histories.",
          "Masked and sequence-denoising objectives expose different evidence."
        ],
        "interviewPrompt": "A language model predicts its input tokens perfectly but generates poorly. Which alignment mistake would you check?"
      },
      {
        "id": "pretraining-data",
        "title": "Training-data quality",
        "summary": "Corpus quality, deduplication, sampling, and evaluation boundaries determine what a model actually learns.",
        "keyPoints": [
          "More tokens help only when they add useful learning signal.",
          "Deduplication and split boundaries prevent misleading evaluation.",
          "Data mixtures shape which languages and domains receive capacity."
        ],
        "interviewPrompt": "Your validation loss improves after adding benchmark-like documents. How would you distinguish transfer from contamination?"
      },
      {
        "id": "scaling-and-compute",
        "title": "Model size, data, and compute",
        "summary": "Allocate model capacity, training tokens, and lifetime serving compute against a measured objective.",
        "keyPoints": [
          "Training compute depends on parameters and tokens together.",
          "Compute-optimal choices depend on the budget and objective.",
          "The best training tradeoff can differ from the best serving tradeoff."
        ],
        "interviewPrompt": "Why might a smaller model trained longer be preferable when it will serve billions of requests?"
      },
      {
        "id": "training-resources",
        "title": "Training within resource limits",
        "summary": "Training memory comes from weights, gradients, optimizer state, and activations; different techniques reduce different terms.",
        "keyPoints": [
          "Training stores more than model weights.",
          "Accumulation and checkpointing save different kinds of memory.",
          "Parallelism trades replication for communication and coordination."
        ],
        "interviewPrompt": "A model fits for inference but not for training. Which additional memory terms explain the difference?"
      },
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
        "id": "distillation-and-synthetic-data",
        "title": "Distillation and synthetic training data",
        "summary": "Distillation transfers selected teacher behavior, but generated training data needs independent quality checks.",
        "keyPoints": [
          "A student can learn teacher outputs or distributions.",
          "Synthetic labels inherit teacher errors and selection bias.",
          "Smaller models need independent evaluation after compression."
        ],
        "interviewPrompt": "A student closely matches its teacher on synthetic examples but fails real requests. Which mismatch would you investigate?"
      }
    ],
    "quizQuestionCount": 8
  },
  {
    "id": "generation-and-reasoning",
    "number": "4",
    "title": "Generation, preferences, and reasoning",
    "description": "Control generation and understand how feedback and additional computation change behavior.",
    "color": "#9334E6",
    "icon": "GitBranch",
    "topics": [
      {
        "id": "sequence-decoding",
        "title": "Selecting a generated sequence",
        "summary": "Decoding chooses a path through token distributions; locally likely choices can miss better complete sequences.",
        "keyPoints": [
          "Greedy decoding chooses the best next token locally.",
          "Beam search retains several partial sequences.",
          "High sequence probability does not establish answer quality."
        ],
        "interviewPrompt": "Give an example where the most probable first token does not start the most probable complete sequence."
      },
      {
        "id": "sampling-controls",
        "title": "Sampling and generation controls",
        "summary": "Sampling settings reshape output diversity and candidate selection without adding model knowledge.",
        "keyPoints": [
          "Temperature reshapes relative probabilities.",
          "Top-k and top-p restrict different candidate sets.",
          "Sampling settings change diversity rather than model knowledge."
        ],
        "interviewPrompt": "How do temperature and top-p differ when controlling an uncertain next-token distribution?"
      },
      {
        "id": "instructions-and-structure",
        "title": "Instructions and structured outputs",
        "summary": "Instructions steer existing behavior; structured decoding restricts form while external validation checks meaning and permission.",
        "keyPoints": [
          "Few-shot examples steer behavior through context.",
          "Constrained decoding restricts syntax rather than factual correctness.",
          "Generated tool calls need validation and authorized execution."
        ],
        "interviewPrompt": "A response is valid JSON but contains an unsupported account ID. Which guarantee did structured decoding actually provide?"
      },
      {
        "id": "reinforcement-learning",
        "title": "Reinforcement learning foundations",
        "summary": "Reinforcement learning changes action probabilities using outcome rewards under an explicit objective.",
        "keyPoints": [
          "A policy assigns action probabilities given the current state.",
          "Positive and negative advantages encourage or discourage sampled choices.",
          "Reward optimization can exploit flaws in the feedback signal."
        ],
        "interviewPrompt": "Why can maximizing a response-length reward make a model worse at answering questions?"
      },
      {
        "id": "rlhf",
        "title": "Learning from human feedback",
        "summary": "A common RLHF pipeline learns a reward model from human preferences and optimizes a policy against it.",
        "keyPoints": [
          "Preference comparisons train a reward predictor.",
          "RLHF optimizes generated responses against that predictor.",
          "Reward-model improvement and human usefulness can diverge."
        ],
        "interviewPrompt": "Why can a policy become less helpful while its learned reward keeps increasing?"
      },
      {
        "id": "direct-preference-optimization",
        "title": "Direct preference optimization",
        "summary": "DPO learns directly from comparison pairs by changing relative response probabilities against a reference policy.",
        "keyPoints": [
          "DPO trains directly on preferred and rejected response pairs.",
          "Its reference model anchors relative probability changes.",
          "Offline preference quality and coverage remain critical."
        ],
        "interviewPrompt": "How can a DPO update favor a preferred response even if both responses become less probable?"
      },
      {
        "id": "verifiable-rewards",
        "title": "Learning from verifiable rewards",
        "summary": "Executable checks can train a policy, but their coverage and exploitability define the reward's limits.",
        "keyPoints": [
          "A verifier supplies an operational correctness signal.",
          "GRPO compares sampled responses within a prompt group.",
          "A successful checker outcome can still reward shortcuts."
        ],
        "interviewPrompt": "A model passes visible tests but fails hidden tests after reinforcement learning. What could its reward have encouraged?"
      },
      {
        "id": "inference-time-reasoning",
        "title": "Reasoning and computation at inference time",
        "summary": "Additional generation and verification can improve selected tasks when the extra computation is allocated well.",
        "keyPoints": [
          "Generating a correct candidate and selecting it are different capabilities.",
          "Verification quality determines whether additional candidates help.",
          "Long explanations need not reflect faithful internal reasoning."
        ],
        "interviewPrompt": "When would generating ten candidates and choosing one be worse than generating a single concise answer?"
      }
    ],
    "quizQuestionCount": 8
  },
  {
    "id": "image-and-multimodal",
    "number": "5",
    "title": "Image and multimodal generation",
    "description": "Learn image generation and cross-modal representations without assuming prior computer vision.",
    "color": "#E37400",
    "icon": "Shapes",
    "topics": [
      {
        "id": "autoencoders-and-vaes",
        "title": "Autoencoders and variational autoencoders",
        "summary": "VAEs combine reconstruction with a regularized latent distribution that supports generation from a prior.",
        "keyPoints": [
          "An autoencoder learns compression and reconstruction.",
          "A VAE learns a distribution over latent representations.",
          "The ELBO balances reconstruction with latent-prior compatibility."
        ],
        "interviewPrompt": "Why might sampling random latent vectors fail for an ordinary autoencoder but work better for a VAE?"
      },
      {
        "id": "generative-adversarial-networks",
        "title": "Generative adversarial networks",
        "summary": "GANs learn generation through a changing discriminator, trading fast sampling against adversarial training challenges.",
        "keyPoints": [
          "A discriminator learns to separate real from generated examples.",
          "The generator learns through the discriminator signal.",
          "Sharp samples can coexist with poor distribution coverage."
        ],
        "interviewPrompt": "A generator produces realistic faces but nearly all look alike. What failure does this suggest?"
      },
      {
        "id": "diffusion-foundations",
        "title": "Diffusion models",
        "summary": "Diffusion generation learns to turn noise into structured data through repeated reverse updates.",
        "keyPoints": [
          "The forward process adds known noise.",
          "The learned reverse process generates by iterative denoising.",
          "Inference starts from noise rather than an unknown clean image."
        ],
        "interviewPrompt": "If training supplies noisy versions of real images, how can generation begin without a real image?"
      },
      {
        "id": "diffusion-training-and-sampling",
        "title": "Training and sampling diffusion models",
        "summary": "The denoising objective teaches predictions; the sampler determines how those predictions produce a trajectory.",
        "keyPoints": [
          "Known injected noise provides a training target.",
          "Predicted noise gives a clean estimate through the mixture equation.",
          "A defined sampler turns predictions into successive generation updates."
        ],
        "interviewPrompt": "Why can a noisy state produce an imperfect clean estimate, and why is that estimate not a complete sampling step?"
      },
      {
        "id": "latent-diffusion",
        "title": "Latent diffusion and denoiser architectures",
        "summary": "Latent diffusion reduces spatial work by generating compressed representations before decoding images.",
        "keyPoints": [
          "Latent diffusion denoises compressed representations.",
          "Convolution reuses local filters across image locations.",
          "U-Nets and diffusion Transformers organize denoising differently."
        ],
        "interviewPrompt": "Why can latent diffusion be faster while still losing small text or fine image details?"
      },
      {
        "id": "conditioning-and-guidance",
        "title": "Conditioning, guidance, and image editing",
        "summary": "Conditioning and guidance steer image generation, while editing adds constraints from an existing image or layout.",
        "keyPoints": [
          "Conditioning supplies the requested content or structure.",
          "Classifier-free guidance amplifies a conditional prediction difference.",
          "Stronger guidance can improve adherence while reducing quality or diversity."
        ],
        "interviewPrompt": "An image matches its prompt more strongly after increasing guidance but develops artifacts. What tradeoff explains this?"
      },
      {
        "id": "flow-matching",
        "title": "Flow matching",
        "summary": "Flow matching learns a velocity field whose numerical integration transports noise toward the data distribution.",
        "keyPoints": [
          "A velocity field describes how samples move over time.",
          "Training can use known intermediate paths without simulating a solver.",
          "Generation integrates a learned field through multiple evaluations."
        ],
        "interviewPrompt": "Why does training on straight interpolation paths not mean every generated sample follows one straight line?"
      },
      {
        "id": "image-text-alignment",
        "title": "Aligning images and text",
        "summary": "Contrastive image–text training aligns representations for comparison without itself supplying an image generator.",
        "keyPoints": [
          "Contrastive learning compares matched pairs against alternatives.",
          "A shared representation supports cross-modal retrieval.",
          "An aligned encoder is not itself an image generator."
        ],
        "interviewPrompt": "Why can a model that retrieves the right picture still struggle to generate or describe exact spatial relationships?"
      },
      {
        "id": "vision-language-models",
        "title": "Vision–language models",
        "summary": "A vision–language model turns visual features into information a language model can use for grounded responses.",
        "keyPoints": [
          "Visual encoders turn images into features the language model can consume.",
          "Projectors connect representations with different dimensions.",
          "Visual grounding must be tested separately from fluent descriptions."
        ],
        "interviewPrompt": "A model gives a plausible description of a blurred chart. How would you test whether it read the chart rather than guessed?"
      },
      {
        "id": "video-and-audio",
        "title": "Extending generation to video and audio",
        "summary": "Video and audio generation extend modeling across time, requiring continuity, synchronization, and appropriate representations.",
        "keyPoints": [
          "Video requires consistency across space and time.",
          "Audio needs representations of timing and sound structure.",
          "Streaming introduces causal and latency constraints."
        ],
        "interviewPrompt": "Why can a system generate attractive individual frames but still produce an implausible video?"
      }
    ],
    "quizQuestionCount": 8
  },
  {
    "id": "grounding-and-retrieval",
    "number": "6",
    "title": "Grounding with external knowledge",
    "description": "Retrieve useful evidence, construct context, and locate failures in grounded generation.",
    "color": "#039BE5",
    "icon": "Search",
    "topics": [
      {
        "id": "knowledge-and-rag",
        "title": "Knowledge in weights versus context",
        "summary": "RAG supplies external evidence in context while leaving ordinary inference-time model weights unchanged.",
        "keyPoints": [
          "RAG supplies retrieved evidence at inference time.",
          "Retrieval changes model inputs rather than parameters.",
          "Grounded generation still needs correctness and permission checks."
        ],
        "interviewPrompt": "Why is fine-tuning on last year’s policy documents a weak solution for answering questions about today’s policies?"
      },
      {
        "id": "document-preparation",
        "title": "Preparing documents for retrieval",
        "summary": "Parsing, chunking, metadata, and versioning determine which evidence retrieval can preserve.",
        "keyPoints": [
          "Chunking defines the evidence units a retriever can return.",
          "Metadata preserves source, date, and access context.",
          "An unreadable parse cannot be repaired by a better similarity score."
        ],
        "interviewPrompt": "A retrieved passage contains a table heading but none of its values. Which ingestion choice could explain the failure?"
      },
      {
        "id": "retrieval-mechanisms",
        "title": "Retrieving relevant evidence",
        "summary": "Lexical and dense retrieval find different kinds of matches; approximate search adds another accuracy–latency tradeoff.",
        "keyPoints": [
          "Lexical retrieval rewards useful term matches.",
          "Dense retrieval compares learned representations.",
          "Approximate search trades exactness for speed."
        ],
        "interviewPrompt": "Why can dense retrieval miss an exact product code while lexical retrieval finds it immediately?"
      },
      {
        "id": "hybrid-retrieval-and-reranking",
        "title": "Improving retrieval",
        "summary": "Hybrid retrieval broadens candidates; joint reranking spends more computation deciding which candidates matter.",
        "keyPoints": [
          "Hybrid retrieval combines complementary candidate sources.",
          "Reranking applies a stronger scorer to a smaller set.",
          "A reranker cannot recover a document absent from its candidates."
        ],
        "interviewPrompt": "A reranker is accurate on judged pairs but the system still misses key evidence. Where should you inspect first?"
      },
      {
        "id": "grounded-generation",
        "title": "Generating grounded answers",
        "summary": "A grounded answer must use complete, permitted evidence and support each cited claim.",
        "keyPoints": [
          "Context selection must preserve necessary evidence.",
          "Citations need claim-level support.",
          "Abstention is appropriate when allowed evidence cannot answer the question."
        ],
        "interviewPrompt": "The answer cites a relevant document, but the cited passage does not support its number. What failed?"
      },
      {
        "id": "choosing-interventions",
        "title": "Choosing the right intervention",
        "summary": "Choose changes from the measured failure stage rather than treating every error as a model-size problem.",
        "keyPoints": [
          "Different failures require different changes.",
          "Stage-level measurements prevent misplaced optimization.",
          "Compare against a simple baseline under the same constraints."
        ],
        "interviewPrompt": "You retrieved the correct answer passage, but the generated answer contradicts it. Would you first replace the search index?"
      }
    ],
    "quizQuestionCount": 8
  },
  {
    "id": "evaluation-and-safety",
    "number": "7",
    "title": "Evaluation, reliability, and safety",
    "description": "Measure useful behavior, identify misleading scores, and enforce trust boundaries.",
    "color": "#D93025",
    "icon": "ListChecks",
    "topics": [
      {
        "id": "evaluation-design",
        "title": "Designing a generative-model evaluation",
        "summary": "A valid evaluation compares complete systems against representative requirements with uncertainty and failure slices.",
        "keyPoints": [
          "Compare complete systems under representative task requirements.",
          "Use slices and statistical uncertainty to assess measured gains.",
          "Confidence calibration and answer coverage complement accuracy."
        ],
        "interviewPrompt": "How would you decide whether a confidence threshold improves reliability without refusing too many useful requests?"
      },
      {
        "id": "text-evaluation",
        "title": "Evaluating generated text",
        "summary": "Text metrics test particular properties, so token loss, overlap, semantics, and correctness need distinct interpretation.",
        "keyPoints": [
          "Perplexity evaluates token prediction under a tokenizer.",
          "Overlap metrics compare surface forms.",
          "Semantic similarity and factual correctness require separate checks."
        ],
        "interviewPrompt": "Why can two correct paraphrases receive very different overlap scores?"
      },
      {
        "id": "human-and-model-judges",
        "title": "Human evaluation and model judges",
        "summary": "Human and model judges need concrete rubrics, bias checks, and independent validation.",
        "keyPoints": [
          "A judge needs an explicit task-specific rubric.",
          "Presentation biases can change pairwise winners.",
          "Agreement with people must be checked on representative examples."
        ],
        "interviewPrompt": "A model judge favors whichever answer appears first. How would you detect and reduce that effect?"
      },
      {
        "id": "rag-evaluation",
        "title": "Evaluating grounded answers",
        "summary": "Evaluate retrieval, context, correctness, faithfulness, and citations separately to locate grounded-answer failures.",
        "keyPoints": [
          "Retrieval coverage and answer quality are different measurements.",
          "Faithfulness can coexist with an incorrect source.",
          "Citation accuracy requires support for the cited claim."
        ],
        "interviewPrompt": "An answer is perfectly faithful to an obsolete policy. Which evaluation dimensions should pass and fail?"
      },
      {
        "id": "multimodal-evaluation",
        "title": "Evaluating images and multimodal outputs",
        "summary": "Multimodal evaluation must inspect fidelity, coverage, requested structure, and temporal behavior beyond aggregate similarity.",
        "keyPoints": [
          "Fidelity and diversity are separate dimensions.",
          "Distribution metrics depend on the representation and sample set.",
          "Video and audio require temporal and perceptual checks."
        ],
        "interviewPrompt": "Why can a low distribution-distance score coexist with incorrect object counts in generated images?"
      },
      {
        "id": "prompt-injection",
        "title": "Prompt injection and unsafe tool use",
        "summary": "Treat external instructions as untrusted data and enforce action permissions independently of generated text.",
        "keyPoints": [
          "External content is evidence rather than new authority.",
          "Permission checks belong in the executor.",
          "Structured outputs do not establish authorization."
        ],
        "interviewPrompt": "A retrieved document tells the assistant to email its contents elsewhere. Where should the system enforce the boundary?"
      },
      {
        "id": "privacy-bias-and-harm",
        "title": "Privacy, bias, and harmful outputs",
        "summary": "Privacy, group performance, harmful outputs, and refusal behavior require explicit requirements and targeted evaluation.",
        "keyPoints": [
          "A model can memorize rare or repeated training material.",
          "Group-level evaluation reveals uneven performance.",
          "Refusal behavior needs both safety and usefulness checks."
        ],
        "interviewPrompt": "A safety update blocks harmful requests but also refuses routine questions from one language group. What should evaluation reveal?"
      }
    ],
    "quizQuestionCount": 8
  },
  {
    "id": "inference-and-diagnosis",
    "number": "8",
    "title": "Efficient inference and practical diagnosis",
    "description": "Connect memory, computation, latency, and cost to model and deployment choices.",
    "color": "#188038",
    "icon": "Wrench",
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
        "title": "Memory estimates and inference quantization",
        "summary": "Estimate weights and sequence state separately, then validate the memory and quality effects of lower precision.",
        "keyPoints": [
          "Weight storage and KV storage scale differently.",
          "Lower precision reduces representation cost with possible quality loss.",
          "Actual deployment memory includes overhead beyond simple estimates."
        ],
        "interviewPrompt": "Why can a model fit at batch size one but run out of memory when serving long concurrent conversations?"
      },
      {
        "id": "efficient-attention",
        "title": "Efficient attention and cache management",
        "summary": "Sharing projections, tiling attention, and paging cache memory address different inference bottlenecks.",
        "keyPoints": [
          "Grouped-query attention shares keys and values across query heads.",
          "FlashAttention reduces memory traffic without replacing full attention with an approximation.",
          "Paged cache allocation addresses dynamic sequence storage."
        ],
        "interviewPrompt": "Do grouped-query attention, FlashAttention, and paged caching reduce the same resource in the same way?"
      },
      {
        "id": "batching-and-prefix-caching",
        "title": "Serving multiple requests",
        "summary": "Scheduling and compatible prefix reuse improve utilization while changing latency, isolation, and freshness requirements.",
        "keyPoints": [
          "Continuous batching replaces completed sequences with new work.",
          "Prefix caching reuses compatible prompt state.",
          "Throughput gains can increase waiting time for individual users."
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
        "id": "production-diagnosis",
        "title": "Choosing and debugging a deployed model",
        "summary": "Choose a complete quality–cost–latency operating point and use controlled experiments to diagnose regressions.",
        "keyPoints": [
          "A deployment comparison includes quality and complete request cost.",
          "Controlled ablations isolate the failing component.",
          "Versioned evaluation and rollback make changes reviewable."
        ],
        "interviewPrompt": "A smaller model is cheaper per token but needs longer answers and more retries. What should the cost comparison include?"
      }
    ],
    "quizQuestionCount": 8
  }
];
export const genaiTopics = genaiParts.flatMap(part => part.topics);
export const genaiTopicCount = genaiTopics.length;
export const genaiPartsById = Object.fromEntries(genaiParts.map(part => [part.id, part])) as Record<string, GenaiPart>;
export const genaiTopicsById = Object.fromEntries(genaiTopics.map(topic => [topic.id, topic]));
export const genaiPartIdForTopic = Object.fromEntries(genaiParts.flatMap(part => part.topics.map(topic => [topic.id, part.id])));
export const genaiLessonNumbers = Object.fromEntries(genaiParts.flatMap(part => part.topics.map((topic, i) => [topic.id, `${part.number}.${i + 1}`])));
