# Retrieving relevant evidence

## 1. Find candidate evidence

A **retriever** ranks stored records for a query. **Lexical retrieval** scores term overlap; **dense retrieval** compares learned vectors representing queries and documents.

Their errors differ, so an appropriate choice depends on the query and corpus.

## 2. Start with terms

An **inverted index** maps terms to documents containing them. **BM25** is a lexical ranking method that rewards relevant term matches while accounting for term rarity, repetition, and document length.

Rare identifiers and exact phrases can be strong lexical evidence. Paraphrases with little overlap are harder.

## 3. Compare dense vectors

A text encoder maps each query and document to vectors. Score them with dot product or cosine similarity, using the convention the encoder was trained for.

For q=[1,0], documents [1,1] and [2,2] have equal cosine similarity but different dot products. Normalization changes rankings when norms differ.

## 4. Learn useful embeddings

Retrieval encoders often use contrastive examples: matching query–document pairs compete with selected negatives. A **hard negative** is a plausible but irrelevant candidate.

If negatives are actually relevant, training can punish useful similarity. Pair labels and sampling matter as much as vector width.

## 5. Search approximately

**Approximate nearest-neighbor (ANN) search** finds high-scoring vectors without comparing every stored vector exactly. Graph-based or partitioned indexes trade search effort, storage, and retrieval accuracy.

**Recall@k** is the fraction of relevant items recovered in the first k results under a defined relevance set.

## 6. Separate search errors

Compare exact vector search with ANN on a sample. If exact search succeeds and ANN fails, tune the index. If both fail, inspect embeddings, chunking, or the query.

Increasing k can improve coverage while adding latency and irrelevant context. Measure downstream answer quality as well as retrieval scores.
