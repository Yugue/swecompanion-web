# Generating grounded answers

## 1. Answer from supplied evidence

**Grounded generation** produces an answer supported by specified evidence. **Faithfulness** requires claims to be supported by that evidence; **correctness** requires agreement with the task’s truth criteria. Mere absence of contradiction is insufficient for evidence-only answers.

A faithful summary of an incorrect document can still be factually wrong.

## 2. Select context under a budget

A **context budget** limits the tokens available for instructions, evidence, history, and output. Retain complete answer-bearing passages rather than many truncated matches.

For a decoder with 8,000 total positions, 500 instruction tokens, 1,000 history tokens, and 1,500 reserved output tokens leave 5,000 for evidence before formatting overhead. Duplicate passages spend that budget without adding support.

## 3. Make source priority explicit

Keep source IDs, dates, and relevant metadata attached to text. For conflicts, use a defined authority or effective-date rule instead of asking the model to guess.

If two equally authoritative sources disagree, report the conflict or escalate according to the task.

## 4. Check citations at the claim level

A **citation** links a claim to supporting evidence. Relevance of the whole document is insufficient: the cited span must support the particular assertion.

For “the limit is 20 MB,” verify that the source actually gives 20 MB for the correct product and date.

## 5. Handle missing evidence

**Abstention** declines to assert an unsupported answer. Define whether the model may use background knowledge, request clarification, or state that the corpus lacks the answer.

A confident fallback from model memory can violate an evidence-only task even when it happens to be correct.

## 6. Probe evidence use

Move decisive evidence, add distractors, change a key fact, and test unanswerable questions. Check whether the answer follows the supplied evidence appropriately.

Measure correctness, support, citation accuracy, and appropriate abstention separately. One fluent answer does not establish robust grounding.
