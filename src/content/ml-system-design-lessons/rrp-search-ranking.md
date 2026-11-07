# Google Search Relevance Ranking

Numerical targets are illustrative interview assumptions.

# 1. Problem statement

Design a ranking system that takes a web query and a set of candidate documents and returns search results ordered by relevance, usefulness, and quality at web scale. Focus on ranking; assume crawling and the basic inverted index already exist.

# 2. Clarifying Q&A

**Candidate:** Is the goal classic web search relevance or personalized recommendation?  
**Interviewer:** General web search relevance, with limited context such as language and location.

**Candidate:** Are we building retrieval or only the ranking layer?  
**Interviewer:** Both should be placed in the architecture, but focus your ML design on ranking.

**Candidate:** What ground truth do we have?  
**Interviewer:** Human relevance judgments, clicks, dwell/return behavior, and quality/spam labels.

**Candidate:** What are the latency and freshness expectations?  
**Interviewer:** Very high QPS, P95 around 150–250 ms; new documents and breaking-news queries need freshness.

**Candidate:** Are relevance and webpage quality equivalent?  
**Interviewer:** No. A page may match query words but be unhelpful, untrustworthy, outdated, or spammy.

# 3. Requirements

**Functional:** interpret query intent; retrieve candidate pages; rank graded relevance and quality; support lexical/entity matches, multilingual pages, fresh news; enforce safety and deduplication; return top 10–20.

**Non-functional illustrative:** billions of pages; 100K QPS; P95 under 200 ms; daily corpus updates plus near-real-time hot content; graceful degradation under load.

# 4. ML objectives

- **Retrieval:** human-relevant Recall@K at K~1,000–10,000.
- **Ranking:** maximize graded relevance measured by **NDCG@10** (Normalized Discounted Cumulative Gain), and MRR for navigational queries.
- **Quality:** demote spam, misleading or harmful results, and duplicates.
- **Online:** successful search/task completion, reformulation rate, long-click indicators, abandonment interpreted carefully; P95 and cost.

CTR is observational and position-biased. It should not be the sole objective.

# 5. Data and judgments

**Log features:** query text, language, geo (as permitted), retrieved candidate IDs, shown positions, clicks/dwell, query reformulations, session success proxies.

**Page features:** body/title/anchor text, freshness, domain-quality/spam signals, structured data, page language, authority and safety.

**Gold labels:** human assessors assign grades, e.g. 0=irrelevant, 1=marginal, 2=useful, 3=highly relevant, 4=perfect. Label `(query, page)` with special query-intent and locale slices.

**Bias and leakage:**

- Results at top ranks get more clicks independent of quality: randomized/interleaved experiments, propensity or counterfactual correction where feasible.
- Prevent train/test leakage from near-identical queries and document versions; use time splits and head/tail query slices.
- Beware stale human judgments on evolving pages; re-label high-impact changes.

# 6. Architecture

<!-- system-design-diagram -->

Semantic retrieval complements rather than replaces lexical search: exact names, identifiers, rare terms and new topics strongly favor lexical signals.

# 7. Feature engineering and model selection

**First-stage ranker:** LambdaMART/gradient-boosted decision trees with BM25, term proximity, title match, query-document language match, link/quality features, page age, intent features, and aggregate interaction features.

**Neural reranker:** fine-tuned transformer cross-encoder jointly attends to query and candidate snippet/page chunks, capturing context and meaning. For long pages, select relevant passages first; do not blindly pass full documents to a limited context model.

**Training objectives:**

- **Pointwise:** predict relevance grade (cross-entropy/regression); simple but ignores relative ranking structure.
- **Pairwise:** learn document A > document B for same query (RankNet or pairwise logistic loss).
- **Listwise / LambdaMART:** optimize ordering and approximate NDCG-related improvements; often strong for graded relevance labels.

Train only on meaningful comparison sets within the same query; use hard negatives from retrieval, not random web pages alone.

# 8. Evaluation: NDCG and ranking diagnosis

For grades `rel_i`, discounted gain `DCG@K = Σ_{i=1..K} (2^{rel_i}-1)/log2(i+1)`; `NDCG@K = DCG@K / ideal_DCG@K`.

- **Recall@K:** are relevant pages present after retrieval?
- **NDCG@10:** are highly relevant pages near the top?
- **MRR:** how high is the first correct answer, particularly for navigational tasks?
- **Quality/robustness:** spam rate, harmful exposure, diversity of sources, freshness for time-sensitive queries.

**Diagnostic:** retrieval Recall@1000 low -> improve query understanding, sparse/dense retrieval. Recall high but NDCG@10 low -> improve features/ranker/reranker. If offline NDCG improves but search satisfaction worsens -> recheck label design, query mix, and trust/latency costs.

# 9. Freshness, inference, and scaling

- Query rewriting/correcting should preserve exact entity IDs, product numbers, and intentional unusual terms.
- Build page indexes incrementally; update freshness features independent of full model retraining.
- Cache frequent query candidate sets with invalidation for changing topics; cache document embeddings, but not wrong versions.
- Rerank only top N; dynamic compute allocation based on query difficulty/traffic can protect latency.
- Shard index for throughput; budget fan-out and top-K merges; fallback to first-stage ranker if cross-encoder unavailable.
- Model drift from SEO/adversarial behavior demands continuous spam evaluation and robust features.

# 10. Trade-offs and pitfalls

- Lexical-only misses paraphrases; dense-only misses exact rare strings: hybrid retrieval is the default.
- Click labels without position correction train a popularity/position model, not necessarily relevance.
- Using only a cross-encoder against billions of pages is computationally infeasible: stage the ranking.
- Optimizing NDCG from stale labels can regress fresh-news intent; slice evaluation and refresh labels.
- More personalization is not always desirable for objective factual queries; use sparingly and fairly.

**Interview close:** “I separate high-recall hybrid retrieval, a cheap learning-to-rank stage, and a small cross-encoder rerank. I train on graded relevance judgments plus debiased behavior, optimize NDCG@10 with safety/quality guardrails, and measure query-success online. Freshness, head/tail behavior, and P95 dictate the cascade.”
