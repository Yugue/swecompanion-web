# Lexical, dense, and hybrid retrieval

## 1. Retrieve a useful candidate set

**Retrieval** selects candidates from a corpus before more expensive processing. It needs both a scoring rule and an index that makes selection feasible.

A relevant document absent from the candidate set cannot be recovered by a reranker that only reads that set.

## 2. Score explicit terms with BM25

**BM25** is a lexical ranking function combining term rarity, diminishing returns from repetition, and document-length normalization. One common term contribution is:

\[
\operatorname{IDF}(t)\frac{f(t,d)(k_1+1)}{f(t,d)+k_1(1-b+b|d|/\overline{|d|})}
\]

\(t\) is a query term; \(d\) a document; \(f\) its term count; \(|d|\) document length; \(\overline{|d|}\) average corpus length. \(k_1>0\) controls frequency saturation; \(b\in[0,1]\) length adjustment; IDF measures term rarity under a stated formula.

Sum over the selected query terms. At equal document lengths and \(k_1=1\), frequency factors for counts 1, 2, 3 are 1, 1.333, 1.5: repeated evidence has diminishing returns.

## 3. Search a learned vector space

**Dense retrieval** encodes queries and documents into vectors, then searches by similarity. Document vectors can be computed before a request if their encoder is query-independent.

**Approximate nearest-neighbor (ANN) search** trades exact neighbor recovery for speed. Compare approximate results with exact search on a feasible sample to distinguish index misses from representation errors.

## 4. Combine complementary evidence

**Hybrid retrieval** combines lexical and dense candidates or rankings. Exact product codes and rare names may favor lexical evidence; paraphrases can benefit from learned representations.

Raw scores from different systems need not share units. Use a validated score transformation, learned fusion, or rank-based fusion rather than assuming their unscaled sum is meaningful.

## 5. Evaluate candidate coverage

**Recall@K** measures the fraction of known relevant documents recovered among K candidates under the declared relevance set.

Report query-level aggregation and coverage of relevance judgments. An unjudged document is not automatically irrelevant; incomplete labels can distort the score.

## 6. Keep the index compatible

Corpus snapshots, tokenizer, encoder version, similarity rule, and vector normalization form a retrieval contract. Changing the query encoder without compatible document vectors can break that contract.

Set the candidate budget from coverage, downstream capacity, and latency. More candidates increase possible coverage but also processing work.

## 7. Interview reasoning

**Question:** Why can a dense retriever miss an exact serial number while finding topical documents?

**Answer:** Its training may emphasize broad semantic relationships rather than precise identifier matching. Check lexical or hybrid retrieval and inspect tokenizer and index behavior.
