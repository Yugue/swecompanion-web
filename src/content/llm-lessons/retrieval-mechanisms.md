# Lexical search, dense retrieval, and reranking

## 1. Define a search item

**Retrieval** finds items relevant to a query. An **index** is a search structure; a **chunk** is a document segment stored as a retrievable unit.

Choose chunks that preserve the fact and its qualifications. A result containing a limit without its account-type exception can mislead the answer generator.

## 2. Match terms or meaning

**Lexical retrieval** matches words or terms; **BM25** is a term-based scoring method balancing term frequency, rarity, and document length. **Dense retrieval** compares learned query and document vectors.

## 3. Train and search vectors

A common dense retriever uses separate encoders for queries and documents. A **contrastive objective** scores relevant pairs higher than competing pairs, making independent document vectors reusable in an index.

Known relevant passages are positives; sampled alternatives are negatives. An unlabelled but relevant alternative is a **false negative** and can distort training.

## 4. Combine and refine candidates

**Hybrid retrieval** combines these signals: lexical matching can find an exact SKU such as AX-17, while dense retrieval can connect “forgot password” with “reset credentials.” A **reranker** jointly scores a query and candidate passage, refining a smaller set at greater per-pair cost.

Do not directly add unrelated score scales without validation; use calibrated combination or a rank-based fusion rule. A reranker cannot select a supporting passage absent from its candidate set.

## 5. Measure evidence coverage

**Recall@k** is the fraction of relevant items found in the top k candidates under a defined relevance set. If three relevant passages exist and two are retrieved, recall is 2/3.

Use both judged relevance and actual answer-support coverage. Ten passages on the same subject can still omit the one fact needed for the answer.
