import { amlVisuals, type AmlVisualId } from "./amlVisuals";
export interface RrpVisualSpec { title: string; caption: string; alt: string; sharedAml?: AmlVisualId }
export const rrpVisuals = {
  "ranking-funnel": {
    title: "Spend more work on fewer candidates",
    caption: "Illustrative funnel: ten million catalogue entries → 800 retrieved candidates → a 50-item ranked shortlist → six displayed items. Ranking scores the 800 candidates; re-ranking selects from the shortlist. Each stage has its own cost and loss of coverage.",
    alt: "Four narrowing layers show a catalogue of ten million, eight hundred retrieved candidates, fifty shortlisted items, and six displayed items, with the three selection stages labelled.",
  },
  "interaction-matrix": {
    title: "Unknown, exposed non-click, and click are different cells",
    caption: "Toy summary within a fixed observation period. A 1 means at least one recorded click; 0 means recorded exposure without a click; ? means no recorded exposure evidence. This summary loses individual impression timing and repeats, which remain in the event log.",
    alt: "A three-user by four-item grid distinguishes recorded clicks, exposed non-clicks, and unknown exposure using one, zero, and question-mark labels.",
  },
  "ranking-discount": {
    title: "Same precision, different placement quality",
    caption: "Binary relevance, k = 4, linear gain, and the same two relevant items. Both lists have precision@4 = 0.5. The ideal DCG is 1 + 1/log₂3 ≈ 1.631. Putting both positives first gives NDCG 1; putting them last gives about 0.571.",
    alt: "Two four-item lists contain the same two relevant items in early versus late positions, showing equal precision but unequal discounted gain.",
  },
  "collaborative-neighbors": {
    title: "Shared behavior supplies recommendation paths",
    caption: "Solid edges are observed consumption: Ann used A/B, Ben A/B/C, and Cara A. B has support from two users sharing A with Cara; C has one. The dashed Cara–B edge is a proposed recommendation, not an observed outcome or proof of preference.",
    alt: "A bipartite user–item graph connects Ann, Ben, and Cara to consumed items, with a dashed suggested connection from Cara to B and shared-user support counts.",
  },
  "matrix-factorization": {
    title: "A missing score comes from two learned vector rows",
    caption: "Illustrative vectors, not a fitted reconstruction of these exact observations. Select Ann's [1, 2] and B's [1, −1]: dot product = −1, with offsets set to zero. It is an unbounded compatibility score, not a negative probability. P has shape 3 × 2; Q has shape 3 × 2; the full score matrix is PQᵀ.",
    alt: "A sparse user–item observation grid sits beside user and item factor tables; highlighted rows calculate Ann's unknown B score as negative one.",
  },
  "embedding-geometry": {
    title: "Length changes dot-product ranking; cosine removes it",
    caption: "Query u = (1, 0), A = (1, 0), B = (2, 2). Dot product favors B: 2 versus 1. Cosine favors A: 1 versus about 0.707. These vectors show why changing the comparison rule can change the chosen item.",
    alt: "Two item vectors point along or at an angle to the query direction, accompanied by a table showing reversed rankings under dot product and cosine.",
  },
  "two-tower": {
    title: "Precompute item vectors; encode the request once",
    caption: "The request tower reads user, query, history, or context; the item tower reads supported item inputs independently. Their vectors meet only in the cheap score. Item vectors can be indexed ahead of time, while arbitrary joint candidate features require a different scoring path.",
    alt: "Separate request and item feature streams pass through two encoders into vectors, with item vectors stored in an index and a shared dot-product score.",
  },
  "ann-partitions": {
    title: "Searching one partition can miss a closer neighbor",
    caption: "Toy nearest-center partitions with chosen centers (1,1), (5,1), (1,5), (5,5). Query (2.9,2.9) selects the lower-left bucket. Its nearest candidate A = (2.6,2.5) is distance 0.5, while B = (3.1,2.8) in the adjacent bucket is closer at about 0.224. Searching more buckets can recover B.",
    alt: "Four vector partitions highlight the selected lower-left bucket, a nearby query, its searched neighbor A, and an even closer omitted neighbor B across the boundary.",
  },
  "source-union": {
    title: "Merge item IDs and retain every source tag",
    caption: "Vector returns A/B/C, history B/D, and fresh C/E: seven returned entries become five unique IDs. B retains vector and history tags; C retains vector and fresh tags. Scores from different sources are not assumed comparable.",
    alt: "Three candidate lists merge into five deduplicated items, with B and C retaining two origin tags each.",
  },
  "ranking-objectives": {
    title: "Individual labels, pair comparisons, or a whole request",
    caption: "Toy reference labels: A and C relevant, B not relevant. Scores put B above C. Pointwise loss checks each score against its target; pairwise loss checks desired gaps; a listwise surrogate treats the request's score vector together. None removes bias in the reference labels automatically.",
    alt: "Three rows contrast pointwise item labels, pairwise A-over-B and C-over-B comparisons, and listwise evaluation of all three candidates together.",
  },
  "sequence-history": {
    title: "The decision can use its past, never its later outcome",
    caption: "At the 14:00 decision, A/B/C are already available history. The 14:02 action D may later supply a training target, but cannot enter that decision's input. Order and time can be retained by the encoder; masking requirements depend on the training setup.",
    alt: "A timeline sends three available past actions into a history representation, while a future action is separated by the decision cutoff and excluded from the inputs.",
  },
  "multi-task-heads": {
    title: "Shared features, different outputs and units",
    caption: "Illustrative outputs: click probability 0.20, expected watch given a click 60 seconds, and hide probability 0.01. If watch is zero without clicking, expected watch per impression is 0.20 × 60 = 12 seconds. Conditional watch labels need their own availability treatment; serving weights differ from training loss weights.",
    alt: "A shared representation feeds click, conditional watch-time, and hide heads; click probability and conditional watch combine into twelve expected seconds per impression.",
  },
  calibration: { ...amlVisuals.calibration, sharedAml: "calibration" },
  "re-ranking": {
    title: "Choose the next item relative to what is already selected",
    caption: "A is selected. With utility relevance − 0.3 × similarity-to-A, B scores 0.9 − 0.3 × 0.95 = 0.615 and C scores 0.8 − 0.3 × 0.2 = 0.740. C becomes the next choice despite its lower standalone relevance. This is a toy soft preference inside an eligible set.",
    alt: "Candidate B is more individually relevant but highly similar to selected A; the redundancy-adjusted utility chooses less similar candidate C.",
  },
  "temporal-evaluation": {
    title: "Rebuild each historical fit using only available evidence",
    caption: "Schematic forward evaluations: train on earlier periods and score the next held-out period. A reserved final period stays outside development choices. Label-maturation gaps or removal of overlapping windows must be added when the task requires them.",
    alt: "Three forward-time evaluations use growing training prefixes and later held-out periods, followed by an independent final period.",
  },
  "position-examination": {
    title: "Same attractiveness, different examination opportunity",
    caption: "Under the stated toy examination model, conditional click attractiveness is 0.10 at either rank. Examination 0.80 at rank 1 gives CTR 0.08; examination 0.40 at rank 5 gives CTR 0.04. The components are assumed here, not identified from raw rank CTR alone.",
    alt: "Two position paths multiply different examination probabilities by the same conditional attractiveness, producing different click rates.",
  },
  "ips-support": {
    title: "Reweight observed rewards; missing support stays missing",
    caption: "Ten logged decisions: A selected eight times with two rewards, B twice with two rewards. Logging probabilities are 0.8/0.2; target probabilities 0.5/0.5. IPS is (2 × 0.625 + 2 × 2.5)/10 = 0.625 versus raw reward 4/10 = 0.4. These are illustrative finite-sample estimates, not proof of true policy value.",
    alt: "A two-action table shows logging and target probabilities, counts, rewards, and importance weights, with an unsupported third action explicitly excluded from a valid IPS claim.",
  },
  "feedback-cycle": {
    title: "What is shown changes what can be learned",
    caption: "Exposure creates opportunities for outcomes; the training data influences the next model and its selection. The dashed exploration path changes opportunities to observe alternatives. A feedback structure can amplify bias but does not establish harm or equal underlying quality by itself.",
    alt: "A cycle links model selection, exposure, observed outcomes, and training, with a separate exploration path into exposure.",
  },
  "serving-path": {
    title: "Parallel sources share a deadline; later work follows the merge",
    caption: "Illustrative 50 ms allocation: context 5, retrieval 10, features 15, ranking 15, finalization 5. The last 5 includes list selection and slack. Independent retrieval paths can run in parallel; their durations are not simply added. Measure end-to-end percentiles under load.",
    alt: "Parallel retrieval sources join before feature fetching and ranking; a time-allocation bar below totals fifty milliseconds.",
  },
  "feature-availability": {
    title: "An earlier event can still arrive too late",
    caption: "The click happened at 13:59 but arrived at 14:02. It was not available to the 14:00 decision. A historical feature built later must respect the arrival/publication cutoff, not just the event timestamp. A later request may use the now-arrived event.",
    alt: "An event-to-arrival timeline places a fourteen-hundred prediction between a thirteen-fifty-nine click and its fourteen-oh-two arrival, marking that click unavailable for the earlier prediction.",
  },
  "exploration-uncertainty": {
    title: "A lower observed rate can have much greater uncertainty",
    caption: "A: 2,500/50,000 clicks, 5%; B: 3/100, 3%. Approximate 95% Wilson intervals are 4.81–5.19% and 1.03–8.45%. They describe binomial sampling uncertainty, not posterior probabilities of being best, and do not correct unequal audience or position exposure.",
    alt: "Click-rate estimates and Wilson intervals show a narrow five-percent estimate for A and a broad three-percent estimate for B, extending above A's rate.",
  },
} as const satisfies Record<string, RrpVisualSpec>;
export type RrpVisualId = keyof typeof rrpVisuals;
export const rrpVisualIds = Object.keys(rrpVisuals) as RrpVisualId[];
export function isRrpVisualId(id: string): id is RrpVisualId { return Object.hasOwn(rrpVisuals, id); }
