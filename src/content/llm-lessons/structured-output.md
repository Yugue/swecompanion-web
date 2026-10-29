# Structured output and constrained decoding

## 1. Define the output contract

A **schema** describes required structure, types, and allowed values. A date-extraction schema might require one date string or null.

Specify what null means: missing evidence, an unknown value, and an execution failure are different outcomes and may need different fields.

## 2. Constrain token selection

**Constrained decoding** masks tokens that cannot continue a valid output under a grammar or supported schema representation. The remaining token probabilities are normalized before selecting a token.

It changes which continuations are legal, not which customer or date is factually correct. Verify the constraints actually supported by the implementation.

## 3. Validate at several levels

| Check | Establishes | Does not establish |
|---|---|---|
| JSON parse | Valid serialization | Correct fields |
| Schema validation | Required structure and types | True facts |
| Business validation | Checked domain rules | Every untested property |

## 4. Check semantics

An account ID can be a valid string while belonging to the wrong customer. Check references against authorized records outside the generated response.

A schema-valid answer may also omit a required factual qualification. Add task-specific checks and evaluate missing-information behavior.

## 5. Repair with a bound

If validation fails, a targeted repair prompt can include the error and original evidence. Limit retries and measure final success, additional latency, and refusal behavior.

Repeatedly asking for a valid answer can turn an honest “missing” into a fabricated value. Preserve the task’s evidence requirements throughout repair.
