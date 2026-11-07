# Text-to-SQL assistant over thousands of tables

Numerical targets are illustrative interview assumptions.

# 1. Problem statement

Design a natural-language analytics assistant that answers employee questions against a warehouse containing thousands of tables and frequently changing schemas. It must convert questions into **correct, safe, executable SQL** and return useful answers without leaking unauthorized rows or creating uncontrolled expensive queries.

Example: “What were weekly paid subscriptions by region last quarter, excluding test accounts?”

# 2. Clarification Q&A

| Candidate asks | Interviewer answers (assumed) | Design consequence |
|---|---|---|
| How many tables? | 10K tables, 200K columns; schemas change daily. | Schema retrieval, not full schema in prompt. |
| Read-only or writes? | Read-only analytics. | Read-only DB credentials and SQL validator. |
| What data permissions? | User-level table/column/row policies. | Enforce database-native authorization. |
| Ambiguity? | Clarify unclear business terms, metric definitions. | Metric catalog and interactive clarification. |
| Allowed latency? | P95 5 seconds excluding unusually expensive jobs. | Bounded compilation, execution timeout, async jobs. |
| How do we determine correctness? | Compare answers/results, not just SQL strings. | Execution accuracy, semantic equivalence. |
| Can the LLM issue arbitrary queries? | Never without validation and limits. | Sandboxed validator, dry-run, cost guardrails. |

# 3. Requirements

**Functional:** interpret question, retrieve relevant schema and business metrics, produce one or more SQL queries, validate types/joins/access/safety, execute safely, summarize results with assumptions and source tables, ask clarifications or abstain when ambiguous/unsupported.

**Non-functional:** high execution accuracy, zero unauthorized data access, predictable latency and warehouse spend, schema freshness, auditability, database dialect support, robust error recovery.

# 4. ML objectives

- **Schema retrieval Recall@K:** all essential tables/columns/joins and metric definitions included in context. A correct SQL generator cannot recover missing schema.
- **SQL validity:** parser success, resolved columns, type-checks, permission compliance.
- **Execution accuracy:** result correctness on gold queries, rather than exact SQL string match (many equivalent SQL forms).
- **Result faithfulness:** natural-language summary matches executed result, including units and filters.
- **Clarification decision:** ask when a question lacks a defined metric/aggregation, instead of guessing.
- **Operational safety:** query costs, scan limits, timeouts, forbidden operations.

# 5. Data

**Schema index:** names/descriptions for tables and columns, primary/foreign keys, join paths, freshness, owner, access-control labels, business metric glossary, example approved queries, data quality notes, database dialect. Maintain from the warehouse catalog and migration events.

**Training pairs:** user question → relevant schema subset → approved SQL → result or explanation. Generate paraphrases and diverse question types (aggregation, filters, time zones, window functions, joins); experts verify hard/critical cases. Use query logs carefully: past SQL may be incorrect or unsafe, not automatic gold.

**Gold evaluation:** schema-version snapshots and database fixtures with exact expected outputs. Split by time, schemas/joins and question templates to test generalization. Include questions requiring clarification, unsupported datasets, private columns, malicious injection, and high-cost queries.

# 6. High-level architecture

<!-- system-design-diagram -->

**Schema retrieval:** dense retrieval handles business paraphrases; keyword retrieval handles exact names/IDs. Include related join keys and approved join paths even if not individually similar to the question. For enterprise metrics, the semantic layer is often more important than raw schema descriptions.

# 7. Model and training

- Start with a capable LLM grounded by retrieved schema, relevant metric definitions, dialect rules, and a small number of **authorized** examples. Structured output should include SQL and any unresolved assumptions.
- For high QPS or repetitive workloads, fine-tune an encoder–decoder or smaller LLM on question/schema/SQL examples. Evaluate execution accuracy; matching SQL tokens is a weak proxy.
- Use a schema linker (retrieval over tables/columns + optional pairwise reranking). For complex questions, expand graph neighbors to recover required join paths.
- Constrain generation to SQL grammar or parseable abstract syntax trees (ASTs) where feasible, and validate the AST deterministically. Syntax validity alone does not ensure semantic correctness.
- Use execution feedback to repair **safe** failures (missing column, type mismatch) with bounded attempts. Do not let the model loosen access policies, add broad `SELECT *`, or remove limits merely to “make query pass.”

# 8. Safety and serving

- Execute with the **end user's database identity**, least-privilege read-only credentials, enforced row/column-level security, and approved datasets. A pre-execution LLM “permission check” is insufficient.
- Reject mutation operations, multi-statements, forbidden functions, unsafe external resources; enforce query deadline, row limit, scanned-byte/cost budget, and tenant quota.
- If user asks “revenue,” determine whether that means gross bookings, recognized revenue, or net receipts. Use the metric registry or ask a clarifying question.
- For high-cost queries, present a plan/estimate or submit as an asynchronous job. Cache only when authorization and freshness allow.
- On schema change, update the metadata index immediately; model retraining should not be required for a renamed column or added table. Consider schema aliases/migration compatibility.
- Log SQL, schema version, approvals/validation, execution identifiers, and anonymized outcome; protect user data in logs.

# 9. Evaluation and diagnostics

| Stage | Metric | Common issue |
|---|---|---|
| Schema linking | Gold table/column Recall@K, join-path coverage | Required fact table missing |
| Generation | AST validity, column/type resolution | Syntactically valid SQL uses wrong column |
| End-to-end | **Execution accuracy**, expected-result comparison | Wrong join duplicates rows |
| Semantics | Metric/aggregation correctness, time filtering | Wrong definition of active users |
| Safety | Unauthorized query attempts caught, cost violations | Query scans whole warehouse |
| UX | Clarification accuracy, end-to-end time, query cost | Assistant confidently guesses ambiguity |

**Diagnostic rule:** correct schema in context but wrong SQL → prompt/model/semantic reasoning. Correct query but wrong user-facing answer → result interpretation. Wrong schema → retrieval/catalog/metrics metadata. Exact-string match to reference SQL is not a reliable primary metric.

# 10. Trade-offs and interview summary

LLM-only generation with full schema fails context and freshness constraints. Schema retrieval improves cost and accuracy but adds recall risk. Execution-guided repair fixes mechanical errors but may increase cost and cannot prove the question's meaning was captured. Database safety must be deterministic.

> **Interview answer:** “I'd retrieve a small, authorized, versioned schema slice and business metric definitions before generating SQL. The LLM produces a candidate query, but a deterministic validator enforces AST, schema, permission, and cost constraints before read-only execution. I'd measure execution accuracy on gold database fixtures, schema Recall@K, clarification quality, and warehouse costs; schema changes update the index, not necessarily the model.”
