// Study data for the "Agentic AI Development" domain, written to match the shape and voice of
// `mlStudyData.ts` (the Deep Learning / Neural Networks track). As with `amlStudyData.ts`, this
// file is hand-authored and deliberately independent of the generated deep-learning data - the
// shared component props are structural, not nominal.
//
// Quiz questions AND answers are premium content, served only from Firestore
// (quizzes/{quizId}, gated by firestore.rules) - only the count is public here.

export interface AgenticTopic {
  id: string;
  title: string;
  summary: string;
  keyPoints: string[];
  interviewPrompt: string;
  code?: string;
}

export interface AgenticPart {
  id: string;
  number: string;
  title: string;
  description: string;
  color: string;
  icon: string;
  topics: AgenticTopic[];
  quizQuestionCount: number;
}

export const agenticParts: AgenticPart[] = [
  {
    id: "foundations",
    number: "1",
    title: "From model call to bounded agent",
    description: "What makes a system agentic, how its execution loop works, and when autonomy is worth its cost.",
    color: "#4285F4",
    icon: "Blocks",
    topics: [
      {
        id: "what-is-an-agent",
        title: "What an agent actually is",
        summary:
          "An agent is a language model placed in a loop where it chooses its own actions, observes the results, and decides when it is done.",
        keyPoints: [
          "A model call maps input to output. An agent adds actions, a loop, and stopping conditions, so the model can choose the next step at runtime.",
          "The defining property is not intelligence but **delegated control**: the sequence of steps is not written by the engineer in advance.",
          "The runtime still owns permissions, validation, budgets, and execution; the model only proposes decisions inside that boundary.",
          "Autonomy is a dial: action breadth, loop length, and approval requirements can be tuned independently.",
        ],
        interviewPrompt:
          "Draw the boundary: at what exact point does a retrieval-augmented chatbot become an agent, and what does that change about how you test it?",
        code: "while not done:  action = model(context); observation = run(action); context += observation",
      },
      {
        id: "llm-capabilities-and-limits",
        title: "What the underlying model gives you",
        summary:
          "The model supplies language and judgment; tools supply live facts, computation, storage, and checked actions.",
        keyPoints: [
          "Models provide language understanding and judgment; tools provide live facts, exact computation, storage, and external actions.",
          "A model has no guaranteed truth, persistent memory, or authority beyond the context and actions supplied by the runtime.",
          "Missing information can become a plausible invention, so absence must be explicit and important values must be verified.",
          "Before adding orchestration, ask whether one capable call with complete evidence could solve the task at all.",
        ],
        interviewPrompt:
          "Your agent hallucinates order IDs when the retrieval step returns nothing. Where do you fix it, and why not in the prompt?",
        code: "capability ceiling = base model  |  scaffolding = how close you get to it",
      },
      {
        id: "agent-loop",
        title: "The agent loop",
        summary:
          "Decide → act → observe, repeated until success, budget, or safety conditions stop the run; nearly every agent framework is a variation on this loop.",
        keyPoints: [
          "One iteration: the model reads the context, emits either a tool call or a final answer, the runtime executes it, and the observation is appended.",
          "Three stopping conditions must always exist: the model declares completion, a step/token/cost budget is exhausted, or a guardrail halts it.",
          "The runtime validates, authorizes, executes, and records each requested action; the model never performs the action directly.",
          "Failures often look like progress: repeated calls, ignored observations, goal drift, or confident completion with nothing done.",
        ],
        interviewPrompt:
          "Your agent hits the 25-step cap on 8% of runs. Walk through how you would diagnose whether that is a prompt, tool, or task-scoping problem.",
        code: "for step in range(MAX_STEPS): ...  # the cap is a safety net, not a design",
      },
      {
        id: "context-window",
        title: "The context window as working memory",
        summary:
          "The context window is the agent's entire working memory, refilled from scratch on every call, and it is the scarcest resource in the system.",
        keyPoints: [
          "Each call receives an assembled window of instructions, tool descriptions, task state, recent history, evidence, and the current request.",
          "More context is not always better: irrelevant material adds cost and makes useful facts harder to identify.",
          "Keep structured task state separate from the transcript so the current truth does not have to be reconstructed from conversation.",
          "Treat the window as a budget and define what can be dropped, summarized, externalized, or must remain exact.",
        ],
        interviewPrompt:
          "A 40-step agent run is 12x more expensive than you modelled. Explain where the tokens went before you propose a fix.",
        code: "tokens_turn_n ≈ system + tools + Σ(all prior steps)  → cost grows superlinearly",
      },
      {
        id: "prompting-for-agents",
        title: "System prompts and instruction hierarchy",
        summary:
          "An agent's system prompt is a persistent policy - role, tools, rules, and stopping conditions - not a one-off request.",
        keyPoints: [
          "Separate role, goal, behavioral rules, tool guidance, and completion conditions.",
          "Write observable rules, such as asking for an identifier after an empty lookup.",
          "Follow the platform's instruction hierarchy; retrieved content is evidence, not authority to change the task.",
          "Use focused examples for recurring ambiguity, and enforce permissions in the runtime.",
        ],
        interviewPrompt:
          "Rewrite a vague agent instruction - \"be helpful and accurate\" - into three rules you could write an eval for.",
        code: "policy + goal + tool guidance + observable completion",
      },
      {
        id: "structured-output",
        title: "Structured output and schemas",
        summary:
          "Agents act through machine-readable output, so schema adherence is the interface contract between the model and your code.",
        keyPoints: [
          "Formatting requests, JSON syntax constraints, and schema constraints provide different structural checks.",
          "Valid structure does not prove a value is true or an action occurred.",
          "Represent unknown, blocked, and incomplete states explicitly.",
          "Handle refusal/truncation, validate domain meaning, and authorize before execution.",
        ],
        interviewPrompt:
          "Constrained decoding guarantees valid JSON. Name two classes of bug it does not prevent.",
        code: "response_format={\"type\": \"json_schema\", \"schema\": {...}}  # shape, not truth",
      },
      {
        id: "task-contracts",
        title: "Defining the agent task contract",
        summary:
          "A task contract bounds the goal, trusted inputs, permissions, success criteria, budgets, and escalation path before implementation begins.",
        keyPoints: [
          "Describe an observable outcome without prescribing a framework or implementation.",
          "Name authoritative sources and define what happens when required input is missing or conflicting.",
          "Separate permission to read, propose, and execute; a useful investigation agent may remain entirely read-only.",
          "Define successful partial outcomes, cost and time limits, and who owns the task after escalation.",
        ],
        interviewPrompt:
          "Turn the request \"build an agent that handles order delays\" into a bounded task contract before proposing an architecture.",
        code: "contract = {goal, inputs, scope, success, limits, escalation}",
      },
      {
        id: "workflows-vs-agents",
        title: "Workflows versus autonomous agents",
        summary:
          "Most production systems are workflows with agentic steps, not autonomous agents - and that is usually the right architecture.",
        keyPoints: [
          "Common workflow shapes: prompt chaining, routing to a specialist, parallel voting, and evaluator-optimizer loops.",
          "A workflow's control flow is code, so it is testable, observable, and bounded by construction.",
          "Put autonomy only where the path is genuinely unknown, and wrap it in a deterministic shell.",
          "Hybrid is the norm: a fixed pipeline whose third stage is an agent with three tools and a ten-step cap.",
        ],
        interviewPrompt:
          "Take an autonomous agent design and convert the 70% that is predictable into a workflow. What's left?",
        code: "route → [agent step] → validate → format   # autonomy in one bounded stage",
      },
      {
        id: "when-not-to-use-an-agent",
        title: "When not to build an agent",
        summary:
          "Use a single call or workflow when it meets the task; add adaptive action selection only where it earns its cost.",
        keyPoints: [
          "Prefer a workflow when the task decomposes the same way every time - it is cheaper, faster, debuggable, and testable with ordinary methods.",
          "Prefer a single model call when the task is one transformation: classify, extract, rewrite, summarize.",
          "Agents earn their cost when the path is genuinely data-dependent, the step count is unknown, and recovering from failure requires judgment.",
          "The honest cost of autonomy: non-determinism, variable latency, variable spend, and a much larger failure surface.",
        ],
        interviewPrompt:
          "A PM wants an agent to \"process invoices.\" Ask the three questions that decide whether this should be an agent at all.",
        code: "known steps → workflow   |   unknown steps + judgment → agent",
      },
    ],
    quizQuestionCount: 11,
  },
  {
    id: "tool-use",
    number: "2",
    title: "Tool use and function calling",
    description: "How a model reaches the outside world, and how tool design decides whether it succeeds.",
    color: "#EA4335",
    icon: "Wrench",
    topics: [
      {
        id: "function-calling",
        title: "Function calling mechanics",
        summary:
          "The model does not execute anything: it emits a structured request naming a tool and its arguments, and your runtime decides what actually happens.",
        keyPoints: [
          "Tool definitions supply the model with available operations and argument contracts.",
          "The model selects and requests; the runtime validates, authorizes, and executes.",
          "Bind each observation to its call ID, including out-of-order results.",
          "Use authenticated session state for permissions, independently of model output.",
        ],
        interviewPrompt:
          "Where in a function-calling system do you enforce that a user can only read their own records - and why can't that live in the prompt?",
        code: "call = model(ctx)  →  authorize(call)  →  execute(call)  →  observe",
      },
      {
        id: "tool-design",
        title: "Designing tools a model can use",
        summary:
          "Clear operations, arguments, effects, and observations make tools easier to select and use correctly.",
        keyPoints: [
          "Name and describe tools for the model's decision, not for your codebase: say when to use it and when not to.",
          "Too granular and the agent burns steps orchestrating primitives; too coarse and it cannot express what the user wants.",
          "Make arguments hard to get wrong: enums over free text, explicit units, required fields the model can actually know.",
          "Return observations the model can act on - a compact, relevant result beats a full API payload that floods the context.",
        ],
        interviewPrompt:
          "Your agent calls `search` five times with near-identical queries. Give two tool-design changes that fix it without touching the prompt.",
        code: "good: book_flight(origin, dest, date)   bad: http_request(url, method, body)",
      },
      {
        id: "tool-errors",
        title: "Errors, retries, and idempotency",
        summary:
          "Tool failure is the normal case, and how the error is worded determines whether the agent recovers or spirals.",
        keyPoints: [
          "Return concise errors naming the cause, correction, and retry policy.",
          "Distinguish transient failures, invalid input, missing records, and denied operations.",
          "Use stable operation IDs/idempotency and external status checks for uncertain writes.",
          "Bound retries and report partial, failed, and unknown outcomes separately.",
        ],
        interviewPrompt:
          "A payment tool times out but the payment succeeded. Describe what your agent should do and what the tool must provide for that to be safe.",
        code: "same logical operation → same key → reconcile before retry",
      },
      {
        id: "parallel-and-sequential-tools",
        title: "Parallel and sequential calls",
        summary:
          "Independent tool calls should run concurrently; dependent ones must not, and telling them apart is a planning decision.",
        keyPoints: [
          "Run ready independent calls together to reduce waiting.",
          "Wait when arguments depend on a previous observation.",
          "Conflicting shared writes need ordering or a concurrency protocol.",
          "Bind results by call ID, retain per-call failures, and cap concurrency.",
        ],
        interviewPrompt:
          "The model emits three tool calls in one turn, and the third needs the second's output. What went wrong and where do you fix it?",
        code: "results = await gather(*[run(c) for c in calls])  # only if truly independent",
      },
      {
        id: "code-execution",
        title: "Code execution as a universal tool",
        summary:
          "Giving an agent a sandbox turns an open-ended set of operations into one tool, trading a huge capability gain for a real security surface.",
        keyPoints: [
          "Code expresses calculations and transformations without a separate tool for each operation.",
          "Computation can stay outside context, returning compact results and artifact references.",
          "Enforce scoped files, permissions, network access, resources, and output limits.",
          "Check result correctness independently; successful execution is not proof of a correct task.",
        ],
        interviewPrompt:
          "Argue both sides: why a code tool is safer than twenty narrow tools, and why it is far more dangerous.",
        code: "run_python(src, net=False, fs=scratch_dir, timeout=30s, mem=512MB)",
      },
      {
        id: "mcp",
        title: "Tool servers and the Model Context Protocol",
        summary:
          "MCP gives applications and capability servers a common interface for tools, resources, and prompts.",
        keyPoints: [
          "Hosts coordinate clients connecting to servers; servers expose supported capabilities.",
          "A shared interface reduces adapter duplication, while testing and system-specific work remain.",
          "Review discovered tools and capability changes as dependencies.",
          "Scope access and credentials; the protocol does not replace authorization.",
        ],
        interviewPrompt:
          "What changes about your threat model when tool definitions are fetched at runtime from a server you don't control?",
        code: "client.list_tools()  →  schemas injected into context  →  model selects",
      },
      {
        id: "tool-selection-at-scale",
        title: "Tool selection at scale",
        summary:
          "Large tool menus can consume context and confuse selection; evaluate consolidation, routing, and candidate retrieval.",
        keyPoints: [
          "Symptoms of too many tools: near-duplicate tools chosen at random, and steadily rising selection latency and cost.",
          "Retrieve a small candidate set per turn by embedding the task against tool descriptions, then expose only those schemas.",
          "Alternatively group tools behind a namespace or route to a subagent that owns one domain's tools.",
          "Measure selection separately from task success - a tool-choice accuracy metric localizes the failure immediately.",
        ],
        interviewPrompt:
          "You have 300 internal APIs and want one agent over all of them. Design the tool layer.",
        code: "candidates = retrieve(task, tool_index, k=12)  # then expose only those schemas",
      },
    ],
    quizQuestionCount: 10,
  },
  {
    id: "reasoning",
    number: "3",
    title: "Reasoning and planning",
    description: "How agents decide what to do next, and what actually improves that decision.",
    color: "#FBBC04",
    icon: "GitBranch",
    topics: [
      {
        id: "chain-of-thought",
        title: "Chain of thought and its limits",
        summary:
          "Intermediate reasoning can help dependent steps, but evidence and verification remain separate requirements.",
        keyPoints: [
          "Additional computation can carry intermediate results into a later decision.",
          "Measure gains by task/model; extra reasoning is not universally helpful.",
          "Generated explanations are not faithful audit logs; retain observable evidence and operations.",
          "Account for additional usage and latency under the actual interface.",
        ],
        interviewPrompt:
          "Your agent's stated reasoning contradicts the tool call it then makes. What does that tell you, and what does it not?",
        code: "think first → then act   (cost: latency + tokens on every turn)",
      },
      {
        id: "react",
        title: "ReAct: interleaving reasoning and acting",
        summary:
          "ReAct interleaves decisions, actions, and observations so current evidence can inform the next step.",
        keyPoints: [
          "Read an observation, identify the next evidence need, and choose an allowed action.",
          "Fresh evidence can confirm or change a plan; verify its source and meaning.",
          "Independent actions can be batched without abandoning interleaving.",
          "Track progress and budgets to prevent locally sensible wandering.",
        ],
        interviewPrompt:
          "Contrast ReAct with plan-then-execute on a task where step 3 reveals step 1 was wrong.",
        code: "Thought: need the order date → Action: get_order(id) → Observation: {...} → Thought: ...",
      },
      {
        id: "planning-strategies",
        title: "Planning strategies",
        summary:
          "The real choice is how much structure you fix before execution, and it is set by how predictable the environment is.",
        keyPoints: [
          "Plan-then-execute produces an explicit step list first: auditable, parallelizable, and easy to show a human for approval.",
          "Interleaved planning decides one step at a time: robust to surprises, harder to review or bound.",
          "Hierarchical planning splits the difference - a stable high-level plan, with tactics chosen at execution time.",
          "Replanning needs an explicit trigger (a failed step, a contradicted assumption) or the agent silently drifts from its own plan.",
        ],
        interviewPrompt:
          "When is an up-front plan actively harmful? Give a concrete task where it costs you.",
        code: "stable env → plan first   |   noisy env → plan one step ahead",
      },
      {
        id: "task-decomposition",
        title: "Task decomposition and dependency graphs",
        summary:
          "A useful decomposition turns an open goal into verifiable artifacts with explicit dependencies, without assuming the work needs multiple agents.",
        keyPoints: [
          "Every subtask should produce a named artifact with an observable completion rule.",
          "Explicit dependencies reveal which work can run in parallel and which steps must wait.",
          "Choose granularity that reduces complexity rather than creating more coordination overhead than useful work.",
          "Map every requirement to one owner and define the observations that trigger replanning.",
        ],
        interviewPrompt:
          "Decompose a market-research task into artifacts and dependencies, then identify what can run in parallel.",
        code: "ready(step) = all(dep.status == done for dep in step.depends_on)",
      },
      {
        id: "reflection",
        title: "Reflection and self-critique",
        summary:
          "Review an artifact against criteria and evidence, then revise within a measured budget.",
        keyPoints: [
          "Tests, sources, and explicit criteria make critiques checkable.",
          "Ungrounded self-critique can help or hurt; measure final outcomes.",
          "Evaluate the artifact rather than relying on the actor's justification.",
          "Bound revision, and use retrieval or computation when those address the actual gap.",
        ],
        interviewPrompt:
          "Design a reflection step that would have caught a real bug, and explain what makes the critic better informed than the actor.",
        code: "draft → run tests → critique(draft, test_output) → revise   (max 2 rounds)",
      },
      {
        id: "search-over-actions",
        title: "Sampling and search over actions",
        summary:
          "When a solution is hard to find but easy to check, spend test-time compute exploring several candidates and keep the one that verifies.",
        keyPoints: [
          "Best-of-N samples several attempts and selects with a verifier; the verifier's quality, not N, sets the ceiling.",
          "Tree search over action sequences helps when steps are reversible and states are cheap to evaluate.",
          "Real environments make search expensive: irreversible side effects and slow tools mean you often cannot backtrack.",
          "Cheap verifiers - unit tests, type checks, schema validation - are what make this pattern economical.",
        ],
        interviewPrompt:
          "Best-of-5 with an LLM judge helps on code and not on customer emails. Explain the asymmetry.",
        code: "candidates = [gen() for _ in range(N)];  best = max(candidates, key=verify)",
      },
      {
        id: "reasoning-models",
        title: "Reasoning models and thinking budgets",
        summary:
          "Reasoning models are trained to spend variable test-time compute before answering, which shifts effort from prompt engineering to budget allocation.",
        keyPoints: [
          "Additional effort can improve difficult decisions; compare gains, latency, and usage.",
          "Treat effort settings as tunable choices for each task type.",
          "Evaluate faster routes for routine steps and stronger routes for difficult decisions.",
          "Controls and accounting vary by interface; clear evidence and goals remain essential.",
        ],
        interviewPrompt:
          "Your agent is accurate but too slow. Show how you would decide which steps deserve a reasoning model.",
        code: "model = REASONER if task.is_hard else FAST  # measure, don't guess",
      },
    ],
    quizQuestionCount: 10,
  },
  {
    id: "memory-and-retrieval",
    number: "4",
    title: "Memory, context, and retrieval",
    description: "Getting the right information into a finite window, and keeping it there across turns and sessions.",
    color: "#34A853",
    icon: "Layers",
    topics: [
      {
        id: "context-engineering",
        title: "Context engineering",
        summary:
          "Assemble the evidence, state, and tools needed for each decision within a deliberate input budget.",
        keyPoints: [
          "Every turn is assembled: instructions, tool schemas, retrieved evidence, history, current state - each with a token budget.",
          "Relevance beats volume. Irrelevant context measurably lowers accuracy, so adding \"just in case\" material has a real cost.",
          "Put stable content first so prefix caching can hit, and volatile content last.",
          "Define an eviction policy up front: what gets summarized, what gets dropped, what is never dropped.",
        ],
        interviewPrompt:
          "You have 100k tokens of potentially relevant docs and a 32k budget. Describe your selection policy, not your retriever.",
        code: "context = system + tools + selected_evidence + compacted_history + state",
      },
      {
        id: "rag-for-agents",
        title: "Retrieval as a tool",
        summary:
          "Retrieval brings evidence into context; an agent can adapt the next lookup after reading results.",
        keyPoints: [
          "Agentic retrieval issues its own queries, reads the results, and reformulates - which fixes the single-shot query's blind spots.",
          "It costs more calls, so a cheap pre-retrieval step is still right for simple lookup questions.",
          "Always return provenance with the content; without it, the agent cannot cite and you cannot debug.",
          "If retrieval finds nothing, say so explicitly - an empty observation is where hallucination starts.",
        ],
        interviewPrompt:
          "When does fixed retrieval meet the task better than an adaptive search loop? Compare evidence coverage and cost.",
        code: "search(q) → read → refine q → search again  (vs. one shot before generation)",
      },
      {
        id: "chunking-and-indexing",
        title: "Chunking and indexing",
        summary:
          "Chunk boundaries decide which facts and exceptions arrive together when evidence is retrieved.",
        keyPoints: [
          "Split on document structure - sections, functions, table rows - before falling back to fixed sizes.",
          "Too small loses the context that makes a passage interpretable; too large dilutes the embedding and wastes the window.",
          "Overlap preserves facts that straddle a boundary; prepend section titles so orphan chunks stay self-describing.",
          "Index the metadata you will filter on - date, source, tenant, permissions - because filtering usually beats a better embedding.",
        ],
        interviewPrompt:
          "Retrieval keeps missing an answer you can see in the corpus. Walk through your diagnosis in order.",
        code: "chunk = title + breadcrumb + body   # so it stands alone when retrieved",
      },
      {
        id: "embeddings-and-search",
        title: "Embeddings, hybrid search, and reranking",
        summary:
          "Dense and lexical retrieval provide different signals; compare hybrid search and reranking on actual queries.",
        keyPoints: [
          "Embeddings map text to vectors for learned similarity.",
          "Lexical or structured lookup can help with rare identifiers that dense search misses.",
          "Fusion combines candidates; pairwise reranking orders a selected shortlist.",
          "Measure candidate recall, top-rank quality, and grounded answer outcomes separately.",
        ],
        interviewPrompt:
          "Why does a cross-encoder rerank the top 50 instead of the whole corpus?",
        code: "recall: hybrid top-100  →  precision: rerank  →  context: top-5",
      },
      {
        id: "agent-memory",
        title: "Short-term and long-term memory",
        summary:
          "Within a run, memory is the transcript; across runs, it is an explicit store you write to and read from deliberately.",
        keyPoints: [
          "Working memory is the current context. Episodic memory records what happened in past sessions. Semantic memory holds durable facts about the user or domain.",
          "Nothing persists unless you write it, so define write triggers as carefully as read ones.",
          "Retrieve memory selectively by relevance - loading a user's entire history defeats the purpose.",
          "Memory needs a lifecycle: correction, expiry, and deletion on request, or stale facts silently poison future runs.",
        ],
        interviewPrompt:
          "A user changes their address. Describe how it propagates through your memory store, including what happens to the old value.",
        code: "write: explicit + typed   |   read: retrieved by relevance, not dumped",
      },
      {
        id: "summarization-and-compaction",
        title: "Summarization and compaction",
        summary:
          "Long runs need the transcript compressed in place, and what you choose to keep verbatim is the whole design.",
        keyPoints: [
          "Compact when the window crosses a threshold: replace old turns with a structured summary of decisions, findings, and open items.",
          "Keep identifiers, file paths, exact values, and user constraints verbatim - these are what summaries destroy.",
          "Summaries compound: each round loses detail, so compact from the original transcript when you still can.",
          "Externalize instead of summarizing when possible - write state to a file or scratchpad and keep only a pointer in context.",
        ],
        interviewPrompt:
          "Your agent forgets a constraint the user gave at turn 2 after compaction at turn 40. Give two structural fixes.",
        code: "summary = {goal, constraints, decisions, artifacts, open_questions}",
      },
      {
        id: "state-and-sessions",
        title: "State and session management",
        summary:
          "The durable state of an agent run is a resumable record of what happened - not whatever happens to be in the context window.",
        keyPoints: [
          "Persist the run: steps, tool calls, observations, artifacts, and a status - so a crash resumes instead of restarting.",
          "Separate conversation state from task state; the second is what other systems and humans actually need.",
          "Make state inspectable and editable - a human should be able to correct a fact and let the run continue.",
          "Scope state by tenant and user from the start; retrofitting isolation onto a shared store is painful.",
        ],
        interviewPrompt:
          "An agent run crashes at step 18 of 30. What must have been persisted for a resume to be correct rather than merely possible?",
        code: "run = {id, goal, steps[], artifacts[], status}  # context is derived from this",
      },
    ],
    quizQuestionCount: 10,
  },
  {
    id: "multi-agent",
    number: "5",
    title: "Multi-agent systems",
    description: "When more than one agent helps, how they coordinate, and how coordination fails.",
    color: "#A78BFA",
    icon: "Network",
    topics: [
      {
        id: "single-vs-multi-agent",
        title: "When multi-agent pays for itself",
        summary:
          "Multiple agents buy parallelism and context isolation; they cost coordination, latency variance, and a much harder debugging story.",
        keyPoints: [
          "Parallel work, context isolation, capabilities, or permission scopes can justify separation.",
          "Role labels alone do not prove an advantage over a focused single-agent design.",
          "Budget worker setup, briefs, coordination, and merging against any avoided context processing.",
          "Start from a simpler baseline and split along a measured bottleneck.",
        ],
        interviewPrompt:
          "Make the case against the three-agent design someone just proposed, then say what would change your mind.",
        code: "split for: parallelism, context isolation   |   not for: vibes, personas",
      },
      {
        id: "orchestrator-worker",
        title: "The orchestrator-worker pattern",
        summary:
          "One agent owns the goal and delegates bounded subtasks to workers that return compact results.",
        keyPoints: [
          "The orchestrator keeps the goal and dependencies; workers receive relevant task context.",
          "Briefs define outputs, constraints, budgets, and how to report blockers or request clarification.",
          "Return compact findings, sources, artifacts, and gaps rather than full transcripts.",
          "Validate and reconcile results against the original goal.",
        ],
        interviewPrompt:
          "Write the brief you'd hand a worker for one subtask of a market-research agent, and say what you deliberately left out.",
        code: "orchestrator: decompose → dispatch → merge   |   worker: narrow goal → findings",
      },
      {
        id: "agent-communication",
        title: "Handoffs and shared state",
        summary:
          "Agents coordinate either by passing messages or by sharing a workspace, and the choice decides your failure modes.",
        keyPoints: [
          "Messages make handoffs explicit but can omit required context.",
          "Shared state needs ownership, access controls, and version-checked updates.",
          "Transfer goal, constraints, sources, unresolved questions, and prior attempts.",
          "Typed fields, task IDs, deadlines, and deduplication make coordination testable.",
        ],
        interviewPrompt:
          "Two agents edit the same file in a shared workspace. Design the minimum coordination that makes this safe.",
        code: "handoff = {goal, constraints, findings, already_tried, deliverable}",
      },
      {
        id: "context-isolation",
        title: "Context isolation across agents",
        summary:
          "The main engineering benefit of subagents is that each gets a clean window, which only works if the boundary is enforced.",
        keyPoints: [
          "Compact worker returns reduce material repeatedly carried in the parent's active context.",
          "Compare avoided parent input with worker and coordination costs.",
          "Separate contexts need enforced runtime permissions to become a privilege boundary.",
          "Share essential constraints and validate findings at the handoff.",
        ],
        interviewPrompt:
          "Estimate when isolated worker context reduces total cost, and when coordination outweighs the savings.",
        code: "net savings = avoided parent processing - worker/coordination overhead",
      },
      {
        id: "coordination-failures",
        title: "How multi-agent systems fail",
        summary:
          "Coordination failures are quiet: the system produces a confident answer assembled from work that never fit together.",
        keyPoints: [
          "Duplicated work when briefs overlap; dropped work when they leave a gap neither agent owns.",
          "Error amplification - one agent's wrong finding becomes another's premise, and no one revisits it.",
          "Cost and latency blowups, because the slowest worker sets the wall clock and every worker pays full prompt overhead.",
          "Mitigations: explicit ownership per subtask, provenance on every finding, a merge step that checks for contradictions, and a global budget.",
        ],
        interviewPrompt:
          "Your multi-agent research system returns a fluent report with a fabricated statistic. Trace where that could have entered and what would have caught it.",
        code: "finding = {claim, source, agent_id, confidence}  # provenance survives the merge",
      },
    ],
    quizQuestionCount: 10,
  },
  {
    id: "evaluation-and-safety",
    number: "6",
    title: "Evaluation, reliability, and safety",
    description: "Measuring an agent that takes a different path every time, and containing what it can do.",
    color: "#22D3EE",
    icon: "ListChecks",
    topics: [
      {
        id: "agent-evaluation",
        title: "Evaluating agents",
        summary:
          "Measure verified task outcomes and observable process across repeated runs and representative cases.",
        keyPoints: [
          "Outcome metrics: task success, correctness of the final artifact, and whether required side effects actually happened.",
          "Process metrics: steps taken, tool-choice accuracy, tokens and cost per run, recovery after a failed call.",
          "Build the eval set from real traces; synthetic tasks miss the messy inputs that break agents.",
          "Non-determinism is a measurement problem - run each case several times and report pass rate, not a single pass/fail.",
        ],
        interviewPrompt:
          "An agent passes 92% of your eval set and users complain constantly. Give three reasons your eval is lying.",
        code: "report per-run success, repeated-run consistency, critical slices, and cost/latency",
      },
      {
        id: "trajectory-analysis",
        title: "Trajectory analysis",
        summary:
          "Observable calls, results, and state transitions show where a run first departed from supported behavior.",
        keyPoints: [
          "Score the path, not just the endpoint: was every step necessary, grounded, and in a sensible order?",
          "Compare against a reference trajectory when one exists, but allow legitimately different correct paths.",
          "Look for the standard pathologies: loops, oscillation, ignored observations, and premature completion.",
          "Localize failure to a step - retrieval, selection, argument synthesis, or interpretation - before changing anything.",
        ],
        interviewPrompt:
          "Given a failed 30-step trace, describe your reading order and the first thing you look for.",
        code: "for step in trace: check(grounded?, necessary?, used_observation?)",
      },
      {
        id: "llm-as-judge",
        title: "LLM-as-judge",
        summary:
          "A model can grade open-ended output at scale, but only once its judgments have been shown to agree with human ones.",
        keyPoints: [
          "Define concrete rubric criteria and require evidence for verdicts.",
          "Check position, length, style, and correlated model biases.",
          "Compare pairwise and categorical scoring; randomize order and allow ties.",
          "Validate with independent human labels, then recheck after judge or rubric changes.",
        ],
        interviewPrompt:
          "How would you establish that your judge is trustworthy - and what number do you report?",
        code: "judge(A, B, rubric) → winner   # randomized order, validated vs. human labels",
      },
      {
        id: "failure-modes",
        title: "Characteristic failure modes",
        summary:
          "Agent failures repeat across systems, and recognizing them by name turns debugging into diagnosis.",
        keyPoints: [
          "Looping: identical calls repeated because the observation never changed the model's belief.",
          "Hallucinated tools and arguments: plausible names and IDs the schema cannot rule out.",
          "Error cascades: one wrong intermediate fact becomes the premise for every later step.",
          "Premature completion and goal drift: stopping with nothing done, or quietly solving an easier adjacent problem.",
        ],
        interviewPrompt:
          "Name the failure: the agent calls `get_status(id)` six times with the same id and then reports success.",
        code: "detect: repeated (tool, args) hash → break loop, surface to human",
      },
      {
        id: "guardrails",
        title: "Guardrails and permissioning",
        summary:
          "Check inputs, operations, and outputs; enforce critical permissions independently of model suggestions.",
        keyPoints: [
          "Validate inputs and outputs, and check every tool operation before execution.",
          "Use scoped access, destinations, resource limits, and trusted session identity.",
          "Choose review or execution controls based on impact, reversibility, sensitivity, and policy.",
          "Test enforcement directly, including unavailable checks, stale approval, and duplicate requests.",
        ],
        interviewPrompt:
          "Your agent can send email. List every control you'd put between the model's decision and the message leaving.",
        code: "proposal → validate → authorize/review if required → execute → confirm",
      },
      {
        id: "prompt-injection",
        title: "Prompt injection and untrusted content",
        summary:
          "Untrusted content can try to redirect an agent; source distinctions need independent permission enforcement.",
        keyPoints: [
          "Indirect injection arrives through retrieved documents, messages, repositories, or tool payloads.",
          "Private data plus an unauthorized outbound path creates disclosure risk; injection can also corrupt results or memory.",
          "Restrict data, tools, and destinations; validate findings crossing context boundaries.",
          "Instruction hierarchy and source labeling are layers, not substitutes for runtime controls.",
        ],
        interviewPrompt:
          "A support agent reads customer emails and can call an HTTP tool. Show the exfiltration path and close it.",
        code: "untrusted read → low-privilege context → no secrets, no open egress",
      },
      {
        id: "human-in-the-loop",
        title: "Human-in-the-loop design",
        summary:
          "Place human review where the cost of being wrong is high and the cost of checking is low - and make the review genuinely reviewable.",
        keyPoints: [
          "Gate on irreversibility and blast radius, not on model confidence, which is poorly calibrated.",
          "Show the human the action and its justification in a form they can evaluate in seconds.",
          "Too many approvals produce rubber-stamping, which is worse than no gate because it manufactures false assurance.",
          "Record every approval and override - that log is your best future eval set.",
        ],
        interviewPrompt:
          "Design the approval UX for an agent that files production changes. What exactly does the reviewer see?",
        code: "gate = f(reversibility, blast_radius)   # not f(model_confidence)",
      },
    ],
    quizQuestionCount: 10,
  },
  {
    id: "production",
    number: "7",
    title: "Production agentic systems",
    description: "Cost, latency, observability, and the end-to-end design answer an interviewer is listening for.",
    color: "#EC4899",
    icon: "Route",
    topics: [
      {
        id: "latency-and-cost",
        title: "Latency and token economics",
        summary:
          "An agent's cost is driven by steps times context size, so the biggest savings come from taking fewer steps with smaller windows.",
        keyPoints: [
          "Price each call's input/output and applicable cache, reasoning, tool, and infrastructure usage.",
          "Growing history can make later calls more expensive; reduce unnecessary repeated material.",
          "Evaluate routing and parallel ready work without assuming unchanged quality.",
          "Measure critical-path and tail latency, plus cost per successful task.",
        ],
        interviewPrompt:
          "Budget: $0.05 and 8 seconds per request. Walk through how you'd design backwards from that.",
        code: "cost ≈ steps × avg_context × price  →  attack the first two factors first",
      },
      {
        id: "caching",
        title: "Prompt caching and reuse",
        summary:
          "Reusing an unchanged prefix across turns cuts both cost and time to first token, and it dictates how you order the prompt.",
        keyPoints: [
          "Prefix matching, cache lifetime, and pricing depend on the serving interface.",
          "Keep reusable content stable where supported; measure the actual cached share.",
          "Cache suitable reads with tenant, access scope, versions, and freshness in the key.",
          "Validate permissions and track stale-result incidents alongside savings.",
        ],
        interviewPrompt:
          "Your cache hit rate is near zero despite a long fixed system prompt. Name the likely causes.",
        code: "[system][tools][static docs] ← cacheable prefix | [history][turn] ← volatile",
      },
      {
        id: "observability",
        title: "Tracing and observability",
        summary:
          "You cannot debug what you did not record; agent tracing means capturing every step with enough structure to query it.",
        keyPoints: [
          "One trace per run, one span per step, with prompt, model, tool call, observation, tokens, latency, and cost attached.",
          "Track cost and step count as first-class metrics - they detect degradation faster than quality metrics do.",
          "Version the prompt, tool schemas, and model in every trace, or you cannot attribute a regression.",
          "Redact secrets and personal data at capture time; traces are the most over-shared artifact in an agent system.",
        ],
        interviewPrompt:
          "Quality dropped after a deploy that changed three things. What in your traces lets you attribute it?",
        code: "span = {step, prompt_version, model, tool, args, obs, tokens, ms, cost}",
      },
      {
        id: "testing-and-replay",
        title: "Testing and replay",
        summary:
          "Non-determinism does not excuse untested agents - you test by mocking tools, replaying traces, and asserting on distributions.",
        keyPoints: [
          "Mock tools for deterministic unit tests of routing, argument construction, and error handling.",
          "Replay recorded traces against a new prompt or model to get a regression diff before deploying.",
          "Assert on properties, not exact strings: a required tool was called, no forbidden action occurred, cost stayed under budget.",
          "Run each eval case n times and gate on pass rate, so a flaky improvement cannot ship as a win.",
        ],
        interviewPrompt:
          "Write the three assertions you'd put in CI for a refund agent.",
        code: "assert called(\"verify_identity\") before called(\"issue_refund\")",
      },
      {
        id: "deployment-and-versioning",
        title: "Deployment and versioning",
        summary:
          "Prompts, tool schemas, and model choice are all production dependencies and need the same discipline as code.",
        keyPoints: [
          "Version prompts and tool definitions in source control and pin them per deployment.",
          "Model upgrades are breaking changes: re-run evals, because behavior shifts even when benchmarks improve.",
          "Roll out behind a flag with canary traffic, and watch cost and step count alongside quality.",
          "Keep rollback cheap - if reverting a prompt requires a full deploy, you will not do it quickly enough.",
        ],
        interviewPrompt:
          "A provider deprecates your model with 30 days' notice. Give your migration plan.",
        code: "config = {prompt@v7, tools@v3, model@pinned}  # canary, measure, roll forward",
      },
      {
        id: "continuous-improvement",
        title: "From traces to improvements",
        summary:
          "A production agent improves through a loop: traces reveal failures, failures become eval cases, and fixes are validated against them.",
        keyPoints: [
          "Cluster failures by mechanism, impact, frequency, and repair effort.",
          "Choose the cheapest layer that addresses the cause: tools, context, prompts, models, or training.",
          "Preserve representative regression cases and independent evaluation.",
          "Fine-tuning can improve stable task behavior and capabilities; compare its gains and maintenance cost with alternatives.",
        ],
        interviewPrompt:
          "You have 10,000 production traces and one engineer. Describe how you decide what to fix first.",
        code: "traces → cluster failures → eval case → fix → regression suite",
      },
      {
        id: "system-design-walkthrough",
        title: "An agentic system design answer",
        summary:
          "A complete design answer moves from the task, through the loop and the tools, to evaluation, cost, and failure containment.",
        keyPoints: [
          "Start with the task and the success criterion, then justify whether this needs an agent at all.",
          "Specify the loop: tools, stopping conditions, step budget, and what the context holds each turn.",
          "State the controls: permissions, approval gates, untrusted-content handling, and budget caps.",
          "Close with measurement and cost - eval set, online metrics, tokens and latency per run - and name the top failure mode.",
        ],
        interviewPrompt:
          "\"Design an agent that resolves customer refund requests end to end.\" Give the eight-minute version.",
        code: "task → agent? → loop + tools → context → guardrails → evals → cost → failure modes",
      },
      {
        id: "interview-playbook",
        title: "Answering agentic AI questions",
        summary:
          "The graded skill is narrowing a broad prompt to one concept and explaining it concretely - not listing every framework you have used.",
        keyPoints: [
          "Define the term in one sentence, then ask the clarifying question that forces the interviewer to pick a direction.",
          "Ground every claim in a mechanism: say what is in the context window, what the tool returns, what the loop does next.",
          "Name the tradeoff out loud - autonomy versus predictability, cost versus quality - and say when you would choose differently.",
          "Reach for the simpler architecture first; proposing an agent where a workflow suffices reads as inexperience.",
        ],
        interviewPrompt:
          "\"Tell me about agents.\" Produce the first 30 seconds of your answer, including the question you ask back.",
        code: "define → clarify → commit to one concept → mechanism → tradeoff",
      },
    ],
    quizQuestionCount: 10,
  },
];

export const agenticTopicsById: Record<string, AgenticTopic> = Object.fromEntries(
  agenticParts.flatMap((part) => part.topics.map((topic) => [topic.id, topic] as const))
);

export const agenticPartsById: Record<string, AgenticPart> = Object.fromEntries(
  agenticParts.map((part) => [part.id, part])
);

export const agenticPartIdForTopic: Record<string, string> = Object.fromEntries(
  agenticParts.flatMap((part) => part.topics.map((topic) => [topic.id, part.id] as const))
);

export const agenticTopicCount: number = agenticParts.reduce((sum, part) => sum + part.topics.length, 0);
