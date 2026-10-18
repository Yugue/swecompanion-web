import type { CvVisualId } from "./cvVisuals";
import { cvVisuals } from "./cvVisuals";
import type { DlVisualId } from "./dlVisuals";
import { dlVisuals } from "./dlVisuals";

export interface AmlVisualSpec {
  title: string;
  caption: string;
  alt: string;
  sharedCv?: CvVisualId;
  sharedDl?: DlVisualId;
}

export const amlVisuals = {
  "data-splits": {
    title: "Fit, choose, then assess on separate data",
    caption: "Training fits; validation chooses; test assesses the fixed procedure. The 60/20/20 split and separate timeline are illustrative. Choose proportions and temporal gaps from the task and label availability.",
    alt: "A data bar divided into training, validation, and test roles, followed by an earlier-to-later temporal split.",
  },
  "confusion-matrix": {
    title: "Precision and recall look at different piles",
    caption: "Of 180 flags, 80 are fraud: precision ≈ 44%. Of 100 actual frauds, 80 are found: recall = 80%. The labelled axes identify the two denominators.",
    alt: "A labelled two-by-two confusion matrix shows eighty true positives, one hundred false positives, twenty false negatives, and ninety-eight hundred true negatives, with precision and recall denominators highlighted.",
  },
  "bias-variance": {
    title: "Repeat the fit on different training samples",
    caption: "Illustrative repeated fits. Rigid lines miss the same bend; flexible curves vary between samples. Bias concerns the average prediction; variance concerns the spread of fitted predictions at an input.",
    alt: "Two plots compare repeated rigid lines that systematically miss a true parabola with flexible curves that vary around it.",
  },
  "feature-scaling": {
    title: "Changing units can change the nearest example",
    caption: "Query: (0, 0). A differs by $10,000 and 1 year; B by $2,000 and 20 years. Raw distance favors B; dividing income by $10,000 and tenure by 10 favors A. These scales are illustrative.",
    alt: "Two bar charts compare raw and rescaled Euclidean distances from one query, with the nearest example changing from B to A.",
  },
  "cyclic-features": {
    title: "Midnight and 11 pm are neighbors on a clock",
    caption: "Sine and cosine put hours 23 and 0 next to each other: distance ≈ 0.261, versus 2 for opposite hours 0 and 12. Both coordinates are needed to locate a unique hour.",
    alt: "A numeric hour line separates zero and twenty-three, while a sine-cosine circle places them next to each other.",
  },
  "pca-projection": {
    title: "Project a stretched cloud onto its broadest axis",
    caption: "Centered toy data spreads most along (1, 1)/√2. Dashed lines show perpendicular projection onto that axis. The discarded sideways variation may still matter for prediction; PCA ignores labels.",
    alt: "A two-dimensional point cloud projects perpendicularly onto a diagonal principal axis, then appears as points on a one-dimensional coordinate line.",
  },
  "linear-fit": {
    title: "Least squares measures vertical misses from the line",
    caption: "Candidate line: price = 3 × area + 40, in thousands. Residuals are [−10, 0, 0, −10], squared sum 200. Fitting seeks smaller total squared misses; this line is not the exact optimum.",
    alt: "Four house-price observations and a candidate prediction line show two vertical ten-thousand-dollar residuals.",
  },
  "logistic-sigmoid": {
    title: "A linear score becomes a probability through the sigmoid",
    caption: "Scores −2, 0, 2 map to probabilities ≈ 0.119, 0.5, 0.881. Cutoff 0.5 corresponds to score zero. The horizontal axis is the scalar score, rather than an original input feature.",
    alt: "A sigmoid curve marks scores negative two, zero, and two, and connects the zero score with a probability cutoff of one-half.",
  },
  "nearest-neighbors": {
    title: "The closest three examples vote on the query",
    caption: "Two positive circles and one negative square lie within the three-neighbor radius. Equal voting predicts positive. The dashed circle marks lookup reach, rather than a learned class boundary.",
    alt: "A query cross is surrounded by a dashed three-neighbor radius containing two positive circles and one negative square, while farther examples are excluded.",
  },
  "svm-margin": {
    title: "Support vectors hold a margin around the boundary",
    caption: "Toy score f(x) = x₁: boundary at zero, margin lines at ±1, total width 2. Ringed margin points are supports here. Soft-margin supports can also lie inside the corridor or be misclassified.",
    alt: "Two classes flank a vertical decision boundary with dashed margin lines at negative one and positive one, ringed support points, and a labelled corridor width.",
  },
  "decision-tree": {
    title: "A tree's questions cut the feature map into regions",
    caption: "Illustrative rules: amount ≤ $500 gives A; otherwise age < 7 days gives B, and older accounts give C. Matching regions show the interaction: age matters only after the amount test.",
    alt: "A two-question decision tree labelled A, B, and C is paired with matching rectangular regions in amount and account-age coordinates.",
  },
  "ensemble-methods": {
    title: "Bagging averages independent fits; boosting adds corrections",
    caption: "Bagging fits resampled trees independently and averages them; random forests also sample split features. Boosting fits successive loss-reducing corrections to the current ensemble, scaling each addition by a learning rate.",
    alt: "A branching bagging diagram merges three trees into an average, while a separate boosting chain adds successive scaled tree corrections.",
  },
  "regression-losses": { ...dlVisuals["regression-losses"], sharedDl: "regression-losses" },
  "gradient-descent": { ...cvVisuals["gradient-descent"], sharedCv: "gradient-descent" },
  "regularization-geometry": {
    title: "L1 has corners on the axes; L2 has a rounded boundary",
    caption: "Unconstrained optimum: (1.8, 0.4). With unit L1 bound, the solution is (1, 0); with unit L2 bound, ≈ (0.976, 0.217). Corners favor zero coefficients. Equivalent penalty strengths need not have the same λ.",
    alt: "An L1 diamond touches a circular loss contour at a zero-coordinate corner; an L2 disk touches another contour with both coordinates nonzero.",
  },
  "learning-curves": { ...cvVisuals["learning-curves"], sharedCv: "learning-curves" },
  "cross-validation": {
    title: "Hold out one fold, rebuild the pipeline, then rotate",
    caption: "Each row is a new fit: four training folds and one held-out fold. The final test stays separate. Group and temporal tasks need fold designs that enforce their restrictions.",
    alt: "A five-by-five grid moves a held-out cell along the diagonal; the other cells are training data, with an independent final test set shown separately.",
  },
  "threshold-curves": {
    title: "One score ordering, two threshold curves",
    caption: "At cutoff 0.7, TP = 2 and FP = 1: recall = precision = 2/3, FPR = 1/3. Markers are threshold points; connectors guide the eye. These six scores give ROC-AUC 2/3 and AP ≈ 0.756.",
    alt: "ROC and precision-recall plots mark operating points from the same six labelled scores, highlighting the threshold point seven in both views.",
  },
  calibration: {
    title: "Compare predicted positive risk with observed positive frequency",
    caption: "The highlighted bin predicts mean risk 0.8 but contains 60 positives in 100 cases: observed frequency 0.6. Below the diagonal means overpredicted positive risk. Other bins are schematic; counts and uncertainty matter.",
    alt: "A reliability diagram plots mean predicted positive probability against observed positive fraction, highlighting a bin at point eight predicted and point six observed.",
  },
  "kmeans-step": {
    title: "Assign to current centers, then move to group means",
    caption: "Assign six points to the initial centers (0, 0) and (6, 5), then move centers to group means (1⅓, 1⅓) and (7⅓, 6⅓). Reassign and repeat.",
    alt: "Two panels show six points assigned to initial centers, followed by center movement to the mean of each assigned group.",
  },
  dendrogram: {
    title: "A horizontal cut selects a level of grouping",
    caption: "A and B merge at height 1; C and D at 2; the groups merge at 5. Cutting at height 3 leaves two groups. Heights follow the chosen group-distance rule.",
    alt: "A four-leaf dendrogram has merges at heights one, two, and five, with a cut at three separating AB from CD.",
  },
  "dbscan-neighborhood": {
    title: "Core points extend a cluster; border points do not",
    caption: "Toy radius 55, minimum count 4, including the point itself. The core neighborhood contains 5 points. The border square has only 3 but lies near core points; isolated crosses are noise.",
    alt: "A radius around a core point contains five dense points, a nearby border square connects to the cluster, and distant crosses remain noise.",
  },
  "gaussian-mixture": {
    title: "Weighted component densities add to one mixture",
    caption: "Equal-weight Gaussian components have means −1.5 and 1.5, standard deviation 1. Their weighted densities sum to the dark curve. At zero, contributions match: responsibilities [0.5, 0.5]. Height is density, not point probability.",
    alt: "Two weighted Gaussian density curves overlap and sum into a mixture curve, with equal component contributions highlighted at zero.",
  },
  "feature-attributions": {
    title: "Contributions add from a reference output to this prediction",
    caption: "Illustrative probability-scale explanation: 0.20 + 0.15 − 0.05 + 0.10 = 0.40. Attributions depend on the reference, model, output scale, and assumptions. The bars do not establish causal effects.",
    alt: "A waterfall moves from baseline probability point two through positive amount, negative history, and positive device contributions to a prediction of point four.",
  },
} as const satisfies Record<string, AmlVisualSpec>;

export type AmlVisualId = keyof typeof amlVisuals;
export const amlVisualIds = Object.keys(amlVisuals) as AmlVisualId[];
export function isAmlVisualId(id: string): id is AmlVisualId { return Object.hasOwn(amlVisuals, id); }
