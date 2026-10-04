## Deployment and versioning

Prompts, models, tools, policies, and runtime settings are versioned behavior dependencies.

## 1. Configuration bundle

```json
{
  "prompt": "v7",
  "tools": "v3",
  "model": "pinned-version",
  "policy": "v4",
  "limits": {"steps": 12}
}
```

Record retrieval/index and runtime versions where they affect outcomes.

## 2. Model changes

A stronger public benchmark score does not guarantee better behavior for this task.

Compare repeated outcomes, tool arguments, refusal/escalation, cost, and latency before switching.

## 3. Gradual rollout

```text
offline evaluation → shadow proposals → small canary → measured expansion
```

Define stop criteria in advance. Check critical slices and real integration effects.

## 4. Rollback

Keep a compatible previous bundle and a tested switch-back path.

Configuration-based rollback can be fast, but schema/data compatibility still matters.

## 5. In-flight runs

Pin the run's configuration or explicitly migrate/restart it.

Current permissions and policy revocations may still require immediate enforcement. Reproducibility must not preserve revoked authority.

## 6. Tool compatibility

Optional additions can be compatible; changed meanings and required fields need migration/versioning.

Support old valid contracts for a defined period and measure remaining use.

## What matters most

> Deploy a compatible behavior bundle and know how running work survives a change.
