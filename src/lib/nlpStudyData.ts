// Standalone NLP curriculum. Public lesson summaries and quiz counts only.
export interface NlpTopic { id: string; title: string; summary: string; keyPoints: string[]; interviewPrompt: string; }
export interface NlpReference { title: string; url: string; }
export interface NlpPart { id: string; number: string; title: string; description: string; color: string; icon: string; topics: NlpTopic[]; quizQuestionCount: number; references: NlpReference[]; }
export const NLP_DOMAIN = "Natural Language Processing / Understanding (NLP / NLU)";
export const nlpParts: NlpPart[] = [
  {
    "id": "foundations",
    "number": "1",
    "title": "Foundations",
    "description": "Frame language tasks, understand the evidence, and establish a valid learning problem.",
    "color": "#4285F4",
    "icon": "Blocks",
    "topics": [
      {
        "id": "language-tasks",
        "title": "What NLP and NLU do",
        "summary": "NLP maps language to structured predictions or generated text for a defined use.",
        "keyPoints": [
          "Specify the input, output, evidence, and action.",
          "Understanding depends on context and task definitions.",
          "Generation quality includes correctness, not only fluency."
        ],
        "interviewPrompt": "How would you turn “understand support messages” into a measurable prediction problem?"
      },
      {
        "id": "language-and-context",
        "title": "Why language is difficult",
        "summary": "Meaning depends on word structure, sentence structure, context, and the speaker’s intended use.",
        "keyPoints": [
          "The same spelling can express different meanings.",
          "Negation, order, and reference change the answer.",
          "Missing context can make a label genuinely ambiguous."
        ],
        "interviewPrompt": "Why might replacing each word with a synonym change a classification label?"
      },
      {
        "id": "learning-paradigms",
        "title": "How models learn from language",
        "summary": "Learning signals can come from supplied labels, structure, or targets constructed from text itself.",
        "keyPoints": [
          "Recorded outcomes and human labels have different limitations.",
          "Self-supervision creates prediction tasks from available text.",
          "Pretraining does not remove the need for task evaluation."
        ],
        "interviewPrompt": "You have a large message archive and 500 labels. Which learning signals are available?"
      },
      {
        "id": "examples-and-labels",
        "title": "Defining examples, features, and labels",
        "summary": "A dataset needs a precise prediction unit, input contract, and reproducible target.",
        "keyPoints": [
          "Documents, tokens, spans, and pairs create different examples.",
          "Inputs must be available at the prediction time.",
          "Label policies determine what the model is trained to predict."
        ],
        "interviewPrompt": "Define a training example for routing a customer conversation while it is still happening."
      },
      {
        "id": "labels-and-leakage",
        "title": "Training, validation, testing, and leakage",
        "summary": "Evaluation must exclude information unavailable in the deployment setting being claimed.",
        "keyPoints": [
          "Training fits; validation chooses; test assesses fixed choices.",
          "Keep dependent conversations and duplicate documents together.",
          "Temporal tasks require historically available labels and inputs."
        ],
        "interviewPrompt": "Why can a random split over messages overestimate performance on new conversations?"
      },
      {
        "id": "baselines-and-metrics",
        "title": "Baselines and basic evaluation",
        "summary": "A useful model must beat a relevant reference under the same decision constraints.",
        "keyPoints": [
          "Compare trivial, current-system, and simple learned references.",
          "Precision and recall use different denominators.",
          "Choose metrics and class averaging from the actual task."
        ],
        "interviewPrompt": "A spam detector has 99% accuracy. What would you ask before calling it useful?"
      }
    ],
    "quizQuestionCount": 3,
    "references": [
      {
        "title": "Google ML Crash Course",
        "url": "https://developers.google.com/machine-learning/crash-course"
      },
      {
        "title": "Speech and Language Processing",
        "url": "https://web.stanford.edu/~jurafsky/slp3/"
      }
    ]
  },
  {
    "id": "mathematics-and-probability",
    "number": "2",
    "title": "Mathematical and probability tools",
    "description": "Build the numerical vocabulary needed for text probabilities, embeddings, and neural models.",
    "color": "#EA4335",
    "icon": "Combine",
    "topics": [
      {
        "id": "vectors-and-tensors",
        "title": "Vectors, matrices, and tensor shapes",
        "summary": "Arrays represent features; their shapes determine which model operations are valid.",
        "keyPoints": [
          "A matrix multiplication combines weighted coordinates.",
          "Dot products depend on vector lengths and directions.",
          "Cosine compares directions and needs nonzero vectors."
        ],
        "interviewPrompt": "Why can two documents have equal cosine similarity but different dot-product scores?"
      },
      {
        "id": "probability-and-language",
        "title": "Probability and conditional reasoning",
        "summary": "Conditional probability updates an event’s likelihood when evidence is known.",
        "keyPoints": [
          "Probabilities describe events under a specified population.",
          "Bayes’ rule connects evidence likelihoods and posterior beliefs.",
          "Expectation and variance describe average outcomes and spread."
        ],
        "interviewPrompt": "Why can a strongly suspicious phrase still occur mostly in legitimate messages?"
      },
      {
        "id": "sequence-probability",
        "title": "Sequence probability, likelihood, and logarithms",
        "summary": "A sequence probability factors into conditional token probabilities under a specified context.",
        "keyPoints": [
          "The probability chain rule is an identity.",
          "A limited context is an extra modeling assumption.",
          "Logarithms turn products into sums without changing likelihood order."
        ],
        "interviewPrompt": "Why should sequence scores be accumulated in log space?"
      },
      {
        "id": "information-theory",
        "title": "Entropy, cross-entropy, and distribution mismatch",
        "summary": "Entropy measures uncertainty; cross-entropy measures prediction cost under another distribution.",
        "keyPoints": [
          "Cross-entropy penalizes probability placed away from actual outcomes.",
          "KL measures a directed distribution mismatch.",
          "The true outcome distribution and fitted model have distinct roles."
        ],
        "interviewPrompt": "Can a confident model have low entropy and still have very bad cross-entropy?"
      }
    ],
    "quizQuestionCount": 5,
    "references": [
      {
        "title": "Speech and Language Processing — probability and information",
        "url": "https://web.stanford.edu/~jurafsky/slp3/"
      }
    ]
  },
  {
    "id": "text-representations",
    "number": "3",
    "title": "Preparing and representing text",
    "description": "Preserve relevant language evidence and choose representations that expose useful patterns.",
    "color": "#00897B",
    "icon": "Braces",
    "topics": [
      {
        "id": "text-and-preprocessing",
        "title": "Text normalization and segmentation",
        "summary": "Text preparation chooses which distinctions survive from source text to model input.",
        "keyPoints": [
          "Unicode, casing, punctuation, and whitespace need deliberate treatment.",
          "Normalization can merge values that the task must distinguish.",
          "Preserve source text and offsets for extraction."
        ],
        "interviewPrompt": "When might lowercasing help topic classification but hurt entity extraction?"
      },
      {
        "id": "tokens-and-vocabularies",
        "title": "Word, character, and byte tokenization",
        "summary": "A tokenizer segments text into model units and maps them to vocabulary IDs.",
        "keyPoints": [
          "Vocabulary size trades against sequence length.",
          "An ID is an identifier, not a semantic coordinate.",
          "Special tokens and unknown handling belong to the input contract."
        ],
        "interviewPrompt": "Does byte coverage guarantee that a model understands every language?"
      },
      {
        "id": "tokens-and-subwords",
        "title": "Byte-pair encoding",
        "summary": "BPE learns reusable adjacent-symbol merges and applies a fixed merge order to new text.",
        "keyPoints": [
          "Training counts adjacent pairs and merges selected symbols.",
          "Encoding reuses learned ranks without retraining on the request.",
          "Boundary rules and base-symbol coverage affect unseen words."
        ],
        "interviewPrompt": "How can BPE represent an unseen word using a fixed vocabulary?"
      },
      {
        "id": "wordpiece-and-unigram",
        "title": "WordPiece, unigram tokenization, and tokenizer tradeoffs",
        "summary": "Subword methods differ in vocabulary learning and in how they select a segmentation.",
        "keyPoints": [
          "WordPiece commonly encodes by longest matching vocabulary pieces.",
          "Unigram models score alternative segmentations probabilistically.",
          "Compare coverage and length across the languages you serve."
        ],
        "interviewPrompt": "Why can the same text require very different token budgets under two tokenizers?"
      },
      {
        "id": "lexical-representations",
        "title": "Bag-of-words and n-gram features",
        "summary": "Sparse features record explicit word or character evidence for a text model.",
        "keyPoints": [
          "Unigram counts discard order.",
          "Word n-grams retain selected local patterns.",
          "Character n-grams share evidence across spelling variants."
        ],
        "interviewPrompt": "Why might adding bigrams help distinguish “good” from “not good”?"
      },
      {
        "id": "tfidf-and-hashing",
        "title": "TF-IDF and feature hashing",
        "summary": "Feature weighting and hashing control the influence and storage of sparse lexical evidence.",
        "keyPoints": [
          "IDF downweights terms common in the reference corpus.",
          "Hashing limits feature width but creates collisions.",
          "Fit corpus-derived statistics inside training."
        ],
        "interviewPrompt": "When would hashing be preferable to storing a complete text vocabulary?"
      }
    ],
    "quizQuestionCount": 6,
    "references": [
      {
        "title": "Unicode normalization",
        "url": "https://www.unicode.org/reports/tr15/"
      },
      {
        "title": "BPE subwords",
        "url": "https://aclanthology.org/P16-1162/"
      },
      {
        "title": "Unigram subword modeling",
        "url": "https://aclanthology.org/P18-1007/"
      }
    ]
  },
  {
    "id": "classical-models",
    "number": "4",
    "title": "Classical models and strong baselines",
    "description": "Understand inexpensive text classifiers and probabilistic language models before adding neural complexity.",
    "color": "#A78BFA",
    "icon": "LineChart",
    "topics": [
      {
        "id": "naive-bayes",
        "title": "Naive Bayes for text classification",
        "summary": "Naive Bayes combines class priors with conditionally independent feature evidence.",
        "keyPoints": [
          "Feature distributions must match counts or indicators.",
          "Smoothing prevents unseen words from zeroing a class score.",
          "Correlated evidence can distort predicted confidence."
        ],
        "interviewPrompt": "Why can repeating correlated words make Naive Bayes overconfident?"
      },
      {
        "id": "linear-text-models",
        "title": "Linear and logistic text classifiers",
        "summary": "Linear text models learn feature contributions; logistic models convert scores into class probabilities.",
        "keyPoints": [
          "Sparse coefficients provide inexpensive, inspectable predictions.",
          "Log loss fits probability predictions.",
          "Regularization controls unstable weights, not missing information."
        ],
        "interviewPrompt": "What kinds of language patterns are difficult for a unigram linear classifier?"
      },
      {
        "id": "ngram-language-models",
        "title": "N-gram language models and smoothing",
        "summary": "N-gram models estimate the next token using a short history and smoothed counts.",
        "keyPoints": [
          "The history-length restriction is the model’s assumption.",
          "Unseen continuations need nonzero probability support.",
          "Backoff shares evidence with shorter histories."
        ],
        "interviewPrompt": "Why can a higher-order n-gram model generalize worse on a small corpus?"
      },
      {
        "id": "language-model-evaluation",
        "title": "Evaluating language models",
        "summary": "Held-out log loss and perplexity measure how much probability a model assigns to observed text.",
        "keyPoints": [
          "Perplexity is exponential average token log loss.",
          "Tokenization and scoring conventions determine comparability.",
          "Predictable text is not necessarily useful or factual text."
        ],
        "interviewPrompt": "Can lower perplexity establish that a question-answering model is more truthful?"
      }
    ],
    "quizQuestionCount": 4,
    "references": [
      {
        "title": "Speech and Language Processing — text models",
        "url": "https://web.stanford.edu/~jurafsky/slp3/"
      },
      {
        "title": "scikit-learn Naive Bayes",
        "url": "https://scikit-learn.org/stable/modules/naive_bayes.html"
      }
    ]
  },
  {
    "id": "neural-foundations",
    "number": "5",
    "title": "Neural learning foundations",
    "description": "Trace a complete neural prediction and learn how its parameters improve from examples.",
    "color": "#34A853",
    "icon": "Network",
    "topics": [
      {
        "id": "neural-text-features",
        "title": "Neurons, activations, and the forward pass",
        "summary": "Neural networks compose learned weighted sums with nonlinear transformations.",
        "keyPoints": [
          "Dense layers mix feature coordinates.",
          "Nonlinearities let stacked layers express richer relationships.",
          "A task head maps learned features to required outputs."
        ],
        "interviewPrompt": "Why does stacking linear layers without activations fail to add nonlinear expressiveness?"
      },
      {
        "id": "neural-output-heads",
        "title": "Output heads, probabilities, and losses",
        "summary": "Match the output transformation and training loss to the target’s structure.",
        "keyPoints": [
          "Softmax models mutually exclusive alternatives.",
          "Independent sigmoid outputs support simultaneous labels.",
          "Logits, probabilities, labels, losses, and metrics are different objects."
        ],
        "interviewPrompt": "Why is one softmax unsuitable when an article can have several valid labels?"
      },
      {
        "id": "backpropagation",
        "title": "Derivatives, the chain rule, and backpropagation",
        "summary": "Backpropagation computes loss derivatives by composing local derivatives through a computation graph.",
        "keyPoints": [
          "Multiply sensitivities along a path and add contributions across paths.",
          "Shared parameters accumulate gradients from every use.",
          "Computing a gradient does not update the parameter."
        ],
        "interviewPrompt": "A token affects the loss but its embedding never changes. Where would you look?"
      },
      {
        "id": "optimization",
        "title": "Mini-batches, optimizers, and learning rates",
        "summary": "An optimizer uses gradients to change parameters; sampling and step size determine update behavior.",
        "keyPoints": [
          "Mini-batches trade per-step work for gradient noise.",
          "Momentum and Adam use running gradient information.",
          "Warmup, decay, clipping, and weight decay address different issues."
        ],
        "interviewPrompt": "Why can training become unstable when the learning rate is increased?"
      },
      {
        "id": "generalization",
        "title": "Generalization and regularization",
        "summary": "A good fit captures relationships that transfer beyond its training examples.",
        "keyPoints": [
          "Bias and variance describe different repeated-fit behavior.",
          "Dropout, penalties, and early stopping restrict fitting differently.",
          "Representative evidence matters more than training accuracy alone."
        ],
        "interviewPrompt": "A larger network fits perfectly but validates worse. What could explain this?"
      },
      {
        "id": "training-diagnostics",
        "title": "Diagnosing training failures",
        "summary": "Use controlled evidence to separate data problems, fitting failures, and insufficient representations.",
        "keyPoints": [
          "A learning curve varies training-set size.",
          "A small-subset fit checks whether a suitable model can learn the pipeline.",
          "Change one plausible cause and evaluate the resulting behavior."
        ],
        "interviewPrompt": "What would you check if a flexible model cannot fit a small consistent dataset?"
      }
    ],
    "quizQuestionCount": 4,
    "references": [
      {
        "title": "PyTorch automatic differentiation",
        "url": "https://docs.pytorch.org/tutorials/beginner/basics/autogradqs_tutorial.html"
      },
      {
        "title": "PyTorch cross-entropy",
        "url": "https://docs.pytorch.org/docs/stable/generated/torch.nn.CrossEntropyLoss.html"
      }
    ]
  },
  {
    "id": "embeddings-and-sequences",
    "number": "6",
    "title": "Embeddings and sequence models",
    "description": "Move from reusable token vectors to local patterns, recurrent context, and sequence generation.",
    "color": "#E37400",
    "icon": "Layers",
    "topics": [
      {
        "id": "embedding-lookup",
        "title": "Embedding tables and learned geometry",
        "summary": "An embedding lookup selects learned vector rows corresponding to token IDs.",
        "keyPoints": [
          "The table is shared across all occurrences of a token.",
          "Backpropagation updates the rows used by the computation.",
          "Distance meaning comes from training, not from ID order."
        ],
        "interviewPrompt": "How can a single token embedding receive several gradient contributions in one batch?"
      },
      {
        "id": "static-embeddings",
        "title": "Learning static word embeddings",
        "summary": "Distributional objectives train word vectors using observed contexts and alternative words.",
        "keyPoints": [
          "Skip-gram predicts context from a center word.",
          "Negative sampling trains selected positive and negative pairs.",
          "A static vector blends a word’s senses and associations."
        ],
        "interviewPrompt": "Why might antonyms be close in a distributional embedding space?"
      },
      {
        "id": "text-convolution",
        "title": "Convolutional models for text",
        "summary": "Shared local filters turn token windows into pattern responses that pooling can summarize.",
        "keyPoints": [
          "A filter combines all embedding coordinates inside its window.",
          "Pooling can retain a strong match while discarding its location.",
          "Local features and global order are different capabilities."
        ],
        "interviewPrompt": "What information can max pooling lose when applied to text features?"
      },
      {
        "id": "sequence-models",
        "title": "Recurrent neural networks",
        "summary": "A recurrent model updates a shared state from the current token and previous state.",
        "keyPoints": [
          "The state is a learned summary of earlier evidence.",
          "Shared recurrent weights receive gradients across time.",
          "Bidirectional context is unsuitable for unseen future-token prediction."
        ],
        "interviewPrompt": "How does processing order affect a recurrent sentence representation?"
      },
      {
        "id": "gated-sequence-models",
        "title": "LSTMs, GRUs, and long-range dependencies",
        "summary": "Gates regulate the information carried through a recurrent sequence.",
        "keyPoints": [
          "LSTM memory has an additive update path.",
          "Forget, input, and output gates have distinct roles.",
          "Gating helps gradient flow but does not guarantee perfect memory."
        ],
        "interviewPrompt": "Why can an LSTM preserve information more easily than a plain recurrent state?"
      },
      {
        "id": "sequence-objectives",
        "title": "Encoder-decoder models and teacher forcing",
        "summary": "A sequence-to-sequence model conditions a generated target on a source sequence and target prefix.",
        "keyPoints": [
          "Encoder and decoder have different information roles.",
          "Teacher forcing supplies earlier reference tokens during training.",
          "Shift targets correctly and evaluate generated prefixes at inference."
        ],
        "interviewPrompt": "Why can a model trained with correct prefixes fail after its first generated mistake?"
      }
    ],
    "quizQuestionCount": 8,
    "references": [
      {
        "title": "Word2Vec training objectives",
        "url": "https://arxiv.org/abs/1310.4546"
      },
      {
        "title": "Speech and Language Processing — neural sequence models",
        "url": "https://web.stanford.edu/~jurafsky/slp3/"
      }
    ]
  },
  {
    "id": "transformers",
    "number": "7",
    "title": "Attention and Transformers",
    "description": "Build attention, legal context, position, and full Transformer information flow step by step.",
    "color": "#4285F4",
    "icon": "Network",
    "topics": [
      {
        "id": "attention",
        "title": "Attention as weighted information aggregation",
        "summary": "Attention mixes value vectors using normalized query-key compatibility scores.",
        "keyPoints": [
          "Queries and keys determine weights; values supply content.",
          "Scaling controls score magnitude before softmax.",
          "A weighted mixture is not necessarily one selected token."
        ],
        "interviewPrompt": "How does increasing one attention score change the resulting representation?"
      },
      {
        "id": "attention-types",
        "title": "Self-attention, cross-attention, and multiple heads",
        "summary": "Attention variants differ in their information sources and learned projection subspaces.",
        "keyPoints": [
          "Self-attention reads the same sequence.",
          "Cross-attention reads another set of representations.",
          "Multiple heads combine several learned mixtures without predefined roles."
        ],
        "interviewPrompt": "Why might two attention heads learn different behavior on the same input?"
      },
      {
        "id": "positional-information",
        "title": "Representing position and word order",
        "summary": "Position mechanisms distinguish token order beyond the tokens’ identities.",
        "keyPoints": [
          "Absolute embeddings combine content with a position signal.",
          "Relative and rotary methods express positional relationships differently.",
          "Position schemes have limits beyond their training distribution."
        ],
        "interviewPrompt": "What happens to self-attention when token order is permuted without any position signal?"
      },
      {
        "id": "encoder-decoder-masks",
        "title": "Padding masks, causal masks, and information access",
        "summary": "Masks specify which keys each query is allowed to use before attention normalization.",
        "keyPoints": [
          "Causal masks block future target positions.",
          "Padding masks exclude artificial inputs.",
          "Attention, pooling, and loss masks solve different problems."
        ],
        "interviewPrompt": "Why might a prediction change when the same sentence is batched with a longer one?"
      },
      {
        "id": "transformer-blocks",
        "title": "The Transformer block",
        "summary": "A Transformer block combines attention-based token mixing and per-token nonlinear feature transformations.",
        "keyPoints": [
          "Residual paths preserve additive information and gradient routes.",
          "Layer normalization operates on an example’s feature coordinates.",
          "The feed-forward layer transforms features separately at each position."
        ],
        "interviewPrompt": "What functions would be lost if a Transformer block contained attention alone?"
      },
      {
        "id": "transformer-architectures",
        "title": "Encoder-only, decoder-only, and encoder-decoder architectures",
        "summary": "Architecture determines which context supports each representation and prediction.",
        "keyPoints": [
          "Encoders contextualize a complete available input.",
          "Causal decoders extend prefixes.",
          "Encoder-decoder models combine full source access with causal target access."
        ],
        "interviewPrompt": "Which information paths are valid when translating a complete source sentence?"
      },
      {
        "id": "context-and-compute",
        "title": "Sequence length, context, and computational cost",
        "summary": "Longer contexts increase attention interactions and activation work in different ways.",
        "keyPoints": [
          "Dense prefill attention forms a square position-pair matrix.",
          "Cached decoding reuses earlier keys and values.",
          "Context capacity does not guarantee reliable use of every token."
        ],
        "interviewPrompt": "Why does increasing context length strain memory even when the model weights stay fixed?"
      }
    ],
    "quizQuestionCount": 7,
    "references": [
      {
        "title": "Attention Is All You Need",
        "url": "https://arxiv.org/abs/1706.03762"
      },
      {
        "title": "Rotary position embeddings",
        "url": "https://arxiv.org/abs/2104.09864"
      }
    ]
  },
  {
    "id": "pretraining-and-adaptation",
    "number": "8",
    "title": "Pretraining, adaptation, and generation",
    "description": "Connect language objectives to reusable features, task adaptation, and generated outputs.",
    "color": "#DB4437",
    "icon": "Sparkles",
    "topics": [
      {
        "id": "pretraining-objectives",
        "title": "Language-model pretraining objectives",
        "summary": "Self-supervised objectives choose what text is visible and which missing or future content must be predicted.",
        "keyPoints": [
          "Causal, masked, and denoising objectives create distinct tasks.",
          "Masking targets and attention access must agree.",
          "A pretraining objective does not establish downstream factual reliability."
        ],
        "interviewPrompt": "Why can a masked language model read right context while a next-token model cannot?"
      },
      {
        "id": "contextual-representations",
        "title": "Using contextual representations",
        "summary": "Contextual states encode a token together with the context available to its model.",
        "keyPoints": [
          "Token states and sentence-level representations have different shapes.",
          "Pooling must ignore padding and reflect the training task.",
          "Frozen features still require evaluation for the target problem."
        ],
        "interviewPrompt": "Why is a pretrained model’s first-token vector not automatically a good search embedding?"
      },
      {
        "id": "fine-tuning",
        "title": "Fine-tuning and parameter-efficient adaptation",
        "summary": "Adaptation changes a pretrained representation or its task mapping using relevant training evidence.",
        "keyPoints": [
          "Frozen, partial, and full updates expose different numbers of parameters.",
          "LoRA learns a low-rank update while freezing a base matrix.",
          "Fewer trainable weights do not remove base-model activation costs."
        ],
        "interviewPrompt": "How would you choose an adaptation strategy with only a few hundred labels?"
      },
      {
        "id": "instruction-and-preference-tuning",
        "title": "Instruction tuning and preference-based adaptation",
        "summary": "Demonstrations and preference comparisons teach different kinds of desired response behavior.",
        "keyPoints": [
          "Supervised fine-tuning imitates target responses.",
          "Preference methods learn relative response desirability.",
          "Reward optimization and direct preference objectives are different procedures."
        ],
        "interviewPrompt": "Can a model trained on preferred answers still produce unsupported statements?"
      },
      {
        "id": "decoding",
        "title": "Decoding and stopping decisions",
        "summary": "Decoding converts next-token distributions into complete output sequences under an explicit policy.",
        "keyPoints": [
          "Greedy, beam, and sampling policies optimize different behavior.",
          "Temperature and truncation alter sampling distributions.",
          "Stopping and length rules affect both quality and cost."
        ],
        "interviewPrompt": "Why can greedy decoding miss the most probable complete sequence?"
      }
    ],
    "quizQuestionCount": 6,
    "references": [
      {
        "title": "BERT pretraining",
        "url": "https://aclanthology.org/N19-1423/"
      },
      {
        "title": "T5 denoising and transfer",
        "url": "https://jmlr.org/papers/v21/20-074.html"
      },
      {
        "title": "Low-rank adaptation",
        "url": "https://arxiv.org/abs/2106.09685"
      },
      {
        "title": "Instruction and preference training",
        "url": "https://arxiv.org/abs/2203.02155"
      }
    ]
  },
  {
    "id": "understanding-tasks",
    "number": "9",
    "title": "Language understanding and extraction",
    "description": "Apply representations and objectives to decisions, spans, coherent labels, and text pairs.",
    "color": "#00897B",
    "icon": "Share2",
    "topics": [
      {
        "id": "text-classification",
        "title": "Text classification, sentiment, and intent",
        "summary": "Text classification predicts categories from language under a defined labeling policy.",
        "keyPoints": [
          "Match binary, multiclass, or multilabel heads to the task.",
          "Compare lexical baselines with contextual models on shared examples.",
          "Inspect negation, class imbalance, and rare intents."
        ],
        "interviewPrompt": "How would you distinguish a representation failure from a poor classification threshold?"
      },
      {
        "id": "entities-and-spans",
        "title": "Named-entity recognition and span extraction",
        "summary": "Entity extraction identifies source spans and assigns their task-specific types.",
        "keyPoints": [
          "BIO labels encode boundaries and continuation.",
          "Subword outputs must map back to original source offsets.",
          "Entity-level evaluation checks complete spans and types."
        ],
        "interviewPrompt": "Why can high token accuracy coexist with poor entity extraction?"
      },
      {
        "id": "structured-prediction",
        "title": "Structured prediction with CRFs and Viterbi decoding",
        "summary": "A conditional random field scores complete label sequences using local evidence and transitions.",
        "keyPoints": [
          "Sequence scores couple neighboring label choices.",
          "Viterbi finds a best-scoring path with dynamic programming.",
          "Training normalization and best-path decoding are different operations."
        ],
        "interviewPrompt": "When can an individually weaker token label belong to the best complete label sequence?"
      },
      {
        "id": "sentence-pair-understanding",
        "title": "Sentence-pair understanding",
        "summary": "Pair tasks distinguish similarity, equivalent meaning, and directional entailment.",
        "keyPoints": [
          "Similarity does not imply logical support.",
          "Entailment is directional; paraphrase aims at meaning equivalence.",
          "Train pair representations for the relationship actually evaluated."
        ],
        "interviewPrompt": "Why might two contradictory sentences receive a high similarity score?"
      },
      {
        "id": "question-answering",
        "title": "Extractive question answering and answerability",
        "summary": "An extractive reader predicts an answer span in available evidence or identifies that no answer is supported.",
        "keyPoints": [
          "Start and end outputs must define a valid source span.",
          "Train and evaluate unanswerable cases explicitly.",
          "Exact match and token overlap capture different errors."
        ],
        "interviewPrompt": "Why should a reader be able to decline extraction when the context looks relevant?"
      }
    ],
    "quizQuestionCount": 11,
    "references": [
      {
        "title": "Speech and Language Processing — tagging and understanding",
        "url": "https://web.stanford.edu/~jurafsky/slp3/"
      },
      {
        "title": "Extractive QA and answerability",
        "url": "https://aclanthology.org/P18-2124/"
      }
    ]
  },
  {
    "id": "retrieval-and-generation",
    "number": "10",
    "title": "Semantic search and text generation tasks",
    "description": "Learn useful sentence spaces, retrieve and rerank evidence, and evaluate generated language.",
    "color": "#7C3AED",
    "icon": "Search",
    "topics": [
      {
        "id": "sentence-embeddings",
        "title": "Sentence embeddings and contrastive learning",
        "summary": "Sentence embedding training makes appropriate text pairs close under the intended similarity function.",
        "keyPoints": [
          "Pooling alone does not define a useful similarity objective.",
          "In-batch and hard negatives supply different training comparisons.",
          "False negatives can push equivalent texts apart."
        ],
        "interviewPrompt": "How can adding more negatives make an embedding model worse?"
      },
      {
        "id": "semantic-retrieval",
        "title": "Lexical, dense, and hybrid retrieval",
        "summary": "Retrieval selects candidate documents using explicit term evidence, learned representations, or both.",
        "keyPoints": [
          "BM25 balances term rarity, saturation, and document length.",
          "Dense search depends on representation quality and index approximation.",
          "Candidate recall limits what later stages can recover."
        ],
        "interviewPrompt": "Why can a lexical retriever outperform a dense model on a rare product code?"
      },
      {
        "id": "reranking",
        "title": "Reranking and query-document interaction",
        "summary": "A reranker spends more computation on a smaller retrieved candidate set.",
        "keyPoints": [
          "Bi-encoders allow reusable document vectors.",
          "Cross-encoders model query-document interactions jointly.",
          "Measure ranking gains alongside candidate coverage and cost."
        ],
        "interviewPrompt": "Why is a cross-encoder often impractical for the first pass over millions of documents?"
      },
      {
        "id": "retrieval-augmented-qa",
        "title": "Retrieval-augmented question answering",
        "summary": "Retrieval-augmented generation conditions an answer on selected external evidence.",
        "keyPoints": [
          "Chunking changes which evidence can be retrieved intact.",
          "Separate retrieval, context selection, and answer-generation failures.",
          "A citation or fluent answer does not establish evidential support."
        ],
        "interviewPrompt": "How would you diagnose a wrong answer when the required document is in the corpus?"
      },
      {
        "id": "translation",
        "title": "Machine translation",
        "summary": "Translation generates target-language text that preserves the source meaning under language-specific structure.",
        "keyPoints": [
          "Parallel examples connect a source to a target sequence.",
          "Decoding and segmentation influence translation behavior.",
          "BLEU measures reference overlap, not complete semantic adequacy."
        ],
        "interviewPrompt": "Why can a valid translation receive a low n-gram overlap score?"
      },
      {
        "id": "summarization",
        "title": "Summarization and faithful generation",
        "summary": "Summarization selects and expresses important source information under an output budget.",
        "keyPoints": [
          "Extraction and abstraction impose different capabilities and limits.",
          "Coverage, faithfulness, and concision are separate requirements.",
          "Overlap, semantic scores, and human checks provide different evidence."
        ],
        "interviewPrompt": "Why can a summary improve ROUGE while becoming less faithful to the source?"
      }
    ],
    "quizQuestionCount": 10,
    "references": [
      {
        "title": "Sentence-BERT",
        "url": "https://aclanthology.org/D19-1410/"
      },
      {
        "title": "Introduction to Information Retrieval",
        "url": "https://nlp.stanford.edu/IR-book/information-retrieval-book.html"
      },
      {
        "title": "Retrieval-augmented generation",
        "url": "https://arxiv.org/abs/2005.11401"
      },
      {
        "title": "BLEU",
        "url": "https://aclanthology.org/P02-1040/"
      },
      {
        "title": "ROUGE",
        "url": "https://aclanthology.org/W04-1013/"
      }
    ]
  }
];
export const nlpTopics = nlpParts.flatMap(part => part.topics);
export const nlpTopicCount = nlpTopics.length;
export const nlpPartsById = Object.fromEntries(nlpParts.map(part => [part.id, part])) as Record<string, NlpPart>;
export const nlpTopicsById = Object.fromEntries(nlpTopics.map(topic => [topic.id, topic]));
export const nlpPartIdForTopic = Object.fromEntries(nlpParts.flatMap(part => part.topics.map(topic => [topic.id, part.id])));
export const nlpLessonNumbers = Object.fromEntries(nlpParts.flatMap(part => part.topics.map((topic, i) => [topic.id, `${part.number}.${i + 1}`])));
export const nlpReferencesByTopic: Record<string, NlpReference[]> = {};
