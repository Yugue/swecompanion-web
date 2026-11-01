export type DesignFlowNode = { title: string; detail: string };

export { mlSystemDesignFramework as nlpDesignFramework } from "./mlSystemDesignTopics";

export type NlpDesignProblem = {
  id: string;
  legacyIds?: string[];
  title: string;
  pattern: string;
  decision: string;
  summary: string;
  statement: string;
  requirements: string[];
  trainingExample: { input: string; target: string };
  designSteps: { title: string; text: string }[];
  mentalModel: string;
  example: { input: string; output: string };
  conversation: { speaker: "Interviewer" | "Candidate"; text: string }[];
  objectives: { business: string; ml: string };
  data: { sources: string; labels: string; features: string; validation: string };
  highLevel: { model: string; rationale: string };
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
    feedbackLabel?: string;
    ingestion?: { nodes: DesignFlowNode[]; feedsStep: number; label: string };
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
    "id": "content-moderation",
    "title": "Customer Support Issue Classification",
    "pattern": "Encoder → independent label scores",
    "decision": "The categories are known, and a message may belong to several at once.",
    "summary": "Read a customer message, identify every issue it contains, and return scored categories or a review outcome.",
    "mentalModel": "Imagine 150 switches, one per issue. “My package is damaged and I was charged twice” should turn on both Damaged product and Duplicate charge. Each switch is a separate decision.",
    "example": {
      "input": "“My package arrived broken, and you charged me twice.”",
      "output": "Damaged product and Duplicate charge, each with a confidence score. If no score clears its category’s cutoff, return an empty label set and NEEDS_REVIEW."
    },
    "conversation": [
      {
        "speaker": "Interviewer",
        "text": "Design an ML system that classifies customer support messages into issue categories."
      },
      {
        "speaker": "Candidate",
        "text": "Which languages and categories must we support? Can one message describe several issues?"
      },
      {
        "speaker": "Interviewer",
        "text": "Support 20 languages and 150 predefined categories. A message can contain multiple issues, so return every applicable label with a confidence score."
      },
      {
        "speaker": "Candidate",
        "text": "What happens if nothing fits, and what business outcome matters most?"
      },
      {
        "speaker": "Interviewer",
        "text": "Send unmatched or uncertain messages for review. We want less manual sorting and fewer transfers between support teams. Wrong labels send customers to the wrong team, but missed issues also delay resolution."
      }
    ],
    "objectives": {
      "business": "The goal is fewer transfers and less manual sorting, so route messages to the right support teams and shorten resolution time.",
      "ml": "Because several issues can coexist, recover all applicable labels. Limit wrong labels that cause transfers, and track missed issues and review volume."
    },
    "data": {
      "sources": "Use historical messages and agent corrections. Humans review examples across all 20 languages, rare categories, and messages containing several issues.",
      "labels": "Each message needs its complete set of categories. A large language model can suggest labels offline—this is the teacher—but people audit its answers. Keep unmatched messages as review examples, not forced category matches.",
      "features": "Read the whole short message, preserving negation, product names, and error codes. A tokenizer breaks text into model-readable pieces. “Not charged twice” must remain different from “charged twice.”",
      "validation": "Keep related customer threads together so copied messages do not appear in both training and testing. Use separate examples to choose models and score cutoffs; reserve a final human-labeled test set for reporting quality."
    },
    "highLevel": {
      "model": "Fine-tune a pretrained multilingual text encoder, such as XLM-R, with one yes/no output per category. “Fine-tune” means adapt a model that already reads many languages to these support labels.",
      "rationale": "The 150 categories are stable, so a compact classifier is a natural starting point. Independent outputs allow several labels at once. An LLM can help create training labels offline without being called for every live message."
    },
    "modeling": {
      "baseline": "Start with TF–IDF plus logistic regression: weight informative words and learn a yes/no decision for each category. Compare against a prompted language model on the same examples before choosing a more expensive approach.",
      "choice": "The encoder turns the message into a numeric summary. A classification head produces 150 independent scores between 0 and 1 using sigmoid outputs. Several scores can be high at once, which allows multiple labels.",
      "training": "Fine-tune the pretrained encoder on reviewed message-to-label examples. Binary cross-entropy trains each category as a separate yes/no target. Include rare categories and multi-issue messages; check real examples before trusting synthetic ones."
    },
    "inference": {
      "serving": "Accept each label only if its score exceeds that category’s cutoff. Check score reliability on held-out examples; a high score alone is not proof of correctness. If no label qualifies, return NEEDS_REVIEW.",
      "experiment": "First run the candidate in shadow mode: log predictions without changing routing. Then use a small traffic sample, called a canary. Expand only if routing quality and review queues remain acceptable; retain the previous version for rollback."
    },
    "measure": [
      {
        "label": "Offline",
        "text": "Precision measures how many returned labels are right; recall measures how many real issues are found. F1 balances the two. Report results by category and language, including rare categories, plus score reliability and the fraction sent for review."
      },
      {
        "label": "Live",
        "text": "Measure transfers between teams and time to resolution. Audit both accepted labels and reviewed messages; a smaller review queue is useful only if it does not hide more mistakes."
      }
    ],
    "monitoring": "Watch score distributions, review volume, and freshly audited errors by language/category. New products and slang may increase mistakes. Add serving replicas and batch short requests within the latency limit; retrain from reviewed new examples plus older examples so previous skills are retained.",
    "diagram": {
      "online": [
        {
          "title": "Customer message",
          "detail": "One of 20 languages"
        },
        {
          "title": "Inference service",
          "detail": "Normalize + tokenize"
        },
        {
          "title": "Live classifier",
          "detail": "150 independent scores"
        },
        {
          "title": "Decision policy",
          "detail": "Cutoffs → labels / review"
        },
        {
          "title": "Labels / review",
          "detail": "Return + log scores"
        }
      ],
      "offline": [
        {
          "title": "Teacher + humans",
          "detail": "Suggest, review, audit"
        },
        {
          "title": "Labeled examples",
          "detail": "Train / calibrate / test"
        },
        {
          "title": "Training job",
          "detail": "Adapt multilingual model"
        },
        {
          "title": "Offline evaluation",
          "detail": "Compare with live model"
        },
        {
          "title": "Model registry",
          "detail": "Approved versions"
        }
      ],
      "offlineLabel": "Training",
      "feedsStep": 2,
      "feedLabel": "Load the approved model version",
      "learningLoop": "Prediction logs and agent corrections feed the teacher/human labeling process; evaluated candidates reach the registry before serving.",
      "caption": "The live path scores messages; the offline path creates and evaluates improved models. A teacher is used for labeling, not automatically for every prediction.",
      "feedbackLabel": "Logged messages → audited training labels"
    },
    "tradeoff": "A higher cutoff usually reduces wrong labels but misses more real issues. Choose each category’s cutoff using routing cost and review capacity, rather than one global rule.",
    "followUp": {
      "question": "Does an unmatched message mean we need a new category?",
      "answer": "No. It may be unclear, noisy, or an existing issue the model missed. Humans review examples first; a new category needs a clear definition and labeled examples before the classifier gains another output."
    },
    "pitfalls": [
      "Forcing a single winning category loses the second issue in a multi-issue message.",
      "Agreement between an agent tag, a rule, and a teacher model can still be wrong. Keep independent human audits."
    ],
    "capacity": "Illustrative load: 5,000 messages/sec × 100 input tokens (text pieces) = 500,000 input tokens/sec. Measure throughput and response time on the chosen model, then add enough serving copies for peak traffic. Estimate teacher-labeling work separately from live requests.",
    "reference": {
      "title": "Hugging Face: XLM-RoBERTa",
      "href": "https://huggingface.co/docs/transformers/model_doc/xlm-roberta",
      "note": "Reference for a multilingual encoder; benchmark it against smaller models and the stated workload."
    },
    "statement": "Design an ML system that automatically classifies customer support messages into predefined issue categories.",
    "requirements": [
      "Accept customer messages in 20 languages.",
      "Assign one or more labels from 150 predefined categories.",
      "Recognize several issues in the same message.",
      "Handle messages that match no existing category.",
      "Return the selected labels with confidence scores."
    ],
    "trainingExample": {
      "input": "“My package arrived broken, and you charged me twice.” The same format applies in all 20 languages.",
      "target": "The complete set of correct categories, such as {Damaged product, Duplicate charge}. A label is simply a category name."
    },
    "designSteps": [
      {
        "title": "Read and score",
        "text": "The inference service cleans the message and calls the live classifier. The decision policy turns its 150 scores into labels or a review outcome."
      },
      {
        "title": "Learn from corrections",
        "text": "Store predictions and approved corrections. An offline teacher suggests more labels; humans audit them and maintain an independent evaluation set."
      },
      {
        "title": "Train and promote",
        "text": "A training job produces a candidate. Offline checks compare it with the live model; a versioned model registry records approved releases and supports rollback."
      }
    ]
  },
  {
    "id": "duplicate-detection",
    "title": "Semantic Duplicate Ticket Detection",
    "pattern": "Similarity shortlist → same-issue verification",
    "decision": "Similarity finds candidates; a separate decision establishes whether the issue is actually the same.",
    "summary": "Find tickets about the same underlying issue even when the words differ, while protecting unrelated incidents from false merges.",
    "mentalModel": "A librarian pulls a small stack of similar case files. A detective then compares them carefully. “Both mention checkout” is a reason to investigate, not permission to merge.",
    "example": {
      "input": "New: “Version 8.2 checkout fails with E42.” Ticket T-104: “E42 blocks purchases after the 8.2 update.”",
      "output": "Return T-104 if review-quality evidence confirms the same underlying issue. A ticket about a different checkout failure remains separate; no verified match returns NOVEL."
    },
    "conversation": [
      {
        "speaker": "Interviewer",
        "text": "Design a system that detects duplicate support tickets among 100 million historical tickets."
      },
      {
        "speaker": "Candidate",
        "text": "Does duplicate mean the same topic or the same underlying issue? Can the wording or language differ?"
      },
      {
        "speaker": "Interviewer",
        "text": "It must be the same underlying issue, even across languages or very different wording. Related tickets must stay separate. Return the canonical ticket ID—the representative ID of the confirmed duplicate group—or NOVEL if no duplicate is found."
      },
      {
        "speaker": "Candidate",
        "text": "Must new tickets become searchable continuously? Which mistake costs more: missing a duplicate or merging distinct issues?"
      },
      {
        "speaker": "Interviewer",
        "text": "Yes, continuously ingest new tickets. Wrong merges are more costly because they can hide a real issue. We want to avoid repeated investigation without losing distinct customer problems."
      }
    ],
    "objectives": {
      "business": "Repeated tickets waste investigation time, so reuse existing investigations while keeping distinct customer problems visible.",
      "ml": "Because false merges are more costly, set a strict false-merge limit first. Within that limit, find as many genuine duplicates as possible, including across languages."
    },
    "data": {
      "sources": "Start with agent-confirmed duplicate links and reviewed ticket pairs. A language model can suggest extra pair labels offline, but people audit them. Sharing a customer, product, or topic is not enough to establish duplication.",
      "labels": "Use three pair labels: DUPLICATE, RELATED_BUT_DIFFERENT, and UNRELATED. Include confusing nonduplicates, called hard negatives. Review unlinked high-scoring pairs too; an absent link does not prove two tickets are different.",
      "features": "Read subject, body, product version, and error details. A multilingual encoder maps each ticket to an embedding—a numeric address used to find similar meanings across wording and languages.",
      "validation": "Keep each confirmed issue group out of other training/test splits. Replay held-out tickets against history available before each arrival, then tune acceptance cutoffs on separate examples. Never let a query retrieve itself."
    },
    "highLevel": {
      "model": "Use a multilingual bi-encoder to find candidates, then a cross-encoder to verify pairs. The bi-encoder reads tickets separately for fast search; the cross-encoder reads both together to judge whether they describe the same issue.",
      "rationale": "A careful comparison against all 100 million tickets is too costly. First retrieve a small shortlist, then spend verification work on that shortlist. Benchmark retrieval alone to learn whether the extra verifier is needed."
    },
    "modeling": {
      "baseline": "Compare BM25 keyword search with embedding search. Keywords help with exact error codes; embeddings help with paraphrases. Judge duplicate decisions on reviewed pairs, not similarity scores alone.",
      "choice": "Store historical embeddings in an approximate nearest-neighbor index (ANN), which quickly finds nearby vectors. Retrieve, for example, 50 candidates and verify the best few. The verifier scores duplicate, related, and unrelated separately.",
      "training": "Train the retriever to pull true duplicates closer and push hard negatives apart: contrastive learning. Train the verifier on the three pair labels. Audited teacher-model judgments can add examples; final quality still needs human-labeled testing."
    },
    "inference": {
      "serving": "Return a canonical ID only when the duplicate score clears a tested cutoff and the evidence identifies a consistent group. Otherwise return NOVEL and optionally queue the pair for later review. NOVEL means no verified match, not certainty that no duplicate exists.",
      "experiment": "Replay past arrivals, then show shadow suggestions without changing ticket groups. Trial suggestions with a small group of agents before wider release. Keep a decision log and compatible previous model/index versions for rollback."
    },
    "measure": [
      {
        "label": "Offline",
        "text": "Check whether a real duplicate appears in the top K candidates: Recall@K. Then measure the fraction of accepted matches that are correct and the fraction of true duplicates found. Test related-but-different tickets and each language separately."
      },
      {
        "label": "Live",
        "text": "Audit rejected suggestions, missed duplicates, NOVEL rates, and investigation time saved. Separately compare approximate search with an exact scan on a sample to detect index-search losses."
      }
    ],
    "monitoring": "Watch similarity scores and freshly reviewed errors by language. Search a main index plus a small delta index of recent tickets; fold delta into main periodically. A new encoder changes the numeric addresses, so rebuild historical vectors and release the encoder/index together.",
    "diagram": {
      "online": [
        {
          "title": "New ticket",
          "detail": "Subject + body + context"
        },
        {
          "title": "Encoder + retrieval",
          "detail": "Search main + delta"
        },
        {
          "title": "Pair verifier",
          "detail": "Duplicate / related / other"
        },
        {
          "title": "Decision policy",
          "detail": "Canonical ID or NOVEL"
        },
        {
          "title": "Canonical ID / NOVEL",
          "detail": "Return + log pairs"
        }
      ],
      "offline": [
        {
          "title": "Teacher + humans",
          "detail": "Review difficult pairs"
        },
        {
          "title": "Labeled pairs",
          "detail": "Train / calibrate / test"
        },
        {
          "title": "Training job",
          "detail": "Retriever + verifier"
        },
        {
          "title": "Offline evaluation",
          "detail": "Recall; false merges"
        },
        {
          "title": "Model registry",
          "detail": "Compatible model / index"
        }
      ],
      "offlineLabel": "Training and release",
      "feedsStep": 1,
      "feedLabel": "Release compatible encoder and index",
      "learningLoop": "Reviewed pairs improve retrieval and verification. A separate ingestion path embeds new tickets into delta, then compacts the index.",
      "caption": "Retrieval narrows the search; verification protects strict equivalence. New-ticket ingestion updates searchable history independently of retraining.",
      "feedbackLabel": "Difficult ticket pairs → reviewed examples",
      "ingestion": {
        "nodes": [
          {
            "title": "New tickets",
            "detail": "After match decision"
          },
          {
            "title": "Keep IDs + context",
            "detail": "Own ID / matched group"
          },
          {
            "title": "Encode once",
            "detail": "Live encoder version"
          },
          {
            "title": "Fresh delta index",
            "detail": "Search immediately"
          },
          {
            "title": "Main + delta search",
            "detail": "Compact periodically"
          }
        ],
        "feedsStep": 1,
        "label": "Fresh vectors → live retrieval"
      }
    },
    "tradeoff": "A stricter decision cutoff prevents more false merges but leaves more real duplicates for agents. Ranking quality chooses the shortlist; calibrated duplicate precision chooses the final acceptance rule.",
    "followUp": {
      "question": "The correct duplicate is in the shortlist, but merges are still wrong. What do we fix?",
      "answer": "Inspect the verifier and acceptance cutoff using related-but-different examples. If the real duplicate never reached the shortlist, fix retrieval instead. These are different failure stages."
    },
    "pitfalls": [
      "Related, similar, and duplicate are different judgments. Never merge on a shared topic alone.",
      "Do not silently label every unlinked pair negative, or change the encoder without rebuilding compatible historical embeddings."
    ],
    "capacity": "Illustrative load: 500 tickets/sec × five verified candidates = 2,500 pair comparisons/sec, in addition to query encoding and index search. Budget the one-time encoding of 100 million historical tickets separately. Measure each stage before choosing machines.",
    "reference": {
      "title": "Sentence Transformers: cross-encoder training",
      "href": "https://sbert.net/docs/cross_encoder/training_overview.html",
      "note": "Reference for pairwise models and hard-negative training; the labels here encode strict duplication."
    },
    "statement": "Design an ML system that detects whether a new support ticket is semantically equivalent to an existing ticket among 100 million historical tickets.",
    "requirements": [
      "Accept multilingual tickets and recognize paraphrases.",
      "Return the canonical ticket ID for a verified duplicate.",
      "Return NOVEL when no duplicate is verified.",
      "Avoid merging tickets that are only related.",
      "Continuously make newly ingested tickets searchable."
    ],
    "trainingExample": {
      "input": "Pair: “Version 8.2 checkout fails with E42” and “E42 blocks purchases after the 8.2 update.”",
      "target": "DUPLICATE, after human confirmation. Other pairs receive RELATED_BUT_DIFFERENT or UNRELATED, teaching the verifier that a shared topic need not be the same issue."
    },
    "designSteps": [
      {
        "title": "Find candidates",
        "text": "Encode the arriving ticket and search earlier history in main plus delta. Retrieve candidate ticket IDs before adding this ticket, so it cannot match itself."
      },
      {
        "title": "Verify and decide",
        "text": "Compare shortlisted pairs, resolve their canonical group IDs, and return one verified ID or NOVEL. Conflicting evidence stays separate."
      },
      {
        "title": "Keep history current",
        "text": "After the decision, record this ticket’s own ID and group mapping, then add its vector to delta. New tickets become searchable without retraining."
      },
      {
        "title": "Improve safely",
        "text": "Review difficult pairs, train candidate models, and evaluate on held-out arrivals. A model registry records approved versions; release each encoder with its matching index."
      }
    ]
  },
  {
    "id": "workflow-matching",
    "legacyIds": [
      "support-ticket-routing",
      "semantic-search"
    ],
    "title": "Match requests to changing workflows",
    "pattern": "Retrieve known actions → accept or abstain",
    "decision": "A curated registry changes faster than model weights should.",
    "summary": "Select the correct workflow from thousands of changing actions, or return UNSUPPORTED when none fits.",
    "mentalModel": "A dispatcher searches a live playbook, then checks that the chosen procedure actually fits the request.",
    "example": {
      "input": "Stop my monthly plan, but keep my current order.",
      "output": "CANCEL_SUBSCRIPTION; never CANCEL_ORDER. Selection still requires authorization and parameter validation before execution."
    },
    "conversation": [
      {
        "speaker": "Interviewer",
        "text": "Design a system that maps a customer request to a support workflow, such as canceling a subscription."
      },
      {
        "speaker": "Candidate",
        "text": "Which languages do we support, how often do workflows change, and what should we return when no workflow applies?"
      },
      {
        "speaker": "Interviewer",
        "text": "Requests are multilingual. We have 20,000 curated workflows, edited daily and searchable within minutes. Return one active workflow ID or UNSUPPORTED. Expect 10,000 requests/sec with most responses under 150 ms."
      },
      {
        "speaker": "Candidate",
        "text": "Are we selecting an action or executing it? What makes a selection successful?"
      },
      {
        "speaker": "Interviewer",
        "text": "Select only. Check required inputs and prerequisites; a separate authorized service executes the action. We want more correctly resolved requests. A wrong action is worse than asking for help."
      }
    ],
    "objectives": {
      "business": "The goal is more correctly resolved requests, so select useful actions while avoiding costly wrong actions.",
      "ml": "Because wrong selections are costly, prioritize the correctness of accepted workflow IDs. Then increase supported-request coverage while rejecting unsupported requests."
    },
    "data": {
      "sources": "Each workflow is an approved procedure with an ID, description, example requests, required inputs, and prerequisites. Use reviewed support requests to capture the different ways customers ask for it.",
      "labels": "Pair each request with its correct active workflow, or mark it UNSUPPORTED. Include easily confused actions such as cancel-order and cancel-subscription. Audit any generated examples before using them.",
      "features": "Convert requests and workflow descriptions into embeddings: numeric vectors that place similar meanings near one another. Keep account permissions and mandatory inputs as explicit checks in the execution service.",
      "validation": "Group paraphrases of the same request together, then test on later requests and catalog versions. Tune acceptance cutoffs separately, with unsupported requests and newly added workflows included."
    },
    "highLevel": {
      "model": "Use a multilingual bi-encoder to read requests and workflow descriptions separately, then find matching descriptions by their embeddings. Return one active ID or UNSUPPORTED.",
      "rationale": "A fixed-category classifier needs an output for every action. Searching descriptions lets a new workflow become searchable as soon as its description is encoded. Retraining is reserved for improving matching quality."
    },
    "modeling": {
      "baseline": "Try keyword search first. Next compare embedding search using an exact scan of the 20,000 workflow vectors; use an approximate index only if measured traffic and latency justify it.",
      "choice": "Retrieve the top K candidate descriptions. If needed, a cross-encoder reads each request and candidate together to rerank them. A separate tested score cutoff decides acceptance; being first in the ranking is not enough.",
      "training": "Train on reviewed request–workflow pairs. Contrastive learning brings correct pairs closer and separates confusing wrong ones. Include diverse unsupported requests when choosing the rejection cutoff."
    },
    "inference": {
      "serving": "Accept an active workflow only when its match score clears the cutoff; otherwise return UNSUPPORTED. A separate authorized service checks permissions, required inputs, and prerequisites before execution.",
      "experiment": "Log candidate selections without executing them, compare with reviewed answers, then trial a small share of requests. Expand only if wrong selections and unsupported-request acceptance remain acceptable."
    },
    "measure": [
      {
        "label": "Offline",
        "text": "Check whether the correct workflow reaches the shortlist, then whether the final accepted ID is right. Report supported coverage and false acceptance of unsupported requests. Compare approximate search with an exact scan separately."
      },
      {
        "label": "Live",
        "text": "Audit wrong-action selections, successful resolutions, catalog update lag, latency, and cost. Execution failures may reflect permissions or missing parameters rather than a matching mistake."
      }
    ],
    "monitoring": "Watch wrong selections, unsupported requests, and the delay before workflow edits become searchable. Remove retired IDs immediately. Start with a versioned full index; add a main-plus-delta update scheme only if rebuilds cannot meet freshness needs.",
    "diagram": {
      "online": [
        {
          "title": "Request + context",
          "detail": "Multilingual query"
        },
        {
          "title": "Bi-encoder search",
          "detail": "Main + delta; active IDs"
        },
        {
          "title": "Optional verifier",
          "detail": "Request ↔ action spec"
        },
        {
          "title": "Acceptance gate",
          "detail": "Calibrated precision"
        },
        {
          "title": "ID / UNSUPPORTED",
          "detail": "Execution is separate"
        }
      ],
      "offline": [
        {
          "title": "Curated actions",
          "detail": "Specs + utterances"
        },
        {
          "title": "Validate + embed",
          "detail": "Matching encoder version"
        },
        {
          "title": "Delta index",
          "detail": "Fresh validated records"
        },
        {
          "title": "Merge / compact",
          "detail": "Retire via active filter"
        },
        {
          "title": "Main + delta library",
          "detail": "Publish current IDs"
        }
      ],
      "offlineLabel": "Registry updates",
      "feedsStep": 1,
      "feedLabel": "Search current action specifications",
      "learningLoop": "Audited matches and verified hard negatives → encoder/gate evaluation; registry edits update embeddings independently.",
      "caption": "New actions enter delta directly. Retirement updates the active-ID filter immediately; do not wait for main-index compaction."
    },
    "tradeoff": "A longer shortlist can recover missed actions but costs more to verify. If the correct action is absent, improve search; if it is present but rejected or outranked, inspect verification and the cutoff.",
    "followUp": {
      "question": "Can UNSUPPORTED be one more vector in the index?",
      "answer": "No single vector represents every unsupported intent. Calibrate rejection on diverse supported/unsupported pairs, and apply the gate to the actual candidate score."
    },
    "pitfalls": [
      "Top-K chooses candidate volume; it does not set the accept/reject threshold.",
      "Do not cluster a curated action registry or retrain for every catalog edit."
    ],
    "capacity": "At 10,000 requests/sec, checking 20 candidate pairs per request adds 200,000 pair comparisons/sec. Benchmark exact search, query encoding, and optional reranking separately against the 150 ms response target; shortlist size is a cost decision.",
    "reference": {
      "title": "Sentence Transformers: retrieve and rerank",
      "href": "https://www.sbert.net/examples/sentence_transformer/applications/retrieve_rerank/README.html",
      "note": "Reference for candidate retrieval and optional pairwise reranking."
    },
    "statement": "Design a system that maps a customer request to the right action in a changing workflow catalog.",
    "requirements": [
      "Accept requests in multiple languages.",
      "Search 20,000 curated workflows that change daily.",
      "Return one active workflow ID or UNSUPPORTED.",
      "Check prerequisites before an authorized service executes the action."
    ],
    "trainingExample": {
      "input": "“Stop future monthly payments, but keep this order.”",
      "target": "CANCEL_SUBSCRIPTION, with CANCEL_ORDER as a deliberately confusing wrong candidate."
    },
    "designSteps": [
      {
        "title": "Publish the playbook",
        "text": "Validate descriptions and encode each active workflow with the live model. Publish versioned updates and exclude retired IDs immediately."
      },
      {
        "title": "Match and reject",
        "text": "Encode the request, search descriptions, and optionally rerank a short list. Return the accepted active ID or UNSUPPORTED; execution happens separately."
      },
      {
        "title": "Learn from reviewed outcomes",
        "text": "Collect wrong selections and missed matches. Train an improved encoder only when useful, evaluate it on later requests, then rebuild compatible catalog vectors before release."
      }
    ]
  },
  {
    "id": "entity-linking",
    "legacyIds": [
      "information-extraction"
    ],
    "title": "Link product mentions to catalog IDs",
    "pattern": "Detect mentions → retrieve → verify identity",
    "decision": "Free text must resolve to exact canonical entities.",
    "summary": "Find every product mention in a message and link it to the right variant in a large catalog, or return NO_MATCH.",
    "mentalModel": "Highlight the products in a sentence, then check their identity cards. Similar names can belong to different products.",
    "example": {
      "input": "“The blue Model X 128GB overheats, but my Model X 256GB works.”",
      "output": "Two product mentions linked to two distinct catalog variant IDs. If a variant cannot be identified reliably, return NO_MATCH for that mention."
    },
    "conversation": [
      {
        "speaker": "Interviewer",
        "text": "Find products mentioned in multilingual messages and link them to our catalog of 50 million products."
      },
      {
        "speaker": "Candidate",
        "text": "Can a message mention several products, use aliases or typos, or refer to something absent from the catalog?"
      },
      {
        "speaker": "Interviewer",
        "text": "Yes. Handle zero, one, or several mentions, including aliases, misspellings, and multilingual descriptions. Return the exact product variant ID or NO_MATCH for each mention. Keep new and retired products up to date."
      },
      {
        "speaker": "Candidate",
        "text": "What will these links be used for, and how costly is confusing two similar variants?"
      },
      {
        "speaker": "Interviewer",
        "text": "We use them to connect product discussions to catalog records. Linking the wrong storage size or model is expensive; leave an uncertain or absent product unmatched."
      }
    ],
    "objectives": {
      "business": "Product discussions must connect to the right records, so avoid incorrect links that mix up models or variants.",
      "ml": "Because exact variants matter, measure both finding each product mention and linking it to the correct ID. Control false links and correctly return NO_MATCH for absent products."
    },
    "data": {
      "sources": "Use catalog names, aliases, model numbers, colors, and storage sizes. Humans mark product phrases in real messages and link them to exact records. Clicks suggest candidates but are not automatically correct labels.",
      "labels": "Teach both the mention span (its position in the text) and the exact catalog ID. Include typos, several mentions, absent products, and nearly identical variants.",
      "features": "Read each product phrase with its sentence. Keep “blue,” “128GB,” and model codes attached to the right mention. Combine embeddings (numeric vectors representing meaning) with keyword matching and explicit variant attributes.",
      "validation": "Group repeated messages and hold out later catalog versions. Test with human-marked spans first, then with model-detected spans, so linking errors can be separated from detection errors."
    },
    "highLevel": {
      "model": "Use a token classifier to highlight product phrases. A bi-encoder reads each phrase/context and catalog description separately for fast search; a cross-encoder can compare shortlisted pairs to check exact identity.",
      "rationale": "Finding the words “Model X” and deciding which Model X record they mean are different jobs. Separating them reveals where errors happen and lets new products enter search without retraining the detector."
    },
    "modeling": {
      "baseline": "Start with exact model-code and alias lookup plus a pretrained mention detector. Measure which misspellings, languages, and sibling variants these simple methods miss.",
      "choice": "The detector marks product words. Retrieval finds candidate catalog records; a cross-encoder can compare each candidate with the mention and sentence. Explicit storage/model conflicts reject a candidate even when its wording is similar.",
      "training": "Train the detector on labeled text spans. Train retrieval and verification on reviewed mention–ID pairs, including confusing variants. Use absent and ambiguous products to choose when to return NO_MATCH."
    },
    "inference": {
      "serving": "Keep each mention’s original position and qualifiers. Return a matching active variant ID only above the acceptance cutoff; otherwise return NO_MATCH. A missing qualifier may make an exact variant impossible to identify.",
      "experiment": "Compare human-span and detected-span results before release. Trial linked IDs with a small group of users, auditing wrong variants before allowing links to drive downstream actions."
    },
    "measure": [
      {
        "label": "Offline",
        "text": "Measure mention-boundary correctness, candidate-ID recall, exact final ID accuracy, and false links. A correct product name with the wrong variant ID is still an error."
      },
      {
        "label": "Live",
        "text": "Audit unmatched and wrong-variant results by language/brand; watch catalog freshness, messages with many mentions, latency, and cost."
      }
    ],
    "monitoring": "Watch wrong-variant links, unmatched mentions, and errors by language or brand. Add new catalog vectors promptly and filter retired IDs immediately. Scale mention detection, catalog search, and pair verification according to their measured loads.",
    "diagram": {
      "online": [
        {
          "title": "Text → mentions",
          "detail": "Phrases + text positions"
        },
        {
          "title": "Encode with context",
          "detail": "Retain variant qualifiers"
        },
        {
          "title": "Hybrid retrieval",
          "detail": "Main + delta; filters"
        },
        {
          "title": "Verify + reject",
          "detail": "Exact identity; calibrated"
        },
        {
          "title": "IDs / NO_MATCH",
          "detail": "One result per mention"
        }
      ],
      "offline": [
        {
          "title": "Canonical catalog",
          "detail": "IDs + aliases + variants"
        },
        {
          "title": "Validate metadata",
          "detail": "Distinct sibling products"
        },
        {
          "title": "Embed item records",
          "detail": "Compatible encoder"
        },
        {
          "title": "Update active IDs",
          "detail": "New / retired records"
        },
        {
          "title": "Searchable catalog",
          "detail": "Dense + keyword"
        }
      ],
      "offlineLabel": "Catalog updates",
      "feedsStep": 2,
      "feedLabel": "Retrieve active catalog candidates",
      "learningLoop": "Reviewed spans and exact-ID corrections → separately improve detection, retrieval, and verification.",
      "caption": "Detection locates mentions; linking resolves identity. The linker receives context, not just an isolated product name."
    },
    "tradeoff": "More candidates improve identity recall but increase pairwise cost. A verifier is useful for lookalike variants only after the right ID reaches the shortlist.",
    "followUp": {
      "question": "Why not search for just the words “Model X”?",
      "answer": "That discards the color and storage size that distinguish variants. Keep surrounding qualifiers with each mention, and enforce explicit attribute conflicts instead of trusting similarity alone."
    },
    "pitfalls": [
      "Do not merge catalog products merely because their descriptions are similar.",
      "A correct mention span is not proof of a correct entity link."
    ],
    "capacity": "Example storage estimate: 50 million products × 768 numbers/vector × two bytes/number = 76.8 GB for raw vectors. The search index, metadata, and extra copies need more space. Measure memory and search time before choosing compression or sharding.",
    "reference": {
      "title": "Hugging Face: token classification",
      "href": "https://huggingface.co/docs/transformers/tasks/token_classification",
      "note": "Implementation reference for the mention detector; retrieval and exact-ID verification are separate stages."
    },
    "statement": "Find product mentions in multilingual messages and map each mention to an exact ID in a 50-million-product catalog.",
    "requirements": [
      "Handle zero, one, or several product mentions.",
      "Understand aliases, typos, and multilingual descriptions.",
      "Return the correct product variant ID or NO_MATCH.",
      "Keep new and retired catalog products up to date."
    ],
    "trainingExample": {
      "input": "“The blue Model X 128GB is overheating.”",
      "target": "The product-name span plus the exact blue/128GB catalog ID, not a similar 256GB variant."
    },
    "designSteps": [
      {
        "title": "Locate each mention",
        "text": "Highlight product phrases and preserve their text positions and surrounding qualifiers."
      },
      {
        "title": "Resolve identity",
        "text": "Search active catalog records, check exact attributes, and verify difficult pairs. Return one ID or NO_MATCH for each mention."
      },
      {
        "title": "Update data and models separately",
        "text": "Publish new catalog vectors and filter retired IDs immediately. Use reviewed span and ID corrections to train and test the failing stage; a new encoder requires compatible catalog vectors."
      }
    ]
  },
  {
    "id": "emerging-issues",
    "legacyIds": [
      "aspect-sentiment"
    ],
    "title": "Discover emerging customer issues",
    "pattern": "Unknown observations → validated new issues",
    "decision": "New recurring categories must be discovered, not just assigned.",
    "summary": "Find genuinely new problems after a release, without promoting praise, copied complaints, or spam into incidents.",
    "mentalModel": "A newsroom tip desk: route familiar stories, group credible new tips, then check whether the story is real and growing.",
    "example": {
      "input": "Independent users report: “After release 8.2, exported PDFs are blank.”",
      "output": "A reviewed issue such as ISSUE-201, with representative reports and a growth timeline. Future matching reports attach to ISSUE-201."
    },
    "conversation": [
      {
        "speaker": "Interviewer",
        "text": "Discover new recurring customer issues from millions of multilingual messages each day."
      },
      {
        "speaker": "Candidate",
        "text": "Do we already know some issues? What distinguishes a useful discovery from a group of similar messages?"
      },
      {
        "speaker": "Interviewer",
        "text": "There are 200 known issues; assign reports to them when possible. For the rest, reject spam, praise, and irrelevant chatter. Find credible new recurring problems within an hour."
      },
      {
        "speaker": "Candidate",
        "text": "Who confirms a new issue, and what should happen after confirmation?"
      },
      {
        "speaker": "Interviewer",
        "text": "A reviewer confirms discoveries before adding them to the known issue registry. New reports should then match that issue promptly. We want earlier incident detection without overwhelming responders with false alerts."
      }
    ],
    "objectives": {
      "business": "Responders need earlier, useful warnings, so reduce incident discovery time while keeping false alerts manageable.",
      "ml": "Because similarity alone does not establish a new incident, recover issue-like messages, form coherent groups, and validate novelty, persistence, and credibility before promotion."
    },
    "data": {
      "sources": "Collect messages with timestamps, release versions, and source identifiers that allow independent reports to be counted. Keep definitions and examples for the 200 known issues, plus past confirmed incidents.",
      "labels": "Humans mark known-issue matches and distinguish problem reports from praise or spam. They also judge proposed groups: one new incident, an existing issue, unrelated reports, or noise.",
      "features": "Use multilingual text embeddings—numeric vectors describing meaning—to group similar reports. Track distinct sources, growth, and persistence separately. Repeated copies should not count as many independent confirmations.",
      "validation": "Replay past messages in time order using only issue definitions available then. Measure whether each real incident would have been found within an hour, including false alerts and messages wrongly filtered out."
    },
    "highLevel": {
      "model": "Use embedding search for known issues, a small text classifier for issue-versus-noise filtering, then clustering to group the remaining reports. Humans confirm promising new groups.",
      "rationale": "Known-issue search only finds issues already in the library. Clustering suggests new groups; independent reports, timing, and review determine whether a group deserves an incident ID."
    },
    "modeling": {
      "baseline": "Match known issue examples and send frequent unmatched phrases to reviewers. This establishes whether automated clustering reduces review work or finds issues sooner.",
      "choice": "Try multilingual embeddings with HDBSCAN, which groups nearby reports and can leave isolated messages unassigned. Pick representative real messages from each group, then check novelty, growth, and independent sources.",
      "training": "Train the known-issue matcher and issue/noise filter on reviewed examples. Clustering groups observations without predefined new-issue labels. Tune its settings on past incidents and include rare-language reports in evaluation."
    },
    "inference": {
      "serving": "Assign confident known matches directly. Group unmatched issue-like messages in rolling time windows; align overlapping groups across windows to avoid duplicate alerts. Review a proposed incident before publishing its ID and examples.",
      "experiment": "Replay historical incidents, then let responders review alerts without paging anyone. Trial notifications only after checking false alerts, missed incidents, and discovery delay."
    },
    "measure": [
      {
        "label": "Offline",
        "text": "Check known assignments, recovery of novel issue-like messages, and whether clusters wrongly merge or split incidents. Measure time to detection and false promotions on historical replays."
      },
      {
        "label": "Live",
        "text": "Track responder-confirmed alert quality, review load, source diversity, and whether newly approved issues become assignable promptly."
      }
    ],
    "monitoring": "Track missed incidents, spam-driven alerts, and reviewer workload. Keep isolated issue-like reports for later windows so weak early signals are not permanently discarded. A newly confirmed issue updates the known library immediately; model retraining can follow later.",
    "diagram": {
      "online": [
        {
          "title": "Incoming messages",
          "detail": "Release + source context"
        },
        {
          "title": "Known-issue gate",
          "detail": "Match current registry"
        },
        {
          "title": "Unknown issue pool",
          "detail": "Noise gate; de-spam"
        },
        {
          "title": "Cluster + trend",
          "detail": "Coherence; growth; novelty"
        },
        {
          "title": "Assign / promote",
          "detail": "New issues need review"
        }
      ],
      "offline": [
        {
          "title": "Validated issues",
          "detail": "Definitions + reviews"
        },
        {
          "title": "Encode examples",
          "detail": "Confirmed issue reports"
        },
        {
          "title": "Publish delta",
          "detail": "New known issues only"
        },
        {
          "title": "Compact + version",
          "detail": "Active issue IDs"
        },
        {
          "title": "Known registry",
          "detail": "Main + delta indexes"
        }
      ],
      "offlineLabel": "Known registry",
      "servingLabel": "Assignment and discovery",
      "feedsStep": 1,
      "feedLabel": "Search confirmed known issues",
      "bypass": {
        "fromStep": 1,
        "label": "Known match → assign directly"
      },
      "learningLoop": "Confirmed groups receive an issue ID and searchable examples now; reviewed outcomes improve trained models in later releases.",
      "caption": "Known matches go directly to assignment. Only plausible unmatched reports enter discovery; a reviewer confirms new issues before they join the known library."
    },
    "tradeoff": "Waiting for more independent reports reduces false alerts but delays detection. Let severity and source diversity influence review priority; cluster size alone should not determine promotion.",
    "followUp": {
      "question": "A cluster doubles in size. Is that an emerging issue?",
      "answer": "Check distinct sources, copying/spam, persistence, novelty against known issues, and a historical baseline. Clustering establishes similarity; temporal growth and review establish an emerging issue."
    },
    "pitfalls": [
      "An unmatched message may be praise, noise, or a missed known issue.",
      "Do not discard every isolated report permanently, or create a fresh incident ID for the same group in every time window."
    ],
    "capacity": "Illustrative load: five million messages/day averages about 58/sec, with higher peaks. Encode each message once, then cluster recent unknown reports in bounded windows. Measure the slowest window plus review delay against the one-hour discovery target.",
    "reference": {
      "title": "scikit-learn: HDBSCAN",
      "href": "https://scikit-learn.org/stable/modules/generated/sklearn.cluster.HDBSCAN.html",
      "note": "Clustering reference; trend scoring, noise filtering, and issue validation remain separate decisions."
    },
    "statement": "Discover genuinely new recurring customer issues from millions of multilingual messages each day.",
    "requirements": [
      "Assign messages to 200 known issues when possible.",
      "Reject spam, praise, and irrelevant chatter.",
      "Find credible new issues within an hour.",
      "Review discoveries before adding them to the known issue registry."
    ],
    "trainingExample": {
      "input": "“After version 8.2, exported PDFs are blank.”",
      "target": "An issue-like message, with known-issue assignment if available. Reviewers later judge whether grouped reports represent a genuinely new incident."
    },
    "designSteps": [
      {
        "title": "Separate familiar reports from candidates",
        "text": "Search confirmed known issues first. Apply the issue/noise filter to unmatched messages and retain plausible new reports with timestamps and source counts."
      },
      {
        "title": "Group and investigate",
        "text": "Cluster recent candidates, connect repeated groups across windows, and inspect representative reports. Compare with known issues before notifying a reviewer."
      },
      {
        "title": "Publish a confirmed issue",
        "text": "A reviewer creates the canonical issue ID, description, and examples. Publish them to the known library now; use reviewed outcomes to improve models in a separately evaluated release."
      }
    ]
  },
  {
    "id": "grounded-question-answering",
    "title": "Answer questions from company documents",
    "pattern": "Retrieve evidence → answer → verify support",
    "decision": "An answer must be justified by current, permitted evidence.",
    "summary": "Give cited, grounded answers from a changing corpus, and abstain when relevant passages still do not answer the question.",
    "mentalModel": "An open-book exam: finding the right chapter is only the first step; the cited lines must actually justify the answer.",
    "example": {
      "input": "An employee asks: “How many vacation days can I carry over?” Their region is not supplied.",
      "output": "Ask for the region first. If the permitted current policy says five days, answer “Up to five days” with that passage cited; otherwise return INSUFFICIENT_EVIDENCE."
    },
    "conversation": [
      {
        "speaker": "Interviewer",
        "text": "Build an assistant that answers employee questions from company documents, manuals, and policy pages."
      },
      {
        "speaker": "Candidate",
        "text": "Which sources may it use, how do policies change, and must answers include supporting evidence?"
      },
      {
        "speaker": "Interviewer",
        "text": "Use only documents the employee may access. Cite supporting passages and account for changing or conflicting policy versions. Policies change daily; some manuals contain screenshots."
      },
      {
        "speaker": "Candidate",
        "text": "What should happen when the question is ambiguous or the available documents do not support an answer? What outcome matters?"
      },
      {
        "speaker": "Interviewer",
        "text": "Ask for clarification or return INSUFFICIENT_EVIDENCE. Provide answers only, usually within four seconds. We want faster question resolution without unsupported advice or disclosure of restricted information."
      }
    ],
    "objectives": {
      "business": "Employees need reliable answers faster, so reduce question-resolution time without unsupported advice or restricted-information disclosure.",
      "ml": "Because answers need current, permitted evidence, retrieve authoritative passages and produce complete, supported claims. Clarify or abstain when evidence is insufficient or conflicts remain."
    },
    "data": {
      "sources": "Use company documents with access permissions, effective dates, regions, and source links. Experts provide real questions, correct answers, and the passages supporting them. Extract screenshot text while retaining links to the originals.",
      "labels": "Judge two things separately: is a passage relevant, and does it actually answer the question? Include ambiguous questions, missing answers, and conflicting policy versions.",
      "features": "Split documents into readable passages with headings and source pointers. Search by keywords and embeddings (vectors representing meaning). Keep permissions, dates, and region as explicit filters rather than asking the model to infer them.",
      "validation": "Test on held-out questions and later document snapshots. Include users with different permissions, revoked access, policy changes, and no-answer cases. Humans audit any automated answer-quality scores."
    },
    "highLevel": {
      "model": "Use retrieval-augmented generation (RAG): search documents the employee may access, then give the selected passages to a pretrained language model to write a cited answer.",
      "rationale": "Policies can change in the search library without retraining the language model. Retrieval supplies evidence; the generator turns it into an answer. Relevant text still needs to contain enough information to answer the actual question."
    },
    "modeling": {
      "baseline": "Return the best source excerpts with links. Compare this with generated answers using the same permitted evidence, so the value and risk of generation are visible.",
      "choice": "Combine keyword and meaning-based search. A reranker can compare the question with each candidate passage more carefully. Clarify missing scope, then generate only from sufficient evidence and check each claim against its cited passage.",
      "training": "Start with a pretrained generator and no custom training. Improve retrieval using reviewed question–passage pairs. Fine-tune only if audited errors justify it; training does not replace current evidence or access checks."
    },
    "inference": {
      "serving": "Filter permissions before passages reach the generator. Treat retrieved text as evidence, not instructions. If scope is unclear, ask a question; if evidence is missing or conflicts cannot be resolved, return INSUFFICIENT_EVIDENCE.",
      "experiment": "Pass expert answer audits and permission tests, then trial a small user group. Check useful-answer coverage as well as correctness: refusing every question is not success. Keep the previous prompt/model version available."
    },
    "measure": [
      {
        "label": "Offline",
        "text": "Check retrieval of real supporting passages, answer completeness, claim support, citation correctness, and appropriate abstention. Human review calibrates automated judges."
      },
      {
        "label": "Live",
        "text": "Audit resolved questions, unsupported claims, stale sources, latency, and cost. Inspect the first failing step: indexing, retrieval, evidence selection, or generation."
      }
    ],
    "monitoring": "Apply document edits, deletions, and permission changes promptly. Audit unsupported and stale answers. Cache only for compatible access rights and document versions; otherwise one user’s cached answer could reveal another user’s restricted source.",
    "diagram": {
      "online": [
        {
          "title": "Query + identity",
          "detail": "Account + region scope"
        },
        {
          "title": "Hybrid retrieval",
          "detail": "Permissions + reranking"
        },
        {
          "title": "Answerability gate",
          "detail": "Evidence + conflicts"
        },
        {
          "title": "Generate + check",
          "detail": "Claims ↔ cited spans"
        },
        {
          "title": "Answer / abstain",
          "detail": "Or ask for clarification"
        }
      ],
      "offline": [
        {
          "title": "Documents + visuals",
          "detail": "Permissions; date; source"
        },
        {
          "title": "Parse + chunk",
          "detail": "Read text; keep sources"
        },
        {
          "title": "Embed + index",
          "detail": "Vectors + keyword index"
        },
        {
          "title": "Delta + deletes",
          "detail": "Compatible versions"
        },
        {
          "title": "Evidence library",
          "detail": "Main + delta; active IDs"
        }
      ],
      "offlineLabel": "Evidence updates",
      "feedsStep": 1,
      "feedLabel": "Retrieve current permitted evidence",
      "bypass": {
        "fromStep": 2,
        "label": "Not answerable → clarify / abstain"
      },
      "learningLoop": "Reviewed search and answer errors guide targeted changes; expert evaluation checks improvements before release.",
      "caption": "Topically relevant passages may still lack an answer. Source authority and chronology constrain conflict handling; unsupported cases bypass generation."
    },
    "tradeoff": "Extra context and verification add latency and cost. Improve evidence selection first; add stages only when audited quality gains justify their serving budget.",
    "followUp": {
      "question": "The answer has a citation. Does that prove it is supported?",
      "answer": "Read the cited lines and check the actual claim. A passage about vacation may not state the carryover limit, and an old policy may have been replaced. A citation is a source pointer, not proof."
    },
    "pitfalls": [
      "Checking access only after generation is too late: restricted passages may already be exposed.",
      "Automated claim checks can miss errors. Use expert audits, including unsupported answers and incorrect refusals."
    ],
    "capacity": "Divide the four-second target across search, reranking, and answer generation. Illustratively, 20 questions/sec × 100 generated tokens/answer = 2,000 output tokens/sec, plus reading the retrieved passages. Benchmark these stages separately and leave room for queues.",
    "reference": {
      "title": "Microsoft: design and evaluate a RAG solution",
      "href": "https://learn.microsoft.com/en-us/azure/architecture/ai-ml/guide/rag/rag-solution-design-and-evaluation-guide",
      "note": "Reference for stage-by-stage RAG preparation and evaluation."
    },
    "statement": "Answer employee questions from current company documents, with supporting citations and enforced permissions.",
    "requirements": [
      "Use only documents the requester may access.",
      "Handle changing or conflicting policy versions.",
      "Cite supporting source passages.",
      "Ask for clarification or return INSUFFICIENT_EVIDENCE when needed."
    ],
    "trainingExample": {
      "input": "A vacation-policy question, the employee’s region, and permitted policy passages.",
      "target": "A correct scoped answer with supporting source IDs—or an explicit statement that evidence is insufficient."
    },
    "designSteps": [
      {
        "title": "Maintain the evidence library",
        "text": "Parse documents into passages with source links, permissions, dates, and region. Index new versions and remove obsolete or inaccessible content promptly."
      },
      {
        "title": "Retrieve and establish scope",
        "text": "Use the employee’s identity and question to search permitted passages. Clarify missing details and resolve policy authority or dates before writing an answer."
      },
      {
        "title": "Answer, check, and learn",
        "text": "Generate a short cited answer or return insufficient evidence. Check claims against sources, log reviewed errors, and evaluate changes to the failing retrieval or generation stage."
      }
    ]
  },
  {
    "id": "machine-translation",
    "title": "Translate messages with a live glossary",
    "pattern": "Specialized translation + dynamic terminology",
    "decision": "High-volume language conversion needs stable facts and changing terms.",
    "summary": "Translate multilingual support messages cheaply at scale while preserving approved terminology, entities, and numbers.",
    "mentalModel": "An interpreter with a live phrasebook: terminology changes in the phrasebook immediately, without relearning the whole language.",
    "example": {
      "input": "Spanish → English: “Mi pedido AB-42 de la Caja Pro llega el 12 de mayo.” Glossary: “Caja Pro” → “Pro Box.”",
      "output": "“My Pro Box order AB-42 arrives on May 12.” Keep the approved product term, order ID, date, and original message."
    },
    "conversation": [
      {
        "speaker": "Interviewer",
        "text": "Translate high-volume customer support conversations across roughly 20 language pairs."
      },
      {
        "speaker": "Candidate",
        "text": "Do we translate each message alone? Which facts and product terms must survive unchanged?"
      },
      {
        "speaker": "Interviewer",
        "text": "The client specifies the target language. Use brief prior conversation context when needed. Preserve meaning, names, amounts, and IDs. Apply approved product terminology from a glossary that changes weekly."
      },
      {
        "speaker": "Candidate",
        "text": "What should users see if translation is unsupported or fails? What are the business and speed goals?"
      },
      {
        "speaker": "Interviewer",
        "text": "Keep the original message visible and show a clear fallback. We want successful cross-language support without meaning-changing errors or excessive cost. Expect 10,000 requests/sec, with most short translations under one second."
      }
    ],
    "objectives": {
      "business": "Cross-language support must remain accurate and affordable, so enable correct resolutions without meaning-changing errors or excessive serving cost.",
      "ml": "Because facts and glossary terms must survive, preserve meaning, terminology, names, and numbers in each language direction. Detect failed requests and provide a visible fallback."
    },
    "data": {
      "sources": "Use professionally translated message pairs, reviewed agent corrections, and a versioned product glossary. A language model may propose extra translations, but bilingual reviewers audit them before they become training data.",
      "labels": "For each source message, record a translation that preserves its meaning, tone, names, and numbers. Review with conversation context so “it” and other references are translated correctly.",
      "features": "Read the source message, requested target language, brief relevant conversation context, and matching glossary entries. The glossary is a live phrasebook; it can change without changing the model’s vocabulary.",
      "validation": "Keep repeated templates and conversations together, then test on later real messages. Evaluate each language direction separately, including glossary edits, uncommon names, and ambiguous context. Back-translation alone cannot prove correctness."
    },
    "highLevel": {
      "model": "Start with a pretrained multilingual encoder–decoder translator: the encoder reads the source and the decoder writes the target. Compare it with a prompted language model; choose using bilingual quality, speed, and cost.",
      "rationale": "A specialized translator may serve repeated translation work efficiently. Supply the glossary at request time so renamed products do not require a model retraining cycle. Verify that the selected model actually supports the glossary mechanism."
    },
    "modeling": {
      "baseline": "Compare an off-the-shelf translator with a language model on the same reviewed messages. Include difficult language directions and product terms, not only common short sentences.",
      "choice": "Use a model with tested glossary support. Constrained decoding restricts allowed wording; protected placeholders can preserve IDs and exact terms. Check that terms fit the sentence, and validate dates and amounts after translation.",
      "training": "Adapt on reviewed source–target pairs only when the baseline misses the quality target. Train with glossary inputs if serving uses them, and balance languages so improvements in common pairs do not erase rarer-language quality."
    },
    "inference": {
      "serving": "Confirm the source/target language direction, load relevant terms, translate, and check critical facts. Show the original alongside the result. Unsupported or failed requests return a visible fallback with retry or human help.",
      "experiment": "Use bilingual review for every language direction, then trial a small share of conversations. Compare corrections and resolution time, and stop expansion if critical fact errors or response time worsen."
    },
    "measure": [
      {
        "label": "Offline",
        "text": "Bilingual reviewers score preserved meaning and readability. Check glossary compliance, IDs, numbers, and context separately. COMET, an automated translation-quality model, can help prioritize reviews but cannot replace them."
      },
      {
        "label": "Live",
        "text": "Track agent corrections, failed translations, response time, and cost by language direction. Audit a sample of accepted translations too; low correction rates do not necessarily mean users noticed no errors."
      }
    ],
    "monitoring": "Publish glossary changes with a version and expire affected cached translations. Separate caches by customer, language pair, model, and glossary version. Retrain for recurring translation mistakes; a renamed product normally updates the supported glossary path first.",
    "diagram": {
      "online": [
        {
          "title": "Message + context",
          "detail": "Source + target language"
        },
        {
          "title": "Fetch glossary",
          "detail": "Relevant terms + version"
        },
        {
          "title": "Encoder–decoder",
          "detail": "Glossary-aware decoding"
        },
        {
          "title": "Validate + restore",
          "detail": "Terms; facts; IDs"
        },
        {
          "title": "Translation / fallback",
          "detail": "Original always retained"
        }
      ],
      "offline": [
        {
          "title": "Approved terminology",
          "detail": "Aliases; pair; product"
        },
        {
          "title": "Validate term rules",
          "detail": "Effective dates"
        },
        {
          "title": "Publish live glossary",
          "detail": "No model retrain needed"
        },
        {
          "title": "Version + invalidate",
          "detail": "Scoped translation cache"
        },
        {
          "title": "Glossary lookup",
          "detail": "Current approved terms"
        }
      ],
      "offlineLabel": "Terminology updates",
      "feedsStep": 1,
      "feedLabel": "Use current approved terms",
      "learningLoop": "Bilingual corrections improve candidate models; human quality checks gate releases. Glossary updates happen separately.",
      "caption": "A glossary instruction is not an exactness guarantee. Validate output and use suitable constraints or protected placeholders when terms must survive exactly."
    },
    "tradeoff": "A smaller translator may cost less but miss context or rare-language details. A larger model is worthwhile only where measured quality gains justify its response time and cost.",
    "followUp": {
      "question": "A product is renamed today. Do we retrain?",
      "answer": "Update the external versioned glossary and invalidate affected caches. The translator must already support glossary conditioning; validate compliance and retrain later only if errors are systematic."
    },
    "pitfalls": [
      "A glossary instruction alone does not guarantee the approved term appears correctly.",
      "Fluent output can still change an amount, omit negation, or attach a date to the wrong event."
    ],
    "capacity": "At 10,000 requests/sec, an illustrative 100 source tokens and 80 output tokens per request require one million input and 800,000 output tokens/sec. Output is generated piece by piece, so benchmark reading, writing, and queue delays separately against the one-second target.",
    "reference": {
      "title": "Hugging Face: constrained beam search",
      "href": "https://huggingface.co/blog/constrained-beam-search",
      "note": "Reference for lexical constraints; measure their decoding cost and validate terminology."
    },
    "statement": "Translate high-volume customer support messages while preserving meaning, names, numbers, and approved product terminology.",
    "requirements": [
      "Accept the target language and support roughly 20 language pairs.",
      "Use brief conversation context where needed.",
      "Apply a product glossary that changes weekly.",
      "Retain the original and fall back visibly on unsupported or failed requests."
    ],
    "trainingExample": {
      "input": "Spanish message: “Mi pedido AB-42 llega el 12 de mayo.” Target language: English.",
      "target": "Reviewed translation: “My order AB-42 arrives on May 12.” Include any context or glossary entries used to produce it."
    },
    "designSteps": [
      {
        "title": "Prepare the language request",
        "text": "Read the requested target language, confirm a supported direction, and fetch relevant prior context and glossary entries."
      },
      {
        "title": "Translate and validate",
        "text": "Generate the translation using the tested glossary mechanism. Restore any protected IDs, verify terms and critical facts, and display the original with the result or a visible fallback."
      },
      {
        "title": "Improve from corrections",
        "text": "Review bilingual corrections and evaluate candidate models on every language direction. Release approved model versions separately from routine glossary updates."
      }
    ]
  },
  {
    "id": "document-summarization",
    "title": "Summarize long documents and extract facts",
    "pattern": "Local summaries + facts → grounded aggregation",
    "decision": "Long inputs require compression without losing exact facts or chronology.",
    "summary": "Produce a concise summary and structured facts from long, contradictory documents while retaining evidence for both.",
    "mentalModel": "Each chapter sends upstairs a short brief and a ledger of exact facts. The editor needs both to write a faithful final account.",
    "example": {
      "input": "A long case file: Monday’s note approves a $40 refund; Tuesday’s signed decision reverses it.",
      "output": "“The $40 refund was approved Monday and reversed Tuesday,” with both source links. Structured fields record status = reversed and amount = $40; unsupported ownership remains unknown."
    },
    "conversation": [
      {
        "speaker": "Interviewer",
        "text": "Turn long multilingual case files into a summary and structured facts for the next support agent."
      },
      {
        "speaker": "Candidate",
        "text": "How long are the files, what do they contain, and which outputs does the agent need?"
      },
      {
        "speaker": "Interviewer",
        "text": "Up to about 100,000 tokens—roughly word pieces—including emails and tables. Return a concise summary plus actions, dates, amounts, owners, and unresolved issues, with source links. Asynchronous processing is fine."
      },
      {
        "speaker": "Candidate",
        "text": "How should we handle contradictory notes or a later reversal? What makes the handoff successful?"
      },
      {
        "speaker": "Interviewer",
        "text": "Preserve later reversals and flag unresolved conflicts. Never invent facts. We want less reading time without losing decisions, money amounts, or next steps needed for a correct handoff."
      }
    ],
    "objectives": {
      "business": "The next agent needs a faster, correct handoff, so reduce reading time without losing decisions, money amounts, or next steps.",
      "ml": "Because omissions and fabricated facts can break the handoff, maximize important-fact coverage and source-supported claims. Return exact structured fields and explicit unresolved conflicts."
    },
    "data": {
      "sources": "Use original emails, notes, and tables alongside approved handoff summaries. Include long cases, late reversals, and conflicting notes; training only on tidy short files hides the hard cases.",
      "labels": "Humans mark important facts and source passages, then review summaries for omissions and invented claims. Link amounts to the correct event and owner. Audit any language-model-generated training answers.",
      "features": "Divide files into manageable sections, or chunks, while preserving dates, speakers, source positions, and table headers. Carry exact fact records alongside short summaries so repeated compression does not erase a decision.",
      "validation": "Keep entire cases and repeated templates in one split; test on later cases. Evaluate long files, table-heavy files, and reversals separately. Review fact relationships, not just whether each word or amount appears somewhere."
    },
    "highLevel": {
      "model": "Use a pretrained language model to summarize each section and extract facts into named fields. Combine the section outputs, reconcile their timeline, and write a source-linked final summary. Separate models are optional.",
      "rationale": "A long file can exceed the model’s usable input budget. Section processing bounds the work, while exact fact records protect details such as a refund amount or later reversal from being lost in shortened summaries."
    },
    "modeling": {
      "baseline": "Test direct summarization on files that fit the chosen model. Also try selecting key source excerpts. Compare with section-by-section processing on the same cases, including the longest files.",
      "choice": "For each chunk, produce a short brief and structured facts: event, amount, owner, date, status, and source. Merge duplicate events, reconcile chronology and authority, then generate the final summary. Retrieve original passages when evidence is incomplete.",
      "training": "Start with pretrained models and a clear output schema—the named fields the result must contain. Fine-tune on audited examples only if needed. Select versions by fact accuracy and important omissions, not wording similarity alone."
    },
    "inference": {
      "serving": "Return a job ID and process the file asynchronously. Limit parallel work, preserve source pointers, and verify the final fields and claims against original passages. Use “unknown” for unsupported fields and flag unresolved conflicts.",
      "experiment": "Ask agents to review old-case outputs without knowing which model produced them, then trial draft handoffs on a small traffic share. Compare reading time and missed actions while checking invented facts and wrong owners."
    },
    "measure": [
      {
        "label": "Offline",
        "text": "Measure important-fact coverage, exact field correctness, and claims supported by source passages. Test whether amounts belong to the correct event and final status. Text-similarity scores such as ROUGE do not establish factual accuracy."
      },
      {
        "label": "Live",
        "text": "Track agent edits, reading time, missed actions, and processing failures by file length. Audit accepted summaries as well as corrected ones; important omissions can pass unnoticed."
      }
    ],
    "monitoring": "Watch missing reversals, table-parsing errors, and slow long-file jobs. Record parser, model, and prompt versions so failures are reproducible. Reviewed corrections improve the failing stage; retain access-controlled original evidence for verification.",
    "diagram": {
      "online": [
        {
          "title": "Parse + chunk",
          "detail": "Layout; tables; positions"
        },
        {
          "title": "Briefs + fact lists",
          "detail": "Parallel local processing"
        },
        {
          "title": "Aggregate + reconcile",
          "detail": "Evidence + timeline"
        },
        {
          "title": "Generate + verify",
          "detail": "Facts ↔ original spans"
        },
        {
          "title": "Summary + fields",
          "detail": "Sources; unknowns; status"
        }
      ],
      "offline": [
        {
          "title": "Reviewed examples",
          "detail": "Summaries + exact facts"
        },
        {
          "title": "Audit evidence",
          "detail": "Fields + source evidence"
        },
        {
          "title": "Train / adapt",
          "detail": "Training split only"
        },
        {
          "title": "Held-out case checks",
          "detail": "Long files; reversals"
        },
        {
          "title": "Versioned recipe",
          "detail": "Extractor + generators"
        }
      ],
      "offlineLabel": "Training / evaluation",
      "servingLabel": "Asynchronous case processing",
      "feedsStep": 1,
      "feedLabel": "Release evaluated extraction and summary models",
      "parallelStep": {
        "index": 1,
        "branches": [
          "Local summarizer",
          "Structured fact extractor"
        ]
      },
      "learningLoop": "Reviewed omissions and field corrections become test cases; improvements must pass independent case evaluation.",
      "caption": "Section briefs and exact facts both reach the final writer. Preserve source pointers so uncertain claims can be checked against the original file."
    },
    "tradeoff": "Shorter section summaries cost less downstream but may discard decisive facts. Preserve exact facts and source pointers, then increase compression only while important-fact coverage remains acceptable.",
    "followUp": {
      "question": "The right amount appears somewhere in the source. Is the generated refund correct?",
      "answer": "Check that the amount belongs to that refund, person, and final decision. Verify normalized facts and relationships against original evidence; matching a number anywhere is insufficient."
    },
    "pitfalls": [
      "The final writer cannot recover a decision absent from every intermediate output unless it retrieves the original evidence.",
      "A fact checker can be wrong too. Validate its flags and accepted results with human-reviewed samples."
    ],
    "capacity": "Illustrative sizing: 100,000 input tokens ÷ 4,000 tokens/chunk = 25 chunks before overlap. Budget section work plus final combination and verification. If combined briefs and facts are still too long, use bounded staged merges with source pointers.",
    "reference": {
      "title": "Hugging Face: summarization",
      "href": "https://huggingface.co/docs/transformers/tasks/summarization",
      "note": "Summarizer reference; evidence-preserving fact extraction and independent grounding checks complete this design."
    },
    "statement": "Turn a long multilingual case file into a faithful summary and structured facts for the next support agent.",
    "requirements": [
      "Handle files up to about 100,000 tokens, including emails and tables.",
      "Return a concise summary plus actions, dates, amounts, owners, and unresolved issues.",
      "Preserve later reversals and conflicting evidence.",
      "Keep source links; asynchronous processing is acceptable."
    ],
    "trainingExample": {
      "input": "Monday: “Approve $40 refund.” Tuesday’s signed decision: “Reverse the refund approval.”",
      "target": "Status = reversed; amount = $40; owner = unknown unless stated. The summary preserves the timeline and links both source events."
    },
    "designSteps": [
      {
        "title": "Parse and queue",
        "text": "Return a job ID, extract text and tables, and divide the case at useful boundaries. Keep headers, dates, and source positions with each chunk."
      },
      {
        "title": "Build briefs and fact records",
        "text": "Produce section summaries and named facts with evidence pointers. Combine them in bounded groups if needed, preserving distinct events and later corrections."
      },
      {
        "title": "Reconcile, verify, and return",
        "text": "Resolve chronology and source authority, mark unknowns or conflicts, and verify the summary and structured fields against originals. Publish the completed job and use reviewed edits to evaluate future versions."
      }
    ]
  }
];

// Keep earlier case links usable while the hub and sitemap use the specific architecture names.
export function getNlpDesignProblem(id: string) {
  return nlpDesignProblems.find((problem) => problem.id === id || problem.legacyIds?.includes(id));
}
