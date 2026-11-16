# Lexical search, dense retrieval, and reranking

## 1. Define a search item

**Retrieval** finds relevant items. An **index** supports search; a **chunk** is an indexed document segment. Keep a fact with the qualification that changes its meaning.

## 2. Match terms or meaning

**Lexical retrieval** matches words or terms; **BM25** is a term-based scoring method balancing term frequency, rarity, and document length. **Dense retrieval** compares learned query and document vectors.

## 3. Train and search vectors

A common dense retriever uses separate encoders for queries and documents. A **contrastive objective** scores relevant pairs higher than competing pairs, making independent document vectors reusable in an index.

Known relevant passages are positives; sampled alternatives are negatives. An unlabelled but relevant alternative is a **false negative** and can distort training.

## 4. Combine and refine candidates

**Hybrid retrieval** combines lexical and dense signals: exact AX-17 identifiers versus “forgot password”/“reset credentials” paraphrases. A **reranker** jointly scores query–passage candidates at higher per-pair cost.

Fuse incompatible score scales carefully. Reranking cannot recover a passage absent from the candidate set.

## 5. Measure evidence coverage

**Recall@k** is relevant items recovered in the top k divided by all relevant items. Finding two of three → 2/3.

Also check answer-support coverage: many on-topic passages may omit the decisive fact.

> **Reason it through:** The supporting passage never reaches the candidate set. Can a stronger reranker repair that failure?
