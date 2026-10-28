# What NLP and NLU do

## 1. Turn language into an answer

**Natural language processing (NLP)** analyzes or generates human language. **Natural language understanding (NLU)** interprets it for a defined task.

An **intent** is a requested action or communicative goal. An **entity** is a mention assigned a type, such as person or location.

> First choose the answer’s shape.

## 2. Choose the output

| Task | Input | Output |
|---|---|---|
| Classification | “My parcel is late” | Delivery complaint |
| Extraction | “Paris on Friday” | City and date spans |
| Retrieval | Question and document collection | Ranked documents |
| Generation | Source and instructions | New text |

A **span** is a contiguous text segment; a **corpus** is a text collection.

## 3. Separate prediction from action

```text
message → intent prediction → routing policy → support queue
```

A **threshold** is a score cutoff used to choose an action. A category prediction and a decision to route automatically are different outputs.

## 4. Specify available evidence

“That’s great” could express approval or sarcasm. Earlier conversation may change its interpretation.

**Inference** applies a fitted model to an input. State which messages, documents, or metadata exist at that time.

## 5. Measure the intended result

Routing needs correct destinations. Extraction needs correct boundaries and types. Generation needs useful, supported content.

**Sentiment** is expressed attitude: positive sentiment about a refund still does not identify every required support action.

## 6. Handle missing context

If essential evidence is absent, allow clarification or review. Fluent output does not establish understanding or correctness.
