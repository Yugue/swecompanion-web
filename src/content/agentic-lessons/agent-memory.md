## Short-term and long-term memory

Memory across runs requires deliberate storage, retrieval, correction, and deletion.

## 1. Memory types

| Type | Example |
|---|---|
| Working context | Latest tool result |
| Episodic record | Previous investigation and outcome |
| Semantic record | User's stated timezone |

Version operating procedures separately; do not let arbitrary memories become application policy.

## 2. Remembering is a data path

```text
user states preference → scoped record → future retrieval → context
```

Tuesday: “I'm vegetarian.” Friday: a meal-planning request retrieves that preference.

If the user later corrects it to pescatarian, supersede the active value and preserve appropriate provenance.

## 3. Select writes

Store durable relevant preferences, corrections, and resumable decisions under the product's consent/retention policy.

```json
{
  "subject": "user:8812",
  "key": "timezone",
  "value": "Europe/Berlin",
  "source": "user_statement"
}
```

Avoid storing every message or unsupported inference as a fact.

## 4. Select reads

Retrieve memories relevant to the current task, scoped to the user/tenant and bounded in count.

Use recency and validity alongside relevance. A stale shipping address can be highly similar and still wrong.

## 5. Lifecycle

```text
write → retrieve → correct/supersede → expire → delete
```

Different facts need different lifetimes. Deletion includes derived indexes/caches according to policy.

## 6. Poisoning and leakage

Treat proposed memories from untrusted content as untrusted. Validate provenance and permitted write rules.

Enforce tenant/user isolation in storage and retrieval. Labeling a record “memory” does not make it an instruction or verified truth.

## What matters most

> Memory is a maintained notebook with sources and corrections, not an automatic permanent belief.
