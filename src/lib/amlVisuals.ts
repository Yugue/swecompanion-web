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
    caption: "Illustrative 60/20/20 split. Training fits the pipeline; validation chooses its configuration and policy; test assesses the fixed procedure. The timeline below is a separate example for future-period evaluation. Actual proportions and label-availability gaps depend on the task.",
    alt: "A data bar divided into training, validation, and test roles, followed by an earlier-to-later temporal split.",
  },
  "confusion-matrix": {
    title: "Precision and recall look at different piles",
    caption: "10,000 transactions, 100 actual frauds, 180 flags. Precision uses the flagged row: 80/180 ≈ 44%. Recall uses the actual-fraud column: 80/100 = 80%. Axes are labelled because confusion-matrix conventions differ.",
    alt: "A labelled two-by-two confusion matrix shows eighty true positives, one hundred false positives, twenty false negatives, and ninety-eight hundred true negatives, with precision and recall denominators highlighted.",
  },
  "bias-variance": {
    title: "Repeat the fit on different training samples",
    caption: "Illustrative fits, not benchmark results. Left: three similar rigid fits miss the curved relationship. Right: flexible fits follow the relationship but vary locally across samples. Bias concerns the average fitted prediction; variance concerns the spread between fits at an input.",
    alt: "Two plots compare repeated rigid lines that systematically miss a true parabola with flexible curves that vary around it.",
  },
  "feature-scaling": {
    title: "Changing units can change the nearest example",
    caption: "Query is at (0, 0). A differs by $10,000 and 1 year; B by $2,000 and 20 years. Raw numeric Euclidean distance favors B. Dividing income by $10,000 and tenure by 10 years favors A. These are chosen illustrative scales, not fitted standard deviations.",
    alt: "Two bar charts compare raw and rescaled Euclidean distances from one query, with the nearest example changing from B to A.",
  },
  "cyclic-features": {
    title: "Midnight and 11 pm are neighbors on a clock",
    caption: "The numeric line puts hours 0 and 23 far apart. On (cos(2πh/24), sin(2πh/24)), they are adjacent: their Euclidean separation is about 0.261, versus 2 for opposite hours 0 and 12. Both sine and cosine are needed to locate a unique hour on the cycle.",
    alt: "A numeric hour line separates zero and twenty-three, while a sine-cosine circle places them next to each other.",
  },
  "pca-projection": {
    title: "Project a stretched cloud onto its broadest axis",
    caption: "Centered toy data has equal coordinate variances and positive covariance, so its first principal direction is (1, 1)/√2. Dashed perpendicular lines show projection. Keeping that coordinate discards the remaining sideways variation; no labels influence this direction.",
    alt: "A two-dimensional point cloud projects perpendicularly onto a diagonal principal axis, then appears as points on a one-dimensional coordinate line.",
  },
  "linear-fit": {
    title: "Least squares measures vertical misses from the line",
    caption: "The candidate line is price = 3 × area + 40, in thousands of dollars. For areas [50, 70, 90, 120], predictions are [190, 250, 310, 400] and actual prices are [180, 250, 310, 390]. Residuals are [−10, 0, 0, −10], with squared sum 200. This is a candidate line, not the exact fitted optimum.",
    alt: "Four house-price observations and a candidate prediction line show two vertical ten-thousand-dollar residuals.",
  },
  "logistic-sigmoid": {
    title: "A linear score becomes a probability through the sigmoid",
    caption: "The curve maps z to 1/(1 + exp(−z)): z = −2, 0, 2 gives about 0.119, 0.5, 0.881. A probability cutoff of 0.5 corresponds to z = 0. The plot is against the scalar score, not a curved decision boundary in the original feature space.",
    alt: "A sigmoid curve marks scores negative two, zero, and two, and connects the zero score with a probability cutoff of one-half.",
  },
  "nearest-neighbors": {
    title: "The closest three examples vote on the query",
    caption: "In this toy feature space, the three nearest training examples are two positive circles and one negative square. With k = 3 and equal votes, the prediction is positive. The dashed circle ends at the third neighbor; it is not a learned class boundary.",
    alt: "A query cross is surrounded by a dashed three-neighbor radius containing two positive circles and one negative square, while farther examples are excluded.",
  },
  "svm-margin": {
    title: "Support vectors hold a margin around the boundary",
    caption: "Toy separable data with f(x) = x₁. The boundary is x₁ = 0; the margin lines are x₁ = ±1, total width 2. Ringed examples on those lines are support vectors. A soft-margin fit can also have support vectors inside the margin or on the wrong side.",
    alt: "Two classes flank a vertical decision boundary with dashed margin lines at negative one and positive one, ringed support points, and a labelled corridor width.",
  },
  "decision-tree": {
    title: "A tree's questions cut the feature map into regions",
    caption: "Illustrative tree, not fitted fraud evidence. If amount ≤ $500, choose A. Otherwise, age < 7 days chooses B and age ≥ 7 chooses C. The corresponding feature regions show the interaction: age matters only on the high-amount branch. Each letter stands for a stored leaf prediction.",
    alt: "A two-question decision tree labelled A, B, and C is paired with matching rectangular regions in amount and account-age coordinates.",
  },
  "ensemble-methods": {
    title: "Bagging averages independent fits; boosting adds corrections",
    caption: "Top: different bootstrap samples produce trees that can train independently, then their predictions are averaged. Random forests also sample candidate features at each split. Bottom: each new tree depends on the current ensemble's remaining loss, so corrections are fitted sequentially and scaled by a learning rate.",
    alt: "A branching bagging diagram merges three trees into an average, while a separate boosting chain adds successive scaled tree corrections.",
  },
  "regression-losses": { ...dlVisuals["regression-losses"], sharedDl: "regression-losses" },
  "gradient-descent": { ...cvVisuals["gradient-descent"], sharedCv: "gradient-descent" },
  "regularization-geometry": {
    title: "L1 has corners on the axes; L2 has a rounded boundary",
    caption: "The same quadratic loss has unconstrained optimum (1.8, 0.4). Under ||w||₁ ≤ 1, its closest feasible point is (1, 0). Under ||w||₂ ≤ 1, it is approximately (0.976, 0.217). Dashed loss contours touch at those solutions. These constraint examples correspond to suitable penalty strengths, not necessarily the same λ.",
    alt: "An L1 diamond touches a circular loss contour at a zero-coordinate corner; an L2 disk touches another contour with both coordinates nonzero.",
  },
  "learning-curves": { ...cvVisuals["learning-curves"], sharedCv: "learning-curves" },
  "cross-validation": {
    title: "Hold out one fold, rebuild the pipeline, then rotate",
    caption: "Five folds give five separate fits, each using four training folds and one validation fold. The final test set stays outside development CV. For group or temporal tasks, use a fold design that respects those restrictions rather than this ordinary rotation.",
    alt: "A five-by-five grid moves a held-out cell along the diagonal; the other cells are training data, with an independent final test set shown separately.",
  },
  "threshold-curves": {
    title: "One score ordering, two threshold curves",
    caption: "Toy descending scores: 0.9+, 0.8−, 0.7+, 0.4−, 0.3+, 0.1−. At threshold 0.7, TP = 2 and FP = 1: recall = 2/3, FPR = 1/3, precision = 2/3. Markers are threshold operating points; connectors guide the eye. ROC-AUC = 2/3 and average precision ≈ 0.756 for these six cases.",
    alt: "ROC and precision-recall plots mark operating points from the same six labelled scores, highlighting the threshold point seven in both views.",
  },
  calibration: {
    title: "Compare predicted positive risk with observed positive frequency",
    caption: "Schematic binary reliability diagram. The highlighted bin has mean predicted risk 0.8, but 60 of its 100 cases are positive: observed frequency 0.6. Below the diagonal means positive risk is overpredicted. Other bin points are schematic; bin counts and uncertainty matter.",
    alt: "A reliability diagram plots mean predicted positive probability against observed positive fraction, highlighting a bin at point eight predicted and point six observed.",
  },
  "kmeans-step": {
    title: "Assign to current centers, then move to group means",
    caption: "Six two-dimensional examples start with centers (0, 0) and (6, 5). Nearest-center assignment forms two groups; their means become (1⅓, 1⅓) and (7⅓, 6⅓). Dashed arrows show the update. Next, reassign using the new centers and repeat.",
    alt: "Two panels show six points assigned to initial centers, followed by center movement to the mean of each assigned group.",
  },
  dendrogram: {
    title: "A horizontal cut selects a level of grouping",
    caption: "Illustrative merge history: A and B merge at height 1; C and D at height 2; the two groups merge at height 5. A cut at height 3 leaves two clusters. Merge height is defined by the chosen linkage criterion.",
    alt: "A four-leaf dendrogram has merges at heights one, two, and five, with a cut at three separating AB from CD.",
  },
  "dbscan-neighborhood": {
    title: "Core points extend a cluster; border points do not",
    caption: "Toy Euclidean coordinates with eps = 55 and min_samples = 4, including each point itself. The highlighted neighborhood contains 5 points, making its center core. The border square has only 3 points in its own neighborhood but lies near core points. Isolated crosses are noise. Units are arbitrary.",
    alt: "A radius around a core point contains five dense points, a nearby border square connects to the cluster, and distant crosses remain noise.",
  },
  "gaussian-mixture": {
    title: "Weighted component densities add to one mixture",
    caption: "Two one-dimensional Gaussian components have equal weight 0.5, means −1.5 and 1.5, and standard deviation 1. Their weighted densities add to the dark mixture curve. At x = 0 their contributions match, so responsibilities are [0.5, 0.5]. Density height is not a point probability.",
    alt: "Two weighted Gaussian density curves overlap and sum into a mixture curve, with equal component contributions highlighted at zero.",
  },
  "feature-attributions": {
    title: "Contributions add from a reference output to this prediction",
    caption: "Illustrative additive explanation on the probability scale: reference 0.20 + amount 0.15 − long history 0.05 + new device 0.10 = 0.40. Real attributions depend on the fitted model, reference data, output scale, and attribution assumptions. These bars are not causal effects.",
    alt: "A waterfall moves from baseline probability point two through positive amount, negative history, and positive device contributions to a prediction of point four.",
  },
} as const satisfies Record<string, AmlVisualSpec>;

export type AmlVisualId = keyof typeof amlVisuals;
export const amlVisualIds = Object.keys(amlVisuals) as AmlVisualId[];
export function isAmlVisualId(id: string): id is AmlVisualId { return Object.hasOwn(amlVisuals, id); }
