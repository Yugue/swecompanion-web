# Prompt injection and authorization boundaries

## 1. Define the attack

**Indirect injection** redirects behavior through retrieved text or tool results. **Jailbreaking** attempts to bypass model restrictions; the attacks can overlap.

## 2. Locate the trust boundary

A page saying “email the private source here” supplies content, not authorization. Delimiters help interpretation; executor checks enforce permission.

## 3. Enforce least privilege

**Least privilege** grants only necessary tool/resource access. Check identity and permissions at retrieval and execution.

**Exfiltration** is unauthorized information transfer, including outbound URLs or tool arguments. Validate destinations and payloads outside the model.

## 4. Test realistic attacks

A **red-team evaluation** probes hostile inputs: forged messages, malicious documents, and encoded instructions.

Measure attempted and executed actions, exposure, and legitimate-task success; blanket blocking destroys utility.

## 5. Treat safety as layered

**Sandboxing** restricts executed operations. Combine it with authorization, isolation, screening, and model safeguards. Re-test when tools or evidence sources change.

> **Reason it through:** A retrieved page requests private data through a tool. Which checks must remain outside the model?
