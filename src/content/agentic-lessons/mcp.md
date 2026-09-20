## Tool servers and the Model Context Protocol

MCP standardizes how an agent discovers and calls external capabilities. The value is an integration-math argument, and the cost is a change to your threat model. Both belong in the answer.

### 1. The problem it solves

```text
without a standard:            with a standard:

 agent A ─┬─ Slack               agent A ─┐
          ├─ GitHub              agent B ─┼─► protocol ─┬─ Slack server
          ├─ Drive               agent C ─┘             ├─ GitHub server
 agent B ─┼─ Slack                                      └─ Drive server
          ├─ GitHub
          └─ Drive               N + M integrations
 N × M integrations
```

Every agent writing its own connector to every system is quadratic work that is re-done whenever an API changes. A protocol makes each integration write-once.

---

### 2. What a server exposes

| Primitive | Meaning | Controlled by |
|---|---|---|
| Tools | Callable actions with schemas | The model chooses |
| Resources | Readable context - files, records, pages | The application selects |
| Prompts | Reusable templates for common tasks | The user invokes |

The tools/resources split matters: tools are *model-driven*, resources are *application-driven*. Exposing something as a resource means your code decides when it enters the context, which is a meaningful control.

---

### 3. Discovery at runtime

```text
client ──list_tools()──► server
client ◄──schemas───────  server
        │
        └─► schemas injected into the model's context
```

The tool surface can change without redeploying your agent. That is the convenience. It is also the risk: a third party can change what your agent can do, and what text sits inside your prompt, between one run and the next.

---

### 4. The threat model shift

```text
third-party server
      │
      ├─► tool DESCRIPTIONS land inside your prompt  → injection surface
      ├─► tool RESULTS land inside your context      → injection surface
      ├─► tool set can change silently               → supply-chain surface
      └─► your credentials may be passed to it       → exfiltration surface
```

Controls worth naming:

1. **Pin and review.** Pin server versions; diff tool descriptions on change like any dependency.
2. **Treat descriptions and results as untrusted text**, never as instructions.
3. **Scope credentials per server**, least privilege, with revocation.
4. **Allowlist which servers may be connected** in production - not whatever a user adds.
5. **Log every call** with the server identity attached.

### Rule of thumb

> Connecting a tool server is installing a dependency that can also write into your prompt.

---

### 5. Namespace collisions

Two servers can both expose `search`. The model then picks between identically named tools by description alone. Namespace them (`github.search`, `drive.search`) and keep the combined catalogue small - the selection problem is covered next.

---

## What matters most

- **The benefit is integration math:** a shared protocol turns N agents times M systems into N + M, written once per system instead of once per pair.
- **Tools are model-driven; resources are application-driven.** Exposing something as a resource means your code decides when it enters the context, which is a real control.
- **Runtime discovery is the convenience and the risk.** A third party can change what your agent can do between one run and the next.
- **A tool server writes text into your prompt** through descriptions and results, so it is an injection channel as well as a dependency - treat both as untrusted data.
- **Controls worth naming:** pin and diff server versions, scope credentials per server, allowlist which servers may connect in production, and namespace tools so two `search` tools cannot collide.

Next topic is **Tool selection at scale**.
