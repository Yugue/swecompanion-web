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

## What you should say in an interview

For "what changes when tool definitions are fetched at runtime from a server you don't control?":

> Two things move. First, availability and behavior become someone else's deploy: the tool set can change between runs, so I pin server versions and diff tool descriptions on change, exactly like a package dependency. Second, and more seriously, that server now writes text into my prompt. Tool descriptions and tool results both land in the model's context, so a malicious or compromised server has a direct injection channel - it doesn't need to exploit anything, it just describes a tool persuasively. So I treat descriptions and results as untrusted data, scope credentials per server with least privilege, allowlist which servers may be connected in production rather than letting users add arbitrary ones, and require approval for irreversible actions regardless of which server offered the tool. The integration-math benefit is real - it turns N times M connectors into N plus M - but it's a supply-chain decision, not just a convenience.

Next topic is **Tool selection at scale**.
