# Privacy, memorization, and data removal

## 1. Separate exposure routes

**Memorization** is retention of training-specific information that can be reproduced. A system can also expose private information from retrieved documents, conversation history, tools, or logs.

A copied passage does not by itself identify the route. Inspect the actual context and data lineage before concluding that it came from model weights.

## 2. Test sensitive recall

**Extraction attacks** try to elicit sensitive or training-specific content. A **membership inference** attack tries to determine whether an example was used in training.

Evaluate with authorized test data, including synthetic sensitive markers where useful. Absence of one memorized phrase is not proof that all private data is protected.

## 3. Limit collection and access

Minimize unnecessary sensitive data, filter training sources appropriately, restrict retrieval permissions, and define log access and retention.

**Differential privacy** is a formal framework bounding how much a mechanism's output distribution can change when one protected record changes. Its guarantee depends on the precise mechanism, privacy budget, and composition; ordinary redaction is not that guarantee.

## 4. Understand deletion scope

Removing a document from an index prevents future retrieval through that index, assuming caches and replicas are handled. It does not automatically erase effects of earlier training.

**Machine unlearning** seeks to remove specified training influence. Validating removal while preserving useful behavior is difficult; do not equate a refusal prompt with erasure.

## 5. Verify the actual boundary

Test the route you intended to close: direct retrieval, cached context, tool access, logs, and model-only generation require different probes.

Keep authorization and data minimization in the application as well as its model-facing prompt. A model refusing one tested query does not prove that the underlying data is absent.
