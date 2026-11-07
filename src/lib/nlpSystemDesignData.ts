export type DesignFlowNode = { title: string; detail: string };

export { mlSystemDesignFramework as nlpDesignFramework } from "./mlSystemDesignTopics";

export type NlpDesignProblem = {
  id: string;
  lessonId?: string;
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
    "lessonId": "content-moderation",
    "title": "Customer Support Issue Classification",
    "pattern": "Encoder → independent label scores",
    "decision": "Treat each category as a separate yes-or-no question. Billing and Fulfillment can both have work to do on the same ticket.",
    "summary": "Read a customer message, identify every issue it contains, and return scored categories or a review outcome.",
    "mentalModel": "Picture a panel with 150 dimmers. One message can turn several up, and each dimmer has its own mark for when to send an alert.",
    "example": {
      "input": "“The screen arrived cracked, and I see two charges.”",
      "output": "Damaged product and Duplicate charge, each with a confidence score."
    },
    "conversation": [
      {
        "speaker": "Candidate",
        "text": "What happens to a message we cannot route confidently?"
      },
      {
        "speaker": "Interviewer",
        "text": "It goes to a human. A missed second issue can still delay resolution even when the first route was right."
      }
    ],
    "objectives": {
      "business": "Reduce manual sorting and transfers between teams.",
      "ml": "Predict the full set of issues in a message and score each selected label."
    },
    "data": {
      "sources": "Start with resolved tickets. The final queue is a clue, since a Billing ticket can also contain a shipping complaint.",
      "labels": "Have reviewers mark every applicable category. When labels are scarce, an offline language model can suggest tags. Audit its suggestions by language and category before using them to train.",
      "features": "Keep the original wording, especially negation and error codes. The eventual resolution arrives after routing, so it belongs on the label side of the dataset.",
      "validation": "Keep whole threads together and hold out later tickets labeled by people. A test graded by the same teacher can reward the student for copying its omissions."
    },
    "highLevel": {
      "model": "A shared multilingual encoder reads each message once. Its output feeds one scoring unit for each category.",
      "rationale": "The expensive labeling work happens offline. Live requests only run the encoder and a small decision policy."
    },
    "modeling": {
      "baseline": "Try TF–IDF with one logistic regression per issue. This gives rare, distinctive terms such as error codes a strong vote.",
      "choice": "Fine-tune XLM-R, a multilingual text encoder. Use sigmoid outputs so each score can rise independently, even when another score is already high.",
      "training": "Use binary cross-entropy to penalize each wrong yes-or-no prediction. Treat unchecked tags as unknown. Test whether emphasizing rare labels improves their recall."
    },
    "inference": {
      "serving": "Calibrate scores on reviewed tickets so a reported 80% confidence corresponds to about eight correct labels out of ten at that score. Choose each cutoff based on the cost of a wrong route. Return NEEDS_REVIEW if no score passes.",
      "experiment": "Run the model alongside agents first and compare its decisions without changing routes. Start sending real tickets only after reviewing missed issues and incorrect routes."
    },
    "measure": [
      {
        "label": "Offline",
        "text": "Measure label precision and recall by language and category. Check recall on multi-issue tickets separately to expose missing second labels."
      },
      {
        "label": "Live",
        "text": "Track transfers and time to resolution alongside the number of tickets sent to manual review."
      }
    ],
    "monitoring": "If review jumps for one language, read recent tickets. A new error code for an existing issue calls for fresh examples. A new type of issue may call for a category.",
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
          "detail": "Audited train; human test"
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
      "feedLabel": "Load encoder and cutoffs together",
      "caption": "The dashed arrows show what crosses between training and serving. A tested release goes up, and reviewed examples go back.",
      "feedbackLabel": "Agent corrections → labeling"
    },
    "tradeoff": "Lowering a cutoff catches more real issues and can send more tickets to the wrong team. Review that tradeoff separately for each category.",
    "followUp": {
      "question": "If the model is certain about the first label, where would you find missing second labels?",
      "answer": "Audit a sample of automatically routed tickets. Reviewing only the manual queue misses incomplete predictions that looked confident."
    },
    "pitfalls": [
      "Counting every unrecorded tag as a confirmed negative.",
      "Treating a raw model score as a calibrated confidence."
    ],
    "capacity": "Benchmark messages per second at peak message lengths. Add replicas for bursts and keep the wait for each batch within the latency budget.",
    "reference": {
      "title": "Conneau et al. · Multilingual representation learning",
      "href": "https://aclanthology.org/2020.acl-main.747/",
      "note": "The paper introduces the multilingual XLM-R encoder."
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
      "input": "“I requested a refund a week ago and it still hasn’t arrived.”",
      "target": "Refund delayed is positive. Refund denied is a useful near miss. The customer reports waiting and says nothing about a denial."
    },
    "designSteps": [
      {
        "title": "Keep the model and cutoffs together",
        "text": "Store the thresholds with the encoder version that produced their calibration scores. Roll back both as one release."
      },
      {
        "title": "Capture the full correction",
        "text": "When an agent adds a missing issue, keep the corrected set with the original message so the next training round sees the full target."
      }
    ]
  },
  {
    "id": "duplicate-detection",
    "lessonId": "duplicate-detection",
    "title": "Semantic Duplicate Ticket Detection",
    "pattern": "Similarity shortlist → same-issue verification",
    "decision": "The search step should be generous about what looks related. The merge decision should require evidence of the same incident.",
    "summary": "Find tickets about the same underlying issue even when the words differ, while protecting unrelated incidents from false merges.",
    "mentalModel": "Imagine a librarian pulling a stack of case files. An investigator reads the stack closely to decide which file, if any, describes this incident.",
    "example": {
      "input": "New ticket says checkout fails with E42 after version 8.2. T-104 reports the same error and release.",
      "output": "Return T-104’s canonical ID if the incident matches. Return NOVEL when no candidate can be verified."
    },
    "conversation": [
      {
        "speaker": "Candidate",
        "text": "Does a duplicate mean the same symptom or the same incident?"
      },
      {
        "speaker": "Interviewer",
        "text": "The same underlying incident. Two checkout failures may need separate investigations."
      }
    ],
    "objectives": {
      "business": "Reuse investigations while keeping distinct incidents visible.",
      "ml": "Retrieve plausible matches and verify whether each pair refers to the same issue."
    },
    "data": {
      "sources": "Start with agent merges, unmerges, and links marked related. Ask reviewers to check uncertain pairs. An old merge can itself be a mistake.",
      "labels": "A training row contains the new ticket, one candidate, and whether the two describe the same issue. Sample convincing near misses from search results.",
      "features": "Keep the subject, body, product version, and error code. Let the verifier compare those clues alongside meaning across languages.",
      "validation": "Replay later tickets in arrival order. Each query can see only earlier tickets, and evaluation incident families should stay out of training."
    },
    "highLevel": {
      "model": "Search precomputed ticket vectors for a shortlist. Then read the full text of each shortlisted pair together before deciding.",
      "rationale": "At 100 million tickets, the first stage saves most of the comparisons. A genuine duplicate omitted from the shortlist cannot be recovered by the verifier."
    },
    "modeling": {
      "baseline": "Start with multilingual vector similarity and a cutoff. Measure how often the nearest neighbor has the same topic and a different cause.",
      "choice": "Use a bi-encoder to embed each ticket independently. Use a cross-encoder to read both tickets at once and score duplication.",
      "training": "Train the retriever to pull confirmed duplicates closer than related nonduplicates. Train the verifier on labeled pairs drawn from the kind of shortlist it will see live."
    },
    "inference": {
      "serving": "Choose a verifier cutoff on held-out candidate pairs. Favor precision because a bad merge hides work. Resolve the accepted ticket to its current canonical ID.",
      "experiment": "Show suggested links to agents before automating merges. Use their decisions to check the cost of mistakes and decide when automatic merging is safe."
    },
    "measure": [
      {
        "label": "Offline",
        "text": "Measure shortlist recall and final merge precision separately. Compare approximate search with exact search on a representative subset to isolate losses from the index."
      },
      {
        "label": "Live",
        "text": "Track confirmed merges, unmerges, and time saved investigating. Sample NOVEL outcomes to estimate missed duplicates."
      }
    ],
    "monitoring": "A rise in NOVEL could signal a release incident or an indexing backlog. Check the age of the newest searchable ticket before touching the cutoff.",
    "diagram": {
      "online": [
        {
          "title": "New ticket",
          "detail": "Subject + body + context"
        },
        {
          "title": "Encoder + retrieval",
          "detail": "Main + delta → top 20"
        },
        {
          "title": "Pair verifier",
          "detail": "Pair → duplicate score"
        },
        {
          "title": "Decision policy",
          "detail": "Calibrated acceptance"
        },
        {
          "title": "Canonical group",
          "detail": "Resolve ID / NOVEL"
        }
      ],
      "offline": [
        {
          "title": "Reviewer feedback",
          "detail": "Merges + corrections"
        },
        {
          "title": "Labeled pairs",
          "detail": "Audited train; human test"
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
          "detail": "Promote encoder + index"
        }
      ],
      "offlineLabel": "Training and release",
      "feedsStep": 1,
      "feedLabel": "Release compatible encoder and index",
      "caption": "Follow the bottom path for freshness. A ticket becomes searchable through ingestion even when the serving path finds no match.",
      "feedbackLabel": "Difficult ticket pairs → reviewed examples",
      "ingestion": {
        "nodes": [
          {
            "title": "New tickets",
            "detail": "Independent of verdict"
          },
          {
            "title": "Keep IDs + context",
            "detail": "Own ID and text"
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
    "tradeoff": "Compressing vectors saves index memory and can drop good candidates. Compare recall on cross-language duplicates and rare products before choosing a compression level.",
    "followUp": {
      "question": "Can a duplicate ticket still enter the search index?",
      "answer": "Yes. Its wording may help a future query find the incident. Keep its own ID and resolve it to the current canonical ticket."
    },
    "pitfalls": [
      "Using unmerged tickets as automatic negatives.",
      "Reusing old ticket vectors with a newly trained query encoder."
    ],
    "capacity": "At an assumed peak of 1,000 queries per second and 20 candidates per query, the verifier sees 20,000 pairs per second. Raw 768-dimensional FP16 vectors for 100 million tickets occupy about 154 GB before index structures, metadata, or replicas. Benchmark the full path against the P95 target below 200 ms.",
    "reference": {
      "title": "Sentence Transformers: cross-encoder training",
      "href": "https://sbert.net/docs/cross_encoder/training_overview.html",
      "note": "Reference for pairwise models and hard-negative training; the labels here encode strict duplication."
    },
    "statement": "Design a multilingual machine learning system that detects whether a newly submitted support ticket describes the same underlying issue as an existing ticket among 100 million historical tickets.",
    "requirements": [
      "Accept multilingual tickets with titles, descriptions, and optional metadata.",
      "Identify duplicates despite different wording or languages.",
      "Return the canonical ticket/group ID or NOVEL.",
      "Support new ticket ingestion and updates.",
      "Allow human reviewers to correct incorrect matches."
    ],
    "trainingExample": {
      "input": "Pair two E42 tickets where one traces to expired payment credentials and the other to the 8.2 update.",
      "target": "Different incidents. Shared words and even a shared error code are insufficient evidence."
    },
    "designSteps": [
      {
        "title": "Index every arrival",
        "text": "Index every ticket regardless of the verdict. Search the rapidly updated index alongside the historical index and exclude the incoming ticket’s own ID."
      },
      {
        "title": "Swap compatible versions",
        "text": "Re-embed historical tickets for a new encoder. Catch up on arrivals, then switch the encoder and both indexes together."
      }
    ]
  },
  {
    "id": "workflow-matching",
    "lessonId": "workflow-matching",
    "legacyIds": [
      "support-ticket-routing",
      "semantic-search"
    ],
    "title": "Match requests to changing workflows",
    "pattern": "Retrieve known actions → accept or abstain",
    "decision": "Separate intent from eligibility. A customer can clearly ask for a refund even when that order is ineligible.",
    "summary": "Select the correct workflow from thousands of changing actions, or return UNSUPPORTED when none fits.",
    "mentalModel": "Think of a dispatcher with a current playbook. They select a page. A separate operator checks the customer’s account before following its instructions.",
    "example": {
      "input": "“Stop future renewals, but keep this month’s shipment.”",
      "output": "CANCEL_SUBSCRIPTION. The account service checks permission and prerequisites before acting."
    },
    "conversation": [
      {
        "speaker": "Candidate",
        "text": "Can selecting a workflow move money or change an account?"
      },
      {
        "speaker": "Interviewer",
        "text": "The matcher proposes an action. The account service decides whether this caller may execute it."
      }
    ],
    "objectives": {
      "business": "Resolve more supported requests without taking unintended actions.",
      "ml": "Rank catalog procedures by the intent expressed in the request."
    },
    "data": {
      "sources": "Use the catalog’s descriptions, input requirements, and example requests. Join historical support requests with agent-confirmed intent and the catalog version they saw.",
      "labels": "Record the intended procedure even when execution failed. Keep a version history for renamed IDs, and re-review labels if a workflow’s meaning changed.",
      "features": "Give the model the request, relevant conversation context, and action descriptions. Let the execution service look up current account state.",
      "validation": "Replay a later catalog snapshot. Test new workflows with no training examples, retired workflows, and legitimate requests outside the catalog."
    },
    "highLevel": {
      "model": "Search active workflow descriptions in a shared multilingual vector space. Re-read the strongest candidates against the request to distinguish similar actions.",
      "rationale": "The catalog holds the changing menu. A newly published action can be retrieved as soon as its description is indexed."
    },
    "modeling": {
      "baseline": "Use the closest multilingual embedding match as the first baseline. Check where a broad match misses a small but consequential distinction.",
      "choice": "A bi-encoder makes the shortlist. A cross-encoder reads the request and one procedure together to score how well the procedure fits.",
      "training": "Train on confirmed request–procedure pairs. Include sibling procedures that share vocabulary and out-of-catalog requests for testing rejection."
    },
    "inference": {
      "serving": "Return one ID only if the score clears a cutoff calibrated on reviewed requests and the workflow is still active. Otherwise return UNSUPPORTED.",
      "experiment": "Suggest IDs to agents first. Move to assisted execution only after audits show that the matcher handles similar workflows and unsupported requests reliably."
    },
    "measure": [
      {
        "label": "Offline",
        "text": "Measure shortlist recall and wrong selections among accepted requests. Track how many supported requests are declined, especially for newly added workflows."
      },
      {
        "label": "Live",
        "text": "Track correct resolutions, wrong-action attempts, and manual escalations. Report prerequisite failures separately from intent errors."
      }
    ],
    "monitoring": "If one language starts returning more UNSUPPORTED results, inspect its top candidates. An unclear new description may be the cause.",
    "diagram": {
      "online": [
        {
          "title": "Request + context",
          "detail": "Multilingual input"
        },
        {
          "title": "Workflow retrieval",
          "detail": "Search active descriptions"
        },
        {
          "title": "Pair scorer",
          "detail": "Check intent against spec"
        },
        {
          "title": "Select workflow",
          "detail": "Accept active matches"
        },
        {
          "title": "ID / UNSUPPORTED",
          "detail": "ID can go to executor"
        }
      ],
      "offline": [
        {
          "title": "Catalog edits",
          "detail": "New, changed, retired"
        },
        {
          "title": "Validate workflow specs",
          "detail": "IDs + prerequisites"
        },
        {
          "title": "Embed changed specs",
          "detail": "Use live encoder"
        },
        {
          "title": "Check catalog snapshot",
          "detail": "Versions + active IDs"
        },
        {
          "title": "Publish catalog",
          "detail": "Descriptions + vectors"
        }
      ],
      "offlineLabel": "Registry updates",
      "feedsStep": 1,
      "feedLabel": "Search current action specifications",
      "caption": "The first path selects a procedure and passes accepted IDs to the authorized service. Catalog updates feed the selection path independently."
    },
    "tradeoff": "A strict cutoff protects against confident-looking mistakes and sends more requests to agents. Review both wrong matches and the workload those declines create.",
    "followUp": {
      "question": "What if a workflow is retired just after the matcher selected it?",
      "answer": "The executor checks the current catalog before running it. Return a visible failure and refresh the choice if the selected version is stale."
    },
    "pitfalls": [
      "Treating successful execution as the only evidence of intent.",
      "Giving the matching model authority to execute a workflow."
    ],
    "capacity": "At 20,000 workflows, compare exact vector search against approximate search on real traffic before adding index complexity. The number of candidates sent to the second model drives most of its cost.",
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
      "input": "“Send the receipt to my new email address.”",
      "target": "RESEND_RECEIPT is the intended action. UPDATE_ACCOUNT_EMAIL is a tempting wrong choice."
    },
    "designSteps": [
      {
        "title": "Publish an updated catalog",
        "text": "Embed changed descriptions and switch the searchable snapshot. Apply retirements to the active-ID check as soon as they take effect."
      },
      {
        "title": "Check authority before acting",
        "text": "The executor validates the active version, caller’s permission, required fields, and current account state. Show why execution stopped if a check fails."
      }
    ]
  },
  {
    "id": "entity-linking",
    "lessonId": "entity-linking",
    "legacyIds": [
      "information-extraction"
    ],
    "title": "Link product mentions to catalog IDs",
    "pattern": "Detect mentions → retrieve → verify identity",
    "decision": "Finding a product name and resolving its identity are separate jobs. A correctly highlighted name can still lead to the wrong catalog record.",
    "summary": "Find every product mention in a message and link it to the right variant in a large catalog, or return NO_MATCH.",
    "mentalModel": "Picture a highlighter and a barcode lookup. The highlighter marks the words. The lookup narrows the result down to the exact item on the shelf.",
    "example": {
      "input": "“My blue Model X 128GB overheats, but the Model X 256GB works.”",
      "output": "Return two mention spans with their respective variant IDs if the catalog and text establish both."
    },
    "conversation": [
      {
        "speaker": "Candidate",
        "text": "What if the message gives the product line without the storage size?"
      },
      {
        "speaker": "Interviewer",
        "text": "We need an exact variant. Return NO_MATCH if several variants still fit the evidence."
      }
    ],
    "objectives": {
      "business": "Connect each complaint to the right product record.",
      "ml": "Find product spans and resolve each one to an exact active variant ID."
    },
    "data": {
      "sources": "Build examples from annotated messages and versioned catalog records. Include aliases, spelling errors, and common names in different languages.",
      "labels": "Mark the text span and exact ID for each mention. A real product absent from the catalog needs a span labeled NO_MATCH. Chatter without a product needs no span.",
      "features": "Keep variant clues such as color, storage, model codes, and nearby words. Index both exact codes and descriptions of each variant.",
      "validation": "Hold out later messages and catalog arrivals. Check rare products and lookalike variants separately."
    },
    "highLevel": {
      "model": "Highlight product mentions first, then search the catalog once per mention. Compare the best results with the mention and its surrounding text.",
      "rationale": "The detector learns what a product phrase looks like. New products can enter the search index without teaching the detector a new output class."
    },
    "modeling": {
      "baseline": "Start with a fuzzy alias dictionary and keyword search. It handles known nicknames and exact codes but can miss unfamiliar paraphrases.",
      "choice": "A multilingual token tagger marks where names begin and end. Keyword search preserves exact identifiers, vector search catches paraphrases, and a pair scorer checks candidate attributes.",
      "training": "Train the tagger on span boundaries and the scorer on mention–record pairs. Retrieve near misses for training, especially sibling variants that differ in one attribute."
    },
    "inference": {
      "serving": "Check the best score and its lead over the runner-up. Calibrate both on reviewed mentions. Return NO_MATCH if the evidence is weak, variants tie, or the winning ID is retired.",
      "experiment": "Show proposed links next to the highlighted words and collect corrections for each stage before automating links."
    },
    "measure": [
      {
        "label": "Offline",
        "text": "Measure span precision and recall, shortlist recall for correctly located mentions, and exact-ID accuracy end to end. Score false links on NO_MATCH examples."
      },
      {
        "label": "Live",
        "text": "Track agent corrections and sample declined links. A high NO_MATCH rate on common items can reveal a missing alias or stale catalog."
      }
    ],
    "monitoring": "If a product launch yields many correct spans with no links, check whether its variants and aliases reached both the keyword and vector indexes.",
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
          "detail": "Score + gap + active ID"
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
      "caption": "Trace one product phrase through the top row. A message with several phrases repeats the lookup for each span."
    },
    "tradeoff": "A confident scorer may still be choosing among incomplete candidates. Preserve retrieval coverage before tightening the final score cutoff.",
    "followUp": {
      "question": "How do you distinguish no mention from NO_MATCH?",
      "answer": "No mention returns an empty list. NO_MATCH comes with the words the detector found, so an agent can still inspect the unresolved product."
    },
    "pitfalls": [
      "Dropping the variant qualifier during text cleanup.",
      "Scoring the linker only on perfect spans and calling that end-to-end quality."
    ],
    "capacity": "Precompute vectors for the 50 million records. Benchmark requests with several mentions and batch their pair comparisons. The expensive workload scales with mentions times candidates.",
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
      "input": "“The black K-80 case is cracked.” The catalog has K-80 in black and blue.",
      "target": "Mark “black K-80 case” and link the black variant. The blue record is a hard negative because most of its attributes match."
    },
    "designSteps": [
      {
        "title": "Keep offsets from the original message",
        "text": "When normalization changes the text, map the detected phrase back to the original so reviewers can see exactly what was linked."
      },
      {
        "title": "Handle additions and retirements independently",
        "text": "Index new records incrementally. Exclude retired IDs with an authoritative status check while old entries are being removed."
      }
    ]
  },
  {
    "id": "emerging-issues",
    "lessonId": "emerging-issues",
    "legacyIds": [
      "aspect-sentiment"
    ],
    "title": "Discover emerging customer issues",
    "pattern": "Unknown observations → validated new issues",
    "decision": "A message the system cannot classify is a clue. A new issue needs several independent reports that describe the same failure.",
    "summary": "Find genuinely new problems after a release, without promoting praise, copied complaints, or spam into incidents.",
    "mentalModel": "Picture a sorting desk with familiar folders, a recycling bin, and a tray for unexplained reports. A pile in the tray becomes worth opening when reports arrive from several customers.",
    "example": {
      "input": "Unrelated customers report that PDF exports became blank after release 8.2.",
      "output": "Propose a new incident with representative reports and a timeline. Publish a new issue ID after review."
    },
    "conversation": [
      {
        "speaker": "Candidate",
        "text": "When does the one-hour clock start?"
      },
      {
        "speaker": "Interviewer",
        "text": "Measure from the first credible report in replay. A rare incident may need more independent evidence before a reviewer can confirm it."
      }
    ],
    "objectives": {
      "business": "Alert responders earlier without flooding their review queue.",
      "ml": "Assign known issues, discard noise, and turn recurring unknowns into reviewable incident candidates."
    },
    "data": {
      "sources": "Keep message text, time, release version, and a source identifier. The same pasted report from one account should count as one source.",
      "labels": "Label reports with a known issue, genuine unknown, or noise. Review ambiguous examples, particularly praise and spam that reuse complaint vocabulary.",
      "features": "Embed reports in a shared space across languages. Keep product and version available to reviewers because similar symptoms can belong to different releases.",
      "validation": "Hide selected issues from the known list and replay the stream in timestamp order. Count detections using only reports that had arrived at the time."
    },
    "highLevel": {
      "model": "A multilingual classifier sorts messages into known issues, unknown complaints, and noise. Keep vectors for the unknown complaints and group nearby reports in a rolling window.",
      "rationale": "Reviewers get a small evidence packet per group. The known-issue registry updates only after a reviewer confirms that the group is new."
    },
    "modeling": {
      "baseline": "Start by comparing each message with the average vector for each known issue. Short paraphrases of different failures often sit near the same average.",
      "choice": "Fine-tune a multilingual encoder for known issues, unknown, and noise. Use density-based clustering such as HDBSCAN to group nearby unknowns while allowing isolated reports to sit out.",
      "training": "Train on reviewed examples of known issues and realistic unknowns. Include difficult distinctions, such as a denied refund versus a delayed one. Publish reviewed examples as temporary matches for newly approved issues until the next classifier update."
    },
    "inference": {
      "serving": "Use validated cutoffs for known and noise decisions. Rank clusters for review by distinct customers, growth versus recent traffic, and distance from known issues.",
      "experiment": "Replay recent launches and run in parallel with the incident desk before sending alerts. Compare discovery delay at the number of clusters reviewers can actually handle."
    },
    "measure": [
      {
        "label": "Offline",
        "text": "Measure issue-level recall and minutes to the first useful alert, along with known-issue and noise errors. Report performance on smaller incidents and by language."
      },
      {
        "label": "Live",
        "text": "Track reviewer acceptance, repeat alerts for known issues, and queue age. Measure the one-hour goal through delivery to the reviewer."
      }
    ],
    "monitoring": "If the unknown pool suddenly grows, inspect examples by product and release. Check for a real incident, a noisy source, or stale known-issue definitions.",
    "diagram": {
      "online": [
        {
          "title": "Incoming messages",
          "detail": "Time + release + source"
        },
        {
          "title": "Classification gate",
          "detail": "Known, unknown, noise"
        },
        {
          "title": "Unknown complaints",
          "detail": "Keep recent vectors"
        },
        {
          "title": "Cluster and rank",
          "detail": "Group + count sources"
        },
        {
          "title": "Assign or review",
          "detail": "Review new proposals"
        }
      ],
      "offline": [
        {
          "title": "Reviewed proposals",
          "detail": "Confirmed issue only"
        },
        {
          "title": "Record stable issue ID",
          "detail": "Definition + examples"
        },
        {
          "title": "Embed examples",
          "detail": "Use live encoder"
        },
        {
          "title": "Validate matcher",
          "detail": "Check lookalike issues"
        },
        {
          "title": "Publish registry",
          "detail": "New issue searchable"
        }
      ],
      "offlineLabel": "Known-issue registry updates",
      "servingLabel": "Assignment and discovery",
      "feedsStep": 1,
      "feedLabel": "Load current issue examples",
      "bypass": {
        "fromStep": 1,
        "label": "Known match → assign directly"
      },
      "caption": "Only unknown complaints go into the clustering window. The direct path assigns a known issue without waiting for the next discovery run.",
      "feedbackLabel": "Approved discoveries → reviewed reports"
    },
    "tradeoff": "A short window reacts quickly and may miss slow-building incidents. A longer window gathers evidence and can mix unrelated failures.",
    "followUp": {
      "question": "Does a large cluster automatically qualify as a new issue?",
      "answer": "Check who sent the reports and whether they point to one distinct failure. A copied message can produce a large cluster with little independent evidence."
    },
    "pitfalls": [
      "Forcing all complaints into the closest known issue.",
      "Measuring discovery against clusters built using future messages."
    ],
    "capacity": "As an illustrative budget, run discovery every ten minutes. Measure the time from ingestion through clustering to the review queue. Bound the active window so a burst can still be processed before the next run.",
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
      "input": "“Thanks, version 8.2 fixed blank PDFs!”",
      "target": "Noise for incident discovery. The message names the symptom and release but describes a fix."
    },
    "designSteps": [
      {
        "title": "Build a review packet",
        "text": "Show examples from different customers, the report timeline, and the closest known issue. The reviewer can merge, dismiss, or approve the proposal."
      },
      {
        "title": "Publish the accepted issue",
        "text": "Assign a stable ID and index reviewed examples immediately. Include that issue in the next evaluated classifier release."
      }
    ]
  },
  {
    "id": "grounded-question-answering",
    "lessonId": "grounded-question-answering",
    "title": "Answer questions from company documents",
    "pattern": "Retrieve evidence → answer → verify support",
    "decision": "Treat access, applicability, and evidence as separate checks. A passage can be relevant and still belong to a different region or an inaccessible document.",
    "summary": "Give cited, grounded answers from a changing corpus, and abstain when relevant passages still do not answer the question.",
    "mentalModel": "Picture an open-book exam with a library card. The card decides which shelves you can access. To answer, open the right edition and point to the line that supports your claim.",
    "example": {
      "input": "“How many vacation days can I carry over?” The region is unknown and the rules differ by region.",
      "output": "Ask for the region. If the applicable policy then supports a five-day limit, answer with that passage linked."
    },
    "conversation": [
      {
        "speaker": "Candidate",
        "text": "Which policy applies if a question is about last year?"
      },
      {
        "speaker": "Interviewer",
        "text": "Use the version that was effective on the relevant date. When the date or region would change the answer, ask for it."
      }
    ],
    "objectives": {
      "business": "Resolve policy questions faster while enforcing access and avoiding unsupported advice.",
      "ml": "Find applicable, permitted evidence and answer with citations when that evidence is sufficient."
    },
    "data": {
      "sources": "Index passages from policy documents with stable links, document versions, effective dates, scope, and access metadata.",
      "labels": "For each reviewed question, record the supporting passages and whether the question needs clarification or has insufficient evidence. Include questions whose answer is inaccessible to that user.",
      "features": "Chunk at headings and preserve parent titles or table headers. Keep scope and access metadata on each chunk so they can be checked before retrieval results reach the model.",
      "validation": "Test against document and permission snapshots from the time of each question. Include access revocations, old policies, and regional near matches."
    },
    "highLevel": {
      "model": "Use retrieval-augmented generation (RAG). Search the employee’s authorized documents, then give the generator the strongest applicable passages.",
      "rationale": "Search can reflect a policy edit immediately after indexing. The answer can cite the actual rule and its version."
    },
    "modeling": {
      "baseline": "Start with permission-filtered keyword search that returns excerpts. This can already answer questions with a distinctive policy name.",
      "choice": "Combine keyword matches for exact terms with vector matches for paraphrases. Merge the lists by rank, then use a cross-encoder to read the question and each shortlisted passage together.",
      "training": "Start with a prompted generator. If ranking misses relevant passages, tune the reranker with judged pairs, including superseded policies and neighboring regions."
    },
    "inference": {
      "serving": "Ask a clarifying question when missing scope changes the rule. Return INSUFFICIENT_EVIDENCE when permitted passages do not settle the answer. Otherwise draft from those passages and verify each material claim against its citation before returning it.",
      "experiment": "Start with a small internal pilot after tests for stale policies, forged citations, and unauthorized access. Review answers alongside the passages the model saw."
    },
    "measure": [
      {
        "label": "Offline",
        "text": "Track whether applicable evidence reached the prompt, whether the answer follows from it, and whether the system correctly abstains. Treat exposure of any forbidden passage as a release-blocking failure."
      },
      {
        "label": "Live",
        "text": "Track resolved questions, audited wrong answers, and abstentions. Recheck permission enforcement on document updates and on cached results."
      }
    ],
    "monitoring": "If abstentions spike after a policy publish, check indexing lag and scope filters. If the generator is unavailable, return clearly labeled excerpts from permitted documents.",
    "diagram": {
      "online": [
        {
          "title": "Query + identity",
          "detail": "Resolve scope and access"
        },
        {
          "title": "Search and rerank",
          "detail": "Only allowed passages"
        },
        {
          "title": "Evidence gate",
          "detail": "Scope, dates, conflicts"
        },
        {
          "title": "Draft and verify",
          "detail": "Claims tied to citations"
        },
        {
          "title": "Answer or defer",
          "detail": "Cite, clarify, or abstain"
        }
      ],
      "offline": [
        {
          "title": "Documents + visuals",
          "detail": "Access + dates + sources"
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
          "detail": "Updates and revocations"
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
        "label": "Clarify scope / abstain"
      },
      "caption": "Access rules feed search before any passage reaches the generator. The evidence gate can send the request straight to clarification or abstention."
    },
    "tradeoff": "More passages can improve coverage and introduce stale or competing evidence. Apply access and effective-date rules before spending model capacity on ranking and reading.",
    "followUp": {
      "question": "The same link worked yesterday. What if the employee’s access is revoked today?",
      "answer": "Filter against current permissions and recheck before using a retrieved or cached passage. Fail closed when permissions cannot be verified."
    },
    "pitfalls": [
      "Treating a matching title or a valid link as proof that the cited sentence supports the answer.",
      "Resolving equally authoritative policy conflicts by taking the highest similarity score."
    ],
    "capacity": "Measure retrieval and generation separately. Cap the number and length of passages passed to the model, and test whether the smaller evidence budget still contains the decisive rule.",
    "reference": {
      "title": "Microsoft Learn · Document-level access control",
      "href": "https://learn.microsoft.com/en-us/azure/search/search-document-level-access-overview",
      "note": "Examples of applying document permissions during retrieval."
    },
    "statement": "Answer employee questions from current company documents, with supporting citations and enforced permissions.",
    "requirements": [
      "Use only documents the requester may access.",
      "Handle changing or conflicting policy versions.",
      "Cite supporting source passages.",
      "Ask for clarification or return INSUFFICIENT_EVIDENCE when needed."
    ],
    "trainingExample": {
      "input": "A Quebec travel question retrieves similar expense policies for Quebec and Ontario.",
      "target": "Mark the applicable Quebec passage as supporting evidence. The Ontario passage is a hard negative, even if it mentions the same expense."
    },
    "designSteps": [
      {
        "title": "Apply authorization before model access",
        "text": "Search within the requester’s allowed set. Recheck current document permissions before passing excerpts to the model, including on cache hits."
      },
      {
        "title": "Publish document and access updates",
        "text": "Index new versions, mark superseded versions with their effective periods, and apply deletions and revocations independently of an index rebuild."
      }
    ]
  },
  {
    "id": "machine-translation",
    "lessonId": "machine-translation",
    "title": "Translate messages with a live glossary",
    "pattern": "Specialized translation + dynamic terminology",
    "decision": "Treat the message as both a sentence and a record. The wording can change across languages while the facts an agent acts on must stay stable.",
    "summary": "Translate multilingual support messages cheaply at scale while preserving approved terminology, entities, and numbers.",
    "mentalModel": "Imagine a translator with a current style sheet and a checklist. The style sheet supplies the approved product name. The checklist catches changes to the order number or date.",
    "example": {
      "input": "Spanish → English. “Mi pedido AB-42 de la Caja Pro llega el 12 de mayo.”",
      "output": "“My Pro Box order AB-42 arrives on May 12.” Pro Box is the current approved term."
    },
    "conversation": [
      {
        "speaker": "Candidate",
        "text": "Can the translated date change how it is written?"
      },
      {
        "speaker": "Interviewer",
        "text": "Yes, if it still refers to the same date. Order IDs should survive character for character."
      }
    ],
    "objectives": {
      "business": "Help agents resolve requests across languages without meaning-changing errors.",
      "ml": "Generate a context-aware translation that uses approved terminology and preserves protected facts."
    },
    "data": {
      "sources": "Start with messages and bilingual post-edits. Keep the source and target language, direction, and version of the glossary used to review each example.",
      "labels": "Ask reviewers to mark meaning changes, including negation and wrong amounts, as well as terminology errors. A fluent translation can still reverse the customer’s request.",
      "features": "Include a few previous turns only when they help resolve a reference or ambiguous phrase. Mark the current message clearly as the one to translate.",
      "validation": "Hold out full conversations. Evaluate each language direction on later data, including terms introduced after the training snapshot."
    },
    "highLevel": {
      "model": "A multilingual encoder reads the message and its context. A decoder writes the target text while following glossary rules supplied for the request.",
      "rationale": "Keeping terminology in a versioned glossary lets a product rename take effect without retraining the translator."
    },
    "modeling": {
      "baseline": "Compare against a pretrained translator without glossary constraints. Count how often it translates product names literally or inconsistently.",
      "choice": "Look up the applicable terms by phrase, language direction, and product context. Use constrained decoding to require approved terms when the match is unambiguous.",
      "training": "Fine-tune on reviewed source–target pairs if support language needs it. Give low-volume directions enough examples to learn and test them separately."
    },
    "inference": {
      "serving": "Check approved terms and protected facts before returning the result. Compare amounts and dates in a common format, and check IDs exactly. If the direction is unsupported or validation still fails after a bounded retry, visibly show the original.",
      "experiment": "Start with a side-by-side view of original and translation. Use bilingual review and agent corrections to catch changes the automatic checks miss."
    },
    "measure": [
      {
        "label": "Offline",
        "text": "Score adequacy with bilingual reviewers and measure glossary compliance, fact preservation, and fallback by language direction."
      },
      {
        "label": "Live",
        "text": "Track corrections, successful resolutions, and fallback rate together. Sample accepted translations because formatting checks can miss a change in meaning."
      }
    ],
    "monitoring": "If terminology failures rise after a glossary publish, inspect the changed entries for overlapping aliases or conflicting preferred terms before changing the model.",
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
          "detail": "Check terms, facts, IDs"
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
      "caption": "Follow the glossary update path into term lookup. The next request can use a new approved name with the same translator."
    },
    "tradeoff": "Applying a term constraint to the wrong sense can change the meaning. Require a clear glossary match and evaluate ambiguous terms separately.",
    "followUp": {
      "question": "Would a final find-and-replace step be enough?",
      "answer": "It can break agreement or replace the wrong sense. Supplying a valid term during decoding lets the model build the sentence around it."
    },
    "pitfalls": [
      "Checking dates as literal strings across languages.",
      "Treating a translation that passes glossary checks as proof that the meaning survived."
    ],
    "capacity": "Measure throughput in generated tokens per second by language direction and length. Batch requests within the latency budget. Cache only within the applicable context and version.",
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
      "input": "Spanish → English. Earlier turn asks about a shipment. Current message says “No llegó el martes.”",
      "target": "“It didn’t arrive on Tuesday.” The context resolves what “it” refers to, and the output preserves the negation."
    },
    "designSteps": [
      {
        "title": "Protect immutable identifiers",
        "text": "Replace order IDs with placeholders before translation, then restore them and verify that each appears exactly as required."
      },
      {
        "title": "Publish the glossary by version",
        "text": "Validate entries before switching versions. Include the glossary, model, direction, and relevant context in the cache key so old translations cannot mask a term update."
      }
    ]
  },
  {
    "id": "document-summarization",
    "lessonId": "document-summarization",
    "title": "Summarize long documents and extract facts",
    "pattern": "Extract cited events → reconcile → summarize",
    "decision": "The handoff needs an accurate current state and enough history to explain it. An approved refund and a reversed approval are separate events.",
    "summary": "Produce a concise summary and structured facts from long, contradictory documents while retaining evidence for both.",
    "mentalModel": "Imagine index cards for every action. Each card carries a date, an actor, and a source tab. Lay cards for the same action together before writing the one-page handoff.",
    "example": {
      "input": "A Monday email approves a $40 refund. On Tuesday a signed decision reverses that approval.",
      "output": "Report the approval and reversal with both source links. Record the refund status as reversed, leaving the owner unknown if the file gives none."
    },
    "conversation": [
      {
        "speaker": "Candidate",
        "text": "If a case file contradicts itself, can the latest note always win?"
      },
      {
        "speaker": "Interviewer",
        "text": "Use the latest authoritative decision for the same action. Keep genuine conflicts visible when the file cannot resolve them."
      }
    ],
    "objectives": {
      "business": "Shorten case handoffs while preserving commitments, open work, and money amounts.",
      "ml": "Extract cited facts and write a short account from the reconciled case record."
    },
    "data": {
      "sources": "Use closed case files with reviewed handoffs. Keep email threads, attached tables, and the exact file revision.",
      "labels": "Annotate actions, dates, amounts, owners, and open issues with source spans. Link a later event to the decision it supersedes.",
      "features": "Preserve speakers, timestamps, and table headers when parsing. A cell that says “40” needs its column and row to establish what it means.",
      "validation": "Hold out entire cases and use later files for testing. Include multilingual records with widely separated reversals and cases where two amounts refer to different actions."
    },
    "highLevel": {
      "model": "Break the file into sections and extract cited event records in parallel. Join the records into a case timeline before asking a model to write the handoff.",
      "rationale": "The merge step sees decisions from distant sections. Keeping a structured record protects details a local summary might omit."
    },
    "modeling": {
      "baseline": "For files that fit, try one prompted model over the whole file with the same output schema. Check whether it finds late reversals and cites the right evidence.",
      "choice": "Use a multilingual generator to extract records into a fixed schema. Reconcile by action identity, time, and authority. Then draft from the resulting record and its evidence.",
      "training": "Start with reviewed prompts and examples. If extraction keeps missing a field or returning invalid records, fine-tune on corrected examples with source spans."
    },
    "inference": {
      "serving": "Verify each material claim against its cited passage. An existing link is insufficient if the passage does not support the claim. Mark unresolved conflicts and missing fields explicitly.",
      "experiment": "Show the handoff as a draft with clickable evidence. Collect edits by field to find systematic mistakes before relying on it in the workflow."
    },
    "measure": [
      {
        "label": "Offline",
        "text": "Measure field accuracy, correct final state after reversals, and unsupported claims. Break out long, multilingual, and table-heavy files."
      },
      {
        "label": "Live",
        "text": "Track time to pick up a case, agent corrections, and jobs that finish with missing sections."
      }
    ],
    "monitoring": "If verification failures rise on table-heavy files, trace them back to the parsed rows and headers. A parser regression can look like model hallucination.",
    "diagram": {
      "online": [
        {
          "title": "Parse and split",
          "detail": "Emails, tables, offsets"
        },
        {
          "title": "Extract events",
          "detail": "Parallel tasks with citations"
        },
        {
          "title": "Reconcile events",
          "detail": "Identity, time, authority"
        },
        {
          "title": "Draft and verify",
          "detail": "Check claims against spans"
        },
        {
          "title": "Case handoff",
          "detail": "Summary, fields, links"
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
      "caption": "Extraction fans out across sections. Reconciliation joins the results before the draft is written, so a later reversal can change the handoff.",
      "parallelStep": {
        "index": 1,
        "branches": [
          "Extract first section",
          "Extract other sections"
        ]
      }
    },
    "tradeoff": "Smaller sections are easier to process and can cut relevant context in half. Split at message or table boundaries and carry source metadata into each chunk.",
    "followUp": {
      "question": "What happens if two sections give conflicting refund amounts?",
      "answer": "Resolve them when a clear correction cites the same transaction. Otherwise show both amounts with evidence and flag the field for review."
    },
    "pitfalls": [
      "Merging actions just because their amounts match.",
      "Presenting a partial case summary as complete after a chunk job fails."
    ],
    "capacity": "At 2,000 tokens per chunk, a 100,000-token case yields roughly 50 extraction tasks before overlap. Bound parallel work per case and measure queue wait as well as model time.",
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
      "input": "A table has a $40 refund and a $40 fee. A later note says to waive the fee.",
      "target": "Link the waiver to the fee record. Leave the separate refund status as documented and cite the table and waiver note."
    },
    "designSteps": [
      {
        "title": "Retry just the failed extraction",
        "text": "Key each task by case revision, chunk, and extraction version. Store successful results so a retry does not repeat completed work."
      },
      {
        "title": "Reconcile after all required chunks arrive",
        "text": "An appended email may reverse an old decision. Reuse unchanged extractions but rerun the merge, summary, and verification for the new case revision."
      }
    ]
  }
];

// Keep earlier case links usable while the hub and sitemap use the specific architecture names.
export function getNlpDesignProblem(id: string) {
  return nlpDesignProblems.find((problem) => problem.id === id || problem.legacyIds?.includes(id));
}
