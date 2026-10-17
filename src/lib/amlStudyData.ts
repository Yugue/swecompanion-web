// Study data for the "Applied Machine Learning -> Basics of ML" domain, written to match the
// shape and voice of `mlStudyData.ts` (the Deep Learning / Neural Networks track). The two files
// are deliberately independent: mlStudyData.ts is generated from the Flutter app's Dart source,
// this one is hand-authored, and the shared component props are structural, not nominal.
//
// Quiz questions AND answers are premium content, served only from Firestore
// (quizzes/{quizId}, gated by firestore.rules) - only the count is public here.

export interface AmlTopic {
  id: string;
  title: string;
  summary: string;
  keyPoints: string[];
  interviewPrompt: string;
  code?: string;
}

export interface AmlPart {
  id: string;
  number: string;
  title: string;
  description: string;
  color: string;
  icon: string;
  topics: AmlTopic[];
  quizQuestionCount: number;
}

export const amlParts: AmlPart[] = [
  {
    id: "foundations",
    number: "1",
    title: "Foundations",
    description: "What a model is, what one row of data looks like, how success is measured, and why models fail.",
    color: "#4285F4",
    icon: "Blocks",
    topics: [
      {
        id: "what-is-ml",
        title: "What machine learning is",
        summary:
          "Machine learning fits a model from data to predict outcomes or find patterns in new examples.",
        keyPoints: [
          "Training fits the model; generalization means useful behavior on new examples.",
          "Model outputs can be numbers, categories, probabilities, or groups.",
          "Compare against explicit rules and include data, serving, and monitoring costs.",
        ],
        interviewPrompt:
          "A team wants ML for 'flag transactions over $10,000 from new accounts'. Explain why a rule beats a model here, and what would change your answer.",
        code: "rules: human writes f    |    ML: data determines f",
      },
      {
        id: "learning-paradigms",
        title: "Supervised, unsupervised, and self-supervised learning",
        summary:
          "A learning paradigm describes the signal used to learn: supplied targets, structure, or targets constructed from the data.",
        keyPoints: [
          "Supervised learning predicts supplied labels; unsupervised learning finds structure without per-example targets.",
          "Self-supervised learning constructs prediction tasks from the data itself.",
          "Semi-supervised learning, weak supervision, and active learning address different label constraints.",
        ],
        interviewPrompt:
          "You have 10 million user sessions and 2,000 human-reviewed labels. Which paradigms are actually available to you, and in what order would you use them?",
        code: "supervised: (x, y)   unsupervised: (x)   self-supervised: (x, y=g(x))",
      },
      {
        id: "features-and-labels",
        title: "Features, labels, and a training example",
        summary:
          "A training example pairs available inputs with a target; define its unit and prediction time explicitly.",
        keyPoints: [
          "Features describe the input; a supervised label states the target to predict.",
          "A tabular design matrix has one row per example and one column per feature.",
          "Use values available at prediction time, and wait for the full label window before assigning outcomes.",
        ],
        interviewPrompt:
          "Define one training row for a food-delivery ETA model: what is the unit, what is in x, what is y, and when does y become observable?",
        code: "X.shape == (n_samples, n_features);  y.shape == (n_samples,)",
      },
      {
        id: "task-types",
        title: "Regression, classification, ranking, and clustering",
        summary:
          "Choose the output shape from the decision: a number, category, ordering, or group.",
        keyPoints: [
          "Regression predicts numbers; classification predicts categories or class probabilities.",
          "Multiclass outcomes are mutually exclusive; multilabel outcomes can occur together.",
          "Ranking, probability calibration, and clustering usefulness require different evaluation.",
        ],
        interviewPrompt:
          "'Predict how likely a user is to churn' - argue for framing it as binary classification, as regression on time-to-churn, and as ranking, then pick one.",
        code: "regression: ŷ ∈ ℝ   classification: ŷ ∈ {1..C}   ranking: order over items",
      },
      {
        id: "parameters-vs-hyperparameters",
        title: "Parameters, hyperparameters, and capacity",
        summary:
          "Parameters are fitted values; hyperparameters configure the model or learning procedure.",
        keyPoints: [
          "Coefficients and split thresholds are fitted; depth and penalty strength are chosen.",
          "Capacity describes which patterns a model can express; not every setting changes capacity.",
          "Choose configurations on validation data and reserve independent final evaluation.",
        ],
        interviewPrompt:
          "Is the number of clusters k in k-means a parameter or a hyperparameter, and how does that change how you would pick it?",
        code: "model = RandomForestClassifier(max_depth=8)  # hyperparameter\nmodel.fit(X, y)                             # parameters",
      },
      {
        id: "train-val-test",
        title: "Train, validation, and test splits",
        summary:
          "Training fits, validation chooses, and test evaluates the procedure after choices are fixed.",
        keyPoints: [
          "Make the split match new rows, unseen entities, future periods, or the combination deployment requires.",
          "Respect historical feature and label availability, including delayed outcomes.",
          "Refit preprocessing inside each training fold; repeated test-driven changes consume independence.",
        ],
        interviewPrompt:
          "Your validation score keeps improving across 200 experiments but the test score does not. What happened, and what would you do differently?",
        code: "train -> fit  |  validation -> choose  |  test -> report (once)",
      },
      {
        id: "confusion-matrix",
        title: "Confusion matrix, precision, and recall",
        summary:
          "A confusion matrix counts decisions against actual classes; precision and recall use different denominators.",
        keyPoints: [
          "TP and TN are correct decisions; FP is a false alarm and FN a missed positive.",
          "Precision asks how many flags are correct; recall asks how many actual positives were found.",
          "Accuracy, F-scores, and class averaging summarize decisions; ranking and probability scores need more information.",
        ],
        interviewPrompt:
          "Cancer screening versus spam filtering: which metric leads in each case, and what is the cost of getting that choice backwards?",
        code: "precision = tp / (tp + fp);  recall = tp / (tp + fn)",
      },
      {
        id: "regression-metrics",
        title: "Regression metrics",
        summary:
          "Regression metrics compare error size, sensitivity to large misses, and the meaning of the target units.",
        keyPoints: [
          "MAE averages absolute error; MSE squares it; RMSE restores the original units.",
          "Held-out R² compares squared error with the evaluation-set mean and can be negative.",
          "Percentage, log-space, and quantile metrics suit different costs; inspect residual patterns too.",
        ],
        interviewPrompt:
          "A delivery-ETA model has RMSE 6 minutes and MAE 3 minutes. What does that gap tell you about the error distribution?",
        code: "rmse = np.sqrt(((y - yhat) ** 2).mean())",
      },
      {
        id: "baselines",
        title: "Baselines and when not to use ML",
        summary:
          "A baseline supplies a fair reference for deciding whether a candidate model adds useful value.",
        keyPoints: [
          "Compare trivial predictors, the current system, and a simple fitted model.",
          "Use the same evaluation examples and decision constraints for each candidate.",
          "Assess uncertainty and operating cost; failing to beat a baseline does not by itself prove a bug.",
        ],
        interviewPrompt:
          "Your fraud model has 99.2% accuracy. What baseline do you compute first, and what does it likely tell you?",
        code: "DummyClassifier(strategy=\"most_frequent\").fit(X_train, y_train).score(X_test, y_test)",
      },
      {
        id: "bias-variance",
        title: "Bias-variance tradeoff",
        summary:
          "Bias is systematic prediction error; variance is sensitivity to which training sample was observed.",
        keyPoints: [
          "The exact bias² + variance + noise decomposition applies to expected squared error under stated assumptions.",
          "Train/validation gaps are clues, not direct measurements of bias and variance.",
          "Use learning curves and pipeline checks to choose between better data, useful capacity, and regularization.",
        ],
        interviewPrompt:
          "You are at 62% train and 61% validation accuracy. What would you check before choosing more data or more capacity?",
        code: "error = bias² + variance + irreducible_noise",
      },
    ],
    quizQuestionCount: 12,
  },
  {
    id: "data-and-features",
    number: "2",
    title: "Data and features",
    description: "Where most of the real accuracy comes from, and where most silent failures start.",
    color: "#EA4335",
    icon: "Layers",
    topics: [
      {
        id: "data-cleaning",
        title: "Missing values, outliers, and duplicates",
        summary:
          "Cleaning repairs recording problems and represents missing or unusual observations without erasing useful signal.",
        keyPoints: [
          "Fit imputation values and data-derived clipping thresholds on training folds only.",
          "Missingness indicators can retain information that a filled value loses.",
          "Distinguish erroneous records, real extremes, and genuine repeated events before deleting rows.",
        ],
        interviewPrompt:
          "Income is missing for 30% of users. Walk through how you decide between dropping the column, imputing, and treating missingness as a feature.",
        code: "SimpleImputer(strategy=\"median\").fit(X_train)  # fit on train only",
      },
      {
        id: "feature-scaling",
        title: "Feature scaling and normalization",
        summary:
          "Scaling changes how units contribute to distances, coefficient penalties, and optimization.",
        keyPoints: [
          "Standardization, min-max scaling, and robust scaling use different fitted statistics.",
          "Distance methods and regularized linear models often benefit; ordinary threshold trees usually need no scaling.",
          "Fit statistics on training data and reuse them in evaluation and serving.",
        ],
        interviewPrompt:
          "Why does standardizing features change an L2-regularized logistic regression's coefficients but not a decision tree's splits?",
        code: "Pipeline([(\"scale\", StandardScaler()), (\"clf\", LogisticRegression())])",
      },
      {
        id: "categorical-encoding",
        title: "Encoding categorical features",
        summary:
          "Encoding represents named feature values numerically while controlling the assumptions introduced.",
        keyPoints: [
          "One-hot creates category switches; ordinal codes also introduce numeric spacing.",
          "Smoothed target encoding needs out-of-fold values with appropriate group or time restrictions.",
          "Plan unseen and rare category handling; compare hashing, embeddings, or native category support where appropriate.",
        ],
        interviewPrompt:
          "You have a zip-code feature with 40,000 levels. Compare one-hot, target encoding, and hashing for a gradient-boosted model.",
        code: "OneHotEncoder(handle_unknown=\"ignore\")  # unseen level at serve time",
      },
      {
        id: "feature-engineering",
        title: "Feature engineering",
        summary:
          "Feature engineering creates useful inputs that make relationships easier for a model to express.",
        keyPoints: [
          "Aggregates, rates, recency, and interactions answer different questions about the same events.",
          "Match window units and preserve denominator counts when constructing rates.",
          "Cyclic coordinates and log transforms can expose structure; keep features that improve honest validation.",
        ],
        interviewPrompt:
          "Give three engineered features for a ride-hailing ETA model and say which model family would benefit most from each.",
        code: "df[\"spend_per_order\"] = df[\"spend_30d\"] / df[\"orders_30d\"].clip(lower=1)",
      },
      {
        id: "leakage",
        title: "Data leakage",
        summary:
          "Leakage uses information unavailable in the prediction or evaluation setting being claimed.",
        keyPoints: [
          "Reconstruct exact feature values as known at the historical prediction time.",
          "Fit preprocessing and label-based selection inside training folds.",
          "Group and time restrictions follow the intended deployment claim; pipelines cannot fix already-leaky inputs.",
        ],
        interviewPrompt:
          "A model jumps from 0.82 to 0.99 AUC after a new feature is added. What is your first hypothesis, and how do you test it?",
        code: "for feature in X: assert available_at(prediction_time, feature)  # pseudocode",
      },
      {
        id: "dimensionality-reduction",
        title: "Dimensionality reduction and PCA",
        summary:
          "Dimensionality reduction keeps selected features or constructs fewer coordinates, trading information for compactness.",
        keyPoints: [
          "PCA projects centered data onto perpendicular high-variance directions.",
          "Scale when units should contribute comparably; fit the entire transform within training folds.",
          "Input variance is not predictive value, and fewer components may still require all original measurements.",
        ],
        interviewPrompt:
          "Compare feature selection with PCA when interpretability and raw measurement costs matter.",
        code: "PCA(n_components=0.95).fit(X_scaled)  # keep 95% of variance",
      },
    ],
    quizQuestionCount: 10,
  },
  {
    id: "supervised-algorithms",
    number: "3",
    title: "Core supervised algorithms",
    description: "How core models make predictions, learn from data, and fail.",
    color: "#FBBC04",
    icon: "LineChart",
    topics: [
      {
        id: "linear-regression",
        title: "Linear regression",
        summary:
          "Linear regression fits a weighted sum of features to a numeric target, usually by minimizing squared error.",
        keyPoints: [
          "Coefficients describe conditional associations and depend on feature units.",
          "Use stable least-squares solvers rather than explicitly inverting a normal-equation matrix.",
          "Correlated inputs can destabilize coefficients; engineered features can express curves while remaining linear in weights.",
        ],
        interviewPrompt:
          "Your coefficients flip sign when you add a highly correlated feature. Explain why, and what you would do about it.",
        code: "w = np.linalg.lstsq(X, y, rcond=None)[0]  # stable least squares",
      },
      {
        id: "logistic-regression",
        title: "Logistic regression",
        summary:
          "Logistic regression converts a linear log-odds score through a sigmoid to predict a binary probability.",
        keyPoints: [
          "Log loss penalizes confident mistakes and gives a convex objective in the weights.",
          "A coefficient changes log-odds; its exponential multiplies odds, not probability.",
          "Regularization and scaling matter; probability calibration must be checked rather than assumed.",
        ],
        interviewPrompt:
          "Compare log loss with squared probability error for a sigmoid model. What changes in their meaning and optimization?",
        code: "LogisticRegression(C=1.0).fit(X_train, y_train).predict_proba(X_test)",
      },
      {
        id: "knn",
        title: "k-Nearest Neighbors",
        summary:
          "k-nearest neighbors predicts from nearby stored examples using a vote or average.",
        keyPoints: [
          "Neighbor count controls smoothing, while features and distance determine the neighborhood.",
          "Scale and choose similarity deliberately; irrelevant dimensions can distort proximity.",
          "Storage and search have real costs; exact or approximate indexes change the serving tradeoff.",
        ],
        interviewPrompt:
          "k-NN works well in your notebook but is impossible to serve at 10k QPS. What exactly is expensive, and what are your options?",
        code: "KNeighborsClassifier(n_neighbors=15, weights=\"distance\")",
      },
      {
        id: "naive-bayes",
        title: "Naive Bayes",
        summary:
          "Naive Bayes combines class priors and per-feature evidence under conditional independence.",
        keyPoints: [
          "Choose multinomial, Bernoulli, or Gaussian likelihoods for the feature representation.",
          "Additive smoothing avoids zero word probabilities; log-space computation avoids underflow.",
          "Correlated evidence can distort confidence even when class predictions remain useful.",
        ],
        interviewPrompt:
          "Naive Bayes outputs 0.9999 for most spam emails. Is it that confident? Explain what the probability actually means here.",
        code: "MultinomialNB(alpha=1.0).fit(X_counts, y)  # alpha = smoothing",
      },
      {
        id: "svm",
        title: "Support Vector Machines",
        summary:
          "An SVM fits a separating boundary by trading a wide margin against costly training violations.",
        keyPoints: [
          "Support vectors influence the fitted boundary and can lie on or inside the margin.",
          "Smaller C means stronger relative regularization; hinge loss stops penalizing sufficiently separated examples.",
          "Kernels express nonlinear separation; tune their geometry and calibrate scores if probabilities are needed.",
        ],
        interviewPrompt:
          "Explain the margin and the role of C to someone who knows logistic regression but has never seen an SVM.",
        code: "SVC(kernel=\"rbf\", C=1.0, gamma=\"scale\")",
      },
      {
        id: "decision-trees",
        title: "Decision trees",
        summary:
          "A decision tree routes examples through learned feature tests to stored leaf predictions.",
        keyPoints: [
          "Greedy splits reduce weighted impurity or regression error rather than optimize the full tree globally.",
          "Depth, minimum leaf size, and pruning limit unreliable small regions.",
          "Trees express interactions with little need for scaling, but can be unstable and extrapolate poorly.",
        ],
        interviewPrompt:
          "Why does a single deep tree overfit so reliably, and which hyperparameter would you reach for first?",
        code: "DecisionTreeClassifier(max_depth=6, min_samples_leaf=50)",
      },
      {
        id: "random-forests",
        title: "Bagging and random forests",
        summary:
          "A random forest combines bootstrapped trees while sampling candidate features at each split.",
        keyPoints: [
          "Bootstrap samples draw with replacement; prediction averaging can reduce sample sensitivity.",
          "Feature sampling encourages different errors, reducing the correlation that limits averaging.",
          "Out-of-bag scores are useful internal estimates but do not enforce time or group evaluation.",
        ],
        interviewPrompt:
          "If bagging reduces variance, why does a random forest also subsample features at each split?",
        code: "RandomForestClassifier(n_estimators=500, max_features=\"sqrt\", oob_score=True)",
      },
      {
        id: "gradient-boosting",
        title: "Boosting and gradient-boosted trees",
        summary:
          "Gradient boosting adds trees sequentially to improve the current ensemble loss.",
        keyPoints: [
          "Squared-error corrections fit residuals; other losses supply negative-gradient targets.",
          "Learning rate, tree complexity, tree count, and early stopping work together.",
          "Compare tabular performance and serving cost with baselines; extra corrections can fit noise.",
        ],
        interviewPrompt:
          "Compare a random forest and gradient boosting for a 200k-row tabular fraud problem - accuracy, tuning effort, and training time.",
        code: "GradientBoostingClassifier(learning_rate=0.05, n_estimators=800, max_depth=3)",
      },
    ],
    quizQuestionCount: 10,
  },
  {
    id: "training-and-generalization",
    number: "4",
    title: "Training and generalization",
    description: "What training optimizes, and how to keep a model honest on data it has not seen.",
    color: "#34A853",
    icon: "TrendingDown",
    topics: [
      {
        id: "loss-functions",
        title: "Loss functions for classical models",
        summary:
          "A loss defines prediction cost during fitting; evaluation metrics judge the resulting behavior.",
        keyPoints: [
          "Squared, absolute, Huber, and quantile losses target different error tradeoffs.",
          "Log loss trains probability estimates; hinge loss trains margin separation.",
          "Training weights, decision thresholds, and capacity constraints solve different parts of the task.",
        ],
        interviewPrompt:
          "Why can't you just train directly on F1 score, and what do you do instead when F1 is the business metric?",
        code: "log_loss(y_true, predicted_probabilities)",
      },
      {
        id: "optimization",
        title: "Optimization: closed form, gradient descent, SGD",
        summary:
          "Optimization searches for fitted values that reduce a chosen training objective.",
        keyPoints: [
          "Least squares has stable direct solvers, including solutions for rank-deficient data.",
          "Gradient descent follows negative derivatives; batch size and learning rate control work and noise.",
          "Convexity excludes nonglobal local minima but does not alone ensure uniqueness or convergence.",
        ],
        interviewPrompt:
          "When would you choose SGD over the closed-form solution for linear regression, even though the closed form is exact?",
        code: "w -= lr * grad(loss, w)  # one step downhill",
      },
      {
        id: "regularization",
        title: "Regularization: L1, L2, and elastic net",
        summary:
          "Regularization discourages unstable or unnecessarily complex fits, often through a coefficient penalty.",
        keyPoints: [
          "L2 typically shrinks; L1 can select exact zeros; elastic net combines both effects.",
          "Scale numeric features appropriately and tune strength inside validation.",
          "Tree limits and early stopping impose other restrictions; too much restriction underfits.",
        ],
        interviewPrompt:
          "You have 5,000 features and 800 rows. Which penalty do you reach for and why?",
        code: "Ridge(alpha=1.0)  |  Lasso(alpha=0.01)  |  ElasticNet(l1_ratio=0.5)",
      },
      {
        id: "overfitting-diagnosis",
        title: "Diagnosing overfitting and underfitting",
        summary:
          "Diagnose poor generalization with comparable errors, useful baselines, curves, and pipeline checks.",
        keyPoints: [
          "Learning curves vary data size; validation curves vary settings; iteration curves vary training steps.",
          "A train/validation gap can reflect overfitting, shift, mismatch, or measurement noise.",
          "Small-subset fitting is a useful check only when model capacity and label consistency make memorization possible.",
        ],
        interviewPrompt:
          "Validation loss improves for 20 iterations and then steadily worsens while train loss keeps falling. Name the effect and two fixes.",
        code: "plot(train_scores, val_scores, x=train_size)  # learning curve",
      },
      {
        id: "cross-validation",
        title: "Cross-validation",
        summary:
          "Cross-validation rotates held-out subsets while rebuilding the complete learning procedure.",
        keyPoints: [
          "Choose random, stratified, grouped, or forward-time folds to match the intended claim.",
          "Refit preprocessing inside every fold; a pipeline cannot repair future-derived input values.",
          "After tuning, use independent testing or nested CV; fold spread is not automatically a confidence interval.",
        ],
        interviewPrompt:
          "Explain why selecting features on the full dataset before cross-validation inflates your CV score.",
        code: "cross_val_score(Pipeline([...]), X, y, cv=StratifiedKFold(5))",
      },
      {
        id: "hyperparameter-search",
        title: "Hyperparameter search",
        summary:
          "Search compares configurations under a defined budget and validation protocol.",
        keyPoints: [
          "Random search explores ranges; small grids suit meaningful short menus.",
          "Sample positive scale parameters across appropriate orders of magnitude.",
          "Track fit cost and selection effects; evaluate the chosen procedure with a clean holdout or outer CV.",
        ],
        interviewPrompt:
          "You have budget for 30 training runs across 6 hyperparameters. Design the search, and say how you report the final number.",
        code: "RandomizedSearchCV(model, param_distributions, n_iter=30, cv=5)",
      },
    ],
    quizQuestionCount: 10,
  },
  {
    id: "evaluation",
    number: "5",
    title: "Evaluation in depth",
    description: "Curves, probabilities, rare classes, and proving one model is really better than another.",
    color: "#A78BFA",
    icon: "ListChecks",
    topics: [
      {
        id: "roc-pr-curves",
        title: "ROC-AUC, PR-AUC, and thresholds",
        summary:
          "ROC and precision-recall curves summarize decisions across score thresholds; an operating point still needs a policy.",
        keyPoints: [
          "ROC compares recall with false-positive rate; PR compares precision with recall.",
          "ROC-AUC measures pair ordering with half-credit for ties; average precision differs from trapezoidal PR area.",
          "For rare positives, report absolute counts and useful operating regions alongside summary scores.",
        ],
        interviewPrompt:
          "Your model has 0.95 ROC-AUC on a 0.3%-positive dataset, and product says it is useless in practice. Explain both facts.",
        code: "precision_recall_curve(y_true, y_score)  # pick a point, not a curve",
      },
      {
        id: "calibration",
        title: "Probability calibration",
        summary:
          "Calibration means predicted probabilities match observed frequencies on the relevant population.",
        keyPoints: [
          "Ranking and probability meaning are different; a good ordering can have poor calibration.",
          "Reliability diagrams need bin counts; Brier score and binned calibration error have different limitations.",
          "Fit sigmoid or isotonic mappings using held-out predictions, then evaluate independently.",
        ],
        interviewPrompt:
          "Your model's output is multiplied by transaction value to estimate expected loss. Why does calibration now matter more than AUC?",
        code: "CalibratedClassifierCV(model, method=\"sigmoid\", cv=5)",
      },
      {
        id: "class-imbalance",
        title: "Class imbalance",
        summary:
          "Class imbalance makes some outcomes rare, changing data coverage and the interpretation of aggregate scores.",
        keyPoints: [
          "Report prevalence, counts, precision, and recall; unweighted learning does not always fail.",
          "Try an appropriate threshold before assuming training must change.",
          "Weights and resampling alter fitting; keep evaluation representative and recheck probability calibration.",
        ],
        interviewPrompt:
          "You oversample positives 50x in training. What happens to the predicted probabilities, and how do you fix them at serving time?",
        code: "LogisticRegression(class_weight=\"balanced\")",
      },
      {
        id: "model-comparison",
        title: "Comparing models honestly",
        summary:
          "Compare complete procedures on shared evaluation units, with uncertainty and operating value in view.",
        keyPoints: [
          "Paired outcomes separate candidate differences from shared example difficulty.",
          "Resampling must respect independent units or temporal dependence; fold standard deviation is no universal significance test.",
          "Repeated search selects favorable noise; reserve independent final evaluation and test policy effects where appropriate.",
        ],
        interviewPrompt:
          "Model B beats model A by 0.4% AUC on your validation set. Would you ship it? What evidence would change your mind?",
        code: "scores = cross_val_score(model, X, y, cv=10); scores.mean(), scores.std()",
      },
      {
        id: "error-analysis",
        title: "Error analysis and slice-based evaluation",
        summary:
          "Error analysis turns mistakes and weak slices into testable hypotheses for improvement.",
        keyPoints: [
          "Inspect labels, pipeline behavior, missing coverage, absent information, and model restrictions.",
          "Report counts and uncertainty for each slice; small groups produce noisy estimates.",
          "Prioritize impact and fixability, then confirm that a targeted change helps without important regressions.",
        ],
        interviewPrompt:
          "Accuracy is 91% and flat across three model iterations. What do you do before trying a bigger model?",
        code: "errors = df[df.pred != df.label].groupby(\"segment\").size()",
      },
    ],
    quizQuestionCount: 10,
  },
  {
    id: "unsupervised",
    number: "6",
    title: "Unsupervised learning",
    description: "Finding structure when there is no label to check yourself against.",
    color: "#22D3EE",
    icon: "CircleDot",
    topics: [
      {
        id: "kmeans",
        title: "k-Means clustering",
        summary:
          "k-means alternates nearest-center assignment and mean updates to reduce within-cluster squared distance.",
        keyPoints: [
          "Initialization and restarts matter because fitting does not guarantee the global optimum.",
          "Euclidean geometry favors compact center-based groups; scaling and outliers change that geometry.",
          "Choose k using several forms of evidence, not simply the lowest training inertia.",
        ],
        interviewPrompt:
          "Your k-means clusters split one dense blob in half and merge two others. What assumption is being violated?",
        code: "KMeans(n_clusters=8, init=\"k-means++\", n_init=10).fit(X_scaled)",
      },
      {
        id: "hierarchical-dbscan",
        title: "Hierarchical clustering and DBSCAN",
        summary:
          "Hierarchical clustering builds nested groups; DBSCAN connects dense neighborhoods and identifies noise.",
        keyPoints: [
          "A dendrogram records merges; linkage defines which groups are closest.",
          "DBSCAN uses eps and min_samples to define core points, border points, and noise.",
          "Choose distances and scales deliberately; varying density and high dimensionality can undermine neighborhoods.",
        ],
        interviewPrompt:
          "You have GPS pickup points and need clusters of unknown count plus an explicit notion of 'not in any cluster'. Which algorithm, and why?",
        code: "DBSCAN(eps=0.3, min_samples=10).fit(X_scaled)  # label -1 = noise",
      },
      {
        id: "gaussian-mixtures",
        title: "Gaussian mixture models",
        summary:
          "A Gaussian mixture models a distribution using weighted Gaussian components and soft memberships.",
        keyPoints: [
          "Responsibilities give each fitted component’s share of density at a point.",
          "Expectation-maximization alternates responsibilities and parameter updates; initialization and covariance regularization matter.",
          "Covariance shape, component count, held-out fit, and usefulness determine the appropriate complexity.",
        ],
        interviewPrompt:
          "When is a soft assignment more useful than a hard one, and what does a responsibility of 0.5 actually tell you?",
        code: "GaussianMixture(n_components=5, covariance_type=\"full\").fit(X)",
      },
      {
        id: "clustering-evaluation",
        title: "Choosing k and evaluating clusters",
        summary:
          "Assess clusters through geometry, reproducibility, independent reference groups, and intended use.",
        keyPoints: [
          "Inertia rewards additional centers; an elbow is a heuristic, not a true-count guarantee.",
          "Silhouette measures separation under the selected distance and favors certain shapes.",
          "ARI compares partitions without depending on cluster names; stable groups can still be unhelpful.",
        ],
        interviewPrompt:
          "Marketing asks for 'the right number of customer segments'. How do you answer without a label to validate against?",
        code: "silhouette_score(X, labels)  # separation under the chosen metric",
      },
      {
        id: "anomaly-detection",
        title: "Anomaly detection",
        summary:
          "Anomaly detection scores unusual observations relative to a reference; unusual is not automatically harmful.",
        keyPoints: [
          "Outlier and novelty detection differ in what training data represents.",
          "Isolation, neighborhood, density, boundary, and reconstruction methods define unusual in different ways.",
          "A contamination setting chooses a cutoff; it does not guarantee a false-alarm rate or useful alerts.",
        ],
        interviewPrompt:
          "You have 400 confirmed fraud cases out of 50 million transactions. Argue for and against a supervised classifier here.",
        code: "IsolationForest(contamination=0.001).fit(X_train)",
      },
    ],
    quizQuestionCount: 10,
  },
  {
    id: "applied-practice",
    number: "7",
    title: "Applied practice",
    description: "From a concrete decision to a deployed model, measured outcomes, and useful updates.",
    color: "#F97316",
    icon: "Wrench",
    topics: [
      {
        id: "ml-workflow",
        title: "The applied ML workflow",
        summary:
          "Connect framing, data, evaluation, serving, and outcomes through an iterative evidence-based workflow.",
        keyPoints: [
          "Define the unit, prediction time, label window, action, and constraints before selecting a model.",
          "Build deployment-matched splits and baselines, then use error analysis to choose experiments.",
          "Ranking risk does not establish intervention benefit; monitor outcomes and validate policy effects separately.",
        ],
        interviewPrompt:
          "Walk end-to-end through a customer-churn project, naming what you would do first and what you would deliberately postpone.",
        code: "frame -> data -> split -> baseline -> model -> evaluate -> deploy -> monitor",
      },
      {
        id: "model-choice",
        title: "Choosing a model under real constraints",
        summary:
          "Choose a complete pipeline using measured quality, data suitability, and real operating constraints.",
        keyPoints: [
          "Data type suggests candidates, but fixed row-count rules do not determine the best family.",
          "Measure the full feature-to-response latency path, including tail latency and failures.",
          "State the required explanation and reliability properties, then compare benefits against maintenance cost.",
        ],
        interviewPrompt:
          "50k rows, 40 tabular features, a 20ms latency budget, and a regulator who can demand an explanation. What do you build?",
        code: "candidates = [logistic, random_forest, gbdt];  pick = meets_constraints(...)",
      },
      {
        id: "interpretability",
        title: "Interpretability and feature importance",
        summary:
          "Interpretability explains how a model uses inputs, globally or for one prediction.",
        keyPoints: [
          "Permutation importance measures held-out score reliance and needs care with correlated inputs.",
          "SHAP expresses reference-relative attributions on a specified output scale; assumptions affect the result.",
          "Effect plots and attributions describe model behavior, not causal effects of interventions.",
        ],
        interviewPrompt:
          "A loan applicant asks why they were declined. What do you actually show them, and what are the limits of that explanation?",
        code: "permutation_importance(model, X_val, y_val, n_repeats=10)",
      },
      {
        id: "deployment-basics",
        title: "Serving a model: batch, online, and train/serve skew",
        summary:
          "Serving delivers fitted predictions through batch, online, or streaming systems with defined freshness requirements.",
        keyPoints: [
          "Train/serve skew occurs when historical and live feature computation differ.",
          "Version model, transforms, feature definitions, schema, and decision policy together.",
          "Use replay, shadow evaluation, staged rollout, and tested fallbacks to validate real operating behavior.",
        ],
        interviewPrompt:
          "Offline AUC is 0.89 but online performance looks far worse, with no code changes between them. What do you check first?",
        code: "np.testing.assert_allclose(train_features, served_features)",
      },
      {
        id: "monitoring-and-retraining",
        title: "Monitoring, drift, and retraining",
        summary:
          "Monitoring checks service health, data, predictions, and delayed outcomes; drift calls for diagnosis before updates.",
        keyPoints: [
          "Input and prediction checks provide immediate clues; outcome quality depends on label maturity.",
          "Covariate, label, and concept shift have different assumptions and may require different responses.",
          "Validate retrains and thresholds, and account for decisions that change which outcomes become observable.",
        ],
        interviewPrompt:
          "Precision drops 8% over three months with no deploys. Walk through detection, diagnosis, and the decision to retrain.",
        code: "monitor(inputs, predictions, matured_outcomes)  # pseudocode",
      },
      {
        id: "interview-playbook",
        title: "Answering a Basics-of-ML interview question",
        summary:
          "Explain one concept through a definition, mechanism, numerical example, and practical limit.",
        keyPoints: [
          "Answer direct questions directly and clarify when the task or constraint is ambiguous.",
          "For design prompts, establish the action, row, prediction time, labels, baseline, and evaluation.",
          "State assumptions and uncertainty precisely; avoid changing subjects or filling space with related definitions.",
        ],
        interviewPrompt:
          "'Tell me about overfitting.' Produce the first 30 seconds of your answer with a definition, example, and practical limit.",
        code: "define -> mechanism -> numerical example -> tradeoff",
      },
    ],
    quizQuestionCount: 10,
  },
];

export const amlTopicsById: Record<string, AmlTopic> = Object.fromEntries(
  amlParts.flatMap((part) => part.topics.map((topic) => [topic.id, topic] as const))
);

export const amlPartsById: Record<string, AmlPart> = Object.fromEntries(
  amlParts.map((part) => [part.id, part])
);

export const amlPartIdForTopic: Record<string, string> = Object.fromEntries(
  amlParts.flatMap((part) => part.topics.map((topic) => [topic.id, part.id] as const))
);

export const amlTopicCount: number = amlParts.reduce((sum, part) => sum + part.topics.length, 0);
