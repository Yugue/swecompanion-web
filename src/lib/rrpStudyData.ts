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
          "A recommender picks a short list out of a very large catalogue for one person at one moment - so the job is choosing what to show, not predicting a number.",
        keyPoints: [
          "The output is an ordered list of a few items, chosen from millions. Everything about the design follows from that size gap.",
          "Search, feed ranking, ads, and 'people you may know' are the same machine with different inputs: score candidates for a user in a context, then show the best few.",
          "You never see what would have happened for the items you did not show, which is what makes this domain different from ordinary prediction.",
          "The score is a means to an end. The product cares about the list, and the business cares about what people do with it.",
        ],
        interviewPrompt:
          "Explain why 'predict the rating' and 'choose the ten things to show' are different problems, and which one a product actually needs.",
        code: "user + context  →  score every candidate  →  show the top k",
      },
      {
        id: "the-ranking-funnel",
        title: "The retrieval and ranking funnel",
        summary:
          "Large systems narrow millions of items to a handful in stages, because scoring everything with a good model is far too slow.",
        keyPoints: [
          "Retrieval cuts millions to hundreds cheaply, ranking scores those hundreds carefully, and re-ranking adjusts the final list.",
          "Each stage has a different budget: retrieval has microseconds per item, ranking has milliseconds per candidate, re-ranking sees the whole list.",
          "Anything retrieval misses can never be recommended, no matter how good the ranker is - so the two stages have different metrics.",
          "The funnel exists for cost, not for accuracy; if you could score everything with the best model, you would.",
        ],
        interviewPrompt:
          "Your ranker improves but engagement does not move. Explain how you would tell whether retrieval is the bottleneck.",
        code: "10M items → retrieval → ~500 → ranking → ~50 → re-rank → 10 shown",
      },
      {
        id: "users-items-interactions",
        title: "Users, items, and the interaction table",
        summary:
          "The raw material is a log of who did what to which item, and that log is almost entirely empty.",
        keyPoints: [
          "One row is one interaction: a user, an item, an action, and a timestamp. Everything else is derived from this.",
          "Laid out as a user-by-item grid it is over 99.9% empty, and that emptiness drives the whole field.",
          "A missing cell means 'not seen', not 'disliked' - conflating the two is the most common modelling error here.",
          "Context belongs on the row too: device, time of day, query, and what was on screen already.",
        ],
        interviewPrompt:
          "A user never clicked a video. Give three different explanations and say what each implies for training.",
        code: "(user_id, item_id, action, timestamp, context)  ← one interaction",
      },
      {
        id: "implicit-feedback",
        title: "Implicit feedback and its biases",
        summary:
          "Real systems learn from clicks and watches rather than ratings, which is free, plentiful, and systematically biased.",
        keyPoints: [
          "Explicit feedback (a star rating) is honest but rare; implicit feedback (a click, a watch, a purchase) is abundant but indirect.",
          "You only observe outcomes for items the current system chose to show, so the data describes the old system as much as the user.",
          "A click is weak evidence of liking, and a non-click is very weak evidence of disliking.",
          "Choose the signal by how close it sits to the outcome you actually want - a purchase beats a click, and a completed watch beats a start.",
        ],
        interviewPrompt:
          "Your model trains on clicks and the product wants satisfaction. Name three ways that gap shows up and what you would do.",
        code: "shown → seen → clicked → engaged → satisfied   (you log the middle, want the end)",
      },
      {
        id: "task-framing",
        title: "Deciding what to predict",
        summary:
          "Naming the exact quantity the model predicts settles the labels, the loss, and most arguments later in the design.",
        keyPoints: [
          "Write the target as a sentence: 'given this user, this item, and this context, the probability of a click within one session'.",
          "State the unit of a row - per impression, per session, or per user-item pair - because it changes what the model can learn.",
          "Say when the label becomes observable. A purchase confirmed after 14 days makes your freshest training data 14 days old.",
          "Predicting a proxy you can measure is fine, as long as you can say how it differs from the thing you actually want.",
        ],
        interviewPrompt:
          "'Improve the home feed.' Turn that into one predicted quantity, and defend it against an obvious alternative.",
        code: "P(click | user, item, context)   vs   E[watch time | ...]   vs   P(purchase | ...)",
      },
      {
        id: "ranking-metrics",
        title: "How a ranked list is scored",
        summary:
          "Ranking metrics only care about the few items at the top, because that is all anyone looks at.",
        keyPoints: [
          "Precision@k asks how many of the k shown were good; recall@k asks how many of the good ones made it into the k.",
          "Mean Reciprocal Rank rewards putting the first correct answer high, which suits problems with one right answer.",
          "Normalized Discounted Cumulative Gain discounts each position, so an item at rank 1 counts more than the same item at rank 10.",
          "Pick k from the product surface, not from habit: six visible slots means k is six.",
        ],
        interviewPrompt:
          "Precision@10 is flat and NDCG@10 improved. Explain what changed in the list.",
        code: "position 1 counts most, position 10 barely counts - the discount is the whole idea",
      },
      {
        id: "baselines-for-rrp",
        title: "Baselines worth beating",
        summary:
          "Popularity is a strong baseline in almost every recommendation problem, and beating it is the first thing worth proving.",
        keyPoints: [
          "The trivial baselines are most popular overall, most popular in this context, and most recently added.",
          "A user's own history is another strong baseline: recently viewed, previously purchased, and 'more of the same'.",
          "Popularity wins because attention is concentrated, so any new model should be quoted against it rather than in isolation.",
          "If a personalized model barely beats popularity, the personalization signal is weak, the features are wrong, or the metric is not measuring it.",
        ],
        interviewPrompt:
          "Your two-tower model beats popularity by 2% on recall@100. Is that good? Say what you would check.",
        code: "most_popular(context)  ← quote every model against this",
      },
      {
        id: "cold-start",
        title: "Cold start",
        summary:
          "New users and new items have no interaction history, so anything learned purely from interactions has nothing to work with.",
        keyPoints: [
          "Three separate problems: a new user, a new item, and a brand-new system with no logs at all.",
          "New items are fixed with content features - text, category, creator, image - which do not need history.",
          "New users are fixed with context, a short onboarding, and popularity within whatever segment you can infer.",
          "Items also need deliberate exposure to gather data, which is why cold start turns into an exploration problem.",
        ],
        interviewPrompt:
          "A marketplace adds 50,000 listings a day. Design how those items reach their first hundred impressions.",
        code: "no history → use content + context → gather data → switch to learned signals",
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
          "Recommend items that resemble what this user already liked, using the items' own attributes.",
        keyPoints: [
          "Describe each item by its features, build a profile from the items a user engaged with, then score new items by similarity to that profile.",
          "It handles new items immediately, because an item's features exist before anyone interacts with it.",
          "It cannot surprise anyone: recommendations stay inside the region the user has already explored.",
          "Quality depends entirely on the item features, so it works best where items carry rich text or structured attributes.",
        ],
        interviewPrompt:
          "When is content-based filtering the right first system, despite being the weaker method?",
        code: "score(user, item) = similarity(profile(user), features(item))",
      },
      {
        id: "collaborative-filtering",
        title: "Collaborative filtering",
        summary:
          "Use the behavior of similar users, or similar items, instead of any description of the item itself.",
        keyPoints: [
          "User-based: find people who behaved like you, recommend what they liked. Item-based: find items co-consumed with what you liked.",
          "Item-based is what production systems use, because item-item similarity is stabler over time and precomputable.",
          "It needs no item features at all, which is its strength, and it fails completely on items nobody has touched.",
          "It is powerful because it discovers relationships no attribute captures - the two products people actually buy together.",
        ],
        interviewPrompt:
          "Why did production systems move from user-based to item-based collaborative filtering?",
        code: "people who engaged with A also engaged with B  →  recommend B",
      },
      {
        id: "similarity-measures",
        title: "Similarity and co-occurrence",
        summary:
          "Every neighbourhood method reduces to a choice of similarity, and that choice decides what the system considers alike.",
        keyPoints: [
          "Cosine similarity compares direction rather than magnitude, so a heavy user does not automatically look similar to everyone.",
          "Raw co-occurrence counts are dominated by popular items, which co-occur with everything.",
          "Normalizing co-occurrence - by expected co-occurrence, or with pointwise mutual information - is what makes the signal useful.",
          "Similarity is computed on the interaction vectors, so it inherits every bias in the logs it was built from.",
        ],
        interviewPrompt:
          "Your 'similar items' widget shows the same three bestsellers everywhere. Diagnose and fix it.",
        code: "normalize, or popularity dominates every similarity you compute",
      },
      {
        id: "matrix-factorization",
        title: "Matrix factorization",
        summary:
          "Represent every user and every item as a short list of numbers, chosen so that their dot product reproduces the observed interactions.",
        keyPoints: [
          "The huge, mostly empty user-by-item grid is approximated by two small dense tables, one per user and one per item.",
          "Those learned numbers are latent factors: the model invents dimensions like 'action-heavy' or 'budget-conscious' without being told them.",
          "A prediction is a dot product, which is cheap to compute and is why this shape survives in modern retrieval.",
          "Biases matter: a per-user and per-item offset captures generous raters and generally popular items before any personalization.",
        ],
        interviewPrompt:
          "What do the learned factors mean, and what would you tell a product manager who asks to see them?",
        code: "score(u, i) ≈ user_vector[u] · item_vector[i] + bias_u + bias_i",
      },
      {
        id: "implicit-mf-and-bpr",
        title: "Factorization for implicit feedback",
        summary:
          "With clicks instead of ratings there are no negative examples, so the training objective has to be redesigned.",
        keyPoints: [
          "Treating every unobserved cell as a zero is wrong, but ignoring them entirely leaves the model nothing to push down.",
          "Weighted approaches treat unobserved cells as weak negatives with low confidence, and observed ones as strong positives.",
          "Pairwise ranking instead learns from comparisons: an item the user engaged with should score above one they did not.",
          "That pairwise framing matches what you actually need - the order of the list - rather than the value of any single score.",
        ],
        interviewPrompt:
          "You have clicks and no ratings. Explain how you build a training objective, and what 'negative' means.",
        code: "minimize:  score(user, clicked) must exceed score(user, not-clicked)",
      },
      {
        id: "factorization-machines",
        title: "Factorization machines",
        summary:
          "A model that learns how pairs of features interact, without needing one weight per pair.",
        keyPoints: [
          "A plain linear model scores each feature independently and cannot express 'this user likes this category on mobile in the evening'.",
          "Writing one weight per pair of features is impossible when features are sparse - most pairs are never observed together.",
          "Factorization machines give every feature a short vector and model an interaction as the dot product of two of them, so pairs share information.",
          "This makes them the natural bridge between matrix factorization and general feature-based prediction.",
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
          "Retrieval's only job is to make sure the good items are somewhere in the few hundred it hands on, as cheaply as possible.",
        keyPoints: [
          "It is judged on recall, not on ordering - getting the right items into the candidate set is the whole task.",
          "It must run in the time it takes to look something up, which rules out scoring each item with a large model.",
          "Because it is judged differently from ranking, it needs its own metric: how often the eventually-clicked item was retrieved at all.",
          "Most real systems run several retrieval sources at once and merge them.",
        ],
        interviewPrompt:
          "Define the metric you would use for retrieval alone, and explain why the ranking metric will not do.",
        code: "recall@500 - was the item the user eventually clicked even a candidate?",
      },
      {
        id: "embeddings-for-retrieval",
        title: "Embeddings",
        summary:
          "An embedding turns a user or an item into a short list of numbers, arranged so that things that belong together sit close together.",
        keyPoints: [
          "Closeness in that space is the whole point: a nearby item is one the model thinks is relevant.",
          "Where matrix factorization learns one vector per known id, an embedding can be computed from features, so it works for new items too.",
          "The same trick covers text, images, and categories, which is how heterogeneous catalogues end up in one space.",
          "Embeddings inherit whatever the training objective rewarded, so a space trained on clicks encodes what gets clicked, not what is good.",
        ],
        interviewPrompt:
          "Two items sit close in your embedding space and are obviously unrelated. What does that tell you?",
        code: "close vectors = the model thinks these go together",
      },
      {
        id: "two-tower-models",
        title: "Two-tower retrieval",
        summary:
          "One network turns the user into a vector, a separate one turns the item into a vector, and relevance is their dot product.",
        keyPoints: [
          "The towers never see each other's input, which is exactly what makes retrieval possible: item vectors can be computed in advance.",
          "At request time only the user tower runs, then you look up nearby item vectors in a prebuilt index.",
          "That separation also costs accuracy - the model cannot express anything that needs user and item features together, which is the ranker's job.",
          "Item features in the item tower are what let brand-new items be retrieved before anyone interacts with them.",
        ],
        interviewPrompt:
          "Why can a two-tower model not use a feature like 'how many times this user viewed this exact item'?",
        code: "user tower → u    item tower → v    score = u · v    (towers stay separate)",
      },
      {
        id: "negative-sampling",
        title: "Choosing negatives",
        summary:
          "Retrieval models learn by contrast, so which non-clicked items you train against decides what the model learns.",
        keyPoints: [
          "Random negatives are easy to beat and teach the model only to separate the obviously unrelated.",
          "In-batch negatives reuse the other examples in the same batch, which is cheap and biased toward popular items.",
          "Hard negatives - plausible items the user did not engage with - are what sharpen the boundary, and too many make training unstable.",
          "Popular items appear as negatives constantly, so correcting for how often an item is sampled is usually necessary.",
        ],
        interviewPrompt:
          "Your retrieval model has great offline recall and returns odd candidates live. How do negatives explain that?",
        code: "easy negatives → blurry model   |   hard negatives → sharp, but unstable",
      },
      {
        id: "ann-search",
        title: "Approximate nearest-neighbour search",
        summary:
          "Finding the closest vectors among millions has to be approximate, because checking every one is far too slow.",
        keyPoints: [
          "Exact search compares the query to every item, which is linear in catalogue size and impossible within a request budget.",
          "Approximate methods trade a small amount of recall for orders of magnitude less work, using graphs or partitions of the space.",
          "The tuning dial is recall against latency, and it should be measured against exact search on a sample.",
          "Index building and index freshness are operational problems: a new item cannot be retrieved until it is in the index.",
        ],
        interviewPrompt:
          "Your ANN index returns 92% of what exact search would. Is that acceptable? What decides it?",
        code: "exact: compare all N   |   approximate: compare a few thousand, lose a little recall",
      },
      {
        id: "multi-source-retrieval",
        title: "Blending several retrieval sources",
        summary:
          "Production systems run several candidate generators side by side, because no single one covers every reason to show something.",
        keyPoints: [
          "Typical sources: an embedding index, item-item co-occurrence, the user's own history, trending items, and business-rule inventory.",
          "Each source has its own recall profile, so the union covers cases none of them covers alone.",
          "Deduplicate across sources and cap how many candidates each may contribute, or one source will dominate the slate.",
          "Adding a source is a cheap, low-risk way to improve a system when the ranker is already good.",
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
          "The workhorse of ranking: estimate the probability that this user clicks this item in this context.",
        keyPoints: [
          "It is ordinary binary classification on impression logs, where a shown-and-clicked row is positive and shown-and-not-clicked is negative.",
          "Positives are rare - often a few percent - so the base rate and the metric have to be chosen accordingly.",
          "The progression is logistic regression with crossed features, then gradient-boosted trees, then deep models with learned embeddings.",
          "Only items that were actually shown appear in the data, so the training set is the previous system's output, not the world.",
        ],
        interviewPrompt:
          "Your CTR model is excellent offline and flat online. Give the two most likely explanations.",
        code: "rows = impressions;  label = did this impression get clicked?",
      },
      {
        id: "learning-to-rank",
        title: "Learning to rank",
        summary:
          "Three ways to train a ranker: score items one at a time, compare them in pairs, or optimize the whole list at once.",
        keyPoints: [
          "Pointwise treats each item as an independent prediction, which is simple and ignores that only relative order matters.",
          "Pairwise learns from comparisons within a list - this item should outrank that one - which matches the task much more closely.",
          "Listwise optimizes a whole-list metric directly and is the most faithful, at the cost of complexity.",
          "Pointwise still dominates in practice because the calibrated score it produces is needed elsewhere, such as in an auction.",
        ],
        interviewPrompt:
          "Why do so many production rankers stay pointwise when pairwise matches the objective better?",
        code: "pointwise: score(item)   pairwise: score(a) > score(b)   listwise: optimize the list",
      },
      {
        id: "ranking-features",
        title: "Features for ranking",
        summary:
          "A ranker's strength comes mostly from the features, and the most valuable ones describe the relationship between user and item.",
        keyPoints: [
          "Four families: user features, item features, context features, and cross features that combine user with item.",
          "The cross features carry the personalization - how often this user engaged with this item's category, creator, or price band.",
          "Counters and rates over several time windows let the model see both a long-run habit and a sudden change.",
          "Every feature is a serving dependency, so it must be computable within the latency budget and identical offline and online.",
        ],
        interviewPrompt:
          "Name the single most valuable feature family in a ranker and explain why it beats the others.",
        code: "user × item history is where personalization actually lives",
      },
      {
        id: "deep-ranking-architectures",
        title: "Deep ranking models",
        summary:
          "Neural rankers exist mainly to learn feature interactions and to represent high-cardinality ids that trees handle badly.",
        keyPoints: [
          "Ids like user, item, and creator have millions of values, and embedding them is what neural models do better than trees.",
          "A common shape pairs a memorizing part, which learns specific combinations seen in the data, with a generalizing part that learns smooth patterns.",
          "Explicit interaction layers exist because a plain stack of layers learns feature crosses inefficiently.",
          "On modest tabular feature sets gradient-boosted trees remain competitive, so the deep model must earn its cost.",
        ],
        interviewPrompt:
          "When would you not replace a gradient-boosted ranker with a neural one?",
        code: "trees: strong on dense tabular   |   neural: strong on huge sparse ids + interactions",
      },
      {
        id: "sequence-modeling",
        title: "Modelling the user's recent behavior",
        summary:
          "What someone did in the last few minutes usually predicts the next click better than anything about who they are.",
        keyPoints: [
          "A bag of past interactions loses order, and order is exactly what carries intent within a session.",
          "Sequence models read the recent history in order and summarize it into a vector the ranker can use.",
          "Attention over the history lets the model weight past items by their relevance to the candidate being scored.",
          "Session-based recommendation matters when users are anonymous, because the session is all the personalization you have.",
        ],
        interviewPrompt:
          "A user who normally watches cooking videos just watched three car reviews. What should the model do?",
        code: "long-term taste  +  what happened in the last ten minutes  →  next item",
      },
      {
        id: "multi-task-ranking",
        title: "Multiple objectives",
        summary:
          "Real products care about several outcomes at once, so rankers predict several things and combine them.",
        keyPoints: [
          "Optimizing clicks alone reliably produces clickbait, because the click is the easiest outcome to provoke.",
          "One model with several heads predicts click, watch time, like, share, and complaint from a shared body.",
          "The final score is a weighted combination, and those weights are a product decision more than a modelling one.",
          "Shared learning helps the sparse objectives, and tasks that conflict can drag each other down.",
        ],
        interviewPrompt:
          "Engagement is up and complaints are up. How do you express that trade-off inside the ranker?",
        code: "score = w₁·P(click) + w₂·E[watch] + w₃·P(share) − w₄·P(complaint)",
      },
      {
        id: "calibration-for-ranking",
        title: "When the score has to be a real probability",
        summary:
          "Ranking only needs the order to be right, but some systems multiply the score by money, and those need it to be believable.",
        keyPoints: [
          "A model can rank perfectly while every probability it outputs is wrong, because ordering survives any monotone distortion.",
          "Advertising needs calibration directly: expected value is the predicted rate times the bid, so an inflated rate overspends.",
          "Blending several predictions into one score also needs calibration, or the weights are meaningless.",
          "Down-sampling negatives, which is common in this domain, distorts the base rate and must be corrected afterwards.",
        ],
        interviewPrompt:
          "You down-sampled negatives 10:1 to train. What happens to your predicted rates, and how do you fix it?",
        code: "ranking → order only   |   auctions, budgets, blending → the number must be true",
      },
      {
        id: "re-ranking-and-diversity",
        title: "Re-ranking the final list",
        summary:
          "The last stage looks at the whole list at once and fixes problems no per-item score can see.",
        keyPoints: [
          "A list of ten near-identical items can be ten individually excellent scores and a poor page.",
          "Re-ranking enforces variety, spreads out creators or sellers, and applies business and policy rules.",
          "The usual mechanism trades relevance against difference from what is already selected, one slot at a time.",
          "It is also where freshness, inventory, and promotional slots get applied, because only here does the whole slate exist.",
        ],
        interviewPrompt:
          "Explain why diversity cannot be handled by the ranking model's score.",
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
          "Offline numbers are computed on logs produced by the system you are trying to replace, which bounds what they can tell you.",
        keyPoints: [
          "Split by time, not at random: a random split lets the model learn from the future it will never have.",
          "You can only score items that were shown, so a model that would have surfaced something better looks wrong rather than better.",
          "Offline gains shrink online, routinely and by a lot, so treat an offline win as a hypothesis worth testing.",
          "Offline evaluation is still worth doing - it is fast, cheap, and catches regressions before they reach anyone.",
        ],
        interviewPrompt:
          "Your offline NDCG is up 8% and the A/B test is flat. Give three explanations that are all consistent with that.",
        code: "logs show what the OLD system chose - that is the ceiling on what offline can measure",
      },
      {
        id: "position-bias",
        title: "Position bias",
        summary:
          "Items at the top get clicked partly because they are at the top, so click data confuses relevance with placement.",
        keyPoints: [
          "Training naively on clicks teaches the model to reproduce wherever the old system happened to place things.",
          "The usual model separates being examined from being relevant: a click needs both, and position drives only the first.",
          "Estimating the position effect needs some randomization, or a comparison of the same item shown at different ranks.",
          "Correcting for it means weighting each example by how likely it was to be seen at all.",
        ],
        interviewPrompt:
          "How would you measure how much of your click rate is position and how much is relevance?",
        code: "P(click) = P(examined | position) × P(relevant | user, item)",
      },
      {
        id: "counterfactual-evaluation",
        title: "Estimating what a new policy would have done",
        summary:
          "Logged data can estimate a different ranking policy's performance, if you know how likely the old system was to show each item.",
        keyPoints: [
          "The question is counterfactual: what would have happened had we shown a different list?",
          "Re-weighting logged outcomes by how likely the old and new policies were to show each item gives an unbiased estimate in principle.",
          "It needs logged probabilities, so the serving system has to record them - which means deciding this before you need it.",
          "Variance is the practical problem: rare actions get enormous weights, so estimates are clipped and remain rough.",
        ],
        interviewPrompt:
          "What must the serving system log today for counterfactual evaluation to be possible next quarter?",
        code: "log the score, the slate, AND the probability each item was shown",
      },
      {
        id: "ab-testing",
        title: "Online testing",
        summary:
          "The only measurement that settles the question is running both systems on real traffic and comparing what people do.",
        keyPoints: [
          "Randomize by user, not by request, or the same person sees both systems and the comparison is contaminated.",
          "Run long enough to pass the novelty effect, where any change lifts engagement briefly just by being different.",
          "Declare the primary metric and the guardrails before starting, so a win on one and a loss on another has a rule.",
          "Interleaving mixes two rankers' results in one list and is far more sensitive, at the cost of only comparing rankings.",
        ],
        interviewPrompt:
          "Clicks are up 3% and time spent is down 5%. What do you do, and what should have been decided earlier?",
        code: "randomize by user · pre-register metrics · outlast the novelty effect",
      },
      {
        id: "beyond-accuracy",
        title: "Diversity, novelty, and coverage",
        summary:
          "A list can score well on relevance and still be a bad experience, so these systems are judged on more than accuracy.",
        keyPoints: [
          "Diversity measures how different the items in one list are from each other.",
          "Novelty and serendipity measure whether anything was unfamiliar or usefully surprising.",
          "Catalogue coverage measures how much of the inventory ever gets shown, which matters commercially in a marketplace.",
          "These trade against short-term engagement, which is why they need explicit targets rather than good intentions.",
        ],
        interviewPrompt:
          "Engagement rises while catalogue coverage collapses. Why is that a problem worth escalating?",
        code: "a perfect list of ten near-identical items is a bad page",
      },
      {
        id: "feedback-loops",
        title: "Feedback loops",
        summary:
          "The system's choices become its own training data, so today's decisions shape tomorrow's model.",
        keyPoints: [
          "Shown items get engagement, engagement becomes training data, and the model learns to show them more - popularity compounds.",
          "Items the system never shows generate no data, so they can never be learned to be good.",
          "Narrowing what one user sees is the same mechanism applied per person, and it looks like accuracy improving.",
          "The only real defences are deliberate exploration, diversity targets, and monitoring coverage over time.",
        ],
        interviewPrompt:
          "Explain how a recommender can look like it is improving while the catalogue it serves is shrinking.",
        code: "shown → engaged → learned → shown more  (and never-shown stays never-shown)",
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
          "The whole funnel has to finish in the time it takes a page to load, which constrains every stage.",
        keyPoints: [
          "A typical budget is tens of milliseconds end to end, split across retrieval, feature fetching, scoring, and re-ranking.",
          "Feature fetching, not model inference, is usually where the time goes.",
          "Precompute whatever does not depend on the request, and cache aggressively for heavy users and popular contexts.",
          "Every stage needs a timeout and a fallback, because a slow feature store must degrade the list rather than fail the page.",
        ],
        interviewPrompt:
          "You have 50ms end to end. Allocate it across the funnel and say what you cut first when you overrun.",
        code: "retrieve 10ms → fetch features 15ms → score 15ms → re-rank 5ms → 5ms slack",
      },
      {
        id: "features-and-freshness",
        title: "Features, freshness, and skew",
        summary:
          "Ranking features come from several places at different speeds, and the dangerous bug is computing one feature two different ways.",
        keyPoints: [
          "Features arrive on three clocks: batch aggregates, near-real-time counters, and request-time context.",
          "Recent-behavior features are the most valuable and the hardest, because they must be updated within seconds.",
          "Training and serving must use one implementation of each feature, or the model quietly receives inputs unlike the ones it learned on.",
          "The most reliable defence is to log features exactly as they were served and train on those logs.",
        ],
        interviewPrompt:
          "Your model degrades a week after launch with no code change. Name the feature-side causes you would check.",
        code: "train on the features you LOGGED at serving time, not on a warehouse reconstruction",
      },
      {
        id: "training-pipelines",
        title: "Building the training data",
        summary:
          "Turning raw logs into training rows involves several decisions that quietly determine what the model can learn.",
        keyPoints: [
          "A row is an impression joined to whatever the user did afterwards, within a window you have to choose.",
          "The attribution window is a real modelling choice: too short misses slow conversions, too long credits the wrong impression.",
          "Negatives usually have to be down-sampled to keep the data manageable, which changes the base rate.",
          "Label delay bounds how fresh your training data can be, and therefore how quickly the model can respond to change.",
        ],
        interviewPrompt:
          "Purchases confirm up to 14 days after the click. How does that shape your training and retraining?",
        code: "impression + context + features-as-served  ⋈  outcome within the window",
      },
      {
        id: "retraining-and-drift",
        title: "Retraining and drift",
        summary:
          "Catalogues, users, and fashions move constantly, so these models go stale faster than most.",
        keyPoints: [
          "Item catalogues turn over continuously, so embeddings for ids need regular refreshing or new items stay invisible.",
          "Daily or continuous retraining is normal here, which is unusual compared with other ML domains.",
          "Watch input distributions and the flag-rate equivalents - click rate, coverage, score distribution - because quality signals arrive late.",
          "Re-tune any threshold or blending weight after a retrain, because the score distribution moves.",
        ],
        interviewPrompt:
          "Why do recommender systems retrain far more often than a typical classifier, and what breaks if they do not?",
        code: "new items daily → stale embeddings → invisible inventory",
      },
      {
        id: "exploration",
        title: "Exploration",
        summary:
          "A system that always shows what it currently believes is best never learns whether something else was better.",
        keyPoints: [
          "Exploitation shows the current best guess; exploration spends a little traffic finding out about uncertain items.",
          "Bandit approaches formalize the trade-off, either by adding a bonus for uncertainty or by sampling from what is plausible.",
          "Contextual versions condition on the user, so exploration is targeted rather than random.",
          "Exploration costs short-term engagement and buys data, cold-start coverage, and protection against feedback loops.",
        ],
        interviewPrompt:
          "A PM asks why 2% of traffic shows 'worse' items. Give the business justification.",
        code: "always exploit → the catalogue narrows and you never find out you were wrong",
      },
      {
        id: "scale-and-cost",
        title: "Scale and cost",
        summary:
          "These systems are among the most expensive in production, and the cost drivers are specific and worth naming.",
        keyPoints: [
          "Embedding tables for hundreds of millions of ids dominate model size, far more than the network itself.",
          "Cost scales with candidates scored per request multiplied by requests, so the funnel's shape is an economic decision.",
          "Precomputing recommendations for the heaviest users is often much cheaper than serving them live.",
          "Hashing ids, pruning rare ones, and quantizing vectors are the standard levers when tables no longer fit.",
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
          "The metric the model optimizes is never quite the thing the business wants, and naming that gap is most of the judgement.",
        keyPoints: [
          "Engagement is a proxy for value, and optimizing a proxy hard enough always finds the ways it differs.",
          "Marketplaces have several parties - buyers, sellers, and the platform - whose interests do not coincide.",
          "Long-term outcomes like retention are what matter and are far too slow to optimize directly.",
          "The usual resolution is a weighted combination of short-term predictions, with guardrails on the things you refuse to lose.",
        ],
        interviewPrompt:
          "Your ranker lifts engagement 5% and seller diversity drops 20%. Whose problem is that, and what do you change?",
        code: "optimize a proxy → it drifts from the goal → hold the difference with guardrails",
      },
      {
        id: "fairness-and-policy",
        title: "Fairness, policy, and what not to show",
        summary:
          "Ranking decides who gets attention, which makes exposure itself something you have to be deliberate about.",
        keyPoints: [
          "Two sides to it: users receiving relevant results, and items or sellers getting a fair chance at exposure.",
          "Popularity bias concentrates attention on a few items unless something actively counteracts it.",
          "Some categories are legally constrained - housing, credit, employment - and restrict what may be used for targeting.",
          "Policy filtering belongs late in the funnel, applied as a hard rule rather than as a weight in a score.",
        ],
        interviewPrompt:
          "Where in the funnel do policy rules belong, and why not just add a penalty to the ranking score?",
        code: "scores are soft; policy is hard - apply it as a filter, not as a weight",
      },
      {
        id: "failure-modes",
        title: "Characteristic failure modes",
        summary:
          "These systems fail in recognizable ways, and naming them turns a vague complaint into a diagnosis.",
        keyPoints: [
          "Popularity collapse: the same few items everywhere, usually a similarity or feedback-loop problem.",
          "Filter bubble: recommendations narrow over time for one user, which looks like accuracy improving.",
          "Stale or invisible inventory: new items never get shown because nothing explores them.",
          "Offline-online divergence: consistent gains offline that never appear in tests, usually bias in the logs.",
        ],
        interviewPrompt:
          "Users report the feed feels repetitive. Work through the possible causes in order.",
        code: "repetitive feed → diversity? similarity? feedback loop? exploration?",
      },
      {
        id: "rrp-system-design",
        title: "A ranking system design answer",
        summary:
          "A complete design answer runs from the business goal, through the funnel, to evaluation, cost, and the failures you expect.",
        keyPoints: [
          "Start with the decision and the metric, including what you refuse to lose, before naming any model.",
          "Define the training row and the label, and say when the label becomes observable.",
          "Walk the funnel in order with a latency and cost budget at each stage.",
          "Close with evaluation - offline, online, and the bias you are correcting for - and the top failure mode.",
        ],
        interviewPrompt:
          "'Design the home feed for a video app.' Give the eight-minute version.",
        code: "goal → row + label → retrieval → ranking → re-rank → eval → cost → failures",
      },
      {
        id: "interview-playbook",
        title: "Answering RRP questions",
        summary:
          "The graded skill is narrowing a broad prompt to one part of the funnel and explaining that part concretely.",
        keyPoints: [
          "Say which stage you are talking about - retrieval, ranking, or re-ranking - because the constraints differ completely.",
          "Name the training row and the label early; most vague answers are vague because that was never pinned down.",
          "Quote every result against the popularity baseline, and say which metric at which k.",
          "Mention the bias in the data before the interviewer does - position, exposure, and feedback loops are what they are listening for.",
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
