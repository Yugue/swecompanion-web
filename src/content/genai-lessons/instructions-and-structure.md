# Instructions and structured outputs

## 1. Steer an existing model

**In-context learning** changes behavior through examples or instructions in that context without updating model parameters.

A **zero-shot prompt** gives instructions without demonstrations. A **few-shot prompt** also supplies examples of the desired input–output pattern.

## 2. Make the contract clear

State the task, available evidence, output format, and relevant constraints. Separate quoted data from instructions. Match demonstrations to the actual task rather than adding unrelated examples.

For name extraction, demonstrate both cases:

| Input | Desired output |
|---|---|
| “Name: Ana” | {"name":"Ana"} |
| “No name supplied” | {"name":null} |

The second example makes missing information an allowed outcome.

## 3. Use the trained chat format

A **chat template** serializes roles and message boundaries using conventions learned during training. System, user, assistant, and tool messages are structured input, not merely decorative labels.

An incorrect template can impair behavior even when the visible words look reasonable.

## 4. Constrain output syntax

A **schema** defines required fields and allowed types. **Constrained decoding** blocks next tokens that cannot lead to an allowed structure under the supported grammar.

| Check | Establishes |
|---|---|
| JSON parsing | Syntactically valid JSON |
| Schema validation | Required structural constraints |
| Evidence validation | Whether asserted values are supported |

These are different guarantees.

## 5. Generate a tool call

**Tool calling** emits a tool name and structured arguments for an external executor. The language model proposes the call; software validates arguments, checks permission, executes, and returns a result.

A schema-valid instruction to transfer money is not authorization to do so.

## 6. Measure robustness

Test paraphrases, missing evidence, long contexts, and adversarial quoted content. Examples can bias the label distribution or encourage copying.

If prompting reaches a stable limit, choose an intervention that matches the failure: evidence retrieval, supervised adaptation, or a deterministic operation.
