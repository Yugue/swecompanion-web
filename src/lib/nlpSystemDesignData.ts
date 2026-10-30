export type DesignFlowNode = { title: string; detail: string };

export { mlSystemDesignFramework as nlpDesignFramework } from "./mlSystemDesignTopics";

export type NlpDesignProblem = {
  id: string;
  legacyIds?: string[];
  title: string;
  pattern: string;
  decision: string;
  summary: string;
  mentalModel: string;
  example: { input: string; output: string };
  conversation: { speaker: "Interviewer" | "Candidate"; text: string }[];
  objectives: { business: string; ml: string };
  data: { sources: string; labels: string; features: string };
  modeling: { baseline: string; choice: string; training: string };
  inference: { serving: string; experiment: string };
  monitoring: string;
  diagram: {
    online: DesignFlowNode[];
    offline: DesignFlowNode[];
    offlineLabel: string;
    servingLabel?: string;
    feedsStep: number;
    feedLabel: string;
    bypass?: { fromStep: number; label: string };
    parallelStep?: { index: number; branches: [string, string] };
    learningLoop: string;
    caption: string;
  };
  measure: { label: "Offline" | "Live"; text: string }[];
  tradeoff: string;
  followUp: { question: string; answer: string };
  pitfalls: string[];
  capacity: string;
  reference: { title: string; href: string; note: string };
};

