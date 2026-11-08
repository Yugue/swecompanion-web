# Link Product Mentions to Catalog IDs

Numerical targets are illustrative interview assumptions.

# 1. Problem statement

Given an unstructured customer message, find **every product mention** and resolve each to the correct **canonical catalog product/variant ID**, or `NO_MATCH`. Distinguish closely related variants, SKUs, models, colors, and generations.

Example: “My Pixel 9 Pro case does not fit my Pixel 9.” → two distinct mentions and two potentially different product IDs.

# 2. Clarification Q&A

**Candidate:** Are inputs short product search queries or paragraphs with multiple mentions?  
**Interviewer:** Full customer messages; some contain multiple products.

**Candidate:** Is the catalog canonical, and are similar variants distinct?  
**Interviewer:** Catalog has unique IDs/SKUs; variants are distinct products and must not be collapsed.

**Candidate:** Do we have product metadata and exact identifiers?  
**Interviewer:** Yes: product title, aliases, brand, type, SKU, specs, version, availability.

**Candidate:** Are unknown products possible, and how costly are false links?  
**Interviewer:** Yes; prefer `NO_MATCH` to mapping a mention to the wrong product variant.

**Candidate:** Scale and freshness?  
**Interviewer:** Millions of products, thousands of catalog updates daily, multilingual text; 2K QPS, P95 below 150 ms.

# 3. Requirements

**Functional:** Detect spans of product mentions in messages; link each span to a canonical catalog ID; correctly discriminate variants; respect exact identifiers and explicit constraints; emit `NO_MATCH` when unresolved; handle additions/deletions rapidly.

**Non-functional:** Million-scale catalog, 2K QPS, <150 ms P95, high linking precision and coverage across languages; current catalog validity.

# 4. ML objectives

Two related but distinct ML tasks:

1. **Mention detection:** Identify product spans and optional types → span-level precision, recall, F1.
2. **Entity linking:** Retrieve/choose the correct canonical ID, or abstain → candidate Recall@K, linking accuracy, accepted-link precision/recall, and `NO_MATCH` false accepts.

Do not conflate mention-detection errors with catalog disambiguation errors.

# 5. Data

**Labeling approach:** Prompt a teacher with text, candidate catalog records and a small human gold set of mention spans, exact variant IDs and NIL examples. Generate span–ID pseudo-labels, checking that spans occur verbatim and IDs exist. Catalog aliases and verified SKU links provide inexpensive additional supervision.

**Quality and escalation:** Hold out new SKUs and variant confusions in human validation/test data. Improve prompts or tune soft prompts first; use teacher LoRA on development gold only if linking quality remains inadequate. Human bulk annotation is a last resort for valuable unresolved variants.

**Feature engineering:** Preserve SKU strings, dimensions and Pro/XL/Max tokens; combine mention/context embeddings with exact brand, model and variant matches.

**Sources:** Annotated text spans mapped to product IDs, canonical catalog records and aliases, verified product search/click data, return and customer-support histories, and corrections to mislinks.

**Gold examples:**

```text
Text: "I bought the Pixel 9 case but own the Pixel 9 Pro."
Span 1: "Pixel 9 case"       → catalog ID for the case variant
Span 2: "Pixel 9 Pro"        → catalog ID for the phone model
```

**Hard negatives:** Different storage capacities; size/color variations; year/revision differences; related accessories versus underlying device; same generic term from multiple brands. Do **not** treat near-duplicate catalog titles as equivalent products.

**Preprocessing:** Preserve exact SKUs, dimensions, numbers, versions, and tokens like “Pro/XL/Max.” Tokenization and case normalization must not erase critical product cues. Split by time and include newly added SKUs in evaluation to test cold-start generalization.

# 6. Models and training

**Mention detection:** Start with a pretrained multilingual span model; if needed, train a head or adapter on checked teacher span pseudo-labels with BIO tagging or span heads. Evaluate exact span + entity-type F1, including nested or overlapping mentions if supported.

**Retrieval:** Train a bi-encoder where query input is **mention plus local context**, not only the surface string. Catalog input contains product name, aliases, and distinguishing structured attributes. Use contrastive positives and hard negatives from near-identical variants. Candidate generation can combine exact lexical matches/BM25 with ANN semantic search.

**Verification:** Cross-encoder takes `(mention + context, candidate catalog record)` and estimates identity compatibility. Exact SKU, brand, size, version, and product-line constraints can override semantic score. Score threshold returns ID or `NO_MATCH`. Calibrate precision particularly on unseen variants and out-of-catalog mentions.

**Question:** Could a single giant classifier predict millions of catalog IDs? It would be expensive to retrain and poorly suited to frequently added products. Retrieval keeps IDs external and updatable.

## Training and inference cost estimate

**Assumptions:** 1K text requests/s × 3 mentions/request. Verify 10 catalog candidates/mention, or 30 mention–catalog pairs/request. Rates and dataset sizes below are illustrative; $4/GPU-h and $0.05/CPU-core-h. Full utilization; round serving fleets up to whole machines.

| Model / stage | Training / preparation | Inference |
|---|---|---|
| Mention/context encoder | 300K examples × 3 passes ÷ (500 examples/s/GPU) ÷ (3,600 s/h) × ($4/GPU-h) ≈ **$2/run** | 1K requests/s × 3 mentions/request ÷ (5K mentions/s/GPU) → 1 GPU × ($4/GPU-h) = **$4/h** |
| Top-10 variant verifier | 300K examples × 3 passes ÷ (500 examples/s/GPU) ÷ (3,600 s/h) × ($4/GPU-h) ≈ **$2/run** | 1K requests/s × 30 pairs/request ÷ (5K pairs/s/GPU) → 6 GPUs × ($4/GPU-h) = **$24/h** |

# 7. Serving and catalog changes

Precompute catalog embeddings, add new products through delta index and lexical index, tombstone withdrawn/merged SKUs, and check current existence in the metadata store before linking. Cache popular aliases but key on disambiguating context. Batch many mention vectors in one message. Restrict expensive cross-encoder calls to K candidates for ambiguous mentions.

Do not cluster canonical variants into one ID: “same meaning” at a topic level does not equal “same SKU.” Raw catalog import deduplication/entity resolution, if required, is a **separate** upstream data-quality workflow.

# 8. High-level architecture

<!-- system-design-diagram -->

**Shortcut:** If input is already a short product search query, skip the mention detector and retrieve using the full query. For paragraphs, span detection is necessary.

# 9. Evaluation and diagnosis

| Stage | Primary metrics |
|---|---|
| Mention extraction | Exact span/type precision, recall, F1 |
| Retrieval | Gold product Recall@K; lexical vs dense contribution |
| Disambiguation | Top-1 canonical ID accuracy; variant confusion rate; MRR |
| Decision | Accepted ID precision, recall; `NO_MATCH` false-accept rate |
| Production | Catalog freshness, missing SKU incidents, per-language quality, P95 |

**Diagnosis:** Good NER F1 but weak candidate Recall@K → enrich aliases, context-based training, or hybrid lexical retrieval. High Recall@K but “Pixel 9” versus “Pixel 9 Pro” swaps → hard negatives and structured/version checks. High apparent accuracy on popular products but low quality on new SKUs → evaluate temporal cold-start slices.

# 10. Interview summary

> “I'd split the problem into mention detection and canonical entity linking. A multilingual span model finds each mention; a bi-encoder retrieves product candidates using the mention **and context**; exact SKU/attribute constraints and an optional cross-encoder distinguish close variants. Each mention returns a valid canonical ID or `NO_MATCH`, with incremental catalog indexing and separate span-F1 and linking-accuracy evaluations.”
