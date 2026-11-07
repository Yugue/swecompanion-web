import type { ArchitectureGraph } from "./systemDesignArchitecture";

export const genaiArchitectures: Record<string, ArchitectureGraph> = {
  "enterprise-rag": {
    "nodes": [
      {
        "kind": "service",
        "x": 32,
        "y": 146,
        "title": [
          "Identity +",
          "input guard"
        ],
        "detail": "Authenticate and scope"
      },
      {
        "kind": "service",
        "x": 336,
        "y": 146,
        "title": [
          "Hybrid retrieval"
        ],
        "detail": "Search allowed evidence"
      },
      {
        "kind": "service",
        "x": 640,
        "y": 146,
        "title": [
          "Evidence gate"
        ],
        "detail": "Check answer sufficiency"
      },
      {
        "kind": "service",
        "x": 944,
        "y": 146,
        "title": [
          "Generate + verify"
        ],
        "detail": "Ground every claim"
      },
      {
        "kind": "result",
        "x": 1248,
        "y": 146,
        "title": [
          "Answer / clarify",
          "or abstain"
        ],
        "detail": "Return cited response"
      },
      {
        "kind": "service",
        "x": 32,
        "y": 430,
        "title": [
          "Document ingestion"
        ],
        "detail": "Parse, chunk, update"
      },
      {
        "kind": "store",
        "x": 336,
        "y": 430,
        "title": [
          "Evidence library"
        ],
        "detail": "Keep current evidence"
      },
      {
        "kind": "service",
        "x": 640,
        "y": 430,
        "title": [
          "Release activation"
        ],
        "detail": "Publish evaluated recipe"
      },
      {
        "kind": "store",
        "x": 32,
        "y": 808,
        "title": [
          "Reviewed examples"
        ],
        "detail": "Review cited answers"
      },
      {
        "kind": "service",
        "x": 336,
        "y": 808,
        "title": [
          "Candidate",
          "preparation"
        ],
        "detail": "Tune retrieval + prompts"
      },
      {
        "kind": "service",
        "x": 640,
        "y": 808,
        "title": [
          "Evaluation gate"
        ],
        "detail": "Check grounding + access"
      },
      {
        "kind": "store",
        "x": 944,
        "y": 808,
        "title": [
          "Release registry"
        ],
        "detail": "Track approved versions"
      }
    ],
    "edges": [
      {
        "path": "M256 232 H333",
        "kind": "serving",
        "label": [
          "1. Scoped",
          "query"
        ],
        "x": 296,
        "y": 196
      },
      {
        "path": "M560 232 H637",
        "kind": "serving",
        "label": [
          "2. Ranked",
          "evidence"
        ],
        "x": 600,
        "y": 196
      },
      {
        "path": "M864 232 H941",
        "kind": "serving",
        "label": [
          "3. Enough",
          "evidence"
        ],
        "x": 904,
        "y": 196
      },
      {
        "path": "M1168 232 H1245",
        "kind": "serving",
        "label": [
          "4. Verified",
          "answer"
        ],
        "x": 1208,
        "y": 196
      },
      {
        "path": "M752 146 V116 H1360 V143",
        "kind": "serving",
        "label": [
          "5. Clarify / abstain"
        ],
        "x": 1060,
        "y": 106
      },
      {
        "path": "M448 430 V321",
        "kind": "serving",
        "label": [
          "6. Allowed",
          "passages"
        ],
        "x": 374,
        "y": 382
      },
      {
        "path": "M256 516 H333",
        "kind": "ingestion",
        "label": [
          "7. Update",
          "evidence"
        ],
        "x": 296,
        "y": 480
      },
      {
        "path": "M1360 318 V708 H16 V894 H29",
        "kind": "learning",
        "label": [
          "8. Audit answers"
        ],
        "x": 752,
        "y": 695
      },
      {
        "path": "M256 894 H333",
        "kind": "learning",
        "label": [
          "9. Train",
          "candidate"
        ],
        "x": 296,
        "y": 858
      },
      {
        "path": "M560 894 H637",
        "kind": "learning",
        "label": [
          "10. Test",
          "quality"
        ],
        "x": 600,
        "y": 858
      },
      {
        "path": "M864 894 H941",
        "kind": "learning",
        "label": [
          "11. Approve",
          "release"
        ],
        "x": 904,
        "y": 858
      },
      {
        "path": "M1056 808 V674 H752 V605",
        "kind": "learning",
        "label": [
          "12. Approved",
          "recipe"
        ],
        "x": 1188,
        "y": 730,
        "dashed": true
      },
      {
        "path": "M640 516 H616 V630 H10 V185 H29",
        "kind": "learning",
        "label": [
          "13. Activate retrieval recipe"
        ],
        "x": 300,
        "y": 619,
        "dashed": true
      },
      {
        "path": "M800 430 V374 H1056 V321",
        "kind": "learning",
        "label": [
          "14. Activate answer recipe"
        ],
        "x": 966,
        "y": 364,
        "dashed": true
      }
    ],
    "description": "Authenticate the requester and retrieve only permitted passages. Check scope, authority and evidence sufficiency before generation, verify cited claims, and clarify or abstain when needed. Document changes and permission revocations update the evidence library independently.",
    "caption": "Orange grounds answers. Green refreshes sources. Blue validates changes."
  },
  "tool-using-agent": {
    "nodes": [
      {
        "kind": "service",
        "x": 32,
        "y": 146,
        "title": [
          "Input + policy guard"
        ],
        "detail": "Scope authorized task"
      },
      {
        "kind": "service",
        "x": 336,
        "y": 146,
        "title": [
          "LLM planner"
        ],
        "detail": "Propose next step"
      },
      {
        "kind": "service",
        "x": 640,
        "y": 146,
        "title": [
          "Action validator"
        ],
        "detail": "Validate proposed actions"
      },
      {
        "kind": "service",
        "x": 944,
        "y": 146,
        "title": [
          "Tool executor"
        ],
        "detail": "Execute idempotent calls"
      },
      {
        "kind": "service",
        "x": 1248,
        "y": 146,
        "title": [
          "Final verifier"
        ],
        "detail": "Check actual state"
      },
      {
        "kind": "store",
        "x": 32,
        "y": 430,
        "title": [
          "Authorized tools"
        ],
        "detail": "List allowed tools"
      },
      {
        "kind": "store",
        "x": 336,
        "y": 430,
        "title": [
          "Task state"
        ],
        "detail": "Persist steps + results"
      },
      {
        "kind": "service",
        "x": 640,
        "y": 430,
        "title": [
          "Approval gate"
        ],
        "detail": "Confirm sensitive writes"
      },
      {
        "kind": "store",
        "x": 944,
        "y": 430,
        "title": [
          "Audit log"
        ],
        "detail": "Record execution evidence"
      },
      {
        "kind": "result",
        "x": 1248,
        "y": 430,
        "title": [
          "Verified result"
        ],
        "detail": "Report completed actions"
      },
      {
        "kind": "store",
        "x": 32,
        "y": 808,
        "title": [
          "Reviewed examples"
        ],
        "detail": "Keep expert trajectories"
      },
      {
        "kind": "service",
        "x": 336,
        "y": 808,
        "title": [
          "Candidate",
          "preparation"
        ],
        "detail": "Adapt tool calling"
      },
      {
        "kind": "service",
        "x": 640,
        "y": 808,
        "title": [
          "Evaluation gate"
        ],
        "detail": "Replay sandbox tasks"
      },
      {
        "kind": "store",
        "x": 944,
        "y": 808,
        "title": [
          "Release registry"
        ],
        "detail": "Track approved versions"
      }
    ],
    "edges": [
      {
        "path": "M256 232 H333",
        "kind": "serving",
        "label": [
          "1. Task",
          "context"
        ],
        "x": 296,
        "y": 196
      },
      {
        "path": "M560 232 H637",
        "kind": "serving",
        "label": [
          "2. Typed",
          "proposal"
        ],
        "x": 600,
        "y": 196
      },
      {
        "path": "M864 232 H941",
        "kind": "serving",
        "label": [
          "3. Allowed",
          "step"
        ],
        "x": 904,
        "y": 196
      },
      {
        "path": "M448 146 V116 H1360 V143",
        "kind": "serving",
        "label": [
          "4. Proposed completion"
        ],
        "x": 1070,
        "y": 106
      },
      {
        "path": "M1056 318 V350 H448 V321",
        "kind": "serving",
        "label": [
          "5. Observe tool results"
        ],
        "x": 940,
        "y": 340
      },
      {
        "path": "M1360 318 V427",
        "kind": "serving",
        "label": [
          "6. Verified",
          "outcome"
        ],
        "x": 1428,
        "y": 369
      },
      {
        "path": "M448 430 V321",
        "kind": "serving",
        "label": [
          "7. Saved",
          "state"
        ],
        "x": 528,
        "y": 382
      },
      {
        "path": "M256 516 H288 V374 H392 V321",
        "kind": "serving",
        "label": [
          "8. Scoped tools"
        ],
        "x": 290,
        "y": 364
      },
      {
        "path": "M704 318 V427",
        "kind": "serving",
        "label": [
          "9. Sensitive",
          "write"
        ],
        "x": 637,
        "y": 382
      },
      {
        "path": "M800 430 V321",
        "kind": "serving",
        "label": [
          "10. Approved",
          "arguments"
        ],
        "x": 878,
        "y": 382
      },
      {
        "path": "M1056 318 V427",
        "kind": "serving",
        "label": [
          "11. Log",
          "effects"
        ],
        "x": 1128,
        "y": 382
      },
      {
        "path": "M1472 516 V708 H16 V894 H29",
        "kind": "learning",
        "label": [
          "12. Review task outcomes"
        ],
        "x": 752,
        "y": 695
      },
      {
        "path": "M256 894 H333",
        "kind": "learning",
        "label": [
          "13. Train",
          "candidate"
        ],
        "x": 296,
        "y": 858
      },
      {
        "path": "M560 894 H637",
        "kind": "learning",
        "label": [
          "14. Test",
          "quality"
        ],
        "x": 600,
        "y": 858
      },
      {
        "path": "M864 894 H941",
        "kind": "learning",
        "label": [
          "15. Approve",
          "release"
        ],
        "x": 904,
        "y": 858
      },
      {
        "path": "M1056 808 V734 H288 V630 H10 V68 H448 V143",
        "kind": "learning",
        "label": [
          "16. Activate approved planner"
        ],
        "x": 470,
        "y": 723,
        "dashed": true
      }
    ],
    "description": "The LLM proposes steps. Deterministic validation and argument-bound approvals gate idempotent tool execution. Results update durable task state and return to the planner. A separate verifier checks actual completion. Sandbox evaluation gates planner changes.",
    "caption": "Orange executes validated steps. Blue evaluates planner changes."
  },
  "llm-inference": {
    "nodes": [
      {
        "kind": "service",
        "x": 32,
        "y": 146,
        "title": [
          "Request validator"
        ],
        "detail": "Check prompts + limits"
      },
      {
        "kind": "service",
        "x": 336,
        "y": 146,
        "title": [
          "Model router"
        ],
        "detail": "Admit compatible requests"
      },
      {
        "kind": "service",
        "x": 640,
        "y": 146,
        "title": [
          "GPU scheduler"
        ],
        "detail": "Batch active sequences"
      },
      {
        "kind": "service",
        "x": 944,
        "y": 146,
        "title": [
          "Sampling + checks"
        ],
        "detail": "Select safe tokens"
      },
      {
        "kind": "result",
        "x": 1248,
        "y": 146,
        "title": [
          "Token stream"
        ],
        "detail": "Stream until stopped"
      },
      {
        "kind": "store",
        "x": 32,
        "y": 430,
        "title": [
          "Warm GPU pool"
        ],
        "detail": "Load approved models"
      },
      {
        "kind": "service",
        "x": 336,
        "y": 430,
        "title": [
          "Prefill workers"
        ],
        "detail": "Process prompt tokens"
      },
      {
        "kind": "service",
        "x": 640,
        "y": 430,
        "title": [
          "Decode workers"
        ],
        "detail": "Generate next tokens"
      },
      {
        "kind": "store",
        "x": 944,
        "y": 430,
        "title": [
          "KV cache"
        ],
        "detail": "Reuse attention state"
      },
      {
        "kind": "store",
        "x": 1248,
        "y": 430,
        "title": [
          "Serving telemetry"
        ],
        "detail": "Track latency + pressure"
      },
      {
        "kind": "store",
        "x": 32,
        "y": 808,
        "title": [
          "Reviewed examples"
        ],
        "detail": "Store representative traces"
      },
      {
        "kind": "service",
        "x": 336,
        "y": 808,
        "title": [
          "Candidate",
          "preparation"
        ],
        "detail": "Benchmark GPU serving"
      },
      {
        "kind": "service",
        "x": 640,
        "y": 808,
        "title": [
          "Evaluation gate"
        ],
        "detail": "Check quality + latency"
      },
      {
        "kind": "store",
        "x": 944,
        "y": 808,
        "title": [
          "Release registry"
        ],
        "detail": "Track approved versions"
      }
    ],
    "edges": [
      {
        "path": "M256 232 H333",
        "kind": "serving",
        "label": [
          "1. Validated",
          "request"
        ],
        "x": 296,
        "y": 196
      },
      {
        "path": "M560 232 H637",
        "kind": "serving",
        "label": [
          "2. Admitted",
          "work"
        ],
        "x": 600,
        "y": 196
      },
      {
        "path": "M1168 232 H1245",
        "kind": "serving",
        "label": [
          "3. Checked",
          "tokens"
        ],
        "x": 1208,
        "y": 196
      },
      {
        "path": "M704 318 V374 H448 V427",
        "kind": "serving",
        "label": [
          "4. Prompt",
          "batches"
        ],
        "x": 538,
        "y": 364
      },
      {
        "path": "M560 516 H637",
        "kind": "serving",
        "label": [
          "5. Active",
          "sequences"
        ],
        "x": 600,
        "y": 480
      },
      {
        "path": "M800 430 V374 H1056 V321",
        "kind": "serving",
        "label": [
          "6. Next token"
        ],
        "x": 928,
        "y": 364
      },
      {
        "path": "M944 516 H867",
        "kind": "serving",
        "label": [
          "7. Read",
          "cache"
        ],
        "x": 904,
        "y": 480
      },
      {
        "path": "M448 602 V650 H1056 V605",
        "kind": "serving",
        "label": [
          "8. Write prompt cache"
        ],
        "x": 752,
        "y": 639
      },
      {
        "path": "M256 516 H288 V350 H392 V321",
        "kind": "serving",
        "label": [
          "9. Warm model"
        ],
        "x": 290,
        "y": 340
      },
      {
        "path": "M1360 318 V427",
        "kind": "serving",
        "label": [
          "10. Usage +",
          "latency"
        ],
        "x": 1428,
        "y": 369
      },
      {
        "path": "M1360 602 V674 H144 V605",
        "kind": "ingestion",
        "label": [
          "11. Autoscale GPU pool"
        ],
        "x": 752,
        "y": 663
      },
      {
        "path": "M1472 516 V708 H16 V894 H29",
        "kind": "learning",
        "label": [
          "12. Replay serving traces"
        ],
        "x": 752,
        "y": 695
      },
      {
        "path": "M256 894 H333",
        "kind": "learning",
        "label": [
          "13. Train",
          "candidate"
        ],
        "x": 296,
        "y": 858
      },
      {
        "path": "M560 894 H637",
        "kind": "learning",
        "label": [
          "14. Test",
          "quality"
        ],
        "x": 600,
        "y": 858
      },
      {
        "path": "M864 894 H941",
        "kind": "learning",
        "label": [
          "15. Approve",
          "release"
        ],
        "x": 904,
        "y": 858
      },
      {
        "path": "M1056 808 V734 H288 V630 H144 V605",
        "kind": "ingestion",
        "label": [
          "16. Load approved release"
        ],
        "x": 502,
        "y": 723,
        "dashed": true
      }
    ],
    "description": "Route admitted requests to continuous-batching workers. Prefill processes prompts and populates KV state, while decode repeatedly generates tokens using that cache. Stream checked tokens, handle cancellation, and scale warm workers from token demand and telemetry. Benchmark quality before releases.",
    "caption": "Orange serves tokens. Green manages capacity. Blue benchmarks releases."
  },
  "domain-adaptation": {
    "nodes": [
      {
        "kind": "service",
        "x": 32,
        "y": 146,
        "title": [
          "Intent + risk guard"
        ],
        "detail": "Scope request risk"
      },
      {
        "kind": "service",
        "x": 336,
        "y": 146,
        "title": [
          "Policy retrieval"
        ],
        "detail": "Fetch current evidence"
      },
      {
        "kind": "service",
        "x": 640,
        "y": 146,
        "title": [
          "Adapted LLM"
        ],
        "detail": "Generate task answers"
      },
      {
        "kind": "service",
        "x": 944,
        "y": 146,
        "title": [
          "Output validator"
        ],
        "detail": "Check grounded fields"
      },
      {
        "kind": "result",
        "x": 1248,
        "y": 146,
        "title": [
          "Reply / escalate"
        ],
        "detail": "Return checked response"
      },
      {
        "kind": "service",
        "x": 32,
        "y": 430,
        "title": [
          "Policy ingestion"
        ],
        "detail": "Index policy edits"
      },
      {
        "kind": "store",
        "x": 336,
        "y": 430,
        "title": [
          "Policy library"
        ],
        "detail": "Keep current rules"
      },
      {
        "kind": "service",
        "x": 640,
        "y": 430,
        "title": [
          "Larger fallback"
        ],
        "detail": "Handle difficult cases"
      },
      {
        "kind": "service",
        "x": 944,
        "y": 430,
        "title": [
          "Model activation"
        ],
        "detail": "Load approved student"
      },
      {
        "kind": "store",
        "x": 32,
        "y": 808,
        "title": [
          "Reviewed gold"
        ],
        "detail": "Keep expert examples"
      },
      {
        "kind": "service",
        "x": 336,
        "y": 808,
        "title": [
          "Teacher + audit"
        ],
        "detail": "Label selected cases"
      },
      {
        "kind": "service",
        "x": 640,
        "y": 808,
        "title": [
          "Student training"
        ],
        "detail": "Adapt stable behavior"
      },
      {
        "kind": "service",
        "x": 944,
        "y": 808,
        "title": [
          "Evaluation gate"
        ],
        "detail": "Check quality + cost"
      },
      {
        "kind": "store",
        "x": 1248,
        "y": 808,
        "title": [
          "Model registry"
        ],
        "detail": "Track approved versions"
      }
    ],
    "edges": [
      {
        "path": "M256 232 H333",
        "kind": "serving",
        "label": [
          "1. Scoped",
          "request"
        ],
        "x": 296,
        "y": 196
      },
      {
        "path": "M560 232 H637",
        "kind": "serving",
        "label": [
          "2. Policy",
          "context"
        ],
        "x": 600,
        "y": 196
      },
      {
        "path": "M864 232 H941",
        "kind": "serving",
        "label": [
          "3. Candidate",
          "answer"
        ],
        "x": 904,
        "y": 196
      },
      {
        "path": "M1168 232 H1245",
        "kind": "serving",
        "label": [
          "4. Validated",
          "reply"
        ],
        "x": 1208,
        "y": 196
      },
      {
        "path": "M144 146 V116 H1360 V143",
        "kind": "serving",
        "label": [
          "5. High-risk escalation"
        ],
        "x": 752,
        "y": 106
      },
      {
        "path": "M448 430 V321",
        "kind": "serving",
        "label": [
          "6. Current",
          "policy"
        ],
        "x": 528,
        "y": 382
      },
      {
        "path": "M704 318 V427",
        "kind": "serving",
        "label": [
          "7. Difficult",
          "case"
        ],
        "x": 637,
        "y": 382
      },
      {
        "path": "M800 430 V374 H1000 V321",
        "kind": "serving",
        "label": [
          "8. Fallback answer"
        ],
        "x": 922,
        "y": 364
      },
      {
        "path": "M256 516 H333",
        "kind": "ingestion",
        "label": [
          "9. Policy",
          "updates"
        ],
        "x": 296,
        "y": 480
      },
      {
        "path": "M1360 318 V708 H16 V894 H29",
        "kind": "learning",
        "label": [
          "10. Review severe errors"
        ],
        "x": 752,
        "y": 695
      },
      {
        "path": "M256 894 H333",
        "kind": "learning",
        "label": [
          "11. Audit",
          "labels"
        ],
        "x": 296,
        "y": 858
      },
      {
        "path": "M560 894 H637",
        "kind": "learning",
        "label": [
          "12. Train",
          "student"
        ],
        "x": 600,
        "y": 858
      },
      {
        "path": "M864 894 H941",
        "kind": "learning",
        "label": [
          "13. Test",
          "candidate"
        ],
        "x": 904,
        "y": 858
      },
      {
        "path": "M1168 894 H1245",
        "kind": "learning",
        "label": [
          "14. Approve",
          "release"
        ],
        "x": 1208,
        "y": 858
      },
      {
        "path": "M1360 808 V674 H1056 V605",
        "kind": "learning",
        "label": [
          "15. Approved",
          "model"
        ],
        "x": 1416,
        "y": 730,
        "dashed": true
      },
      {
        "path": "M1056 430 V350 H824 V321",
        "kind": "learning",
        "label": [
          "16. Activate student"
        ],
        "x": 944,
        "y": 340,
        "dashed": true
      }
    ],
    "description": "Retrieve changing policies while adapting stable response behavior. Generate with the student, use a larger model for difficult cases, and validate schema and grounding before replying or escalating. Optional teacher labels are audited, and student releases pass independent quality and cost checks.",
    "caption": "Orange answers requests. Green refreshes policies. Blue validates adaptation."
  },
  "text-to-sql": {
    "nodes": [
      {
        "kind": "service",
        "x": 32,
        "y": 146,
        "title": [
          "Identity +",
          "intent guard"
        ],
        "detail": "Resolve scope + metrics"
      },
      {
        "kind": "service",
        "x": 336,
        "y": 146,
        "title": [
          "Schema retrieval"
        ],
        "detail": "Find permitted tables"
      },
      {
        "kind": "service",
        "x": 640,
        "y": 146,
        "title": [
          "SQL generator"
        ],
        "detail": "Propose grounded queries"
      },
      {
        "kind": "service",
        "x": 944,
        "y": 146,
        "title": [
          "Query validator"
        ],
        "detail": "Check AST + cost"
      },
      {
        "kind": "result",
        "x": 1248,
        "y": 146,
        "title": [
          "Answer / clarify"
        ],
        "detail": "Return verified results"
      },
      {
        "kind": "service",
        "x": 32,
        "y": 430,
        "title": [
          "Catalog ingestion"
        ],
        "detail": "Track schema changes"
      },
      {
        "kind": "store",
        "x": 336,
        "y": 430,
        "title": [
          "Schema + metrics"
        ],
        "detail": "Resolve valid joins"
      },
      {
        "kind": "service",
        "x": 640,
        "y": 430,
        "title": [
          "Recipe activation"
        ],
        "detail": "Publish tested recipe"
      },
      {
        "kind": "service",
        "x": 944,
        "y": 430,
        "title": [
          "Read-only executor"
        ],
        "detail": "Enforce read-only access"
      },
      {
        "kind": "service",
        "x": 1248,
        "y": 430,
        "title": [
          "Result verifier"
        ],
        "detail": "Check answer faithfulness"
      },
      {
        "kind": "store",
        "x": 32,
        "y": 808,
        "title": [
          "Reviewed examples"
        ],
        "detail": "Keep approved queries"
      },
      {
        "kind": "service",
        "x": 336,
        "y": 808,
        "title": [
          "Candidate",
          "preparation"
        ],
        "detail": "Adapt SQL generation"
      },
      {
        "kind": "service",
        "x": 640,
        "y": 808,
        "title": [
          "Evaluation gate"
        ],
        "detail": "Compare fixture results"
      },
      {
        "kind": "store",
        "x": 944,
        "y": 808,
        "title": [
          "Release registry"
        ],
        "detail": "Track approved versions"
      }
    ],
    "edges": [
      {
        "path": "M256 232 H333",
        "kind": "serving",
        "label": [
          "1. Scoped",
          "question"
        ],
        "x": 296,
        "y": 196
      },
      {
        "path": "M560 232 H637",
        "kind": "serving",
        "label": [
          "2. Relevant",
          "schema"
        ],
        "x": 600,
        "y": 196
      },
      {
        "path": "M864 232 H941",
        "kind": "serving",
        "label": [
          "3. Proposed",
          "SQL"
        ],
        "x": 904,
        "y": 196
      },
      {
        "path": "M144 146 V116 H1360 V143",
        "kind": "serving",
        "label": [
          "4. Clarify ambiguous metric"
        ],
        "x": 752,
        "y": 106
      },
      {
        "path": "M448 430 V321",
        "kind": "serving",
        "label": [
          "5. Allowed",
          "schema"
        ],
        "x": 374,
        "y": 382
      },
      {
        "path": "M1056 318 V427",
        "kind": "serving",
        "label": [
          "6. Validated",
          "query"
        ],
        "x": 1130,
        "y": 382
      },
      {
        "path": "M1168 516 H1245",
        "kind": "serving",
        "label": [
          "7. Query",
          "results"
        ],
        "x": 1208,
        "y": 480
      },
      {
        "path": "M1360 430 V321",
        "kind": "serving",
        "label": [
          "8. Verified",
          "answer"
        ],
        "x": 1428,
        "y": 382
      },
      {
        "path": "M944 516 H912 V374 H752 V321",
        "kind": "serving",
        "label": [
          "9. Bounded safe repair"
        ],
        "x": 830,
        "y": 364
      },
      {
        "path": "M256 516 H333",
        "kind": "ingestion",
        "label": [
          "10. Metadata",
          "updates"
        ],
        "x": 296,
        "y": 480
      },
      {
        "path": "M1472 516 V708 H16 V894 H29",
        "kind": "learning",
        "label": [
          "11. Review query outcomes"
        ],
        "x": 752,
        "y": 695
      },
      {
        "path": "M256 894 H333",
        "kind": "learning",
        "label": [
          "12. Train",
          "candidate"
        ],
        "x": 296,
        "y": 858
      },
      {
        "path": "M560 894 H637",
        "kind": "learning",
        "label": [
          "13. Test",
          "quality"
        ],
        "x": 600,
        "y": 858
      },
      {
        "path": "M864 894 H941",
        "kind": "learning",
        "label": [
          "14. Approve",
          "release"
        ],
        "x": 904,
        "y": 858
      },
      {
        "path": "M1056 808 V674 H752 V605",
        "kind": "learning",
        "label": [
          "15. Approved",
          "recipe"
        ],
        "x": 1188,
        "y": 730,
        "dashed": true
      },
      {
        "path": "M752 430 V321",
        "kind": "learning",
        "label": [
          "16. Activate",
          "generator"
        ],
        "x": 679,
        "y": 382,
        "dashed": true
      }
    ],
    "description": "Retrieve an authorized schema slice and metric definitions before generating SQL. Validate syntax, types, permissions and cost, then execute using database-native read-only authorization. Verify result interpretation, clarify ambiguity and permit only bounded safe repairs. Catalog changes update independently.",
    "caption": "Orange validates queries. Green refreshes metadata. Blue checks execution accuracy."
  },
  "long-document-synthesis": {
    "nodes": [
      {
        "kind": "service",
        "x": 32,
        "y": 146,
        "title": [
          "Document parser"
        ],
        "detail": "Preserve source structure"
      },
      {
        "kind": "service",
        "x": 336,
        "y": 146,
        "title": [
          "Semantic chunker"
        ],
        "detail": "Split with provenance"
      },
      {
        "kind": "service",
        "x": 640,
        "y": 146,
        "title": [
          "Reconciliation"
        ],
        "detail": "Reconcile source claims"
      },
      {
        "kind": "service",
        "x": 944,
        "y": 146,
        "title": [
          "Global synthesis"
        ],
        "detail": "Write global summary"
      },
      {
        "kind": "service",
        "x": 1248,
        "y": 146,
        "title": [
          "Claim verifier"
        ],
        "detail": "Check facts + citations"
      },
      {
        "kind": "store",
        "x": 32,
        "y": 430,
        "title": [
          "Original sources"
        ],
        "detail": "Keep exact evidence"
      },
      {
        "kind": "service",
        "x": 336,
        "y": 430,
        "title": [
          "Local summarizer"
        ],
        "detail": "Condense each chunk"
      },
      {
        "kind": "service",
        "x": 640,
        "y": 430,
        "title": [
          "Fact extractor"
        ],
        "detail": "Extract cited facts"
      },
      {
        "kind": "store",
        "x": 944,
        "y": 430,
        "title": [
          "Evidence ledger"
        ],
        "detail": "Preserve both tracks"
      },
      {
        "kind": "result",
        "x": 1248,
        "y": 430,
        "title": [
          "Summary + facts"
        ],
        "detail": "Return cited output"
      },
      {
        "kind": "store",
        "x": 32,
        "y": 808,
        "title": [
          "Reviewed examples"
        ],
        "detail": "Keep reviewed documents"
      },
      {
        "kind": "service",
        "x": 336,
        "y": 808,
        "title": [
          "Candidate",
          "preparation"
        ],
        "detail": "Tune task models"
      },
      {
        "kind": "service",
        "x": 640,
        "y": 808,
        "title": [
          "Evaluation gate"
        ],
        "detail": "Check facts + coverage"
      },
      {
        "kind": "store",
        "x": 944,
        "y": 808,
        "title": [
          "Release registry"
        ],
        "detail": "Track approved versions"
      }
    ],
    "edges": [
      {
        "path": "M256 232 H333",
        "kind": "serving",
        "label": [
          "1. Parsed",
          "sections"
        ],
        "x": 296,
        "y": 196
      },
      {
        "path": "M864 232 H941",
        "kind": "serving",
        "label": [
          "2. Resolved",
          "facts"
        ],
        "x": 904,
        "y": 196
      },
      {
        "path": "M1168 232 H1245",
        "kind": "serving",
        "label": [
          "3. Draft",
          "summary"
        ],
        "x": 1208,
        "y": 196
      },
      {
        "path": "M144 318 V427",
        "kind": "serving",
        "label": [
          "4. Original",
          "sources"
        ],
        "x": 218,
        "y": 382
      },
      {
        "path": "M392 318 V427",
        "kind": "serving",
        "label": [
          "5. Summary",
          "track"
        ],
        "x": 315,
        "y": 382
      },
      {
        "path": "M504 318 V374 H752 V427",
        "kind": "serving",
        "label": [
          "6. Fact track"
        ],
        "x": 630,
        "y": 364
      },
      {
        "path": "M448 602 V650 H1056 V605",
        "kind": "serving",
        "label": [
          "7. Local summaries + evidence"
        ],
        "x": 696,
        "y": 639
      },
      {
        "path": "M864 516 H941",
        "kind": "serving",
        "label": [
          "8. Cited",
          "facts"
        ],
        "x": 904,
        "y": 480
      },
      {
        "path": "M1056 430 V374 H752 V321",
        "kind": "serving",
        "label": [
          "9. Merge both tracks"
        ],
        "x": 930,
        "y": 364
      },
      {
        "path": "M256 516 H288 V674 H1488 V232 H1475",
        "kind": "serving",
        "label": [
          "10. Verify against original evidence"
        ],
        "x": 900,
        "y": 663
      },
      {
        "path": "M1360 318 V427",
        "kind": "serving",
        "label": [
          "11. Verified",
          "output"
        ],
        "x": 1428,
        "y": 382
      },
      {
        "path": "M1472 516 V708 H16 V894 H29",
        "kind": "learning",
        "label": [
          "12. Review long-case outputs"
        ],
        "x": 752,
        "y": 695
      },
      {
        "path": "M256 894 H333",
        "kind": "learning",
        "label": [
          "13. Train",
          "candidate"
        ],
        "x": 296,
        "y": 858
      },
      {
        "path": "M560 894 H637",
        "kind": "learning",
        "label": [
          "14. Test",
          "quality"
        ],
        "x": 600,
        "y": 858
      },
      {
        "path": "M864 894 H941",
        "kind": "learning",
        "label": [
          "15. Approve",
          "release"
        ],
        "x": 904,
        "y": 858
      },
      {
        "path": "M1056 808 V734 H288 V690 H10 V68 H144 V143",
        "kind": "learning",
        "label": [
          "16. Activate approved pipeline"
        ],
        "x": 470,
        "y": 723,
        "dashed": true
      }
    ],
    "description": "Parse and chunk documents with source pointers. Run local summarization and cited fact extraction in parallel, preserve both in an evidence ledger, reconcile contradictions and chronology, synthesize a global summary, and verify claims against originals. Checkpoint large jobs and evaluate coverage separately from factuality.",
    "caption": "Orange preserves both tracks. Blue validates synthesis changes."
  },
  "evaluation-platform": {
    "nodes": [
      {
        "kind": "store",
        "x": 32,
        "y": 146,
        "title": [
          "Version manifests"
        ],
        "detail": "Pin data + configurations"
      },
      {
        "kind": "service",
        "x": 336,
        "y": 146,
        "title": [
          "Experiment",
          "scheduler"
        ],
        "detail": "Schedule paired runs"
      },
      {
        "kind": "service",
        "x": 640,
        "y": 146,
        "title": [
          "Invocation workers"
        ],
        "detail": "Run model variants"
      },
      {
        "kind": "store",
        "x": 944,
        "y": 146,
        "title": [
          "Trace store"
        ],
        "detail": "Store run evidence"
      },
      {
        "kind": "result",
        "x": 1248,
        "y": 146,
        "title": [
          "Reports + gates"
        ],
        "detail": "Report regressions"
      },
      {
        "kind": "service",
        "x": 32,
        "y": 430,
        "title": [
          "Deterministic checks"
        ],
        "detail": "Validate exact invariants"
      },
      {
        "kind": "service",
        "x": 336,
        "y": 430,
        "title": [
          "Task metrics"
        ],
        "detail": "Measure task correctness"
      },
      {
        "kind": "service",
        "x": 640,
        "y": 430,
        "title": [
          "Calibrated judge"
        ],
        "detail": "Grade semantic quality"
      },
      {
        "kind": "service",
        "x": 944,
        "y": 430,
        "title": [
          "Expert review"
        ],
        "detail": "Adjudicate uncertain cases"
      },
      {
        "kind": "service",
        "x": 1248,
        "y": 430,
        "title": [
          "Score aggregation"
        ],
        "detail": "Compare paired results"
      },
      {
        "kind": "store",
        "x": 32,
        "y": 808,
        "title": [
          "Human gold"
        ],
        "detail": "Keep trusted labels"
      },
      {
        "kind": "service",
        "x": 336,
        "y": 808,
        "title": [
          "Judge calibration"
        ],
        "detail": "Align with experts"
      },
      {
        "kind": "service",
        "x": 640,
        "y": 808,
        "title": [
          "Regression gate"
        ],
        "detail": "Test known failures"
      },
      {
        "kind": "store",
        "x": 944,
        "y": 808,
        "title": [
          "Judge registry"
        ],
        "detail": "Version scoring recipes"
      },
      {
        "kind": "service",
        "x": 1248,
        "y": 808,
        "title": [
          "Rollout controller"
        ],
        "detail": "Gate live experiments"
      }
    ],
    "edges": [
      {
        "path": "M256 232 H333",
        "kind": "serving",
        "label": [
          "1. Pinned",
          "experiment"
        ],
        "x": 296,
        "y": 196
      },
      {
        "path": "M560 232 H637",
        "kind": "serving",
        "label": [
          "2. Paired",
          "jobs"
        ],
        "x": 600,
        "y": 196
      },
      {
        "path": "M864 232 H941",
        "kind": "serving",
        "label": [
          "3. Full",
          "traces"
        ],
        "x": 904,
        "y": 196
      },
      {
        "path": "M1056 318 V350 H144 V427",
        "kind": "serving",
        "label": [
          "4. Exact checks"
        ],
        "x": 300,
        "y": 340
      },
      {
        "path": "M1056 318 V374 H448 V427",
        "kind": "serving",
        "label": [
          "5. Task scores"
        ],
        "x": 604,
        "y": 364
      },
      {
        "path": "M1000 318 V398 H752 V427",
        "kind": "serving",
        "label": [
          "6. Semantic grades"
        ],
        "x": 850,
        "y": 388
      },
      {
        "path": "M1112 318 V427",
        "kind": "serving",
        "label": [
          "7. Expert",
          "labels"
        ],
        "x": 1188,
        "y": 382
      },
      {
        "path": "M144 602 V650 H1360 V605",
        "kind": "serving",
        "label": [
          "8. Combine calibrated grades"
        ],
        "x": 280,
        "y": 639
      },
      {
        "path": "M448 602 V650",
        "kind": "serving",
        "label": [
          "9. Task",
          "metrics"
        ],
        "x": 510,
        "y": 620
      },
      {
        "path": "M752 602 V650",
        "kind": "serving",
        "label": [
          "10. Judge",
          "scores"
        ],
        "x": 814,
        "y": 620
      },
      {
        "path": "M1056 602 V650",
        "kind": "serving",
        "label": [
          "11. Gold",
          "labels"
        ],
        "x": 1118,
        "y": 620
      },
      {
        "path": "M1360 430 V321",
        "kind": "serving",
        "label": [
          "12. Paired",
          "comparison"
        ],
        "x": 1428,
        "y": 382
      },
      {
        "path": "M1472 516 V708 H16 V894 H29",
        "kind": "learning",
        "label": [
          "13. Curate reviewed failures"
        ],
        "x": 752,
        "y": 695
      },
      {
        "path": "M256 894 H333",
        "kind": "learning",
        "label": [
          "14. Calibrate",
          "judge"
        ],
        "x": 296,
        "y": 858
      },
      {
        "path": "M560 894 H637",
        "kind": "learning",
        "label": [
          "15. Check",
          "sensitivity"
        ],
        "x": 600,
        "y": 858
      },
      {
        "path": "M864 894 H941",
        "kind": "learning",
        "label": [
          "16. Approve",
          "rubric"
        ],
        "x": 904,
        "y": 858
      },
      {
        "path": "M1056 808 V734 H616 V630 H704 V605",
        "kind": "learning",
        "label": [
          "17. Activate calibrated judge"
        ],
        "x": 500,
        "y": 723,
        "dashed": true
      },
      {
        "path": "M1472 232 H1488 V734 H1360 V805",
        "kind": "learning",
        "label": [
          "18. Shadow / canary / A-B gates"
        ],
        "x": 1250,
        "y": 723,
        "dashed": true
      }
    ],
    "description": "Version manifests pin every experiment. Workers record traces, then deterministic checks, task metrics, calibrated judges and human reviewers grade them in parallel. Aggregate paired slice results and severe regressions for reports and release gates. Calibrate scoring against human gold and validate known failures before rollout.",
    "caption": "Orange evaluates experiments. Blue calibrates graders and rollout gates.",
    "primaryLabel": "EXPERIMENT EVALUATION",
    "learningLabel": "CALIBRATION AND ROLLOUT"
  }
};