export const nlpDesignProblems: NlpDesignProblem[] = [
  {
    id: "content-moderation",
    title: "Classify multilingual posts",
    pattern: "Encoder → independent label scores",
    decision: "A stable taxonomy; zero or several labels can apply.",
    summary: "Detect overlapping policy violations across languages, with thresholds that reflect the cost of each mistake.",
    mentalModel: "A checklist, not a single pigeonhole: the same post can tick several boxes, or none.",
    example: { input: "A post containing both a threat and targeted harassment.", output: "{threat, harassment}; category scores drive allow, review, or block." },
    conversation: [
      { speaker: "Interviewer", text: "Design policy-violation classification for a multilingual platform." },
      { speaker: "Candidate", text: "Can labels overlap? How often does the taxonomy change, and which mistakes cost the most?" },
      { speaker: "Interviewer", text: "About 200 categories across 25 languages; zero or many labels per post. Definitions change periodically. Plan for 20K requests/sec and p95 below 100 ms; missing severe threats is costly." },
      { speaker: "Candidate", text: "I’ll use a compact multilingual classifier with independent label scores and per-label thresholds. The latency target must be validated on realistic traffic." },
    ],
    objectives: {
      business: "Reduce harmful exposures while limiting wrongful blocks and reviewer workload.",
      ml: "Recover severe violations at acceptable precision, with separate decisions for every label and language slice.",
    },
    data: {
      sources: "Human-adjudicated posts, reviewer corrections, appeals, and random samples of allowed content. Reports alone miss silent errors; audit common and rare language–label combinations.",
      labels: "Use current policy definitions, independent multi-label annotations, and locked temporal test sets. Keep copied posts together. Definition changes require relabeling affected examples; a new category needs a new output and examples.",
      features: "Post + bounded reply context → multilingual subword tokens. Preserve quotations, emojis, and evasive spellings; context distinguishes direct abuse from counterspeech.",
    },
    modeling: {
      baseline: "High-precision rules plus a word-feature classifier; measure contextual and cross-language misses.",
      choice: "Small multilingual Transformer → pooled vector → K logits → K sigmoids. Tune each label’s threshold separately; all-zero decisions mean no detected known violation.",
      training: "Fine-tune with binary cross-entropy and justified class/cost weights. Start with human gold; use audited teacher labels for demonstrated rare-label or language gaps, not by default. Select data volume with held-out learning curves.",
    },
    inference: {
      serving: "Bound input length and batching delay; benchmark smaller or quantized encoders if needed. Keep policy actions separate from scores. Define review-capacity and timeout fallbacks by harm severity.",
      experiment: "Shadow and audit first; canary within approved harm limits. Compare exposure-weighted harm and wrongful blocks against current policy, with latency and review backlog as guardrails.",
    },
    measure: [
      { label: "Offline", text: "Per-label precision/recall, macro-F1, rare-label PR-AUC, and severe-label miss rate. Report language × label slices; tune thresholds on held-out traffic with natural prevalence." },
      { label: "Live", text: "Audited harmful-view and wrongful-block rates, backlog, p95 latency, and score/language drift. Online F1 requires fresh adjudicated labels; score drift alone is not an error metric." },
    ],
    monitoring: "Version policy and model independently. Audit allowed and blocked samples; relabel and validate affected examples after policy changes, then canary with a rollback path.",
    diagram: {
      online: [{ title: "Post + context", detail: "Language-aware input" }, { title: "Prepare tokens", detail: "Keep contextual clues" }, { title: "Multilingual encoder", detail: "K independent sigmoids" }, { title: "Per-label thresholds", detail: "Cost-aware decisions" }, { title: "Allow / review / block", detail: "Versioned policy" }],
      offline: [{ title: "Human gold labels", detail: "Audits + appeals" }, { title: "Target label gaps", detail: "Optional audited teacher" }, { title: "Fine-tune encoder", detail: "Binary cross-entropy" }, { title: "Validate + calibrate", detail: "Language × label slices" }, { title: "Model + thresholds", detail: "Canary release" }],
      offlineLabel: "Training", feedsStep: 2, feedLabel: "Deploy evaluated encoder and label thresholds",
      learningLoop: "Audits and policy revisions → corrected labels → validation → next release.",
      caption: "The classifier produces a set of known labels. Unmatched posts are not automatically new issue categories.",
    },
    tradeoff: "Lowering a severe-label threshold can catch more harm but also create more false alarms. Choose the operating point using harm cost and review capacity.",
    followUp: { question: "The policy changes tomorrow. Do we rebuild everything?", answer: "For a definition change, relabel affected examples and validate the updated model/thresholds. For a new category, expand the output head and collect labels. Automatic topic discovery is a separate requirement." },
    pitfalls: ["A softmax forces mutually exclusive labels; use independent sigmoids here.", "Avoid a conflicting NO_ISSUE label and an automatic online LLM call for every post."],
    capacity: "20K requests/sec × 80 input tokens ≈ 1.6M encoder tokens/sec. Size replicas using measured tokens/sec at realistic batches, plus p95 and failure headroom; do not infer GPU count from parameter count.",
    reference: { title: "Hugging Face: text classification", href: "https://huggingface.co/docs/transformers/tasks/sequence_classification", note: "Classifier implementation reference; this case requires multi-label outputs and cost-aware decisions." },
  },
  {
    id: "workflow-matching",
    legacyIds: ["support-ticket-routing", "semantic-search"],
    title: "Match requests to changing workflows",
    pattern: "Retrieve known actions → accept or abstain",
    decision: "A curated registry changes faster than model weights should.",
    summary: "Select the correct workflow from thousands of changing actions, or return UNSUPPORTED when none fits.",
    mentalModel: "A dispatcher searches a live playbook, then checks that the chosen procedure actually fits the request.",
    example: { input: "Stop my monthly plan, but keep my current order.", output: "CANCEL_SUBSCRIPTION; never CANCEL_ORDER. Selection still requires authorization and parameter validation before execution." },
    conversation: [
      { speaker: "Interviewer", text: "Map multilingual requests to executable support workflows." },
      { speaker: "Candidate", text: "How large and dynamic is the registry? Can we reject unsupported requests, and are we selecting or executing actions?" },
      { speaker: "Interviewer", text: "20K curated workflows, edited daily and searchable within minutes; 10K QPS, p95 under 150 ms. Return one ID or UNSUPPORTED. A separate authorized service executes actions." },
      { speaker: "Candidate", text: "I’ll retrieve action specifications and calibrate an acceptance gate. Catalog updates change the index; they should not require a classifier retrain." },
    ],
    objectives: { business: "Increase correctly resolved requests without selecting costly wrong actions.", ml: "Meet an accepted-match precision target, then maximize supported-request coverage; reject unsupported requests explicitly." },
    data: {
      sources: "Action titles, descriptions, schemas, prerequisites, curated utterances, and audited outcomes. Optional teacher paraphrases cover languages with few examples.",
      labels: "Request → correct active workflow, plus unsupported examples. Mine similar-but-wrong actions and verify negatives. Split by time and paraphrase family; test newly added workflows separately.",
      features: "Request → multilingual query embedding. Action specification + examples → catalog embedding(s); schema/prerequisite compatibility supplies hard constraints when authoritative context is available.",
    },
    modeling: {
      baseline: "Lexical matching plus an exact embedding scan. For a small registry, exact search may be simpler than approximate nearest-neighbor search (ANN).",
      choice: "Multilingual bi-encoder → hybrid main/delta retrieval → acceptance gate. Add a pairwise cross-encoder only when candidate recall is good but final selection remains weak.",
      training: "Contrastive learning on reviewed request–action pairs and hard negatives. Tune final-score thresholds on supported/unsupported validation examples; vector similarity is not automatically a calibrated probability.",
    },
    inference: {
      serving: "Query main and delta indexes; merge candidates and filter retired IDs immediately. Updates embed into delta; compact periodically. Validate the selected active ID and prerequisites again before the execution service takes over.",
      experiment: "Replay held-out requests, shadow against reviewed outcomes, then canary action selection with execution safeguards intact. Track wrong-action precision and supported coverage separately.",
    },
    measure: [
      { label: "Offline", text: "Human-relevance Recall@K for retrieval; ANN Recall@K versus exact vector search for approximation; top-1/MRR for ranking. Set the final gate using accepted-match precision and unsupported false accepts/rejects." },
      { label: "Live", text: "Audited wrong-action rate, supported coverage, update/delete lag, p95 latency, and cost. Record final execution outcomes without treating every failure as a matching error." },
    ],
    monitoring: "Alert on retired-ID selections and rising unsupported rates. Refresh registry data immediately; retrain only when evaluated matching quality needs improvement.",
    diagram: {
      online: [{ title: "Request + context", detail: "Multilingual query" }, { title: "Bi-encoder search", detail: "Main + delta; active IDs" }, { title: "Optional verifier", detail: "Request ↔ action spec" }, { title: "Acceptance gate", detail: "Calibrated precision" }, { title: "ID / UNSUPPORTED", detail: "Execution is separate" }],
      offline: [{ title: "Curated actions", detail: "Specs + utterances" }, { title: "Validate + embed", detail: "Matching encoder version" }, { title: "Delta index", detail: "Fresh validated records" }, { title: "Merge / compact", detail: "Retire via active filter" }, { title: "Main + delta library", detail: "Publish current IDs" }],
      offlineLabel: "Registry updates", feedsStep: 1, feedLabel: "Search current action specifications",
      learningLoop: "Audited matches and verified hard negatives → encoder/gate evaluation; registry edits update embeddings independently.",
      caption: "New actions enter delta directly. Retirement updates the active-ID filter immediately; do not wait for main-index compaction.",
    },
    tradeoff: "A verifier spends latency on harder decisions. Improve retrieval first when Recall@K is low; benchmark verification when the right action is present but loses at the final gate.",
    followUp: { question: "Can UNSUPPORTED be one more vector in the index?", answer: "No single vector represents every unsupported intent. Calibrate rejection on diverse supported/unsupported pairs, and apply the gate to the actual candidate score." },
    pitfalls: ["Top-K chooses candidate volume; it does not set the accept/reject threshold.", "Do not cluster a curated action registry or retrain for every catalog edit."],
    capacity: "10K QPS × 80 tokens ≈ 800K query tokens/sec. Verifying 20 candidates/request means 200K pairs/sec: measure that cost before enabling reranking. Compare exact scan and ANN at the actual registry size.",
    reference: { title: "Sentence Transformers: retrieve and rerank", href: "https://www.sbert.net/examples/sentence_transformer/applications/retrieve_rerank/README.html", note: "Reference for candidate retrieval and optional pairwise reranking." },
  },
  {
    id: "entity-linking",
    legacyIds: ["information-extraction"],
    title: "Link product mentions to catalog IDs",
    pattern: "Detect mentions → retrieve → verify identity",
    decision: "Free text must resolve to exact canonical entities.",
    summary: "Find every product mention in a message and link it to the right variant in a large catalog, or return NO_MATCH.",
    mentalModel: "Highlight the products in a sentence, then check their identity cards. Similar names can belong to different products.",
    example: { input: "Compare the blue 128GB Model X with the 256GB Pro.", output: "Two mention spans, each with its correct variant ID or NO_MATCH; storage and model qualifiers stay attached." },
    conversation: [
      { speaker: "Interviewer", text: "Identify products mentioned in multilingual posts and link them to our catalog." },
      { speaker: "Candidate", text: "Are inputs short product queries or arbitrary prose? Can there be several mentions or a product absent from the catalog?" },
      { speaker: "Interviewer", text: "Arbitrary prose, zero or many mentions, 50M distinct products, continuous arrivals. Return a canonical ID or NO_MATCH per mention. Wrong variant links are expensive." },
      { speaker: "Candidate", text: "I’ll separate mention detection from entity linking, preserving each mention’s context and enforcing exact attribute constraints." },
    ],
    objectives: { business: "Connect product discussions to the right catalog records without confusing sibling variants.", ml: "Recover mention spans and exact canonical IDs while controlling false links and correctly rejecting absent products." },
    data: {
      sources: "Human-labeled spans and canonical links, catalog metadata, and audited click/purchase links as weak signals. Teacher aliases and typo variants can augment sparse languages.",
      labels: "Annotate spans and links separately. Include unseen products and near-sibling negatives; group paraphrases and hold out later catalog snapshots. Audit weak links instead of trusting clicks automatically.",
      features: "Mention + surrounding text → query embedding. Catalog title, brand, model, aliases, and variant attributes → item embedding; exact price/storage constraints use structured filters, not similarity alone.",
    },
    modeling: {
      baseline: "ID/alias matching and a pretrained mention detector; inspect ambiguity before adding expensive verification.",
      choice: "Multilingual BIO span tagger → contextual bi-encoder → hybrid vector/keyword candidates → optional pairwise identity verifier → ID or NO_MATCH. Skip mention detection only for a clearly scoped short-query input.",
      training: "Token cross-entropy for spans; contrastive loss for links; binary loss for verification when justified. Mine sibling variants as hard negatives and calibrate rejection on absent/unseen products.",
    },
    inference: {
      serving: "Preserve offsets and qualifiers through every stage. Embed new canonical records into delta; tombstone obsolete IDs immediately. Validate returned IDs and attributes; similar records are not automatically duplicates.",
      experiment: "Evaluate linking on both gold and predicted spans, then shadow and canary. Audit exact variant correctness before using links to drive downstream product actions.",
    },
    measure: [
      { label: "Offline", text: "Span/type F1, candidate-ID Recall@K, ANN recall versus exact search, exact canonical-ID accuracy, false-link rate, and NO_MATCH precision/recall. Slice by language and ambiguous product family." },
      { label: "Live", text: "Audited wrong-variant links, unmatched mentions, catalog freshness, and latency per mention/message. Compare gold-span and predicted-span results to locate error propagation." },
    ],
    monitoring: "Track new brands, alias drift, retired-ID returns, and sibling confusions. Update metadata/indexes promptly; use reviewed hard cases for model improvements.",
    diagram: {
      online: [{ title: "Text → mentions", detail: "BIO spans + offsets" }, { title: "Encode with context", detail: "Retain variant qualifiers" }, { title: "Hybrid retrieval", detail: "Main + delta; filters" }, { title: "Verify + reject", detail: "Exact identity; calibrated" }, { title: "IDs / NO_MATCH", detail: "One result per mention" }],
      offline: [{ title: "Canonical catalog", detail: "IDs + aliases + variants" }, { title: "Validate metadata", detail: "Distinct sibling products" }, { title: "Embed item records", detail: "Compatible encoder" }, { title: "Update + tombstone", detail: "Delta; immediate retires" }, { title: "Searchable catalog", detail: "Dense + keyword" }],
      offlineLabel: "Catalog updates", feedsStep: 2, feedLabel: "Retrieve active catalog candidates",
      learningLoop: "Reviewed spans and exact-ID corrections → separately improve detection, retrieval, and verification.",
      caption: "Detection locates mentions; linking resolves identity. The linker receives context, not just an isolated product name.",
    },
    tradeoff: "More candidates improve identity recall but increase pairwise cost. A verifier is useful for lookalike variants only after the right ID reaches the shortlist.",
    followUp: { question: "Why not embed only the extracted word ‘Phone’?", answer: "That loses storage, color, and model context. Encode the surrounding phrase and apply authoritative numeric/categorical filters; embeddings cannot reliably enforce a price ceiling." },
    pitfalls: ["Do not merge catalog products merely because their descriptions are similar.", "A correct mention span is not proof of a correct entity link."],
    capacity: "50M vectors × 768 dimensions × 2 bytes ≈ 76.8 GB of raw FP16 embeddings, before ANN overhead, metadata, and replicas. Multi-prototype indexing increases this footprint.",
    reference: { title: "Hugging Face: token classification", href: "https://huggingface.co/docs/transformers/tasks/token_classification", note: "Implementation reference for the mention detector; retrieval and exact-ID verification are separate stages." },
  },
  {
    id: "duplicate-detection",
    title: "Detect strict duplicate tickets",
    pattern: "Similarity shortlist → same-issue verification",
    decision: "Related text is insufficient; two records must represent the same issue.",
    summary: "Match a new ticket to a verified duplicate group while protecting against costly false merges.",
    mentalModel: "Find similar case files, then ask whether they describe the same incident. Sharing a topic is not enough.",
    example: { input: "Two tickets both say ‘checkout failed’, but one is a card decline and the other a site outage.", output: "Different issues. Return NOVEL unless a verified same-issue match exists." },
    conversation: [
      { speaker: "Interviewer", text: "Detect whether an incoming multilingual ticket duplicates an existing issue." },
      { speaker: "Candidate", text: "Does duplicate mean a shared topic or the same underlying issue? Which is worse: missing a duplicate or merging different issues?" },
      { speaker: "Interviewer", text: "The same issue, across 100M historical tickets. False merges are particularly costly. New tickets should become searchable quickly; return a group ID or NOVEL." },
      { speaker: "Candidate", text: "I’ll retrieve similar tickets, verify pairs, and accept only above a high-precision threshold. Broad clustering cannot establish strict equivalence." },
    ],
    objectives: { business: "Reduce repeated investigation without hiding independent incidents inside an incorrect merge.", ml: "Maximize duplicate recall subject to a low false-merge rate; explicitly preserve novel tickets." },
    data: {
      sources: "Confirmed agent merges, adjudicated ticket pairs, and reviewed multilingual paraphrases. Recheck historical merges: agent actions are useful evidence, not infallible truth.",
      labels: "Positive means the same underlying issue. Hard negatives share product/topic but differ in cause or conditions. Keep each confirmed issue group in one split and replay later arrivals against earlier history.",
      features: "Ticket text + relevant product/version/context → retrieval embeddings. The verifier reads both complete scoped descriptions and any reliable incident identifiers.",
    },
    modeling: {
      baseline: "Exact normalized hashes and reliable shared incident IDs; measure missed paraphrases.",
      choice: "Multilingual bi-encoder → ANN shortlist → pairwise cross-encoder → high-precision merge gate. Index tickets or diverse group prototypes; a single centroid may miss important variants.",
      training: "Contrastive learning for retrieval and binary duplicate labels for verification. Mine high-scoring false candidates and independently confirm they are negatives; calibrate the final gate on held-out pairs.",
    },
    inference: {
      serving: "Search main + delta indexes and verify candidates. Add new tickets to delta for future search without promoting them to validated issue groups. Keep uncertain matches separate or queue them for review.",
      experiment: "Replay history chronologically, then shadow against adjudicated merges. Canary suggestions before automatic merging; audit accepted and rejected pairs to measure both false merges and missed duplicates.",
    },
    measure: [
      { label: "Offline", text: "Ground-truth duplicate Recall@K, ANN approximation recall versus exact search, verifier PR-AUC, and end-to-end false-merge rate/duplicate recall. Ranking metrics do not choose a binary merge threshold." },
      { label: "Live", text: "Audited merge precision, missed duplicate rate, NOVEL false accepts/rejects, investigation time saved, and index lag. Preserve evidence needed to undo a mistaken merge." },
    ],
    monitoring: "Watch product/release-specific false merges and shifts in duplicate prevalence. Retrain on reviewed hard pairs; keep indexing new tickets independent of model updates.",
    diagram: {
      online: [{ title: "New ticket", detail: "Text + issue context" }, { title: "Retrieve similar", detail: "Main + delta ANN" }, { title: "Pairwise verifier", detail: "Same issue or not?" }, { title: "Strict merge gate", detail: "False-merge guardrail" }, { title: "Group ID / NOVEL", detail: "Keep merge evidence" }],
      offline: [{ title: "History + new tickets", detail: "Known group IDs if any" }, { title: "Encode tickets", detail: "Or diverse prototypes" }, { title: "Append delta", detail: "Searchable ≠ validated" }, { title: "Compact indexes", detail: "Preserve provenance" }, { title: "Historical library", detail: "Active tickets / groups" }],
      offlineLabel: "Indexing", feedsStep: 1, feedLabel: "Retrieve candidates; do not infer equivalence",
      learningLoop: "Adjudicated merges and rejected near-matches → retriever/verifier training → calibrated merge gate.",
      caption: "ANN answers ‘similar to what?’ The verifier answers ‘same issue?’ Neither index membership nor broad cluster membership proves a duplicate.",
    },
    tradeoff: "A stricter threshold leaves more duplicates unmerged but protects independent issues. Optimize recall only after meeting the false-merge guardrail.",
    followUp: { question: "Candidate recall is high, but false merges are rising. What changes?", answer: "Inspect verifier failures and threshold calibration using same-topic/different-cause pairs. Improving the index alone will not repair an overly permissive final decision." },
    pitfalls: ["Do not equate a similar embedding or shared cluster with a duplicate.", "A searchable new ticket is not automatically a canonical issue group."],
    capacity: "100M × 768 × 2 bytes ≈ 153.6 GB of raw vectors before overhead. At QPS q and k verified pairs/request, benchmark q × k pairs/sec separately from query encoding and ANN search.",
    reference: { title: "Sentence Transformers: cross-encoder training", href: "https://sbert.net/docs/cross_encoder/training_overview.html", note: "Reference for pairwise models and hard-negative training; the labels here encode strict duplication." },
  },
  {
    id: "emerging-issues",
    legacyIds: ["aspect-sentiment"],
    title: "Discover emerging customer issues",
    pattern: "Unknown observations → validated new issues",
    decision: "New recurring categories must be discovered, not just assigned.",
    summary: "Find genuinely new problems after a release, without promoting praise, copied complaints, or spam into incidents.",
    mentalModel: "A newsroom tip desk: route familiar stories, group credible new tips, then check whether the story is real and growing.",
    example: { input: "Many independent users report that release 8.2 makes exported PDFs blank.", output: "A reviewed new issue with evidence, growth history, and a prototype added to the known registry." },
    conversation: [
      { speaker: "Interviewer", text: "Discover new customer issues from millions of multilingual messages each day." },
      { speaker: "Candidate", text: "Do we already have known issue definitions? Must we merely group unknown text, or alert on genuinely new recurring problems?" },
      { speaker: "Interviewer", text: "There are 200 known issues. Detect legitimate new ones within an hour; reject spam and unrelated chatter. Reviewed discoveries must become assignable promptly." },
      { speaker: "Candidate", text: "I’ll separate known assignment, an unknown issue-like pool, and validated new issues. Clustering finds groups; growth and novelty decide whether to alert." },
    ],
    objectives: { business: "Shorten incident discovery time without overwhelming responders with false alerts.", ml: "Recover novel issue-like messages, form coherent groups, and promote only persistent, distinct, credible issues." },
    data: {
      sources: "Known issue definitions/examples, raw messages, release timestamps, distinct-source signals, and reviewed historical incidents. Bootstrap known prototypes from definitions; no initial clustering is needed.",
      labels: "Review known matches, issue-versus-noise examples, and accepted/rejected discoveries. Replay historical incidents in temporal order, exposing only what was known at each moment.",
      features: "Multilingual text embeddings describe meaning. Time-window counts, distinct users, release context, and persistence measure growth; suppress copies in geometry but retain their counts separately.",
    },
    modeling: {
      baseline: "Known-prototype matching plus human review of frequent unmatched phrases.",
      choice: "Known matcher → issue/noise gate → deduplicated unknown pool → sliding-window HDBSCAN → trend/novelty scoring → human or assisted review. Compute medoids/prototypes after clustering; keep noise unassigned.",
      training: "Fit the issue/noise gate on reviewed examples; validate embedding/clustering choices using replayed incidents. Set promotion rules with responders. Add reviewed prototypes immediately; supervised retraining can follow later.",
    },
    inference: {
      serving: "Assign strong known matches directly. Micro-batch unknown issue-like text; score cluster diversity, persistence, growth, and separation from known issues. Only validated promotions enter main/delta known indexes.",
      experiment: "Replay launches and incidents, then shadow the alert stream with responders. Tune false-promotion versus detection-delay tradeoffs before paging; do not equate more discovered clusters with success.",
    },
    measure: [
      { label: "Offline", text: "Known-label P/R/F1; novel-issue gate recall and noise rejection; cluster coherence and false merges/splits. End-to-end: time-to-detection, missed incidents, and false promotion rate." },
      { label: "Live", text: "Reviewed alert precision, detection delay, source diversity, persistence, and assignment freshness after promotion. Track spam-driven alerts and incident review workload." },
    ],
    monitoring: "Watch promotion errors, novel-issue misses, and embedding/taxonomy drift. Keep raw unknown observations separate from validated main/delta records; retain review provenance.",
    diagram: {
      online: [{ title: "Incoming messages", detail: "Release + source context" }, { title: "Known-issue gate", detail: "Match current registry" }, { title: "Unknown issue pool", detail: "Noise gate; de-spam" }, { title: "Cluster + trend", detail: "Coherence; growth; novelty" }, { title: "Assign / promote", detail: "New issues need review" }],
      offline: [{ title: "Validated issues", detail: "Definitions + reviews" }, { title: "Build prototypes", detail: "Embed known examples" }, { title: "Publish delta", detail: "New known issues only" }, { title: "Compact + version", detail: "Active issue IDs" }, { title: "Known registry", detail: "Main + delta indexes" }],
      offlineLabel: "Known registry", servingLabel: "Assignment and discovery", feedsStep: 1, feedLabel: "Match against validated issue prototypes",
      bypass: { fromStep: 1, label: "Known match → assign directly" },
      learningLoop: "Reviewed new cluster → canonical issue + prototypes → known registry now; supervised retraining later.",
      caption: "Unmatched does not mean novel. Filter nonissues before clustering; reject noisy clusters after scoring. Main/delta hold validated issues, while the unknown pool holds observations.",
    },
    tradeoff: "Waiting for persistence reduces false alerts but delays discovery. Use severity and independent-source evidence to choose promotion rules, rather than cluster size alone.",
    followUp: { question: "A cluster doubles in size. Is that an emerging issue?", answer: "Check distinct sources, copying/spam, persistence, novelty against known issues, and a historical baseline. Clustering establishes similarity; temporal growth and review establish an emerging issue." },
    pitfalls: ["No known label can mean praise, noise, or ambiguity—not a new issue.", "Do not cluster delta just because its validated records are fresh, or assume HDBSCAN automatically supplies useful centroids."],
    capacity: "5M messages/day averages about 58/sec, but size for observed peaks. Benchmark clustering on bounded sliding windows; full-history reclustering is not required for hourly discovery.",
    reference: { title: "scikit-learn: HDBSCAN", href: "https://scikit-learn.org/stable/modules/generated/sklearn.cluster.HDBSCAN.html", note: "Clustering reference; trend scoring, noise filtering, and issue validation remain separate decisions." },
  },
  {
    id: "grounded-question-answering",
    title: "Answer questions from company documents",
    pattern: "Retrieve evidence → answer → verify support",
    decision: "An answer must be justified by current, permitted evidence.",
    summary: "Give cited, grounded answers from a changing corpus, and abstain when relevant passages still do not answer the question.",
    mentalModel: "An open-book exam: finding the right chapter is only the first step; the cited lines must actually justify the answer.",
    example: { input: "How many vacation days can I carry over in my region?", output: "A scoped answer citing the current policy, a clarification question, or INSUFFICIENT_EVIDENCE." },
    conversation: [
      { speaker: "Interviewer", text: "Build an enterprise assistant over changing documents, manuals, and policy pages." },
      { speaker: "Candidate", text: "Must answers respect permissions and version conflicts? Are screenshots in scope, and can the assistant abstain?" },
      { speaker: "Interviewer", text: "Yes. Enforce account context and citations; some manuals contain screenshots. Policies change daily. Answers only, p95 under four seconds; abstention is acceptable." },
      { speaker: "Candidate", text: "I’ll separate retrieval relevance from answerability, filter access before generation, and retain provenance through citation checks." },
    ],
    objectives: { business: "Resolve questions faster without unsupported advice or disclosure of restricted content.", ml: "Retrieve authoritative evidence and produce complete, supported claims; clarify or abstain when evidence is insufficient or unresolved." },
    data: {
      sources: "Authorized documents, version/authority metadata, and human question–evidence–answer judgments. OCR or visual descriptions can support a text-first screenshot baseline; preserve links to the originals.",
      labels: "Experts mark relevance, answerability, claim support, and unanswerable/conflicting cases. Group paraphrases and evaluate time-appropriate snapshots. Audit synthetic question/document pairs and calibrate automated judges with human gold.",
      features: "Query/chunks → compatible dense embeddings plus keyword scores. Region, ACLs, dates, source authority, version, and span IDs remain structured context and filters.",
    },
    modeling: {
      baseline: "Hybrid search returning source excerpts; compare answer generation with a strong pretrained LLM on the same permitted evidence.",
      choice: "Hybrid retrieval → optional reranker → answerability gate → generator with cited snippets/context → claim-support checks. Resolve versions with grounded date/authority rules, or state the conflict explicitly.",
      training: "Improve retrieval with reviewed relevance pairs and hard negatives. At high volume, distill audited (question + evidence + metadata) → cited-answer pairs into a smaller generator while retaining retrieval. Routine document updates need indexing, not retraining.",
    },
    inference: {
      serving: "Apply ACLs before unauthorized context reaches a model. Query main/delta dense and lexical indexes; tombstone deletes immediately. Bound output, scope caches by access/version, and treat document instructions as untrusted input.",
      experiment: "Gate on expert audits, access tests, and conflict/abstention cases, then canary eligible users. Compare audited resolution and time saved; stop for access leaks or increased unsupported advice.",
    },
    measure: [
      { label: "Offline", text: "Retriever Recall@K/nDCG, claim-supported rate, completeness, citation precision/recall, abstention P/R, and contradiction handling. Test access leakage independently; a citation’s presence does not establish support." },
      { label: "Live", text: "Human-audited resolution, unsupported claims, answer coverage, stale evidence, p95 latency, and cost. Human-calibrate judge scores and inspect retrieval versus generation failures separately." },
    ],
    monitoring: "Trace every answer to evidence versions. Watch ACL failures, retrieval misses, stale policies, and unsupported claims; fix the first failing stage rather than automatically enlarging the generator.",
    diagram: {
      online: [{ title: "Query + identity", detail: "Account + region scope" }, { title: "Hybrid retrieval", detail: "ACLs; optional reranker" }, { title: "Answerability gate", detail: "Evidence + conflicts" }, { title: "Generate + check", detail: "Claims ↔ cited spans" }, { title: "Answer / abstain", detail: "Or ask for clarification" }],
      offline: [{ title: "Documents + visuals", detail: "ACL; date; authority" }, { title: "Parse + chunk", detail: "Text/OCR; source spans" }, { title: "Embed + index", detail: "Dense + lexical" }, { title: "Delta + deletes", detail: "Compatible versions" }, { title: "Evidence library", detail: "Main + delta; active IDs" }],
      offlineLabel: "Evidence updates", feedsStep: 1, feedLabel: "Retrieve current permitted evidence",
      bypass: { fromStep: 2, label: "Not answerable → clarify / abstain" },
      learningLoop: "Audited retrieval and claim errors → targeted retriever/generator evaluation; human gold calibrates automated checks.",
      caption: "Topically relevant passages may still lack an answer. Source authority and chronology constrain conflict handling; unsupported cases bypass generation.",
    },
    tradeoff: "Extra context and verification add latency and cost. Improve evidence selection first; add stages only when audited quality gains justify their serving budget.",
    followUp: { question: "The model cites a passage. Isn’t the answer grounded?", answer: "Check each claim against the cited source span. The citation may be relevant but not entail the claim, may be superseded, or may contradict a more authoritative policy." },
    pitfalls: ["Never let post-generation ACL filtering substitute for access filtering before context retrieval.", "Do not mix unrelated text and image embedding spaces; use a compatible multimodal model if moving beyond text/OCR retrieval."],
    capacity: "Budget query encoding and reranker pairs separately from generator prefill and output decoding. Required output tokens/sec = QPS × mean generated tokens; use measured stage throughput and p95 headroom to size replicas.",
    reference: { title: "Microsoft: design and evaluate a RAG solution", href: "https://learn.microsoft.com/en-us/azure/architecture/ai-ml/guide/rag/rag-solution-design-and-evaluation-guide", note: "Reference for stage-by-stage RAG preparation and evaluation." },
  },
  {
    id: "machine-translation",
    title: "Translate messages with a live glossary",
    pattern: "Specialized translation + dynamic terminology",
    decision: "High-volume language conversion needs stable facts and changing terms.",
    summary: "Translate multilingual support messages cheaply at scale while preserving approved terminology, entities, and numbers.",
    mentalModel: "An interpreter with a live phrasebook: terminology changes in the phrasebook immediately, without relearning the whole language.",
    example: { input: "A customer message with a product alias, order ID, and delivery date.", output: "A faithful target-language message using the approved term, with IDs and dates intact and the original retained." },
    conversation: [
      { speaker: "Interviewer", text: "Translate high-volume support conversations across roughly 20 language pairs." },
      { speaker: "Candidate", text: "What context and terminology must survive? How often do terms change, and what is the latency budget?" },
      { speaker: "Interviewer", text: "Keep names, amounts, IDs, and a little prior context. Approved product terms change weekly. Expect 10K QPS and p95 below one second for short requests; retain the original." },
      { speaker: "Candidate", text: "I’ll benchmark a specialized multilingual translator against an LLM, condition it on a versioned glossary, and validate protected facts." },
    ],
    objectives: { business: "Enable cross-language resolution without meaning-changing errors or unaffordable serving costs.", ml: "Preserve meaning, terminology, and critical facts in each language direction, with a visible fallback when validation fails." },
    data: {
      sources: "Human parallel messages, reviewed bilingual corrections, and versioned glossary entries. Use quality-filtered teacher translations for sparse pairs, with sampled human review.",
      labels: "Balance language directions; split by conversation/time and template family. Check teacher outputs for language, approved terms, entities, and numbers. Back-translation alone cannot prove correctness.",
      features: "Source + bounded prior context + target-language tag. Retrieve only relevant glossary entries by alias, language pair, product/version, and effective date; glossary data is input, not a vocabulary rewrite.",
    },
    modeling: {
      baseline: "Benchmark a pretrained multilingual translator and a decoder-only LLM on the same short support messages.",
      choice: "Specialized encoder–decoder student: encode the source once, then generate the target autoregressively. Train glossary conditioning if inference expects it; hard term guarantees may need constrained decoding or validated placeholders.",
      training: "Fine-tune on reviewed parallel/teacher pairs using target-token cross-entropy and balanced sampling. Full tuning is reasonable for smaller models; parameter-efficient tuning is an option when model size makes full tuning costly.",
    },
    inference: {
      serving: "Detect language → fetch current glossary → translate → validate facts/terms. Bound queues, batch sizes, and output length. Scope caches by tenant, language pair, model, and glossary version; fail visibly to original/retry.",
      experiment: "Gate every direction with bilingual review, then canary conversations. Compare correction and resolution rates, with critical fact/term errors and p95 latency as stop conditions.",
    },
    measure: [
      { label: "Offline", text: "COMET plus human adequacy/fluency, approved-term accuracy, entity/number fidelity, and pronoun/context correctness. Report every direction; chrF/BLEU are secondary signals, not substitutes for meaning checks." },
      { label: "Live", text: "Audited bilingual errors, glossary compliance, fallback rate, latency, and cost per language pair. Inspect sparse languages separately from traffic-weighted averages." },
    ],
    monitoring: "Apply glossary edits immediately; retrain for systematic failures rather than each new term. Audit low-resource and code-switched messages and retain previous model/glossary versions.",
    diagram: {
      online: [{ title: "Message + context", detail: "Source + target language" }, { title: "Fetch glossary", detail: "Relevant terms + version" }, { title: "Encoder–decoder", detail: "Glossary-aware decoding" }, { title: "Validate + restore", detail: "Terms; facts; IDs" }, { title: "Translation / fallback", detail: "Original always retained" }],
      offline: [{ title: "Approved terminology", detail: "Aliases; pair; product" }, { title: "Validate term rules", detail: "Effective dates" }, { title: "Publish live glossary", detail: "No model retrain needed" }, { title: "Version + invalidate", detail: "Scoped translation cache" }, { title: "Glossary lookup", detail: "Current approved terms" }],
      offlineLabel: "Terminology updates", feedsStep: 1, feedLabel: "Supply glossary as inference context",
      learningLoop: "Audited human/teacher pairs → train glossary-aware student → bilingual release gates; terminology updates separately.",
      caption: "A glossary instruction is not an exactness guarantee. Validate output and use suitable constraints or protected placeholders when terms must survive exactly.",
    },
    tradeoff: "A smaller translator may reduce cost but lose difficult context or rare-language quality. Decide with pair-level quality and measured encoding/decoding latency, not model size alone.",
    followUp: { question: "A product is renamed today. Do we retrain?", answer: "Update the external versioned glossary and invalidate affected caches. The translator must already support glossary conditioning; validate compliance and retrain later only if errors are systematic." },
    pitfalls: ["Do not treat glossary updates as changes to the model’s embedding dictionary.", "ROUGE is not a central translation quality metric; token speed alone does not establish meaning preservation."],
    capacity: "At 10K QPS, 100 source tokens/message means 1M input tokens/sec; 80 generated tokens means 800K output tokens/sec. Benchmark encoder work, autoregressive decoding, and queue delays separately.",
    reference: { title: "Hugging Face: constrained beam search", href: "https://huggingface.co/blog/constrained-beam-search", note: "Reference for lexical constraints; measure their decoding cost and validate terminology." },
  },
  {
    id: "document-summarization",
    title: "Summarize long documents and extract facts",
    pattern: "Local summaries + facts → grounded aggregation",
    decision: "Long inputs require compression without losing exact facts or chronology.",
    summary: "Produce a concise summary and structured facts from long, contradictory documents while retaining evidence for both.",
    mentalModel: "Each chapter sends upstairs a short brief and a ledger of exact facts. The editor needs both to write a faithful final account.",
    example: { input: "100K tokens of emails, tables, case notes, and a refund approved then reversed.", output: "A cited summary plus actions/dates/amounts/owners, with the later reversal preserved or conflict marked unresolved." },
    conversation: [
      { speaker: "Interviewer", text: "Summarize long multilingual case files and extract the facts agents need next." },
      { speaker: "Candidate", text: "How long are the files, what exact outputs matter, and how should conflicting notes be handled?" },
      { speaker: "Interviewer", text: "Up to 100K tokens including tables and emails. Return a summary and structured actions, dates, amounts, owners, and unresolved issues. Fabricated facts are expensive; asynchronous processing is acceptable." },
      { speaker: "Candidate", text: "I’ll preserve document structure and source pointers, process summaries and facts in parallel, then reconcile chronology before final generation and checks." },
    ],
    objectives: { business: "Reduce case-reading time without losing decisions, money amounts, or next steps needed for a correct handoff.", ml: "Maximize important-fact coverage and supported claims while returning correct structured fields and explicit unresolved conflicts." },
    data: {
      sources: "Source documents/layout, tables, reviewed summaries, and field-level facts with evidence. Audited teacher outputs can augment gold data; include long tails and late decision reversals.",
      labels: "Annotate fields, relations, claims, and supporting spans. Split by case/time; group repeated templates. Keep an independent human test set for omissions, numerical facts, ownership, and contradictions.",
      features: "Chunks retain speaker/time, source offsets, and table row/column headers. The aggregator receives local briefs, structured fact lists, and provenance; summaries alone may discard irrecoverable details.",
    },
    modeling: {
      baseline: "Direct generation for short files and cited key excerpts; compare against hierarchical processing on long cases.",
      choice: "Structure-aware chunks → parallel local summarizer and fact extractor → deduplicate facts and reconcile chronology → final generator. Use span/relation models or parsers for stable fields; generative extraction for open-ended attributes.",
      training: "Adapt on audited human/teacher targets only when prompting is insufficient. Use token cross-entropy for generation/span tags and relation loss for fixed links. Select on independent factuality, complete-record, and omission checks rather than overlap alone.",
    },
    inference: {
      serving: "Queue a versioned job, bound chunk concurrency, then aggregate with evidence intact. Compare normalized amounts/dates/roles/relations and verify claims against original spans; failed checks trigger review or source excerpts.",
      experiment: "Replay long, conflicting cases with blinded agent review. Canary draft handoffs; compare reading time and missed actions, with fabricated facts and wrong owners as guardrails.",
    },
    measure: [
      { label: "Offline", text: "Field exact match/F1 and relationship correctness; supported, contradicted, and unsupported claim rates; completeness and human usefulness. Calibrate automated judges with humans; ROUGE/BERTScore are secondary overlap signals." },
      { label: "Live", text: "Audited fact errors and critical omissions, agent edits, reading time, job latency, and cost by input-length bucket. Check accepted drafts too; source extraction can itself be wrong." },
    ],
    monitoring: "Track high-length tails, lost reversals, table-reading errors, and verifier disagreements. Version parser, extractor, summarizer, and prompts; retain sources for independent audits.",
    diagram: {
      online: [{ title: "Parse + chunk", detail: "Layout; tables; offsets" }, { title: "Briefs + fact lists", detail: "Parallel local processing" }, { title: "Aggregate + reconcile", detail: "Sources; chronology" }, { title: "Generate + verify", detail: "Facts ↔ original spans" }, { title: "Summary + JSON", detail: "Citations; unresolved flags" }],
      offline: [{ title: "Human + teacher refs", detail: "Summaries; exact facts" }, { title: "Audit evidence", detail: "Fields + relations" }, { title: "Train / adapt", detail: "Training split only" }, { title: "Locked case audit", detail: "Long tails; reversals" }, { title: "Versioned recipe", detail: "Extractor + generators" }],
      offlineLabel: "Training / evaluation", servingLabel: "Asynchronous case processing", feedsStep: 1, feedLabel: "Deploy evaluated extraction and summary recipe",
      parallelStep: { index: 1, branches: ["Local summarizer", "Structured fact extractor"] },
      learningLoop: "Audited omissions, contradictions, and field edits → targeted cases → independent regression checks.",
      caption: "Local summaries and structured facts are parallel outputs, both sent to aggregation. Preserve provenance and chronology instead of repeatedly compressing summaries alone.",
    },
    tradeoff: "Parallel chunks improve throughput but cannot remove the final aggregation dependency or make 100K-token inputs cheap. Increase compression only while critical-fact coverage stays acceptable.",
    followUp: { question: "The right amount appears somewhere in the source. Is the generated refund correct?", answer: "Check that the amount belongs to that refund, person, and final decision. Verify normalized facts and relationships against original evidence; matching a number anywhere is insufficient." },
    pitfalls: ["A final generator cannot restore a decision that every intermediate summary dropped.", "An LLM judge or source extractor is fallible; validate against original evidence and calibrated human samples."],
    capacity: "100K tokens at 4K/chunk needs at least 25 chunks before overlap. Budget local summary/extraction work plus the aggregation critical path; measure high-length job latency and generated tokens, not just parallel worker throughput.",
    reference: { title: "Hugging Face: summarization", href: "https://huggingface.co/docs/transformers/tasks/summarization", note: "Summarizer reference; evidence-preserving fact extraction and independent grounding checks complete this design." },
  },
];

// Keep earlier case links usable while the hub and sitemap use the specific architecture names.
export function getNlpDesignProblem(id: string) {
  return nlpDesignProblems.find((problem) => problem.id === id || problem.legacyIds?.includes(id));
}
