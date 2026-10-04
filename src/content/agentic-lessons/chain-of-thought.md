## Chain of thought and its limits

Intermediate reasoning can help a model work through dependent steps. It is not a guarantee of correctness.

## 1. The mechanism

```text
direct:   question → answer
extended: question → intermediate computation → answer
```

Extra computation can carry partial results forward. It does not independently fetch facts or verify them.

## 2. When it may help

Constraint solving, planning, and multi-step calculations can benefit.

Simple extraction may need little additional effort. Missing live evidence needs retrieval.

Effects depend on model and task; evaluate them rather than treating a task category as a guarantee.

## 3. A worked decision

Policy: refund within 30 days of delivery.

Delivered March 6; requested April 3. Elapsed time is **28 days**, within the window, subject to other policy conditions.

The useful decomposition is:

```text
identify governing date → calculate elapsed days → check rule/exceptions
```

Use a date tool when exact calendar handling matters.

## 4. Explanation versus evidence

A fluent explanation may omit important influences or rationalize a wrong answer.

For auditing, keep observable calls, cited policy clauses, calculations, and outcome checks. Do not require access to private model reasoning.

## 5. Compute and cost

Thirty steps with 250 additional tokens each produce 7,500 extra tokens in an illustrative visible-reasoning design.

Actual accounting and retention vary by interface. Measure usage and latency. Preserve decisions and evidence when compacting, rather than long reasoning narratives.

## What matters most

> Extra reasoning is scratch-work capacity. Evidence and validation remain separate responsibilities.
