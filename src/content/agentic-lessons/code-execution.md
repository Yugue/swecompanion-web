## Code execution as a universal tool

A code tool lets the model express calculations and transformations in an executable program.

## 1. Coverage and exactness

A script can filter, join, aggregate, and format data without a separate tool for each operation.

```python
total = sum(row["amount"] for row in rows if row["status"] == "paid")
```

Execution makes arithmetic exact for the program's inputs; the program can still implement the wrong task.

## 2. Compute outside context

```text
50,000 rows → interpreter → three summary numbers → model
```

Avoid sending every row to the prompt. Keep artifacts available for verification.

## 3. Isolate execution

Use scoped files, limited permissions, bounded CPU/memory/time, and capped output.

Give only required network access and credentials. Choose an isolation mechanism appropriate to the threat; a container alone is not a complete security design.

## 4. Injection risk

```text
untrusted document → generated code → available data/network → disclosure
```

Restrict secrets, sensitive inputs, and outbound destinations. No network reduces exfiltration paths, but output can also disclose data or contain wrong artifacts.

## 5. Code or narrow tools

| Code | Narrow tools |
|---|---|
| Flexible transformations | Explicit named operations |
| Needs program/result review | Easier per-operation policies |
| Small tool menu | More interfaces |

Combine sandboxed computation with tightly authorized external actions.

## 6. Validate results

A join can double rows and totals while exiting successfully.

Check row counts, uniqueness, conservation of totals, output schema, and representative records.

## 7. Reproduce execution

Record source, input references/hashes, runtime version, output, errors, artifacts, and timing.

Redact sensitive values under the logging policy.

## What matters most

> The sandbox limits effects; independent result checks establish correctness.
