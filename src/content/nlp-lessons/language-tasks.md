# What NLP and NLU do

## 1. Turn language into an output

**Natural language processing (NLP)** builds computational systems that analyze or generate human language. **Natural language understanding (NLU)** focuses on interpreting language for a defined task: identifying an intent, extracting an entity, or deciding whether one statement supports another.

“Understand this message” becomes useful only after the required answer is specified.

## 2. Choose the prediction structure

| Task | Input | Output |
|---|---|---|
| Classification | “My parcel is late” | Delivery complaint |
| Extraction | “Arrive in Paris on Friday” | City and date spans |
| Retrieval | A question and a collection | Ranked documents |
| Generation | A source and instructions | A text sequence |

A **span** is a contiguous source-text segment. A **corpus** is a collection of texts. These output structures need different labels, models, and evaluation.

## 3. Separate prediction from action

```text
customer message → intent prediction → routing policy → support queue
```

The prediction could be a category with estimated probability. The policy decides whether to route automatically or request review. A **threshold** is a cutoff used to choose that action.

The model and policy solve related but different problems.

## 4. Define the available context

“That's great” can express approval or sarcasm. A standalone sentence and the same sentence inside a conversation contain different evidence.

State whether the model receives earlier messages, account information, or a document. **Inference** means applying a fitted model to an input; information unavailable then cannot be required for its prediction.

## 5. Measure useful behavior

For routing, measure incorrect destinations and unresolved messages, including the consequences of mistakes. For extraction, check source boundaries and types. For generation, check meaning and support as well as readability.

A fluent answer may still be incorrect. A model can recognize the topic of a message without identifying the action the customer wants.

## 6. State the boundary

A prediction is evidence produced under a task definition, not unrestricted human understanding. When inputs omit essential context, the supported action may be to ask for clarification.

> First choose the answer’s shape; then decide how to learn it.

## 7. Interview reasoning

**Question:** Is a sentiment classifier sufficient to route complaints?

**Answer:** No. Negative sentiment does not identify the requested service or destination. Define routing labels and compare against a routing baseline; sentiment may supply an additional feature.
