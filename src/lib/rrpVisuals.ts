import { amlVisuals, type AmlVisualId } from "./amlVisuals";
export interface RrpVisualSpec { title: string; caption: string; alt: string; sharedAml?: AmlVisualId }
export const rrpVisuals = {
  "prediction-metrics": {
    title: "A small false-positive rate can still mean modest precision",
    caption: "One threshold, two coordinate systems. With 1% click prevalence, 80 true positives and 99 false positives give 80% recall, 1% FPR, and 44.7% precision. AUC needs the full threshold sweep.",
    alt: "Two plots show the same threshold: an ROC point at false-positive rate 0.01 and recall 0.8, and a precision–recall point at recall 0.8 and precision about 0.447. Counts are 80 true positives, 99 false positives, 20 false negatives, and 9801 true negatives.",
  },
  "ranking-funnel": {
    title: "Spend more work on fewer candidates",
    caption: "Illustrative counts. Ranking scores the retrieved 800 items; re-ranking selects from the 50-item shortlist. Each narrowing step can lose useful options.",
    alt: "Four narrowing layers show a catalogue of ten million, eight hundred retrieved candidates, fifty shortlisted items, and six displayed items, with the three selection stages labelled.",
  },
  "interaction-matrix": {
    title: "Unknown, exposed non-click, and click are different cells",
    caption: "Within one observation period: 1 = recorded click; 0 = recorded exposure without clicking; ? = no exposure evidence. The summary omits individual timings and repeated displays.",
    alt: "A three-user by four-item grid distinguishes recorded clicks, exposed non-clicks, and unknown exposure using one, zero, and question-mark labels.",
  },
  "ranking-discount": {
    title: "Same precision, different placement quality",
    caption: "Binary relevance with linear gain and k = 4. Both lists have precision 0.5; early positives give NDCG 1, late positives about 0.571.",
    alt: "Two four-item lists contain the same two relevant items in early versus late positions, showing equal precision but unequal discounted gain.",
  },
  "collaborative-neighbors": {
    title: "Shared behavior supplies recommendation paths",
    caption: "Solid edges record consumption. The dashed Cara–B edge is a proposed recommendation. Shared behavior supplies evidence, not proof of preference.",
    alt: "A bipartite user–item graph connects Ann, Ben, and Cara to consumed items, with a dashed suggested connection from Cara to B and shared-user support counts.",
  },
  "matrix-factorization": {
    title: "A missing score comes from two learned vector rows",
    caption: "Toy, unfitted factors. P and Q store user/item vectors; the full score matrix is PQᵀ. Ann–B scores −1 with zero offsets: compatibility, not probability.",
    alt: "A sparse user–item observation grid sits beside user and item factor tables; highlighted rows calculate Ann's unknown B score as negative one.",
  },
  "embedding-geometry": {
    title: "Length changes dot-product ranking; cosine removes it",
    caption: "Query (1,0): dot product favors longer B, while cosine favors aligned A. The comparison rule changes which item wins.",
    alt: "Two item vectors point along or at an angle to the query direction, accompanied by a table showing reversed rankings under dot product and cosine.",
  },
  "two-tower": {
    title: "Precompute item vectors; encode the request once",
    caption: "Separate encoders allow item vectors to be stored in advance. They meet the request vector only at scoring; arbitrary joint candidate lookups need another path.",
    alt: "Separate request and item feature streams pass through two encoders into vectors, with item vectors stored in an index and a shared dot-product score.",
  },
  "ann-partitions": {
    title: "Searching one partition can miss a closer neighbor",
    caption: "Chosen toy centers define the buckets. Searching only the lower-left bucket finds A at distance 0.500 but misses closer B at 0.224 across the boundary.",
    alt: "Four vector partitions highlight the selected lower-left bucket, a nearby query, its searched neighbor A, and an even closer omitted neighbor B across the boundary.",
  },
  "source-union": {
    title: "Merge item IDs and retain every source tag",
    caption: "Seven returned entries become five unique IDs. B and C retain two origin tags each. Source scores are not assumed comparable.",
    alt: "Three candidate lists merge into five deduplicated items, with B and C retaining two origin tags each.",
  },
  "ranking-objectives": {
    title: "Individual labels, pair comparisons, or a whole request",
    caption: "A and C have positive reference labels. Scores incorrectly place B above C. The three objective families inspect individual targets, preferred gaps, or the request together.",
    alt: "Three rows contrast pointwise item labels, pairwise A-over-B and C-over-B comparisons, and listwise evaluation of all three candidates together.",
  },
  "sequence-history": {
    title: "The decision can use its past, never its later outcome",
    caption: "A/B/C are available before 14:00. D at 14:02 can later become a target, but cannot enter the earlier decision’s input.",
    alt: "A timeline sends three available past actions into a history representation, while a future action is separated by the decision cutoff and excluded from the inputs.",
  },
  "multi-task-heads": {
    title: "Shared features, different outputs and units",
    caption: "Toy outputs. If watch is zero without a click, 0.20 × 60 seconds gives 12 expected seconds per impression. The hide head predicts a separate event.",
    alt: "A shared representation feeds click, conditional watch-time, and hide heads; click probability and conditional watch combine into twelve expected seconds per impression.",
  },
  calibration: { ...amlVisuals.calibration, sharedAml: "calibration" },
  "re-ranking": {
    title: "Choose the next item relative to what is already selected",
    caption: "A is already selected. Redundancy-adjusted utility is 0.615 for B and 0.740 for C, so the next choice changes to C.",
    alt: "Candidate B is more individually relevant but highly similar to selected A; the redundancy-adjusted utility chooses less similar candidate C.",
  },
  "temporal-evaluation": {
    title: "Rebuild each historical fit using only available evidence",
    caption: "Each fit uses earlier evidence and assesses a later period. Keep a separate final period outside development; add label-maturity gaps when needed.",
    alt: "Three forward-time evaluations use growing training prefixes and later held-out periods, followed by an independent final period.",
  },
  "position-examination": {
    title: "Same attractiveness, different examination opportunity",
    caption: "Toy examination assumptions give different CTRs for the same conditional attractiveness. These components cannot be identified from raw rank CTR alone.",
    alt: "Two position paths multiply different examination probabilities by the same conditional attractiveness, producing different click rates.",
  },
  "ips-support": {
    title: "Reweight observed rewards; missing support stays missing",
    caption: "The displayed probabilities produce IPS 0.625 versus raw reward 0.400 in this finite sample. Zero logging support for C prevents the corresponding target-policy claim.",
    alt: "A two-action table shows logging and target probabilities, counts, rewards, and importance weights, with an unsupported third action explicitly excluded from a valid IPS claim.",
  },
  "feedback-cycle": {
    title: "What is shown changes what can be learned",
    caption: "The return path makes selection affect future evidence. Dashed exploration changes observation opportunities. The loop alone does not establish harmful amplification.",
    alt: "A cycle links model selection, exposure, observed outcomes, and training, with a separate exploration path into exposure.",
  },
  "serving-path": {
    title: "Parallel sources share a deadline; later work follows the merge",
    caption: "Illustrative 50 ms allocation; finalization includes selection and slack. Retrieval sources overlap in time. Measure the actual end-to-end latency distribution.",
    alt: "Parallel retrieval sources join before feature fetching and ranking; a time-allocation bar below totals fifty milliseconds.",
  },
  "feature-availability": {
    title: "An earlier event can still arrive too late",
    caption: "The 13:59 event arrives at 14:02, after the 14:00 prediction. Historical features must respect this availability boundary.",
    alt: "An event-to-arrival timeline places a fourteen-hundred prediction between a thirteen-fifty-nine click and its fourteen-oh-two arrival, marking that click unavailable for the earlier prediction.",
  },
  "exploration-uncertainty": {
    title: "A lower observed rate can have much greater uncertainty",
    caption: "Approximate 95% Wilson intervals: A 4.81–5.19%, B 1.03–8.45%. They show sampling uncertainty, not correction for unequal audiences or positions.",
    alt: "Click-rate estimates and Wilson intervals show a narrow five-percent estimate for A and a broad three-percent estimate for B, extending above A's rate.",
  },
} as const satisfies Record<string, RrpVisualSpec>;
export type RrpVisualId = keyof typeof rrpVisuals;
export const rrpVisualIds = Object.keys(rrpVisuals) as RrpVisualId[];
export function isRrpVisualId(id: string): id is RrpVisualId { return Object.hasOwn(rrpVisuals, id); }
