# Structured output and constrained decoding

## 1. Define the output contract

A **schema** describes required structure, types, and allowed values. A date-extraction schema might require one date string or null.

Specify what null means: missing evidence, an unknown value, and an execution failure are different outcomes and may need different fields.

## 2. Constrain token selection

**Constrained decoding** masks tokens that cannot continue a valid grammar or supported schema, then renormalizes allowed probabilities.

Check the implementation’s supported constraints. Legal syntax does not identify the correct customer or date.

## 3. Validate at several levels

| Check | Establishes | Does not establish |
|---|---|---|
| JSON parse | Valid serialization | Correct fields |
| Schema validation | Required structure and types | True facts |
| Business validation | Checked domain rules | Every untested property |

## 4. Check semantics

A numeric field accepts 17 even if the invoice says 71. Check correspondence with authorized source evidence separately from schema validity.

## 5. Repair with a bound

Give a repair attempt the validation error and original evidence. Bound retries, preserve null/missing rules, and measure final success and latency.

> **Reason it through:** An output passes JSON and schema checks but contains the wrong amount. Which validation layer must catch it?
