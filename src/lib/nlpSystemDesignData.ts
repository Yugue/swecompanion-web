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
  data: { sources: string; labels: string; features: string };
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
      "sources": "Start with historical messages and corrected agent tags. An agent’s original tag is a clue, not guaranteed truth. Humans label a small, trusted reference set covering languages, rare categories, and multi-issue messages.",
      "labels": "An offline LLM teacher can read the category definitions and suggest labels in bulk. Agreement with rules and agent tags helps prioritize review; it does not prove correctness. Audit accepted suggestions, review disagreements, and keep the reported test set human-labeled.",
      "features": "For short messages, feed the whole text to a multilingual tokenizer, which breaks it into pieces the model can read. Preserve negation: “not charged twice” must differ from “charged twice.” Keep customers/threads together and split by time; tune score cutoffs on a separate calibration set."
    },
    "highLevel": {
      "model": "Fine-tune a pretrained multilingual text encoder, such as XLM-R, with one yes/no output per category. “Fine-tune” means adapt a model that already reads many languages to these support labels.",
      "rationale": "The 150 categories are stable, so a compact classifier is a natural starting point. Independent outputs allow several labels at once. An LLM can help create training labels offline without being called for every live message."
    },
    "modeling": {
      "baseline": "Compare a cheap word-weight classifier (TF–IDF + one-vs-rest logistic regression) with an LLM prompted with the category definitions. These are reference points: measure their quality, latency, and cost before adding complexity.",
      "choice": "The encoder turns the message into a numeric summary. A small classification head produces 150 independent scores using sigmoid outputs. A softmax would wrongly force the categories to compete as if only one could apply.",
      "training": "Train on audited human/teacher examples using binary cross-entropy: each category is a separate yes/no target. Review rare and multi-issue examples. Synthetic messages can fill gaps, but validate on real traffic. Compare models on validation data; keep final test results untouched."
    },
    "inference": {
      "serving": "Apply a separate cutoff to each category’s score. Calibrate scores against held-out outcomes so “confident” has empirical meaning. No accepted label means review, not proof that a new category exists. Add an LLM fallback only if it helps the low-confidence slice enough to justify its cost.",
      "experiment": "Evaluate a candidate offline, run it in shadow mode without changing routing, then release to a small traffic sample (a canary). Promote only if language/category quality and queue load stay acceptable; keep the previous model ready for rollback."
    },
    "measure": [
      {
        "label": "Offline",
        "text": "Precision asks “of the labels we returned, how many were right?” Recall asks “of the real issues, how many did we catch?” Report both per category/language, plus micro-F1 overall and macro-F1 so large categories do not hide rare failures. Check calibration and the review rate."
      },
      {
        "label": "Live",
        "text": "Compare agent transfers and time to resolution. Manually audit both accepted labels and reviewed messages. Measure fallback quality on the uncertain slice itself; fresh human labels are needed to know live accuracy."
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
      "Do not call this single-label classification or force one winning category.",
      "Teacher/rule/agent agreement can still be wrong. Human audits and an independent test set remain necessary."
    ],
    "capacity": "Illustrative workload: 5,000 messages/sec × 100 input tokens = 500,000 encoder tokens/sec. A prompted LLM using 1,500 input tokens/request needs 7.5M input tokens/sec, plus output generation. A 5% fallback still handles 250 requests/sec. Convert these workloads into GPUs and dollars only using measured throughput, batching, hardware, and prices.",
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
      "input": "New: “Checkout shows E42 after the update.” Existing: “Since version 8.2, purchases fail with E42.”",
      "output": "Return the existing canonical ID if context confirms the same issue. A different card-decline problem stays separate; no verified match returns NOVEL."
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
      "sources": "Use agent-confirmed duplicate links and human-reviewed pairs. An offline LLM teacher can help label mined pairs; humans audit accepted suggestions and disagreements. Same customer or product is only a clue, never a duplicate label.",
      "labels": "Include difficult negatives: same product and error topic, but a different cause or condition. Also review unlinked high-scoring pairs; some may be missed positives. Keep each confirmed issue group in one split and evaluate future arrivals against earlier history; calibrate thresholds separately.",
      "features": "Use subject, body, and relevant product/version/error context. A multilingual encoder creates an embedding—a numeric address placing similar meanings nearby. Check cross-language quality rather than assuming it. Short tickets can fit whole; preserve important text if longer inputs need handling."
    },
    "highLevel": {
      "model": "Use a bi-encoder to search for candidates, then a cross-encoder to verify pairs. The first reads tickets separately for speed; the second reads two tickets together for a more careful comparison.",
      "rationale": "Comparing a new ticket carefully against all 100 million records is too expensive. Retrieve a small shortlist first. Begin with retrieval alone as a benchmark; add the verifier when similar-but-different tickets cause unacceptable merges."
    },
    "modeling": {
      "baseline": "BM25 keyword search checks exact terms cheaply. Compare its candidates with embedding retrieval. An LLM can judge a few retrieved pairs as a quality benchmark or offline teacher; measure its serving cost before using it live.",
      "choice": "Precompute historical embeddings and use an approximate nearest-neighbor index (ANN) to find, for example, 50 candidates without scanning every record. A verifier reads the best few pairs and scores duplicate/related/unrelated. BM25 can contribute exact error-code matches.",
      "training": "Train the retriever to bring true pairs closer and separate reviewed hard negatives: contrastive learning. Train the verifier on the three pair labels with cross-entropy. Teacher-to-student distillation means teaching a smaller serving model from audited teacher judgments; preserve a human test set."
    },
    "inference": {
      "serving": "Accept only a calibrated duplicate score above the chosen cutoff, with a clear canonical ID. Conflicting candidate groups or insufficient evidence return NOVEL or human review. NOVEL means no verified match, not proof that no duplicate exists. Prioritize verification where evaluation shows it helps.",
      "experiment": "Replay tickets in arrival order, then shadow suggestions against agent decisions. Canary automatic merges only after passing false-merge and language checks. Record reversible merge evidence; rollback must restore compatible model and index versions."
    },
    "measure": [
      {
        "label": "Offline",
        "text": "First ask whether the shortlist contains a real duplicate: retrieval Recall@K. Separately compare ANN results with exact vector search to measure approximation loss. Then measure final duplicate precision, recall, and false merges, especially on related-but-different pairs. High retrieval recall cannot excuse a bad merge gate."
      },
      {
        "label": "Live",
        "text": "Audit agent reversals, missed duplicates, and investigation time saved. Track NOVEL rates and fresh human judgments by language. Teacher agreement is a diagnostic, not proof of correctness."
      }
    ],
    "monitoring": "Watch similarity scores, NOVEL volume, and fresh pair judgments after releases. Add new tickets to a small delta index immediately, search it alongside the main index, then compact later. Maintain canonical-ID mappings when groups merge; switch a new encoder and its rebuilt index together.",
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
            "detail": "Continuous arrivals"
          },
          {
            "title": "Keep IDs + context",
            "detail": "Canonical mapping"
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
    "capacity": "Illustrative workload: 500 tickets/sec × 256 tokens = 128,000 query tokens/sec. Checking five 512-token pairs for every ticket adds 1.28M pair-input tokens/sec. If a validated policy verifies 40% of requests, that becomes 512,000. Index backfill, ANN search, pair verification, and teacher labeling need separate budgets; GPU and dollar estimates require benchmarks.",
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
        "text": "Encode the new ticket and query the main plus delta indexes. Historical vectors are already computed; the index returns candidate ticket IDs."
      },
      {
        "title": "Verify and decide",
        "text": "Compare selected pairs, then return a canonical ID only with sufficient duplicate evidence. Keep ambiguous tickets separate."
      },
      {
        "title": "Keep history current",
        "text": "An ingestion job embeds each new ticket into delta. Being searchable does not make it a validated duplicate group."
      },
      {
        "title": "Improve safely",
        "text": "Log difficult pairs for teacher/human review, train candidates offline, and promote evaluated model/index versions through a registry."
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
      "sources": "Each workflow needs a title, plain-language purpose, example requests, required parameters, and prerequisites. Reviewed support logs provide real ways customers ask for it; teacher-generated paraphrases can supplement rare languages.",
      "labels": "Label requests with the correct active workflow, plus examples that no workflow supports. Review confusing neighbors such as cancel-order versus cancel-subscription. Group paraphrases and use later requests for evaluation.",
      "features": "Encode the whole request and each workflow description into comparable numeric vectors. These embeddings help different wording match. Keep authorization and mandatory prerequisites as explicit checks, not facts the similarity model must guess."
    },
    "highLevel": {
      "model": "Use a multilingual bi-encoder: one encoder reads the request and the other reads action descriptions. Search the resulting vectors, then accept a match or reject it.",
      "rationale": "The action catalog changes daily. Adding a searchable workflow description can be much faster than retraining a fixed output classifier. A careful pairwise verifier is optional if neighboring actions remain confusing."
    },
    "modeling": {
      "baseline": "Try keyword search and an exact vector scan first. With a small catalog, a full scan may be simpler than an approximate index. Compare quality and measured latency.",
      "choice": "Retrieve candidate action IDs, optionally rerank request–action pairs with a cross-encoder, then apply a calibrated acceptance cutoff. Top-K means how many candidates to inspect; it is not the accept/reject rule.",
      "training": "Learn from reviewed request–action pairs. Contrastive training makes correct pairs more similar and confusing wrong pairs less similar. Audit synthetic paraphrases and keep supported/unsupported calibration examples separate from final testing."
    },
    "inference": {
      "serving": "Embed edited workflows into a fresh delta index and filter retired IDs immediately. Recheck the selected active ID and prerequisites before returning it. Selection does not authorize execution.",
      "experiment": "Shadow against reviewed requests, then canary selection with execution safeguards intact. Expand only if accepted matches remain sufficiently precise and unsupported requests are rejected reliably."
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
    "monitoring": "Watch unsupported requests, retired IDs, and newly confused workflows. Refresh descriptions/indexes immediately; retrain only when reviewed matching errors justify it. Add replicas to bottleneck stages using measured query and verifier throughput.",
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
    "tradeoff": "A verifier spends latency on harder decisions. Improve retrieval first when Recall@K is low; benchmark verification when the right action is present but loses at the final gate.",
    "followUp": {
      "question": "Can UNSUPPORTED be one more vector in the index?",
      "answer": "No single vector represents every unsupported intent. Calibrate rejection on diverse supported/unsupported pairs, and apply the gate to the actual candidate score."
    },
    "pitfalls": [
      "Top-K chooses candidate volume; it does not set the accept/reject threshold.",
      "Do not cluster a curated action registry or retrain for every catalog edit."
    ],
    "capacity": "10K QPS × 80 tokens ≈ 800K query tokens/sec. Verifying 20 candidates/request means 200K pairs/sec: measure that cost before enabling reranking. Compare exact scan and ANN at the actual registry size.",
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
        "text": "Validate and embed workflow descriptions. Search a stable main index plus fresh delta records; remove retired IDs through an active-ID filter."
      },
      {
        "title": "Match and reject",
        "text": "Encode a request, retrieve candidates, and verify only if useful. Return one ID or UNSUPPORTED using an evaluated cutoff."
      },
      {
        "title": "Learn from outcomes",
        "text": "Review wrong selections and missing matches, then evaluate updated encoders and cutoffs before release."
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
      "input": "Compare the blue 128GB Model X with the 256GB Pro.",
      "output": "Two mention spans, each with its correct variant ID or NO_MATCH; storage and model qualifiers stay attached."
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
      "sources": "Use catalog names, aliases, model numbers, and variant attributes alongside human-marked mentions and exact-ID links. Clicks can suggest links, but humans must audit them before treating them as truth.",
      "labels": "Teach two answers: where the product mention is, and which catalog ID it means. Include absent products and near-identical variants. Hold out later catalog data and group repeated messages.",
      "features": "Retain the mention’s surrounding sentence: “blue” and “128GB” may determine the right variant. Use embeddings for wording similarity, keyword search for exact model codes, and structured filters for hard price or storage constraints."
    },
    "highLevel": {
      "model": "First use a mention detector to highlight product phrases. Then use retrieval to find catalog candidates and, when needed, a pairwise verifier to check exact identity.",
      "rationale": "Highlighting a name and resolving its identity are different jobs. Separating them makes errors easier to diagnose and lets new catalog products become searchable without retraining the whole system."
    },
    "modeling": {
      "baseline": "Start with exact IDs and alias lookup, plus a pretrained mention detector. Measure which misspellings and ambiguous variants they miss.",
      "choice": "A token tagger marks words as part of a product mention. A contextual bi-encoder finds likely catalog records; an optional cross-encoder reads mention/context and candidate together before the NO_MATCH gate.",
      "training": "Use labeled spans for the detector and reviewed mention–ID pairs for retrieval. Train with confusing sibling products, not just random negatives. Calibrate NO_MATCH on genuinely absent products and ambiguous examples."
    },
    "inference": {
      "serving": "Preserve source offsets and qualifiers through detection and linking. Update active catalog embeddings promptly; reject retired or incompatible variants. An isolated word like “Phone” is often insufficient context.",
      "experiment": "Evaluate with perfect human spans and with predicted spans to separate detector mistakes from linking mistakes. Canary exact-ID results before they drive downstream actions."
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
    "monitoring": "Review new aliases and sibling-product confusions. Keep catalog ingestion separate from model retraining, and scale retrieval and pair verification independently.",
    "diagram": {
      "online": [
        {
          "title": "Text → mentions",
          "detail": "BIO spans + offsets"
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
          "title": "Update + tombstone",
          "detail": "Delta; immediate retires"
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
      "question": "Why not embed only the extracted word ‘Phone’?",
      "answer": "That loses storage, color, and model context. Encode the surrounding phrase and apply authoritative numeric/categorical filters; embeddings cannot reliably enforce a price ceiling."
    },
    "pitfalls": [
      "Do not merge catalog products merely because their descriptions are similar.",
      "A correct mention span is not proof of a correct entity link."
    ],
    "capacity": "50M vectors × 768 dimensions × 2 bytes ≈ 76.8 GB of raw FP16 embeddings, before ANN overhead, metadata, and replicas. Multi-prototype indexing increases this footprint.",
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
        "text": "Highlight product phrases and retain their original text positions and surrounding qualifiers."
      },
      {
        "title": "Resolve identity",
        "text": "Search active catalog records using meaning and exact attributes, then verify difficult candidates or return NO_MATCH."
      },
      {
        "title": "Refresh the catalog",
        "text": "Embed new records into delta; tombstone retired IDs immediately. Feed reviewed linking errors into model evaluation."
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
      "input": "Many independent users report that release 8.2 makes exported PDFs blank.",
      "output": "A reviewed new issue with evidence, growth history, and a prototype added to the known registry."
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
      "sources": "Use known issue descriptions, raw messages, release times, and privacy-appropriate source identifiers. Historical reviewed incidents help test whether the system would have discovered them in time.",
      "labels": "Label known matches and issue-versus-noise examples. Review accepted and rejected discoveries. Replay history in time order so future knowledge cannot leak into an earlier detection decision.",
      "features": "Text embeddings place similar meanings nearby. Separately count distinct sources, volume, persistence, and growth. Keep copy counts for trends, but stop repeated copies from dominating the shape of a cluster."
    },
    "highLevel": {
      "model": "Match known issues first. Filter the remaining messages for real issue-like content, group similar ones with clustering, then score and review promising new groups.",
      "rationale": "An unmatched message may just be praise or spam. Clustering finds a family of related messages; growth and human review decide whether that family is a real emerging issue."
    },
    "modeling": {
      "baseline": "Match known issue examples and send frequent unmatched phrases to human review.",
      "choice": "Use multilingual embeddings with HDBSCAN, a clustering method that can leave isolated messages unassigned. Choose representative examples for each group, then check growth, novelty, and source diversity.",
      "training": "Train the issue/noise filter on reviewed messages. Clustering itself groups unlabeled observations; it is not taught a fixed list of new issues. Tune its settings on replayed incidents and reviewed groups."
    },
    "inference": {
      "serving": "Run bounded sliding-window batches over unknown issue-like text. Promote only reviewed groups; immediately add their definitions/examples to the known registry. Unknown observations and validated known records remain separate.",
      "experiment": "Replay past releases, then shadow alerts with responders before enabling paging. Compare missed incidents, detection delay, and false alarms, not simply the number of clusters created."
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
    "monitoring": "Watch spam-driven alerts and missed incidents. Bound clustering windows to control work; retain raw evidence for review. A growing cluster needs investigation, not automatic promotion.",
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
          "title": "Build prototypes",
          "detail": "Embed known examples"
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
      "feedLabel": "Match against validated issue prototypes",
      "bypass": {
        "fromStep": 1,
        "label": "Known match → assign directly"
      },
      "learningLoop": "Reviewed new cluster → canonical issue + prototypes → known registry now; supervised retraining later.",
      "caption": "Unmatched does not mean novel. Filter nonissues before clustering; reject noisy clusters after scoring. Main/delta hold validated issues, while the unknown pool holds observations."
    },
    "tradeoff": "Waiting for persistence reduces false alerts but delays discovery. Use severity and independent-source evidence to choose promotion rules, rather than cluster size alone.",
    "followUp": {
      "question": "A cluster doubles in size. Is that an emerging issue?",
      "answer": "Check distinct sources, copying/spam, persistence, novelty against known issues, and a historical baseline. Clustering establishes similarity; temporal growth and review establish an emerging issue."
    },
    "pitfalls": [
      "No known label can mean praise, noise, or ambiguity—not a new issue.",
      "Do not cluster delta just because its validated records are fresh, or assume HDBSCAN automatically supplies useful centroids."
    ],
    "capacity": "5M messages/day averages about 58/sec, but size for observed peaks. Benchmark clustering on bounded sliding windows; full-history reclustering is not required for hourly discovery.",
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
        "title": "Route familiar reports",
        "text": "Use the current known registry. Send only unmatched, issue-like reports into the discovery pool."
      },
      {
        "title": "Group and investigate",
        "text": "Suppress spam/copies, cluster meaning, and check whether independent reports are new, growing, and persistent."
      },
      {
        "title": "Promote reviewed issues",
        "text": "Create a canonical issue and examples only after validation; make it searchable now and retrain supervised models later."
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
      "input": "How many vacation days can I carry over in my region?",
      "output": "A scoped answer citing the current policy, a clarification question, or INSUFFICIENT_EVIDENCE."
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
      "sources": "Use authoritative documents with permissions, dates, regions, and source IDs. Human experts supply example questions, correct answers, and supporting passages. Preserve text extracted from screenshots alongside links to the original.",
      "labels": "Judge relevance and answerability separately: a page about vacation may still omit the carryover limit. Include missing-answer and conflicting-policy examples, with later snapshots reserved for evaluation.",
      "features": "Split documents into meaningful passages with enough context to read independently. Store text embeddings for meaning, keyword matches for exact terms, and permission/version metadata as hard filters."
    },
    "highLevel": {
      "model": "Use retrieval-augmented generation (RAG): search permitted documents first, then ask a language model to answer using the retrieved evidence.",
      "rationale": "Think of an open-book exam. Updating the book is easier than teaching the model every policy change. The answer must still be checked: finding a relevant passage does not prove it contains the answer."
    },
    "modeling": {
      "baseline": "Return the best matching source excerpts without generating a new answer. Compare this with a pretrained LLM given the same evidence.",
      "choice": "Combine keyword and embedding search; optionally rerank candidates. Check answerability, then give the generator selected passages and source IDs. A claim-support check compares each answer claim with its cited evidence.",
      "training": "Start with a pretrained generator. Improve retrieval using reviewed question–passage pairs. If high traffic justifies a smaller generator, train it on audited question + evidence → cited-answer examples; keep retrieval in the design."
    },
    "inference": {
      "serving": "Enforce access before document text reaches a model. Treat document instructions as untrusted content. Clarify missing scope, bound context/output size, and return sources or abstention when generation fails.",
      "experiment": "Gate releases on expert audits and permission tests, then canary eligible users. Stop for access leaks or unsupported advice; measure answer coverage as well as accuracy so always abstaining cannot win."
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
    "monitoring": "Apply document edits and deletes promptly. Track wrong/stale answers and permission failures. Budget search, language-model input processing, and generated output separately; cache only within the correct permissions and document versions.",
    "diagram": {
      "online": [
        {
          "title": "Query + identity",
          "detail": "Account + region scope"
        },
        {
          "title": "Hybrid retrieval",
          "detail": "ACLs; optional reranker"
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
          "detail": "ACL; date; authority"
        },
        {
          "title": "Parse + chunk",
          "detail": "Text/OCR; source spans"
        },
        {
          "title": "Embed + index",
          "detail": "Dense + lexical"
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
      "learningLoop": "Audited retrieval and claim errors → targeted retriever/generator evaluation; human gold calibrates automated checks.",
      "caption": "Topically relevant passages may still lack an answer. Source authority and chronology constrain conflict handling; unsupported cases bypass generation."
    },
    "tradeoff": "Extra context and verification add latency and cost. Improve evidence selection first; add stages only when audited quality gains justify their serving budget.",
    "followUp": {
      "question": "The model cites a passage. Isn’t the answer grounded?",
      "answer": "Check each claim against the cited source span. The citation may be relevant but not entail the claim, may be superseded, or may contradict a more authoritative policy."
    },
    "pitfalls": [
      "Never let post-generation ACL filtering substitute for access filtering before context retrieval.",
      "Do not mix unrelated text and image embedding spaces; use a compatible multimodal model if moving beyond text/OCR retrieval."
    ],
    "capacity": "Budget query encoding and reranker pairs separately from generator prefill and output decoding. Required output tokens/sec = QPS × mean generated tokens; use measured stage throughput and p95 headroom to size replicas.",
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
        "text": "Parse documents into passages with access, authority, date, and source pointers; update searchable versions as policies change."
      },
      {
        "title": "Find an answerable context",
        "text": "Retrieve only permitted passages, resolve scope, and stop when evidence is missing or conflicts remain unresolved."
      },
      {
        "title": "Write and check",
        "text": "Generate a short cited answer, compare claims with sources, and audit errors to improve the failing stage."
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
      "input": "A customer message with a product alias, order ID, and delivery date.",
      "output": "A faithful target-language message using the approved term, with IDs and dates intact and the original retained."
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
        "text": "Use brief prior conversation context when needed. Preserve meaning, names, amounts, and IDs. Apply approved product terminology from a glossary that changes weekly."
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
      "sources": "Use professionally translated message pairs, reviewed agent corrections, and an external terminology table. Teacher-generated translations can help sparse language pairs, but require filtering and human audits.",
      "labels": "Each training example pairs source text with an approved translation. Group repeated templates/conversations and hold out later messages. Check language, facts, and terms; translating back is only a clue, not proof of correctness.",
      "features": "Give the model the source message, target-language marker, and only relevant prior context/glossary entries. The glossary is a live phrasebook keyed by languages and product versions, not a rewrite of the model’s vocabulary."
    },
    "highLevel": {
      "model": "Benchmark a specialized multilingual encoder–decoder translator against a pretrained LLM. Use the smaller translator when it meets the language-specific quality and serving budget.",
      "rationale": "The encoder reads the source; the decoder writes the target one piece at a time. This repeated transformation can be cheaper with a specialized model. A live glossary handles terminology changes without constant retraining."
    },
    "modeling": {
      "baseline": "Compare an off-the-shelf translator and an LLM on the same human-reviewed support examples.",
      "choice": "Condition translation on approved glossary entries. Protected placeholders or constrained decoding can help enforce exact terms; a text instruction alone is not a guarantee. Validate names, amounts, and IDs afterward.",
      "training": "Fine-tune on reviewed source–target pairs and audited teacher examples, balancing language directions. Include glossary conditioning in training if you expect it at serving time; preserve general-language quality when adapting to product text."
    },
    "inference": {
      "serving": "Detect the language, load relevant terms, translate, then validate. Bound batches and output length; on failure show the original with retry/help. Version caches by tenant, language pair, model, and glossary.",
      "experiment": "Pass bilingual quality checks for every language direction, then canary conversations. Compare correction and resolution rates while guarding critical fact errors and latency."
    },
    "measure": [
      {
        "label": "Offline",
        "text": "Use bilingual judgments of preserved meaning and readable output, plus COMET as an automatic signal. Check terminology, numbers, entities, and context separately; report each language direction."
      },
      {
        "label": "Live",
        "text": "Audit corrections, fallbacks, latency, and cost. A good overall average must not hide a low-volume language with frequent mistakes."
      }
    ],
    "monitoring": "Update glossary entries and affected caches immediately. Retrain for recurring translation errors, not every renamed product. Measure source reading and target writing separately; long outputs may dominate latency.",
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
      "feedLabel": "Supply glossary as inference context",
      "learningLoop": "Audited human/teacher pairs → train glossary-aware student → bilingual release gates; terminology updates separately.",
      "caption": "A glossary instruction is not an exactness guarantee. Validate output and use suitable constraints or protected placeholders when terms must survive exactly."
    },
    "tradeoff": "A smaller translator may reduce cost but lose difficult context or rare-language quality. Decide with pair-level quality and measured encoding/decoding latency, not model size alone.",
    "followUp": {
      "question": "A product is renamed today. Do we retrain?",
      "answer": "Update the external versioned glossary and invalidate affected caches. The translator must already support glossary conditioning; validate compliance and retrain later only if errors are systematic."
    },
    "pitfalls": [
      "Do not treat glossary updates as changes to the model’s embedding dictionary.",
      "ROUGE is not a central translation quality metric; token speed alone does not establish meaning preservation."
    ],
    "capacity": "At 10K QPS, 100 source tokens/message means 1M input tokens/sec; 80 generated tokens means 800K output tokens/sec. Benchmark encoder work, autoregressive decoding, and queue delays separately.",
    "reference": {
      "title": "Hugging Face: constrained beam search",
      "href": "https://huggingface.co/blog/constrained-beam-search",
      "note": "Reference for lexical constraints; measure their decoding cost and validate terminology."
    },
    "statement": "Translate high-volume customer support messages while preserving meaning, names, numbers, and approved product terminology.",
    "requirements": [
      "Support roughly 20 language pairs.",
      "Use brief conversation context where needed.",
      "Apply a product glossary that changes weekly.",
      "Retain the original and fall back visibly on unsupported or failed requests."
    ],
    "trainingExample": {
      "input": "A source-language message, target language, short prior context, and relevant glossary terms.",
      "target": "A reviewed translation with the correct meaning, terminology, entities, and numbers."
    },
    "designSteps": [
      {
        "title": "Prepare the request",
        "text": "Detect the supported language direction and fetch just the relevant glossary/context."
      },
      {
        "title": "Translate and validate",
        "text": "Generate the target text, restore protected facts, and check approved terms before displaying it with the original."
      },
      {
        "title": "Improve the student",
        "text": "Review bilingual corrections, audit any teacher data, and compare candidate versions before release."
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
      "input": "100K tokens of emails, tables, case notes, and a refund approved then reversed.",
      "output": "A cited summary plus actions/dates/amounts/owners, with the later reversal preserved or conflict marked unresolved."
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
      "sources": "Use original documents with layout/table structure, approved handoffs, and reviewed field-level facts. Include long cases and late reversals; tidy short files alone give misleading results.",
      "labels": "Review summaries for missing or invented facts, and annotate important fields with source evidence. Split by case/time and group templates. Independently audit teacher-written summaries before using them for training.",
      "features": "Keep speaker, time, source offsets, and table headers with each chunk. A chunk is simply a manageable section of the file. Preserve exact fact lists beside local summaries so compression does not erase a critical amount or reversal."
    },
    "highLevel": {
      "model": "Use a local summarizer and a fact extractor, then combine their outputs into a final account. Short files can go directly to a pretrained generator as a baseline.",
      "rationale": "Think of each chapter sending an editor both a short brief and a ledger of exact facts. The final writer needs both; a fact discarded by every intermediate summary cannot be recovered later."
    },
    "modeling": {
      "baseline": "For short cases, compare direct generation with cited key-message excerpts. Test longer cases separately.",
      "choice": "Process document chunks into summaries and facts in parallel. Merge duplicate facts, reconcile chronology, and generate the final summary. Stable fields can use span/rule extractors; open-ended attributes may need a generative extractor.",
      "training": "Start with pretrained models and clear output schemas. Adapt on audited human/teacher examples if needed. Select versions using fact correctness, relationships, and important omissions rather than how similar the wording is to a reference."
    },
    "inference": {
      "serving": "Queue a versioned job, limit parallel chunk work, and retain provenance during aggregation. Verify amounts, dates, owners, and claims against original spans. Flag uncertain cases or return excerpts when checks fail.",
      "experiment": "Replay long/conflicting files with blinded agent review, then canary draft handoffs. Compare reading time and missed actions, with invented facts and wrong ownership as guardrails."
    },
    "measure": [
      {
        "label": "Offline",
        "text": "Check exact fields, relationships, supported/contradicted claims, and key-fact coverage. ROUGE or BERTScore measure overlap/similarity, not factual truth; calibrate automated checks with people."
      },
      {
        "label": "Live",
        "text": "Audit accepted and edited handoffs, reading time, critical omissions, and latency/cost by file length. A number appearing somewhere in the source does not prove it belongs to the generated refund."
      }
    ],
    "monitoring": "Watch long-file tails, table errors, lost reversals, and disagreements between checks. Parallel chunks improve throughput, but final aggregation remains a dependency. Keep original sources and version every parsing/generation step.",
    "diagram": {
      "online": [
        {
          "title": "Parse + chunk",
          "detail": "Layout; tables; offsets"
        },
        {
          "title": "Briefs + fact lists",
          "detail": "Parallel local processing"
        },
        {
          "title": "Aggregate + reconcile",
          "detail": "Sources; chronology"
        },
        {
          "title": "Generate + verify",
          "detail": "Facts ↔ original spans"
        },
        {
          "title": "Summary + JSON",
          "detail": "Citations; unresolved flags"
        }
      ],
      "offline": [
        {
          "title": "Human + teacher refs",
          "detail": "Summaries; exact facts"
        },
        {
          "title": "Audit evidence",
          "detail": "Fields + relations"
        },
        {
          "title": "Train / adapt",
          "detail": "Training split only"
        },
        {
          "title": "Locked case audit",
          "detail": "Long tails; reversals"
        },
        {
          "title": "Versioned recipe",
          "detail": "Extractor + generators"
        }
      ],
      "offlineLabel": "Training / evaluation",
      "servingLabel": "Asynchronous case processing",
      "feedsStep": 1,
      "feedLabel": "Deploy evaluated extraction and summary recipe",
      "parallelStep": {
        "index": 1,
        "branches": [
          "Local summarizer",
          "Structured fact extractor"
        ]
      },
      "learningLoop": "Audited omissions, contradictions, and field edits → targeted cases → independent regression checks.",
      "caption": "Local summaries and structured facts are parallel outputs, both sent to aggregation. Preserve provenance and chronology instead of repeatedly compressing summaries alone."
    },
    "tradeoff": "Parallel chunks improve throughput but cannot remove the final aggregation dependency or make 100K-token inputs cheap. Increase compression only while critical-fact coverage stays acceptable.",
    "followUp": {
      "question": "The right amount appears somewhere in the source. Is the generated refund correct?",
      "answer": "Check that the amount belongs to that refund, person, and final decision. Verify normalized facts and relationships against original evidence; matching a number anywhere is insufficient."
    },
    "pitfalls": [
      "A final generator cannot restore a decision that every intermediate summary dropped.",
      "An LLM judge or source extractor is fallible; validate against original evidence and calibrated human samples."
    ],
    "capacity": "100K tokens at 4K/chunk needs at least 25 chunks before overlap. Budget local summary/extraction work plus the aggregation critical path; measure high-length job latency and generated tokens, not just parallel worker throughput.",
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
      "input": "A case excerpt showing a refund approved on Monday and reversed on Tuesday.",
      "target": "The final status is reversed, with the correct amount/owner and links to both source events; unresolved conflicts stay explicit."
    },
    "designSteps": [
      {
        "title": "Parse before compressing",
        "text": "Retain table headings, chronology, and source positions while dividing the file into bounded chunks."
      },
      {
        "title": "Keep briefs and facts",
        "text": "Run local summaries and extraction side by side; send both with evidence pointers to aggregation."
      },
      {
        "title": "Reconcile and verify",
        "text": "Resolve supported chronology, mark unresolved conflicts, and check the final summary/JSON against original evidence before handoff."
      }
    ]
  }
];

// Keep earlier case links usable while the hub and sitemap use the specific architecture names.
export function getNlpDesignProblem(id: string) {
  return nlpDesignProblems.find((problem) => problem.id === id || problem.legacyIds?.includes(id));
}
