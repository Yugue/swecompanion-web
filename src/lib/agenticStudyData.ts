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
    title: "Agent foundations",
    description: "What makes a system an agent, what the underlying model can and cannot do, and when autonomy is the wrong answer.",
    color: "#4285F4",
    icon: "Blocks",
    topics: [
      {
        id: "what-is-an-agent",
        title: "What an agent actually is",
        summary:
          "An agent is a language model placed in a loop where it chooses its own actions, observes the results, and decides when it is done.",
        keyPoints: [
          "A model call maps prompt to text. An agent adds tools, a loop, and a stopping condition, so control flow is decided at runtime by the model.",
          "The defining property is not intelligence but **delegated control**: the sequence of steps is not written by the engineer in advance.",
          "A fixed chain of LLM calls is a workflow, not an agent - it is more predictable, cheaper, and usually the right default.",
          "Autonomy is a dial, not a switch: tool breadth, loop length, and how much the agent may do without approval are all independently tunable.",
        ],
        interviewPrompt:
          "Draw the boundary: at what exact point does a retrieval-augmented chatbot become an agent, and what does that change about how you test it?",
        code: "while not done:  action = model(context); observation = run(action); context += observation",
      },
      {
        id: "llm-capabilities-and-limits",
        title: "What the underlying model gives you",
        summary:
          "Everything an agent can do is bounded by the base model's instruction-following, reasoning, and tool-calling ability - scaffolding redistributes those limits rather than removing them.",
        keyPoints: [
          "Strengths you can rely on: language understanding, format adherence, broad prior knowledge, plausible decomposition of familiar tasks.",
          "Structural limits: no memory between calls, a frozen knowledge cutoff, no ground truth about the live world, and confident errors when the prompt underspecifies.",
          "The model predicts tokens, so it will happily invent a tool argument that looks right; the system, not the model, must make that safe.",
          "When an agent fails, first ask whether a single well-prompted model call would have succeeded - if not, no loop will save it.",
        ],
        interviewPrompt:
          "Your agent hallucinates order IDs when the retrieval step returns nothing. Where do you fix it, and why not in the prompt?",
        code: "capability ceiling = base model  |  scaffolding = how close you get to it",
      },
      {
        id: "prompting-for-agents",
        title: "System prompts and instruction hierarchy",
        summary:
          "An agent's system prompt is a persistent policy - role, tools, rules, and stopping conditions - not a one-off request.",
        keyPoints: [
          "Order of authority: system instructions, then developer/tool definitions, then user input, then **content retrieved from the world**, which is data and never an instruction.",
          "Write rules as observable behavior (\"ask before deleting\") rather than traits (\"be careful\") - the first is testable, the second is not.",
          "State the stopping condition explicitly; agents that never learn what \"done\" looks like either stop too early or loop.",
          "Few-shot examples steer format and tool-choice style far more reliably than adjectives, but they cost context on every turn.",
        ],
        interviewPrompt:
          "Rewrite a vague agent instruction - \"be helpful and accurate\" - into three rules you could write an eval for.",
        code: "system > developer/tools > user > retrieved content (data, never commands)",
      },
      {
        id: "context-window",
        title: "The context window as working memory",
        summary:
          "The context window is the agent's entire working memory, refilled from scratch on every call, and it is the scarcest resource in the system.",
        keyPoints: [
          "Every turn re-sends system prompt, tool schemas, history, and observations; cost and latency grow with the transcript, not with the task.",
          "Attention cost grows quadratically with sequence length, so a long transcript is slow before it is expensive.",
          "Relevant facts compete with irrelevant ones: a long, noisy context measurably degrades accuracy even when nothing is truncated.",
          "Treat the window as a budget with named line items - instructions, tools, retrieved evidence, history - and decide what gets evicted first.",
        ],
        interviewPrompt:
          "A 40-step agent run is 12x more expensive than you modelled. Explain where the tokens went before you propose a fix.",
        code: "tokens_turn_n ≈ system + tools + Σ(all prior steps)  → cost grows superlinearly",
      },
      {
        id: "structured-output",
        title: "Structured output and schemas",
        summary:
          "Agents act through machine-readable output, so schema adherence is the interface contract between the model and your code.",
        keyPoints: [
          "Prompted JSON is best-effort; constrained decoding masks invalid tokens at sampling time and makes malformed output structurally impossible.",
          "A schema guarantees shape, never truth - a well-formed JSON object can still contain a fabricated account number.",
          "Design schemas for recoverability: optional fields, an explicit `unknown` value, and a reason field beat a required field the model must guess.",
          "Always validate after parsing, and always define what the agent does when validation fails.",
        ],
        interviewPrompt:
          "Constrained decoding guarantees valid JSON. Name two classes of bug it does not prevent.",
        code: "response_format={\"type\": \"json_schema\", \"schema\": {...}}  # shape, not truth",
      },
      {
        id: "agent-loop",
        title: "The agent loop",
        summary:
          "Think → act → observe, repeated until a stopping condition fires; nearly every agent framework is a variation on this loop.",
        keyPoints: [
          "One iteration: the model reads the context, emits either a tool call or a final answer, the runtime executes it, and the observation is appended.",
          "Three stopping conditions must always exist: the model declares completion, a step/token/cost budget is exhausted, or a guardrail halts it.",
          "The context is append-only within a run, which is why step count, not task difficulty, drives cost.",
          "Failures of the loop look like progress: repeated identical calls, oscillation between two tools, or confident completion with nothing done.",
        ],
        interviewPrompt:
          "Your agent hits the 25-step cap on 8% of runs. Walk through how you would diagnose whether that is a prompt, tool, or task-scoping problem.",
        code: "for step in range(MAX_STEPS): ...  # the cap is a safety net, not a design",
      },
      {
        id: "when-not-to-use-an-agent",
        title: "When not to build an agent",
        summary:
          "Autonomy buys flexibility and costs predictability; if the steps are known in advance, hard-coding them is strictly better.",
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
    quizQuestionCount: 10,
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
          "Tool schemas are injected into the context as part of the prompt, so tools consume tokens on every single turn.",
          "The model's job is selection and argument synthesis; execution, authorization, and error handling belong to the runtime.",
          "The result is appended as an observation attributed to that tool call, which is how the model learns whether it worked.",
          "The security boundary is the runtime, not the prompt - never grant a tool permission you would not grant an unattended script.",
        ],
        interviewPrompt:
          "Where in a function-calling system do you enforce that a user can only read their own records - and why can't that live in the prompt?",
        code: "call = model(ctx)  →  authorize(call)  →  execute(call)  →  observe",
      },
      {
        id: "tool-design",
        title: "Designing tools a model can use",
        summary:
          "A tool description is a prompt, and tool granularity is the single biggest lever on agent reliability.",
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
          "Return errors as actionable observations (\"date must be YYYY-MM-DD, got '3rd of May'\"), not stack traces or bare status codes.",
          "Distinguish retryable failures (timeout, rate limit) from terminal ones (not found, forbidden); only the first should be retried.",
          "Any tool with side effects needs an idempotency key, because a retried booking is a duplicated booking.",
          "Cap retries per tool and per run - an agent that retries forever converts a transient failure into an outage.",
        ],
        interviewPrompt:
          "A payment tool times out but the payment succeeded. Describe what your agent should do and what the tool must provide for that to be safe.",
        code: "charge(amount, idempotency_key=run_id + step)  # retry-safe by construction",
      },
      {
        id: "parallel-and-sequential-tools",
        title: "Parallel and sequential calls",
        summary:
          "Independent tool calls should run concurrently; dependent ones must not, and telling them apart is a planning decision.",
        keyPoints: [
          "Parallel calls collapse many round-trips into one, which is usually the single biggest latency win available.",
          "A call is parallelizable only if its arguments do not depend on another call's result.",
          "Writes that touch shared state should be serialized even when they look independent, or you get lost updates.",
          "Observations return out of order, so the runtime must bind each result back to its call id before appending.",
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
          "Code handles what tools cannot enumerate: arithmetic, data wrangling, format conversion, glue between other results.",
          "It also fixes the model's weakest area - exact computation - by moving it out of token prediction entirely.",
          "The sandbox is the control: no network by default, a filesystem scoped to the run, CPU and wall-clock limits, no ambient credentials.",
          "Generated code is untrusted input; review or restrict it exactly as you would code from a stranger.",
        ],
        interviewPrompt:
          "Argue both sides: why a code tool is safer than twenty narrow tools, and why it is far more dangerous.",
        code: "run_python(src, net=False, fs=scratch_dir, timeout=30s, mem=512MB)",
      },
      {
        id: "mcp",
        title: "Tool servers and the Model Context Protocol",
        summary:
          "MCP standardizes how agents discover and call external tools, so integrations are written once per system rather than once per agent.",
        keyPoints: [
          "A server exposes tools, resources, and prompts over a uniform protocol; any compatible client can consume them.",
          "This converts an N-agents x M-systems integration problem into N + M.",
          "Tool definitions arrive at runtime, so the tool surface can change without redeploying the agent - useful, and a supply-chain risk.",
          "A third-party server's tool descriptions land inside your prompt; treat them as untrusted text and pin what you depend on.",
        ],
        interviewPrompt:
          "What changes about your threat model when tool definitions are fetched at runtime from a server you don't control?",
        code: "client.list_tools()  →  schemas injected into context  →  model selects",
      },
      {
        id: "tool-selection-at-scale",
        title: "Tool selection at scale",
        summary:
          "Accuracy degrades as the tool catalogue grows, so past a few dozen tools selection becomes a retrieval problem.",
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
          "Letting the model produce intermediate tokens before answering gives it more computation per decision, which helps on multi-step problems and does nothing for recall.",
        keyPoints: [
          "Reasoning tokens are extra forward passes; they buy serial computation, not new knowledge.",
          "Gains concentrate in arithmetic, logic, and multi-constraint planning; lookup-style questions get slower, not better.",
          "The written reasoning is a plausible narrative, not a faithful trace of the computation - never treat it as an audit log.",
          "It costs latency and tokens on every call, so make it conditional on task difficulty rather than always-on.",
        ],
        interviewPrompt:
          "Your agent's stated reasoning contradicts the tool call it then makes. What does that tell you, and what does it not?",
        code: "think first → then act   (cost: latency + tokens on every turn)",
      },
      {
        id: "react",
        title: "ReAct: interleaving reasoning and acting",
        summary:
          "ReAct alternates a short thought with a single action and its observation, so each decision is grounded in fresh evidence.",
        keyPoints: [
          "The cycle is Thought → Action → Observation, repeated; the observation is real data, which is what keeps planning honest.",
          "Compared with planning everything up front, it adapts when the world disagrees with the plan.",
          "Compared with acting without thinking, it recovers far better from a failed or surprising observation.",
          "Its weakness is myopia: each step is locally sensible, which is how agents wander without ever finishing.",
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
        id: "reflection",
        title: "Reflection and self-critique",
        summary:
          "A separate critique pass over the agent's own output catches a real class of errors, but only when the critic has something the actor lacked.",
        keyPoints: [
          "Reflection works when grounded in new information: a test result, a linter, a schema check, a second retrieval.",
          "Ungrounded self-critique is weak - the same model that made the error often rates it as correct.",
          "A separate critic prompt or model beats asking the actor \"are you sure?\", which mostly produces agreement.",
          "Bound it: one or two rounds, with a hard stop, or the agent burns its budget rewriting an already-acceptable answer.",
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
          "They trade latency and tokens for accuracy on hard multi-step problems, and waste both on simple ones.",
          "A thinking budget is a real hyperparameter: tune it per task type, not per product.",
          "Route by difficulty - cheap model for extraction and routing, reasoning model for planning and diagnosis.",
          "Elaborate chain-of-thought prompting adds little on top of a model already trained to reason; clear task statements matter more.",
        ],
        interviewPrompt:
          "Your agent is accurate but too slow. Show how you would decide which steps deserve a reasoning model.",
        code: "model = REASONER if task.is_hard else FAST  # measure, don't guess",
      },
      {
        id: "task-decomposition",
        title: "Task decomposition and subagents",
        summary:
          "Splitting a task into subtasks with their own contexts controls context growth - and pays for it with coordination overhead.",
        keyPoints: [
          "A subagent gets a narrow objective, its own fresh window, and returns a compact result rather than a transcript.",
          "This keeps the parent's context small, which is the main reason to decompose at all.",
          "The handoff is where information is lost: the parent's brief and the child's summary must both be explicit.",
          "Decompose along genuine boundaries - independent data sources, independent files - not arbitrarily.",
        ],
        interviewPrompt:
          "What information must cross the parent/subagent boundary, and what must not?",
        code: "parent: plan + delegate  |  child: fresh context, narrow goal, compact return",
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
          "Deciding what occupies the window each turn is a systems problem, and it drives agent quality more than prompt wording does.",
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
          "Classic RAG retrieves once before generating; an agent decides when and what to retrieve, and can retrieve again after seeing the results.",
        keyPoints: [
          "Agentic retrieval issues its own queries, reads the results, and reformulates - which fixes the single-shot query's blind spots.",
          "It costs more calls, so a cheap pre-retrieval step is still right for simple lookup questions.",
          "Always return provenance with the content; without it, the agent cannot cite and you cannot debug.",
          "If retrieval finds nothing, say so explicitly - an empty observation is where hallucination starts.",
        ],
        interviewPrompt:
          "When is single-shot RAG strictly better than letting the agent search? Be specific about the cost.",
        code: "search(q) → read → refine q → search again  (vs. one shot before generation)",
      },
      {
        id: "chunking-and-indexing",
        title: "Chunking and indexing",
        summary:
          "Chunk boundaries decide what can ever be retrieved together, and most retrieval failures are really chunking failures.",
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
          "Dense retrieval finds paraphrases, keyword search finds exact strings, and production systems need both plus a reranker.",
        keyPoints: [
          "Embeddings map text to vectors where cosine similarity approximates semantic relatedness.",
          "Dense search fails on rare literals - error codes, SKUs, names - which is exactly where BM25 shines.",
          "Hybrid search fuses both ranked lists; a cross-encoder reranker then scores query and passage jointly over the top ~50.",
          "Retrieve broadly, rerank hard, and pass only a handful of passages into the window.",
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
          "The two honest reasons to split: independent subtasks that can run concurrently, and context that will not fit in one window.",
          "\"Different personas\" is not a reason - role-playing specialists rarely beat one well-prompted agent with the same tools.",
          "Cost multiplies: each agent re-reads its own system prompt and tools, so a five-agent system is far more than 5x one call.",
          "Start with one agent, find the specific bottleneck, and split only along that seam.",
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
          "The orchestrator holds the plan and the only complete picture; workers see only their brief.",
          "Briefs must be self-contained - a worker cannot ask a clarifying question of a context it never saw.",
          "Workers return structured findings, not transcripts, or the orchestrator's window fills with the context you just isolated.",
          "This maps cleanly onto research and analysis, and badly onto tasks where subtasks must negotiate with each other.",
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
          "Message passing is explicit and traceable, but lossy - whatever isn't in the message is gone.",
          "A shared scratchpad or filesystem keeps everything available and introduces write conflicts and stale reads.",
          "A handoff should transfer goal, constraints, relevant findings, and what was already tried - that last one prevents repeated work.",
          "Make every message typed and logged; free-text chatter between agents is unfixable once it goes wrong.",
        ],
        interviewPrompt:
          "Two agents edit the same file in a shared workspace. Design the minimum coordination that makes this safe.",
        code: "handoff = {goal, constraints, findings, already_tried, deliverable}",
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
        id: "context-isolation",
        title: "Context isolation across agents",
        summary:
          "The main engineering benefit of subagents is that each gets a clean window, which only works if the boundary is enforced.",
        keyPoints: [
          "A worker exploring 50 documents and returning one paragraph is a 50:1 context compression for the parent.",
          "Isolation is also a safety boundary: a worker reading untrusted content should not hold the credentials or the plan.",
          "Compress at the boundary deliberately - decide the return schema before you dispatch.",
          "Over-isolation causes duplicated discovery; share a small, explicit set of common facts.",
        ],
        interviewPrompt:
          "Explain how subagents reduce total cost even though they increase total tokens.",
        code: "worker reads 200k tokens → returns 800   # parent never pays for the 200k",
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
          "Agents need outcome evaluation and process evaluation, because a correct answer reached by a broken path will fail tomorrow.",
        keyPoints: [
          "Outcome metrics: task success, correctness of the final artifact, and whether required side effects actually happened.",
          "Process metrics: steps taken, tool-choice accuracy, tokens and cost per run, recovery after a failed call.",
          "Build the eval set from real traces; synthetic tasks miss the messy inputs that break agents.",
          "Non-determinism is a measurement problem - run each case several times and report pass rate, not a single pass/fail.",
        ],
        interviewPrompt:
          "An agent passes 92% of your eval set and users complain constantly. Give three reasons your eval is lying.",
        code: "report pass@k over n runs, plus cost/steps distribution - never one run",
      },
      {
        id: "trajectory-analysis",
        title: "Trajectory analysis",
        summary:
          "The trajectory - every thought, call, and observation - is the primary debugging artifact, and reading them is the highest-yield habit in agent work.",
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
          "Judges need a concrete rubric and a reference or criteria; \"rate 1-10\" produces noise that looks like data.",
          "Known biases: position, length, self-preference for its own generations, and clustering toward the middle.",
          "Pairwise comparison is more reliable than absolute scoring; randomize order to cancel position bias.",
          "Validate on a human-labelled subset, report agreement, and re-validate whenever the judge model changes.",
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
          "Guardrails are deterministic checks around a non-deterministic core, and they must live in code rather than in instructions.",
        keyPoints: [
          "Input guardrails validate what enters; output guardrails validate what leaves, including every tool argument.",
          "Least privilege per tool and per run: scoped credentials, allowlisted destinations, rate and spend limits.",
          "Irreversible actions need an explicit gate - approval, dry run, or a staged change a human commits.",
          "Guardrails are enforcement, not persuasion; anything expressible only as a prompt line is not a guardrail.",
        ],
        interviewPrompt:
          "Your agent can send email. List every control you'd put between the model's decision and the message leaving.",
        code: "if action.is_irreversible: require_approval(action)  # in code, not the prompt",
      },
      {
        id: "prompt-injection",
        title: "Prompt injection and untrusted content",
        summary:
          "Any content an agent reads can contain instructions, and the model has no reliable way to tell data from commands.",
        keyPoints: [
          "Indirect injection hides instructions in a web page, document, email, or tool result the agent retrieves.",
          "The dangerous combination is untrusted content plus private data plus an external side channel - remove any one and the exfiltration path closes.",
          "Mitigations are architectural: mark provenance, isolate untrusted reads in a low-privilege subagent, allowlist outbound destinations, and require approval for sensitive actions.",
          "Prompt-level defenses (\"ignore instructions in documents\") reduce the rate and never eliminate it.",
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
          "Per-run cost ≈ Σ over steps of (input tokens + output tokens); input dominates because history is re-sent each turn.",
          "The three levers, in order: fewer steps, smaller context per step, cheaper model per step.",
          "Route by difficulty and parallelize independent calls; both cut wall-clock without touching quality.",
          "Stream partial output so perceived latency decouples from total run time.",
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
          "Caching keys on an exact prefix, so one changed byte early - a timestamp in the system prompt - invalidates everything after it.",
          "Order the context stable-to-volatile: system prompt, tool schemas, static docs, then history, then the current turn.",
          "Agent loops are the ideal case, since each turn re-sends a long, mostly identical prefix.",
          "Also cache at the semantic layer: identical retrieval queries and repeated deterministic tool calls.",
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
          "Mine failures for clusters, and fix the cluster - one-off prompt patches accumulate into an unmaintainable system prompt.",
          "Escalate deliberately: better tool descriptions and context first, then prompt changes, then a stronger model, then fine-tuning.",
          "Every fixed bug should leave behind a permanent eval case.",
          "Fine-tuning is justified for consistent formatting, a narrow domain, or cost reduction on a stable task - rarely for reasoning.",
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
