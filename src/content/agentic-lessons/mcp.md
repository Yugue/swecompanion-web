## Tool servers and the Model Context Protocol

**MCP** standardizes communication between applications and servers exposing context and capabilities.

## 1. Integration shape

```text
clients → common protocol → servers → external systems
```

For three clients and four systems, bespoke pairwise adapters could mean 12 integrations. A common interface can reduce adapter duplication, though testing and system-specific work remain.

## 2. Server primitives

| Primitive | Purpose | Typical control |
|---|---|---|
| Tools | Callable operations | Model proposes use |
| Resources | Readable context | Application selects |
| Prompts | Reusable templates | User selects |

The host controls what reaches the model and what executes.

## 3. Discovery

```text
host/client → list available tools → server schemas
                         ↓
                  selected tools → model
```

A client maintains a connection to a server. The host coordinates clients, permissions, and model-facing context.

## 4. Trust boundary

Server descriptions, results, and capabilities can change.

Review dependencies and capability changes, scope credentials, restrict approved servers, and log server identity. Returned content is not authority to expand permissions.

## 5. Avoid collisions

Two servers can both offer **search**. Give model-facing tools distinct names and expose only relevant capabilities.

Standard connectivity does not solve tool selection.

## 6. When the protocol helps

Reusable integrations across applications favor a shared server interface.

One stable private function may need only a direct wrapper. Compare operational and maintenance costs.

## What matters most

> A standard socket connects systems; the host still decides which connections and operations are allowed.
