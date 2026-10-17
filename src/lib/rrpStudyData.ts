// Study data for the "Recommendations / Ranking / Predictions (RRP)" domain, written to match
// the shape and voice of the other ML-domain tracks. Hand-authored, like amlStudyData.ts and
// agenticStudyData.ts; the shared component props are structural, not nominal.
//
// Curriculum order follows the rule the other tracks were retrofitted to: a concept is never
// referenced before the lesson that teaches it, which is why the ranking metrics sit in
// chapter 1 rather than in the evaluation chapter.
//
// Quiz questions AND answers are premium content, served only from Firestore
// (quizzes/{quizId}, gated by firestore.rules) - only the count is public here.

export interface RrpTopic {
  id: string;
  title: string;
  summary: string;
  keyPoints: string[];
  interviewPrompt: string;
  code?: string;
}

export interface RrpPart {
  id: string;
  number: string;
  title: string;
  description: string;
  color: string;
  icon: string;
  topics: RrpTopic[];
  quizQuestionCount: number;
}

export const rrpParts: RrpPart[] = [
  {
    id: "foundations",
    number: "1",
    title: "Foundations",
    description: "What these systems do, what one row of data looks like, and how a ranked list is scored.",
    color: "#4285F4",
    icon: "Blocks",
    topics: [
      {
        id: "what-is-a-recommender",
        title: "What a recommender actually does",
        summary:
          "A recommender selects useful items for a person and context; ranking and personalization help make that choice.",
        keyPoints: [
          "Define the surface, action, and success criterion before choosing a model.",
          "Separate prediction quality, list quality, and the product effect of deploying a policy.",
          "Exposure determines which outcomes become observable and can create feedback loops.",
        ],
        interviewPrompt:
          "Explain why 'predict the rating' and 'choose the ten things to show' are different problems, and which one a product actually needs.",
        code: "user + context → eligible candidates → scores and list selection → display",
      },
      {
        id: "the-ranking-funnel",
        title: "The retrieval and ranking funnel",
        summary:
          "Retrieval narrows the catalogue, ranking scores the pool, and re-ranking selects a useful final list.",
        keyPoints: [
          "Each stage needs distinct measurements for coverage, ordering, constraints, and cost.",
          "A ranker cannot recover a relevant item missing from its candidate set.",
          "Choose candidate count empirically and measure the pool after eligibility filtering.",
        ],
        interviewPrompt:
          "Your ranker improves but engagement does not move. Explain how you would tell whether retrieval is the bottleneck.",
        code: "10M items → retrieval → 800 → ranking → 50 → re-rank → 6 shown (example)",
      },
      {
        id: "users-items-interactions",
        title: "Users, items, and the interaction table",
        summary:
          "Interaction and impression logs record events that a user–item matrix only summarizes.",
        keyPoints: [
          "Repeated displays are distinct events with context and outcome windows.",
          "Unknown pairs, displayed non-clicks, and confirmed dislikes are different evidence.",
          "Join outcomes with stable keys and respect both event time and arrival time.",
        ],
        interviewPrompt:
          "A user never clicked a video. Give three different explanations and say what each implies for training.",
        code: "(user_id, item_id, action, timestamp, context)  ← one interaction",
      },
      {
        id: "implicit-feedback",
        title: "Implicit feedback and its biases",
        summary:
          "Implicit feedback records behavior; interpreting it as preference requires understanding exposure and presentation.",
        keyPoints: [
          "Clicks, watches, purchases, and hides supply different and incomplete evidence.",
          "Exposure, position, and popularity biases can coexist; correcting one does not remove all.",
          "Define the proxy and collect outcome and selection evidence that can test its limits.",
        ],
        interviewPrompt:
          "Your model trains on clicks and the product wants satisfaction. Name three ways that gap shows up and what you would do.",
        code: "shown → seen → clicked → engaged → satisfied   (you log the middle, want the end)",
      },
      {
        id: "task-framing",
        title: "Deciding what to predict",
        summary:
          "Specify the action, example unit, target quantity, conditioning, and information timing before fitting.",
        keyPoints: [
          "Per-impression and post-click probabilities have different denominators.",
          "Pending outcomes are not automatically negative; delayed labels need an explicit completion rule.",
          "Reconstruct eligible inventory and features as available at the decision time.",
        ],
        interviewPrompt:
          "'Improve the home feed.' Turn that into one predicted quantity, and defend it against an obvious alternative.",
        code: "P(click | user, item, context)   vs   E[watch time | ...]   vs   P(purchase | ...)",
      },
      {
        id: "ranking-metrics",
        title: "How a ranked list is scored",
        summary:
          "Ranking metrics evaluate which reference-relevant items appear and where, under a stated candidate protocol.",
        keyPoints: [
          "Precision@k counts relevant slots; recall@k uses an explicit reference-positive denominator.",
          "NDCG discounts positions and normalizes by ideal gain from the evaluation reference set.",
          "MRR uses the first relevant rank; report cutoffs, aggregation, uncertainty, and important slices.",
        ],
        interviewPrompt:
          "Precision@10 is flat and NDCG@10 improved. Explain what changed in the list.",
        code: "DCG = sum(gain / log2(rank + 1)); NDCG = DCG / reference ideal DCG",
      },
      {
        id: "baselines-for-rrp",
        title: "Baselines worth beating",
        summary:
          "Baselines show whether added complexity improves a credible alternative under comparable conditions.",
        keyPoints: [
          "Compare popularity, context, history, co-occurrence, and the existing system where relevant.",
          "Keep eligibility, request sets, cutoffs, and historical data availability comparable.",
          "Assess uncertainty and operating value; a small gain is not automatically noise or failure.",
        ],
        interviewPrompt:
          "Your two-tower model beats popularity by 2% on recall@100. Is that good? Say what you would check.",
        code: "compare against suitable popularity, recency, and existing-policy baselines",
      },
      {
        id: "cold-start",
        title: "Cold start",
        summary:
          "Cold start means limited evidence about a user, item, or product, with different available signals in each case.",
        keyPoints: [
          "Feature-based models can represent new items, but index publication and exposure remain separate steps.",
          "Use context, stated interests, session behavior, and evaluated fallbacks for users with little history.",
          "Measure cold slices and publication-to-index delay instead of relying only on aggregate quality.",
        ],
        interviewPrompt:
          "A marketplace adds 50,000 listings a day. Design how those items reach their first hundred impressions.",
        code: "little history → content/context + evaluated fallback → gather evidence → blend signals",
      },
    ],
    quizQuestionCount: 10,
  },
  {
    id: "classical-recommenders",
    number: "2",
    title: "Classical recommenders",
    description: "The methods that defined the field, and the intuitions every modern system still rests on.",
    color: "#EA4335",
    icon: "Combine",
    topics: [
      {
        id: "content-based-filtering",
        title: "Content-based filtering",
        summary:
          "Content-based filtering matches item attributes with a user’s stated or observed interests.",
        keyPoints: [
          "Profiles can pool item vectors; their scores depend on representation and similarity.",
          "Multiple interest profiles can avoid averaging unrelated tastes into one misleading vector.",
          "Content supports new-item representation but does not automatically provide quality, exposure, or unbiased evidence.",
        ],
        interviewPrompt:
          "When is content-based filtering a suitable first system, and what limits should you measure?",
        code: "score(user, item) = similarity(profile(user), features(item))",
      },
      {
        id: "collaborative-filtering",
        title: "Collaborative filtering",
        summary:
          "Collaborative filtering learns recommendations from shared user–item behavior.",
        keyPoints: [
          "Neighborhood methods compare users or items; latent methods share structure through learned factors.",
          "Normalize and check overlap support while accounting for how interactions were observed.",
          "Precompute where useful, but choose refresh and fallback behavior from actual catalogue and traffic conditions.",
        ],
        interviewPrompt:
          "Compare user-based and item-based collaborative filtering under different catalogue and traffic conditions.",
        code: "people who engaged with A also engaged with B  →  recommend B",
      },
      {
        id: "similarity-measures",
        title: "Similarity and co-occurrence",
        summary:
          "Similarity measures distinguish raw shared demand from relative association under a chosen representation.",
        keyPoints: [
          "Cosine compares direction; Jaccard compares intersection with union.",
          "PMI compares observed co-occurrence with an independence reference using a consistent population.",
          "Small overlaps are unreliable; shrinkage and support thresholds trade stability against rare-item coverage.",
        ],
        interviewPrompt:
          "Your 'similar items' widget shows the same three bestsellers everywhere. Diagnose and fix it.",
        code: "raw overlap, cosine, Jaccard, and PMI answer different questions",
      },
      {
        id: "matrix-factorization",
        title: "Matrix factorization",
        summary:
          "Matrix factorization learns user and item vectors whose dot products model interactions under a chosen loss.",
        keyPoints: [
          "Offsets capture baseline tendencies; the objective determines score meaning.",
          "Regularization and vector size govern shared capacity and rare-entity stability.",
          "Latent axes are not uniquely named concepts, and plain ID models need cold-start and context extensions.",
        ],
        interviewPrompt:
          "What do the learned factors mean, and what would you tell a product manager who asks to see them?",
        code: "score(u, i) ≈ user_vector[u] · item_vector[i] + bias_u + bias_i",
      },
      {
        id: "implicit-mf-and-bpr",
        title: "Factorization for implicit feedback",
        summary:
          "Implicit-feedback objectives define how observed actions and uncertain missing entries influence vector scores.",
        keyPoints: [
          "Weighted reconstruction uses targets and confidence weights that encode modelling assumptions.",
          "BPR rewards positive score gaps; correctly ordered pairs still have nonzero loss.",
          "Sampling changes the comparisons, and sampled unknowns are not verified dislikes.",
        ],
        interviewPrompt:
          "You have clicks and no ratings. Explain how you build a training objective, and what 'negative' means.",
        code: "BPR loss = log(1 + exp(-(positive_score - sampled_score)))",
      },
      {
        id: "factorization-machines",
        title: "Factorization machines",
        summary:
          "A factorization machine shares latent vectors across pairwise feature interactions.",
        keyPoints: [
          "Individual feature terms and dot-product pair terms express different information.",
          "A rearranged pair sum makes scoring efficient in the number of active features and vector coordinates.",
          "Unseen pairs can share evidence, but rare features, higher-order interactions, and output calibration still need care.",
        ],
        interviewPrompt:
          "Why can a factorization machine learn an interaction that appears only a handful of times in the data?",
        code: "interaction(a, b) = vec[a] · vec[b]   ← pairs share strength through the vectors",
      },
    ],
    quizQuestionCount: 10,
  },
  {
    id: "retrieval",
    number: "3",
    title: "Retrieval and candidate generation",
    description: "Cutting millions of items down to hundreds, fast enough that the ranker can afford to be good.",
    color: "#FBBC04",
    icon: "Search",
    topics: [
      {
        id: "the-retrieval-stage",
        title: "What retrieval has to do",
        summary:
          "Retrieval finds useful eligible candidates within the budget available to the later stages.",
        keyPoints: [
          "Reference-positive recall measures candidate recovery, not every unobserved user preference.",
          "Measure counts after filtering and balance useful coverage with downstream cost.",
          "Separate missing representation, stale indexing, search loss, and later ranking failures.",
        ],
        interviewPrompt:
          "Define the metric you would use for retrieval alone, and explain why the ranking metric will not do.",
        code: "recall@500 - was the item the user eventually clicked even a candidate?",
      },
      {
        id: "embeddings-for-retrieval",
        title: "Embeddings",
        summary:
          "Embeddings represent requests and items numerically under a task-specific compatibility rule.",
        keyPoints: [
          "Identifier tables and feature encoders have different new-item behavior.",
          "Dot product uses vector length; cosine normalizes it; unit vectors connect these to Euclidean distance.",
          "Validate exact matches before approximation and publish compatible encoders, normalization, and indexes.",
        ],
        interviewPrompt:
          "Two items sit close in your embedding space and are obviously unrelated. What does that tell you?",
        code: "compare vectors using the score convention learned and evaluated for retrieval",
      },
      {
        id: "two-tower-models",
        title: "Two-tower retrieval",
        summary:
          "Two-tower retrieval computes request and item vectors independently so item representations can be reused.",
        keyPoints: [
          "A cheap shared score enables indexed search over precomputed item vectors.",
          "Separate inputs still model compatibility, but cannot directly consume arbitrary candidate-specific lookups.",
          "Sampling, vector freshness, and compatible model/index versions are part of the procedure.",
        ],
        interviewPrompt:
          "Why can an independently computed two-tower score not directly consume an arbitrary user–candidate lookup? Where would you use it?",
        code: "user tower → u    item tower → v    score = u · v    (towers stay separate)",
      },
      {
        id: "negative-sampling",
        title: "Choosing negatives",
        summary:
          "Negative sampling defines the contrasts a retrieval model practices and can change its objective.",
        keyPoints: [
          "Random, in-batch, hard, and exposed non-click contrasts supply different evidence.",
          "Mask known-positive conflicts and inspect plausible false negatives.",
          "Use objective-appropriate corrections and evaluate against realistic, consistently constructed competition.",
        ],
        interviewPrompt:
          "Your retrieval model has great offline recall and returns odd candidates live. How do negatives explain that?",
        code: "sampled contrasts define the competition; unknown is not confirmed dislike",
      },
      {
        id: "ann-search",
        title: "Approximate nearest-neighbour search",
        summary:
          "Approximate nearest-neighbor search trades exact vector-search fidelity against computation, memory, and latency.",
        keyPoints: [
          "Partition and graph indexes skip comparisons through different structures.",
          "ANN recall compares against exact search and is distinct from relevance recall.",
          "Measure compression, eligibility filtering, updates, and end-to-end quality rather than choosing a universal index winner.",
        ],
        interviewPrompt:
          "Your ANN index returns 92% of what exact search would. Is that acceptable? What decides it?",
        code: "exact search scans the reference set; ANN uses an index with measured fidelity and cost",
      },
      {
        id: "multi-source-retrieval",
        title: "Blending several retrieval sources",
        summary:
          "Multi-source retrieval merges complementary candidate generators under a shared budget.",
        keyPoints: [
          "Deduplicate item IDs while retaining all contributing source tags.",
          "Raw scores from different sources are not directly comparable; define the merge policy.",
          "Measure marginal value, overlap, timeouts, and final-list effects through appropriate comparisons.",
        ],
        interviewPrompt:
          "Design the candidate sources for a video home feed and say what each one is there to catch.",
        code: "embedding ∪ co-occurrence ∪ history ∪ trending ∪ inventory → dedupe → rank",
      },
    ],
    quizQuestionCount: 10,
  },
  {
    id: "ranking",
    number: "4",
    title: "Ranking models",
    description: "Scoring a few hundred candidates carefully, with every feature you can afford.",
    color: "#34A853",
    icon: "ArrowDownUp",
    topics: [
      {
        id: "ctr-prediction",
        title: "Click-through rate prediction",
        summary:
          "CTR prediction estimates click probability under a defined context and display process.",
        keyPoints: [
          "Use completed impression-level labels and appropriate historical inputs.",
          "Evaluate log loss, calibration, ranking quality, and policy effects as distinct questions.",
          "Exposure, placement, and class sampling affect what the recorded probabilities mean.",
        ],
        interviewPrompt:
          "Your CTR model is excellent offline and flat online. Give the two most likely explanations.",
        code: "rows = impressions;  label = did this impression get clicked?",
      },
      {
        id: "learning-to-rank",
        title: "Learning to rank",
        summary:
          "Pointwise, pairwise, and listwise objectives compare candidates at different training units.",
        keyPoints: [
          "A strong pointwise model can rank well; objective families are not a guaranteed quality ladder.",
          "Pairwise gaps remove common offsets but do not remove exposure or position bias.",
          "Preserve request groups and add probability estimation or calibration when downstream use requires it.",
        ],
        interviewPrompt:
          "Compare pointwise and pairwise training when ordering and probability estimates both matter.",
        code: "pointwise: score(item)   pairwise: score(a) > score(b)   listwise: optimize the list",
      },
      {
        id: "ranking-features",
        title: "Features for ranking",
        summary:
          "Ranking features describe users, items, contexts, and candidate-specific relationships.",
        keyPoints: [
          "Explicit crosses are useful but are not the only way a model personalizes.",
          "Smoothed rates need support counts and historical availability.",
          "Use feature ablations to weigh quality, latency, freshness, and fallback behavior.",
        ],
        interviewPrompt:
          "Compare user, item, context, and cross features. How would you measure which family adds value?",
        code: "user + item + context + cross features → candidate-specific score",
      },
      {
        id: "deep-ranking-architectures",
        title: "Deep ranking models",
        summary:
          "Neural rankers combine learned representations and nonlinear computation when their measured benefit justifies the cost.",
        keyPoints: [
          "Embedding tables handle categorical representations but need rare-ID and unknown-ID strategies.",
          "MLPs, wide-and-deep branches, and cross layers express different interaction structures.",
          "Candidate attention adds joint history context at per-candidate cost; profile the complete path.",
        ],
        interviewPrompt:
          "When would you not replace a gradient-boosted ranker with a neural one?",
        code: "compare representation, interaction capacity, quality, and serving cost on the same task",
      },
      {
        id: "sequence-modeling",
        title: "Modelling the user's recent behavior",
        summary:
          "Sequence models use ordered past events to represent evolving intent alongside longer-term evidence.",
        keyPoints: [
          "Exclude unavailable future and target events; distinguish padding masks from causal masks.",
          "Pooling, recurrence, self-attention, and candidate attention trade information against reusable computation.",
          "Validate freshness, history length, anonymous traffic, and the balance of recent and stable signals.",
        ],
        interviewPrompt:
          "A user who normally watches cooking videos just watched three car reviews. What should the model do?",
        code: "long-term taste  +  what happened in the last ten minutes  →  next item",
      },
      {
        id: "multi-task-ranking",
        title: "Multiple objectives",
        summary:
          "Multi-task learning shares representations across predictions; multi-objective selection decides how to use them.",
        keyPoints: [
          "Define each head’s conditioning, observation window, and units.",
          "Mask unavailable labels, while recognizing that masking alone does not eliminate selection bias.",
          "Training loss weights and serving utility weights have different purposes; guardrails and eligibility stay explicit.",
        ],
        interviewPrompt:
          "Engagement is up and complaints are up. How do you express that trade-off inside the ranker?",
        code: "score = w₁·P(click) + w₂·E[watch] + w₃·P(share) − w₄·P(complaint)",
      },
      {
        id: "calibration-for-ranking",
        title: "When the score has to be a real probability",
        summary:
          "Calibration gives probability scores a frequency interpretation that ordering alone cannot supply.",
        keyPoints: [
          "Use reliability diagrams with counts and important slices.",
          "Known class-conditional downsampling admits a correction under stated assumptions.",
          "Fit and independently assess held-out calibration mappings when probabilities drive expected-value decisions.",
        ],
        interviewPrompt:
          "You down-sampled negatives 10:1 to train. What happens to your predicted rates, and how do you fix it?",
        code: "ranking needs order; expected-value use also needs validated probability meaning",
      },
      {
        id: "re-ranking-and-diversity",
        title: "Re-ranking the final list",
        summary:
          "Re-ranking chooses a final list using scores, relationships, and explicit constraints.",
        keyPoints: [
          "A redundancy penalty evaluates a candidate relative to items already selected.",
          "Hard eligibility and soft variety goals require different enforcement and infeasibility behavior.",
          "Measure useful list quality and policy outcomes; variety does not have a universal engagement cost.",
        ],
        interviewPrompt:
          "When can independent per-item scores produce a redundant list, and how can list-level selection help?",
        code: "pick next = best (relevance − similarity to what is already chosen)",
      },
    ],
    quizQuestionCount: 10,
  },
  {
    id: "evaluation",
    number: "5",
    title: "Evaluation",
    description: "Measuring a system that only ever sees the consequences of its own choices.",
    color: "#A78BFA",
    icon: "LineChart",
    topics: [
      {
        id: "offline-evaluation",
        title: "Offline evaluation and its limits",
        summary:
          "Offline evaluation measures a defined task using existing evidence whose collection process limits interpretation.",
        keyPoints: [
          "Match temporal and grouped restrictions, label maturity, and historical inventory to deployment.",
          "Fixed-pool ordering, catalogue retrieval, and logged impression prediction test different things.",
          "Report baselines, paired uncertainty, and slices; policy-value claims require additional evidence or assumptions.",
        ],
        interviewPrompt:
          "Your offline NDCG is up 8% and the A/B test is flat. Give three explanations that are all consistent with that.",
        code: "offline conclusions depend on collected exposure, labels, candidates, and evaluation assumptions",
      },
      {
        id: "position-bias",
        title: "Position bias",
        summary:
          "Position bias means placement changes attention or clicking, beyond underlying item appeal.",
        keyPoints: [
          "A simple examination model separates visibility and attractiveness under explicit assumptions.",
          "Raw CTR by rank cannot identify position effects when different items were deliberately ranked there.",
          "Relative examination, selection propensity, trust effects, and item interactions are distinct mechanisms.",
        ],
        interviewPrompt:
          "How would you measure how much of your click rate is position and how much is relevance?",
        code: "toy examination model: click rate = examination × conditional click attractiveness",
      },
      {
        id: "counterfactual-evaluation",
        title: "Estimating what a new policy would have done",
        summary:
          "Off-policy evaluation estimates a target policy’s outcomes from another policy’s logged decisions.",
        keyPoints: [
          "IPS weights rewards by target action probability divided by logging propensity.",
          "Correct action granularity, support, comparable contexts, and outcome assumptions are essential.",
          "Clipping, self-normalization, and doubly robust estimation change statistical properties without creating missing evidence.",
        ],
        interviewPrompt:
          "What must the serving system log today for counterfactual evaluation to be possible next quarter?",
        code: "log context, chosen action, action probability, reward, and policy version",
      },
      {
        id: "ab-testing",
        title: "Online testing",
        summary:
          "Online experiments compare policy effects using an assignment and analysis design suited to the product.",
        keyPoints: [
          "Choose units from carryover and interference rather than a universal user-versus-request rule.",
          "Define primary outcomes, guardrails, power, measurement windows, and stopping before interpreting results.",
          "Check allocation and instrumentation; distinguish relative lift, percentage points, and uncertainty.",
        ],
        interviewPrompt:
          "Clicks are up 3% and time spent is down 5%. What do you do, and what should have been decided earlier?",
        code: "choose experimental units · define outcomes · plan power and stopping",
      },
      {
        id: "beyond-accuracy",
        title: "Diversity, novelty, and coverage",
        summary:
          "Diversity, novelty, coverage, and serendipity describe different aspects of useful recommendation.",
        keyPoints: [
          "Define whether the scope is one list, one user, inventory, or providers.",
          "State eligible denominators and observation windows for coverage measures.",
          "Evaluate relevance and product value alongside variety; choose objectives and guardrails explicitly.",
        ],
        interviewPrompt:
          "Engagement rises while catalogue coverage collapses. Why is that a problem worth escalating?",
        code: "evaluate list usefulness: relevance, redundancy, discovery, and the intended outcome",
      },
      {
        id: "feedback-loops",
        title: "Feedback loops",
        summary:
          "A feedback loop links recommendations to exposure, outcomes, learning, and future selection.",
        keyPoints: [
          "Total engagement can amplify exposure differences without proving better underlying quality.",
          "Logged offline data can inherit a narrowed exposure policy.",
          "Monitor opportunities and outcomes together, and gather suitable evidence about uncertain alternatives.",
        ],
        interviewPrompt:
          "Explain how a recommender can look like it is improving while the catalogue it serves is shrinking.",
        code: "selection → exposure → observed outcomes → training → next selection",
      },
    ],
    quizQuestionCount: 10,
  },
  {
    id: "production",
    number: "6",
    title: "Production systems",
    description: "Serving the funnel inside a latency budget, and keeping it correct as the world moves.",
    color: "#22D3EE",
    icon: "Route",
    topics: [
      {
        id: "serving-architecture",
        title: "Serving inside a latency budget",
        summary:
          "Serving quality depends on the full request path, its deadlines, and valid fallback behavior.",
        keyPoints: [
          "Parallel source work affects the critical path differently from sequential stages.",
          "Precomputation and caching trade repeated work against freshness and reuse.",
          "Log final displays and compatible versions; a retrieved or server-selected item is not necessarily an impression.",
        ],
        interviewPrompt:
          "You have 50ms end to end. Allocate it across the funnel and say what you cut first when you overrun.",
        code: "example: context 5ms → retrieve 10ms → features 15ms → rank 15ms → finalize 5ms",
      },
      {
        id: "features-and-freshness",
        title: "Features, freshness, and skew",
        summary:
          "Feature freshness and historical availability determine which inputs a prediction can legitimately use.",
        keyPoints: [
          "An event can occur before a decision but arrive too late to be an input.",
          "Shared definitions and logged serving snapshots reduce reconstruction mismatch without eliminating every skew risk.",
          "Monitor arrival delays, ages, missingness, coverage, and supported stale-value behavior.",
        ],
        interviewPrompt:
          "Your model degrades a week after launch with no code change. Name the feature-side causes you would check.",
        code: "respect decision-time availability; compare historical reconstruction with serving evidence",
      },
      {
        id: "training-pipelines",
        title: "Building the training data",
        summary:
          "A training pipeline reconstructs decisions and outcomes through explicit joins, windows, sampling, and versions.",
        keyPoints: [
          "Stable exposure keys and completed label windows prevent ambiguous or premature labels.",
          "Record retention probabilities and distinguish class downsampling from retrieval-negative construction.",
          "Validate time availability, split boundaries, row counts, and reproducibility before fitting.",
        ],
        interviewPrompt:
          "Purchases confirm up to 14 days after the click. How does that shape your training and retraining?",
        code: "impression + context + features-as-served  ⋈  outcome within the window",
      },
      {
        id: "retraining-and-drift",
        title: "Retraining and drift",
        summary:
          "Distinguish parameter retraining from feature refresh, index publication, and data-path repair.",
        keyPoints: [
          "New feature-supported inventory may be encoded without retraining but still needs compatible insertion.",
          "Choose training windows and cadence using later-period evidence and label availability.",
          "Validate complete compatible bundles, probability use, slices, and rollback before promoting updates.",
        ],
        interviewPrompt:
          "Separate feature refresh, index publication, and model retraining. How would you choose their cadences?",
        code: "new items → encode from features where possible → publish compatible vectors and index",
      },
      {
        id: "exploration",
        title: "Exploration",
        summary:
          "Exploration buys information about uncertain eligible alternatives while exploitation uses the current best estimate.",
        keyPoints: [
          "Uncertainty matters, but unequal audiences and placement can still confound observed rates.",
          "Epsilon-greedy, confidence methods, and Thompson sampling rely on different policy and uncertainty assumptions.",
          "Log actual final action probabilities and measure information gained alongside outcome cost.",
        ],
        interviewPrompt:
          "A PM asks why 2% of traffic shows 'worse' items. Give the business justification.",
        code: "exploration collects evidence about uncertain eligible alternatives",
      },
      {
        id: "scale-and-cost",
        title: "Scale and cost",
        summary:
          "Estimate storage and work from demand, then validate those estimates on the deployed workload.",
        keyPoints: [
          "Requests times candidates gives scores per second; per-score CPU time is distinct from wall latency.",
          "Include index overhead, replicas, training state, and coexistence during updates in peak memory.",
          "Candidate caps, caches, quantization, and shared IDs each require a measured quality–cost tradeoff.",
        ],
        interviewPrompt:
          "Your embedding table no longer fits in memory. Give three options and what each costs you.",
        code: "cost ≈ candidates scored × requests   (shrink either, or score more cheaply)",
      },
    ],
    quizQuestionCount: 10,
  },
  {
    id: "applied-practice",
    number: "7",
    title: "Applied practice",
    description: "Tying the system to the business, the policy constraints, and the design answer itself.",
    color: "#EC4899",
    icon: "Flag",
    topics: [
      {
        id: "business-objectives",
        title: "Connecting the model to the business",
        summary:
          "Connect measured proxies to the intended product benefit through a clear outcome and decision contract.",
        keyPoints: [
          "Specify population, denominator, time window, primary outcome, and guardrails.",
          "Combined predictions need defined units and utility conversions.",
          "Consider affected users and providers, and evaluate policy effects rather than assuming predictive gains cause value.",
        ],
        interviewPrompt:
          "Your ranker lifts engagement 5% and seller diversity drops 20%. Whose problem is that, and what do you change?",
        code: "define the outcome → choose a proxy → measure policy effects and guardrails",
      },
      {
        id: "fairness-and-policy",
        title: "Fairness, policy, and what not to show",
        summary:
          "Eligibility rules define allowed items; fairness objectives define the comparison of quality or opportunity.",
        keyPoints: [
          "Define user-side and provider-side evidence with relevant eligible groups and uncertainty.",
          "Hard policy conditions cannot be overridden by a finite relevance penalty.",
          "Historical labels and proxies can inherit exposure bias; evaluate retrieval and final-display effects separately.",
        ],
        interviewPrompt:
          "Where in the funnel do policy rules belong, and why not just add a penalty to the ranking score?",
        code: "scores are soft; policy is hard - apply it as a filter, not as a weight",
      },
      {
        id: "failure-modes",
        title: "Characteristic failure modes",
        summary:
          "Diagnose recommendation failures by tracing actual requests and testing competing causes.",
        keyPoints: [
          "Separate input incidents, missing candidates, scoring problems, list selection, and display instrumentation.",
          "Compare counts and denominators before interpreting rate changes.",
          "Recover with a valid compatible fallback, preserve evidence, then verify a targeted fix.",
        ],
        interviewPrompt:
          "Users report the feed feels repetitive. Work through the possible causes in order.",
        code: "repetitive feed → diversity? similarity? feedback loop? exploration?",
      },
      {
        id: "rrp-system-design",
        title: "A ranking system design answer",
        summary:
          "A system design connects a concrete surface to data, candidate selection, evaluation, cost, and operation.",
        keyPoints: [
          "Define the row, target timing, intended benefit, and credible baseline before naming architecture.",
          "Explain each stage’s budget and evidence, including new-item representation and index publication.",
          "Validate policy effects, compatible versions, fallbacks, and the expected failure mechanism.",
        ],
        interviewPrompt:
          "'Design the home feed for a video app.' Give the eight-minute version.",
        code: "goal → row + label → retrieval → ranking → re-rank → eval → cost → failures",
      },
      {
        id: "interview-playbook",
        title: "Answering RRP questions",
        summary:
          "Explain one RRP concept through its definition, stage, numerical mechanism, and practical tradeoff.",
        keyPoints: [
          "Clarify ambiguous requirements and answer direct definitions directly.",
          "Name the row, target, conditioning, and timing for design questions.",
          "State what measured evidence supports, and use follow-ups to test hypotheses rather than list architectures.",
        ],
        interviewPrompt:
          "'Tell me how you would build recommendations.' Produce the first 30 seconds, including the question you ask back.",
        code: "clarify the surface → name the row and label → pick a stage → go deep",
      },
    ],
    quizQuestionCount: 10,
  },
];

export const rrpTopicsById: Record<string, RrpTopic> = Object.fromEntries(
  rrpParts.flatMap((part) => part.topics.map((topic) => [topic.id, topic] as const))
);

export const rrpPartsById: Record<string, RrpPart> = Object.fromEntries(
  rrpParts.map((part) => [part.id, part])
);

export const rrpPartIdForTopic: Record<string, string> = Object.fromEntries(
  rrpParts.flatMap((part) => part.topics.map((topic) => [topic.id, part.id] as const))
);

export const rrpTopicCount: number = rrpParts.reduce((sum, part) => sum + part.topics.length, 0);
