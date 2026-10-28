# Lexical, dense, and hybrid retrieval

## 1. Recover useful candidates

**Retrieval** selects documents from a corpus using a scoring rule and searchable index.

A relevant document missing from this set cannot be recovered by a reranker limited to those candidates.

## 2. Score terms with BM25

**BM25** combines rarity, repetition saturation, and length adjustment. One term contributes:

\[
\operatorname{IDF}(t)\frac{f(t,d)(k_1+1)}{f(t,d)+k_1(1-b+b|d|/\overline{|d|})}
\]

t is query term; d document; f occurrence count; |d| length; average |d| corpus mean. IDF is corpus term rarity under the chosen convention.

k₁>0 controls saturation; b∈[0,1] controls length adjustment. Sum contributions over query terms.

At equal lengths and k₁=1, counts 1,2,3 give factors 1,1.333,1.5. Repetition has diminishing returns; larger b strengthens length adjustment.

## 3. Search learned vectors

**Dense retrieval** compares encoded queries/documents. Query-independent document vectors can be prepared in advance.

**Approximate nearest-neighbor (ANN) search** trades exact recovery for speed. Compare with exact search on a sample to separate index misses from representation errors.

## 4. Combine complementary evidence

**Hybrid retrieval** combines lexical and dense rankings. Product codes favor exact terms; paraphrases can favor learned representations.

Scores need not share units. Validate score transformations or use rank-based fusion rather than an arbitrary raw sum.

## 5. Measure candidate coverage

**Recall@K** is the fraction of known relevant documents recovered among K candidates.

Declare query aggregation and judgment coverage. Unjudged documents are not automatically irrelevant.

## 6. Keep the index compatible

Corpus snapshot, encoder, tokenizer, normalization, and similarity rule must agree. Updating only the query encoder can make stored document vectors incompatible.

Choose K using recall, downstream capacity, and latency.
