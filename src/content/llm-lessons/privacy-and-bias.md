# Privacy, memorization, and data removal

## 1. Separate exposure routes

**Memorization** retains reproducible training-specific information. Exposure can also come from retrieval, history, tools, or logs. Inspect actual context before blaming weights.

## 2. Test sensitive recall

**Extraction attacks** seek reproduced content; **membership inference** estimates whether an example was in training.

Use authorized test data. Failure to extract one phrase does not establish general protection.

## 3. Limit collection and access

Minimize unnecessary sensitive data, filter training sources appropriately, restrict retrieval permissions, and define log access and retention.

**Differential privacy** is a formal framework bounding how much a mechanism's output distribution can change when one protected record changes. Its guarantee depends on the precise mechanism, privacy budget, and composition; ordinary redaction is not that guarantee.

## 4. Understand deletion scope

Removing a document from an index prevents future retrieval through that index, assuming caches and replicas are handled. It does not automatically erase effects of earlier training.

**Machine unlearning** seeks to remove specified training influence. Validating removal while preserving useful behavior is difficult; do not equate a refusal prompt with erasure.

## 5. Verify the actual boundary

Probe retrieval, caches, tools, logs, and model-only generation separately. A refusal on one query does not prove data removal.

> **Reason it through:** A deleted document is still reproduced. How would you distinguish stored context from memorization in weights?
