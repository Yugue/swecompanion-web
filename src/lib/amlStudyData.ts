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
    description: "The vocabulary every other answer in this domain is built on.",
    color: "#4285F4",
    icon: "Blocks",
    topics: [
      {
        id: "what-is-ml",
        title: "What machine learning is",
        summary:
          "Machine learning fits a function from data instead of specifying the rules by hand; it is worth using only when the rules are unknown, numerous, or keep changing.",
        keyPoints: [
          "Traditional software encodes rules a human already knows; ML infers the rules from labelled examples of the behavior you want.",
          "The output is a learned function f(x) → ŷ plus a threshold or decision rule that turns ŷ into an action.",
          "ML is the right tool when rules are hard to write, tolerate being occasionally wrong, and when enough representative data exists.",
          "Every ML system inherits the biases, gaps, and staleness of the data it learned from - a rule engine does not.",
        ],
        interviewPrompt:
          "A team wants ML for 'flag transactions over $10,000 from new accounts'. Explain why a rule beats a model here, and what would change your answer.",
        code: "rules: human writes f    |    ML: data determines f",
      },
      {
        id: "learning-paradigms",
        title: "Supervised, unsupervised, and self-supervised learning",
        summary:
          "The paradigm is decided by what supervision signal exists in your data, not by which algorithm you prefer.",
        keyPoints: [
          "Supervised learning has (x, y) pairs and optimizes predictions against known targets.",
          "Unsupervised learning has only x and looks for structure: clusters, density, low-dimensional manifolds.",
          "Self-supervised learning builds targets from the data itself (mask a word, hide a column) and is how most pretraining works.",
          "Semi-supervised and weak supervision sit in between: a small labelled set plus a large unlabelled one, or noisy programmatic labels.",
        ],
        interviewPrompt:
          "You have 10 million user sessions and 2,000 human-reviewed labels. Which paradigms are actually available to you, and in what order would you use them?",
        code: "supervised: (x, y)   unsupervised: (x)   self-supervised: (x, y=g(x))",
      },
      {
        id: "task-types",
        title: "Regression, classification, ranking, and clustering",
        summary:
          "The task type is a commitment about the shape of the output and therefore about the loss, the metric, and the decision the system makes.",
        keyPoints: [
          "Regression predicts a continuous value; classification predicts one of C classes; ranking predicts an ordering over candidates.",
          "Binary, multiclass, and multilabel are three different problems - multilabel allows several positives per example and uses per-label sigmoids.",
          "Ranking cares only about relative order, so a model with badly calibrated scores can still be excellent at it.",
          "Clustering has no target at all; its 'correctness' is defined by the downstream use, not by a held-out label.",
        ],
        interviewPrompt:
          "'Predict how likely a user is to churn' - argue for framing it as binary classification, as regression on time-to-churn, and as ranking, then pick one.",
        code: "regression: ŷ ∈ ℝ   classification: ŷ ∈ {1..C}   ranking: order over items",
      },
      {
        id: "features-and-labels",
        title: "Features, labels, and a training example",
        summary:
          "One row of training data is a snapshot of what the model will know at prediction time, paired with what actually happened afterwards.",
        keyPoints: [
          "A feature vector x is the information available *before* the outcome; the label y is the outcome you want to predict.",
          "The design matrix X is [n_samples, n_features] - state the shape and the unit of a row (per user, per session, per item pair).",
          "A label needs an operational definition: 'churned' must specify a window, an event, and how it is observed.",
          "If a feature could only be computed after the label is known, it is leakage, not a feature.",
        ],
        interviewPrompt:
          "Define one training row for a food-delivery ETA model: what is the unit, what is in x, what is y, and when does y become observable?",
        code: "X.shape == (n_samples, n_features);  y.shape == (n_samples,)",
      },
      {
        id: "parameters-vs-hyperparameters",
        title: "Parameters, hyperparameters, and capacity",
        summary:
          "Parameters are fitted from the training data; hyperparameters are chosen by you and judged on validation data.",
        keyPoints: [
          "Weights and split thresholds are parameters; tree depth, k in k-NN, C in an SVM, and the regularization strength are hyperparameters.",
          "Capacity is how rich a family of functions the model can express - more capacity fits more, including noise.",
          "Hyperparameters are what you use to trade capacity against generalization, which is why they are tuned on validation data.",
          "Anything tuned by looking at a dataset has 'used up' that dataset - which is exactly why the test set stays untouched.",
        ],
        interviewPrompt:
          "Is the number of clusters k in k-means a parameter or a hyperparameter, and how does that change how you would pick it?",
        code: "model = RandomForestClassifier(max_depth=8)  # hyperparameter\nmodel.fit(X, y)                             # parameters",
      },
      {
        id: "train-val-test",
        title: "Train, validation, and test splits",
        summary:
          "Three splits exist to answer three different questions: how to fit, which model to choose, and how well the chosen model will do.",
        keyPoints: [
          "Train fits parameters, validation compares candidates and tunes hyperparameters, test estimates generalization once.",
          "Every peek at the test set leaks a little information; repeated peeking turns it into a second validation set.",
          "Split by the unit that must not be shared: by user, by account, by patient - grouped rows in two splits inflate your score.",
          "If the data has time in it, split chronologically; a random split lets the model train on the future.",
        ],
        interviewPrompt:
          "Your validation score keeps improving across 200 experiments but the test score does not. What happened, and what would you do differently?",
        code: "train -> fit  |  validation -> choose  |  test -> report (once)",
      },
      {
        id: "baselines",
        title: "Baselines and when not to use ML",
        summary:
          "A baseline turns 'the model gets 87%' into a statement that means something, and often shows the model is not needed at all.",
        keyPoints: [
          "Always quote a trivial baseline: majority class, global mean, last-value-carried-forward, or the existing business rule.",
          "A simple model (logistic regression, gradient-boosted trees) is the second baseline, and often the final model.",
          "The gap between baseline and model is the value of the ML; the absolute number alone is meaningless.",
          "If the rule-based baseline is within noise of the model, ship the rule - it is cheaper to run, explain, and debug.",
        ],
        interviewPrompt:
          "Your fraud model has 99.2% accuracy. What baseline do you compute first, and what does it likely tell you?",
        code: "DummyClassifier(strategy=\"most_frequent\").fit(X, y).score(X_test, y_test)",
      },
    ],
    quizQuestionCount: 10,
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
          "Cleaning is not a chore before the modelling; how you handle a missing value is itself a modelling decision.",
        keyPoints: [
          "Ask why a value is missing: missing at random, or missing because of the outcome (which is signal, and sometimes leakage).",
          "Imputation choices - mean/median, a sentinel, a model-based fill - must be fitted on train only and applied to validation and test.",
          "Add an 'is_missing' indicator when missingness itself is predictive; tree models can often handle NaNs natively.",
          "An outlier can be a data error, a heavy tail, or the exact event you are trying to predict - never delete it reflexively.",
        ],
        interviewPrompt:
          "Income is missing for 30% of users. Walk through how you decide between dropping the column, imputing, and treating missingness as a feature.",
        code: "SimpleImputer(strategy=\"median\").fit(X_train)  # fit on train only",
      },
      {
        id: "feature-scaling",
        title: "Feature scaling and normalization",
        summary:
          "Scaling matters for models that compare distances or penalize coefficient size, and is irrelevant for models that split on thresholds.",
        keyPoints: [
          "Standardization gives zero mean and unit variance; min-max squashes into a fixed range; robust scaling uses the median and IQR.",
          "Distance-based models (k-NN, k-means, SVM with RBF), gradient descent, and regularized linear models need scaling.",
          "Trees and tree ensembles are invariant to monotone rescaling of a feature - it does not change the split ordering.",
          "Fit the scaler on the training split and reuse its statistics everywhere else, or you leak test information into training.",
        ],
        interviewPrompt:
          "Why does standardizing features change an L2-regularized logistic regression's coefficients but not a decision tree's splits?",
        code: "Pipeline([(\"scale\", StandardScaler()), (\"clf\", LogisticRegression())])",
      },
      {
        id: "categorical-encoding",
        title: "Encoding categorical features",
        summary:
          "A categorical column has to become numbers, and the encoding you pick decides what the model is allowed to learn about it.",
        keyPoints: [
          "One-hot is the safe default for low cardinality; it assumes no ordering and costs one column per level.",
          "Ordinal/label encoding is correct only when the levels genuinely have an order (small < medium < large).",
          "Target (mean) encoding is compact and powerful for high cardinality, but leaks unless computed out-of-fold.",
          "Hashing bounds the dimensionality at the cost of collisions; learned embeddings are the dense-vector version used at scale.",
        ],
        interviewPrompt:
          "You have a zip-code feature with 40,000 levels. Compare one-hot, target encoding, and hashing for a gradient-boosted model.",
        code: "OneHotEncoder(handle_unknown=\"ignore\")  # unseen level at serve time",
      },
      {
        id: "feature-engineering",
        title: "Feature engineering",
        summary:
          "Feature engineering is how domain knowledge enters the model: the right transform can do more than a larger model.",
        keyPoints: [
          "Ratios, rates, differences, and time-window aggregates usually generalize better than raw counts.",
          "Log or Box-Cox transforms tame skewed, long-tailed numerics; binning buys robustness and loses resolution.",
          "Explicit interaction and cross features give linear models the nonlinearity that trees discover by themselves.",
          "Time features (hour-of-day, day-of-week) are cyclic - encode them with sine/cosine rather than as a raw integer.",
        ],
        interviewPrompt:
          "Give three engineered features for a ride-hailing ETA model and say which model family would benefit most from each.",
        code: "df[\"spend_per_order\"] = df[\"spend_30d\"] / df[\"orders_30d\"].clip(lower=1)",
      },
      {
        id: "dimensionality-reduction",
        title: "Dimensionality reduction and PCA",
        summary:
          "In high dimensions, distances flatten and data becomes sparse; reduction trades a little information for stability and speed.",
        keyPoints: [
          "The curse of dimensionality: the number of examples needed to cover a space grows exponentially with the number of features.",
          "PCA projects onto the orthogonal directions of maximum variance; components are ordered by explained variance ratio.",
          "PCA needs scaled inputs, is linear, and produces components that are usually not interpretable as business quantities.",
          "t-SNE and UMAP are for visualization, not for producing features - their distances are not globally meaningful.",
        ],
        interviewPrompt:
          "When would you prefer feature selection over PCA, even though PCA keeps more of the variance?",
        code: "PCA(n_components=0.95).fit(X_scaled)  # keep 95% of variance",
      },
      {
        id: "leakage",
        title: "Data leakage",
        summary:
          "Leakage is information in training that will not exist at prediction time; it produces excellent offline numbers and a useless model.",
        keyPoints: [
          "Target leakage: a feature is a consequence of the label (a 'fraud_investigation_opened' flag when predicting fraud).",
          "Preprocessing leakage: scaling, imputing, or selecting features using statistics computed over the full dataset before splitting.",
          "Temporal leakage: any feature aggregated over a window that extends past the prediction timestamp.",
          "Group leakage: the same user, device, or image appearing in both train and test through a naive random split.",
        ],
        interviewPrompt:
          "A model jumps from 0.82 to 0.99 AUC after a new feature is added. What is your first hypothesis, and how do you test it?",
        code: "for feature in X: assert available_at(prediction_time, feature)",
      },
    ],
    quizQuestionCount: 10,
  },
  {
    id: "supervised-algorithms",
    number: "3",
    title: "Core supervised algorithms",
    description: "The eight models you are expected to explain, compare, and justify from first principles.",
    color: "#FBBC04",
    icon: "LineChart",
    topics: [
      {
        id: "linear-regression",
        title: "Linear regression",
        summary:
          "Linear regression fits a weighted sum of features to a continuous target by minimizing squared error.",
        keyPoints: [
          "The model is ŷ = wᵀx + b; each coefficient is the expected change in y per unit change in that feature, holding others fixed.",
          "Least squares has a closed-form solution, but gradient descent is used when n or d is large or XᵀX is ill-conditioned.",
          "Assumptions worth naming: linearity, independent errors, constant variance, and no perfect multicollinearity.",
          "Correlated features make individual coefficients unstable even when predictions stay accurate.",
        ],
        interviewPrompt:
          "Your coefficients flip sign when you add a highly correlated feature. Explain why, and what you would do about it.",
        code: "w = np.linalg.pinv(X.T @ X) @ X.T @ y  # normal equation",
      },
      {
        id: "logistic-regression",
        title: "Logistic regression",
        summary:
          "Logistic regression is a linear model of the log-odds, squashed through a sigmoid to produce a calibrated probability.",
        keyPoints: [
          "p = σ(wᵀx + b); the decision boundary is linear in feature space even though p is not.",
          "It is trained with log loss (cross-entropy), which is convex - so there is a single global optimum.",
          "A coefficient is a change in log-odds; exponentiating it gives an odds ratio, which is why it is the default in regulated settings.",
          "It outputs well-calibrated probabilities out of the box, which many stronger models do not.",
        ],
        interviewPrompt:
          "Why does logistic regression use log loss instead of squared error, and what goes wrong if you use squared error anyway?",
        code: "LogisticRegression(C=1.0).fit(X_train, y_train).predict_proba(X_test)",
      },
      {
        id: "knn",
        title: "k-Nearest Neighbors",
        summary:
          "k-NN makes no model at all: it stores the training set and predicts by majority vote or average among the k closest examples.",
        keyPoints: [
          "Training is free; inference costs a search over the training set, which is the opposite trade-off from most models.",
          "Small k means low bias and high variance (noisy boundaries); large k smooths the boundary toward the majority class.",
          "It is entirely dependent on the distance metric, so scaling and irrelevant features hurt it badly.",
          "It degrades in high dimensions, where all points become roughly equidistant.",
        ],
        interviewPrompt:
          "k-NN works well in your notebook but is impossible to serve at 10k QPS. What exactly is expensive, and what are your options?",
        code: "KNeighborsClassifier(n_neighbors=15, weights=\"distance\")",
      },
      {
        id: "naive-bayes",
        title: "Naive Bayes",
        summary:
          "Naive Bayes applies Bayes' rule with the deliberately wrong assumption that features are conditionally independent given the class.",
        keyPoints: [
          "P(y|x) ∝ P(y)·∏ᵢ P(xᵢ|y) - the product is what makes it 'naive' and also what makes it fast.",
          "Multinomial NB suits word counts, Bernoulli NB binary presence, Gaussian NB continuous features.",
          "Laplace (add-one) smoothing prevents a single unseen feature value from zeroing out the entire posterior.",
          "The independence assumption makes its probabilities badly calibrated, but the argmax is often still a decent classifier.",
        ],
        interviewPrompt:
          "Naive Bayes outputs 0.9999 for most spam emails. Is it that confident? Explain what the probability actually means here.",
        code: "MultinomialNB(alpha=1.0).fit(X_counts, y)  # alpha = smoothing",
      },
      {
        id: "svm",
        title: "Support Vector Machines",
        summary:
          "An SVM finds the boundary with the largest margin to the nearest examples, and the kernel trick lets it do that in a richer space.",
        keyPoints: [
          "Only the support vectors - the points on or inside the margin - determine the boundary.",
          "The soft-margin parameter C trades margin width against training violations: small C means a wider, more regularized margin.",
          "A kernel computes inner products in a higher-dimensional space without ever building it; RBF is the usual nonlinear default.",
          "SVMs scale poorly past a few hundred thousand rows and produce scores, not probabilities, without extra calibration.",
        ],
        interviewPrompt:
          "Explain the margin and the role of C to someone who knows logistic regression but has never seen an SVM.",
        code: "SVC(kernel=\"rbf\", C=1.0, gamma=\"scale\")",
      },
      {
        id: "decision-trees",
        title: "Decision trees",
        summary:
          "A tree recursively splits the feature space by asking the single question that most reduces impurity in the resulting groups.",
        keyPoints: [
          "Split quality is measured by Gini impurity or entropy for classification, and by variance reduction for regression.",
          "Trees capture nonlinearity and interactions for free, need no scaling, and handle mixed feature types.",
          "An unconstrained tree will drive training error to zero and generalize poorly - depth, min samples per leaf, and pruning control this.",
          "Small changes in the data can change the top split and therefore the whole tree, which is high variance.",
        ],
        interviewPrompt:
          "Why does a single deep tree overfit so reliably, and which hyperparameter would you reach for first?",
        code: "DecisionTreeClassifier(max_depth=6, min_samples_leaf=50)",
      },
      {
        id: "random-forests",
        title: "Bagging and random forests",
        summary:
          "Bagging averages many high-variance models trained on bootstrap samples; a random forest adds feature subsampling to decorrelate them.",
        keyPoints: [
          "Averaging reduces variance only to the extent the models make *different* errors - decorrelation is the whole point.",
          "Each tree sees a bootstrap sample of rows and a random subset of features at each split.",
          "Out-of-bag examples give a free validation estimate without a separate holdout.",
          "Forests are robust, parallel, and hard to break, but larger and slower to serve than one tree, and less accurate than good boosting on tabular data.",
        ],
        interviewPrompt:
          "If bagging reduces variance, why does a random forest also subsample features at each split?",
        code: "RandomForestClassifier(n_estimators=500, max_features=\"sqrt\", oob_score=True)",
      },
      {
        id: "gradient-boosting",
        title: "Boosting and gradient-boosted trees",
        summary:
          "Boosting builds shallow trees sequentially, each one fitting the errors the current ensemble still makes.",
        keyPoints: [
          "Each new tree fits the negative gradient of the loss (the residual for squared error), scaled by a learning rate.",
          "Learning rate and number of trees trade off directly: lower rate plus more trees usually generalizes better.",
          "Boosting reduces bias by adding capacity, where bagging reduces variance by averaging - opposite mechanisms.",
          "It is the strongest default for tabular data (XGBoost, LightGBM, CatBoost) but is sequential, tuning-sensitive, and can overfit noisy labels.",
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
    description: "How a model is fitted, why it fails to generalize, and the evidence that tells you which.",
    color: "#34A853",
    icon: "TrendingDown",
    topics: [
      {
        id: "loss-functions",
        title: "Loss functions for classical models",
        summary:
          "The loss is the objective the optimizer minimizes, and every loss encodes an assumption about how errors should be punished.",
        keyPoints: [
          "Squared error assumes Gaussian noise and punishes large errors quadratically; absolute error is robust but less smooth.",
          "Log loss (cross-entropy) is the maximum-likelihood objective for probabilistic classification.",
          "Hinge loss cares only about the margin and ignores examples that are already confidently correct.",
          "Loss is what you optimize; the metric is what you are judged on - they are allowed to differ, and usually do.",
        ],
        interviewPrompt:
          "Why can't you just train directly on F1 score, and what do you do instead when F1 is the business metric?",
        code: "log_loss = -(y*np.log(p) + (1-y)*np.log(1-p)).mean()",
      },
      {
        id: "optimization",
        title: "Optimization: closed form, gradient descent, SGD",
        summary:
          "Some classical models have an exact solution; the rest are fitted by iteratively stepping downhill on the loss surface.",
        keyPoints: [
          "The normal equation solves least squares exactly but costs O(d³) and needs XᵀX to be invertible.",
          "Batch gradient descent uses all data per step, SGD one example, mini-batch a compromise - the usual choice.",
          "The learning rate is the single most important knob: too high diverges, too low crawls into a plateau.",
          "Convex problems (linear, logistic, linear SVM) have one global optimum, so initialization does not matter.",
        ],
        interviewPrompt:
          "When would you choose SGD over the closed-form solution for linear regression, even though the closed form is exact?",
        code: "w -= lr * grad(loss, w)  # one step downhill",
      },
      {
        id: "bias-variance",
        title: "Bias-variance tradeoff",
        summary:
          "Expected error decomposes into bias from wrong assumptions, variance from sensitivity to the sample, and irreducible noise.",
        keyPoints: [
          "High bias means systematic error - the model cannot represent the pattern; it underfits.",
          "High variance means the fitted function changes a lot with a different training sample; it overfits.",
          "Capacity, regularization, and data volume are the three levers that move you along the tradeoff.",
          "Irreducible noise sets a ceiling: no model can beat the ambiguity in the labels themselves.",
        ],
        interviewPrompt:
          "You are at 62% train and 61% validation accuracy. Is more data the right next move? Justify from the decomposition.",
        code: "error = bias² + variance + irreducible_noise",
      },
      {
        id: "overfitting-diagnosis",
        title: "Diagnosing overfitting and underfitting",
        summary:
          "The gap between training and validation performance - and its shape over time - tells you which failure mode you are in.",
        keyPoints: [
          "Train bad and validation bad means underfitting or a broken pipeline; train great and validation bad means poor generalization.",
          "A learning curve over training-set size shows whether more data would help at all.",
          "A large gap is not automatically overfitting - check leakage, distribution shift, a tiny validation set, and label noise first.",
          "Sanity check: a model that cannot overfit 100 examples has a bug, not a capacity problem.",
        ],
        interviewPrompt:
          "Validation loss improves for 20 iterations and then steadily worsens while train loss keeps falling. Name the effect and two fixes.",
        code: "plot(train_scores, val_scores, x=train_size)  # learning curve",
      },
      {
        id: "regularization",
        title: "Regularization: L1, L2, and elastic net",
        summary:
          "Regularization adds a penalty on model complexity, deliberately raising bias to buy a larger reduction in variance.",
        keyPoints: [
          "L2 (ridge) shrinks coefficients smoothly toward zero and handles correlated features by sharing weight between them.",
          "L1 (lasso) drives some coefficients exactly to zero, so it performs feature selection as a side effect.",
          "Elastic net mixes both; the strength (alpha, or C = 1/alpha in scikit-learn) is a hyperparameter tuned on validation data.",
          "For trees, regularization looks different: depth limits, minimum leaf size, subsampling, and shrinkage.",
        ],
        interviewPrompt:
          "You have 5,000 features and 800 rows. Which penalty do you reach for and why?",
        code: "Ridge(alpha=1.0)  |  Lasso(alpha=0.01)  |  ElasticNet(l1_ratio=0.5)",
      },
      {
        id: "cross-validation",
        title: "Cross-validation",
        summary:
          "Cross-validation reuses limited data by rotating which fold is held out, trading compute for a lower-variance estimate.",
        keyPoints: [
          "k-fold splits into k parts, trains k times, and averages; k = 5 or 10 is the usual compromise.",
          "Stratified folds preserve class balance and are the default for classification, especially when imbalanced.",
          "Grouped folds keep all rows of a user/patient/device in one fold; time-series folds only ever train on the past.",
          "Everything fitted - scalers, imputers, encoders, feature selection - must live inside the fold, which is what a Pipeline guarantees.",
        ],
        interviewPrompt:
          "Explain why selecting features on the full dataset before cross-validation inflates your CV score.",
        code: "cross_val_score(Pipeline([...]), X, y, cv=StratifiedKFold(5))",
      },
      {
        id: "hyperparameter-search",
        title: "Hyperparameter search",
        summary:
          "Search is a budgeted experiment: explore the few hyperparameters that matter, score them on validation data, and keep the test set out of it.",
        keyPoints: [
          "Random search beats grid search at equal budget because only a few hyperparameters actually matter.",
          "Sample scale-free parameters (learning rate, regularization strength) log-uniformly, not uniformly.",
          "Bayesian optimization and successive halving pay off when each evaluation is expensive.",
          "Nested CV (inner loop tunes, outer loop evaluates) is the honest way to report performance after heavy tuning.",
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
    title: "Evaluation",
    description: "Turning a model score into a defensible claim about how the system will behave.",
    color: "#A78BFA",
    icon: "ListChecks",
    topics: [
      {
        id: "confusion-matrix",
        title: "Confusion matrix, precision, and recall",
        summary:
          "Every classification metric is a different summary of the same four counts, chosen to match which mistake is expensive.",
        keyPoints: [
          "Precision = TP/(TP+FP) answers 'when we flagged it, were we right'; recall = TP/(TP+FN) answers 'of the real positives, how many did we catch'.",
          "F1 is the harmonic mean, which punishes a lopsided pair more than an arithmetic mean would.",
          "Accuracy is only informative when the classes are roughly balanced and both errors cost the same.",
          "Macro averaging treats every class equally; micro averaging is dominated by the frequent classes.",
        ],
        interviewPrompt:
          "Cancer screening versus spam filtering: which metric leads in each case, and what is the cost of getting that choice backwards?",
        code: "precision = tp / (tp + fp);  recall = tp / (tp + fn)",
      },
      {
        id: "roc-pr-curves",
        title: "ROC-AUC, PR-AUC, and thresholds",
        summary:
          "A model outputs a score; the threshold turns it into a decision, and the curves show every threshold at once.",
        keyPoints: [
          "ROC plots TPR against FPR; AUC is the probability a random positive scores above a random negative.",
          "Under heavy imbalance ROC-AUC looks flattering because FPR has a huge denominator - PR-AUC is the honest curve.",
          "Threshold choice is a business decision: pick the operating point that matches the true cost of each error.",
          "Re-validate the threshold after every retrain; the optimal operating point drifts with the data distribution.",
        ],
        interviewPrompt:
          "Your model has 0.95 ROC-AUC on a 0.3%-positive dataset, and product says it is useless in practice. Explain both facts.",
        code: "precision_recall_curve(y_true, y_score)  # pick a point, not a curve",
      },
      {
        id: "regression-metrics",
        title: "Regression metrics",
        summary:
          "Regression metrics differ mainly in how they punish large errors and whether they are expressed in the target's units.",
        keyPoints: [
          "MAE is in target units and robust; MSE punishes large errors quadratically; RMSE restores the units of MSE.",
          "R² is the fraction of variance explained relative to predicting the mean - it can be negative for a bad model.",
          "MAPE is scale-free and intuitive but explodes near zero and is asymmetric about over- and under-prediction.",
          "For skewed targets, evaluating in log space (RMSLE) matches how the error is actually felt.",
        ],
        interviewPrompt:
          "A delivery-ETA model has RMSE 6 minutes and MAE 3 minutes. What does that gap tell you about the error distribution?",
        code: "rmse = np.sqrt(((y - yhat) ** 2).mean())",
      },
      {
        id: "calibration",
        title: "Probability calibration",
        summary:
          "A calibrated model's 0.7 means the event happens 70% of the time - required whenever the probability itself is consumed downstream.",
        keyPoints: [
          "Ranking quality and calibration are independent: a model can rank perfectly and still be systematically over-confident.",
          "Diagnose with a reliability diagram (predicted probability vs observed frequency) and summarize with Brier score or ECE.",
          "Platt scaling fits a sigmoid on a held-out set; isotonic regression is nonparametric and needs more data.",
          "Resampling and class weighting distort probabilities, so recalibrate on the original, untouched distribution.",
        ],
        interviewPrompt:
          "Your model's output is multiplied by transaction value to estimate expected loss. Why does calibration now matter more than AUC?",
        code: "CalibratedClassifierCV(model, method=\"isotonic\", cv=\"prefit\")",
      },
      {
        id: "class-imbalance",
        title: "Class imbalance",
        summary:
          "When positives are rare, accuracy stops being informative and the training procedure itself needs adjusting.",
        keyPoints: [
          "Always report a trivial-majority baseline alongside the model, and prefer PR-AUC or recall-at-fixed-precision.",
          "Class weights penalize minority mistakes without changing the data; resampling changes what the model sees.",
          "Oversampling (including SMOTE) risks overfitting duplicated points; undersampling throws away information.",
          "Whatever you do to training, evaluate on the original distribution - and recalibrate if the probabilities are consumed directly.",
        ],
        interviewPrompt:
          "You oversample positives 50x in training. What happens to the predicted probabilities, and how do you fix them at serving time?",
        code: "LogisticRegression(class_weight=\"balanced\")",
      },
      {
        id: "model-comparison",
        title: "Comparing models honestly",
        summary:
          "A single validation number is a noisy sample; declaring a winner requires knowing how much that number moves by chance.",
        keyPoints: [
          "Report the mean and spread across CV folds or seeds, not one score - a 0.3% difference is usually noise.",
          "Compare on identical folds and identical preprocessing, or you are measuring the split, not the model.",
          "Testing many variants inflates the best observed score; that is the multiple-comparisons problem, and nested CV or a clean holdout is the answer.",
          "Offline wins still have to be confirmed online: an A/B test measures the decision, not just the prediction.",
        ],
        interviewPrompt:
          "Model B beats model A by 0.4% AUC on your validation set. Would you ship it? What evidence would change your mind?",
        code: "scores = cross_val_score(model, X, y, cv=10); scores.mean(), scores.std()",
      },
      {
        id: "error-analysis",
        title: "Error analysis and slice-based evaluation",
        summary:
          "Aggregate metrics hide the failures that matter; error analysis groups mistakes into causes you can actually act on.",
        keyPoints: [
          "Read a sample of false positives and false negatives by hand before touching the model.",
          "Slice by segment, geography, time, input length, and confidence - an 88% average can be 60% on your biggest customer.",
          "Separate label errors, missing coverage, preprocessing bugs, genuine ambiguity, and real model limitations.",
          "Prioritize by frequency × fixability × impact, not by which fix is most interesting.",
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
          "k-means alternates assigning points to the nearest centroid and recomputing centroids, minimizing within-cluster variance.",
        keyPoints: [
          "It converges to a local optimum, so results depend on initialization - k-means++ and multiple restarts are standard.",
          "It assumes roughly spherical, similarly sized clusters and uses Euclidean distance, so scaling is mandatory.",
          "Cost is O(n·k·d) per iteration, which makes it the practical default at large n.",
          "Outliers pull centroids; k-medoids or a robust alternative is safer when extreme points are common.",
        ],
        interviewPrompt:
          "Your k-means clusters split one dense blob in half and merge two others. What assumption is being violated?",
        code: "KMeans(n_clusters=8, init=\"k-means++\", n_init=10).fit(X_scaled)",
      },
      {
        id: "hierarchical-dbscan",
        title: "Hierarchical clustering and DBSCAN",
        summary:
          "Two alternatives to k-means: one builds a tree of nested clusters, the other grows clusters from regions of high density.",
        keyPoints: [
          "Agglomerative clustering merges the closest pair repeatedly; the linkage rule (single, complete, average, Ward) sets the cluster shape.",
          "A dendrogram lets you choose the number of clusters after the fact, but the algorithm is O(n²) or worse.",
          "DBSCAN needs eps and min_samples instead of k, finds arbitrarily shaped clusters, and labels sparse points as noise.",
          "DBSCAN struggles when cluster densities differ a lot; HDBSCAN relaxes the single global eps.",
        ],
        interviewPrompt:
          "You have GPS pickup points and need clusters of unknown count plus an explicit notion of 'not in any cluster'. Which algorithm, and why?",
        code: "DBSCAN(eps=0.3, min_samples=10).fit(X_scaled)  # label -1 = noise",
      },
      {
        id: "gaussian-mixtures",
        title: "Gaussian mixture models",
        summary:
          "A GMM models the data as a weighted sum of Gaussians and assigns soft, probabilistic cluster memberships.",
        keyPoints: [
          "Fitted with expectation-maximization: E-step computes responsibilities, M-step re-estimates means, covariances, and weights.",
          "The covariance type controls cluster shape - spherical, diagonal, or full - and full covariance costs many more parameters.",
          "k-means is the hard-assignment, equal-spherical-covariance special case of a GMM.",
          "Because it is a density model, BIC/AIC give a principled way to choose the number of components.",
        ],
        interviewPrompt:
          "When is a soft assignment more useful than a hard one, and what does a responsibility of 0.5 actually tell you?",
        code: "GaussianMixture(n_components=5, covariance_type=\"full\").fit(X)",
      },
      {
        id: "clustering-evaluation",
        title: "Choosing k and evaluating clusters",
        summary:
          "Without labels there is no accuracy, so cluster quality is judged by internal geometry, stability, and usefulness downstream.",
        keyPoints: [
          "The elbow method plots inertia against k; it is a heuristic, and the elbow is often ambiguous.",
          "Silhouette compares within-cluster tightness to nearest-cluster separation, per point, in [-1, 1].",
          "If ground-truth groups exist, adjusted Rand index and normalized mutual information compare partitions properly.",
          "The strongest evidence is stability under resampling plus a human reading of the resulting segments.",
        ],
        interviewPrompt:
          "Marketing asks for 'the right number of customer segments'. How do you answer without a label to validate against?",
        code: "silhouette_score(X, labels)  # higher is better, 0 means overlapping",
      },
      {
        id: "anomaly-detection",
        title: "Anomaly detection",
        summary:
          "Anomaly detection asks whether a point looks like the data the model has seen, rather than which class it belongs to.",
        keyPoints: [
          "Use it when positives are too rare, too varied, or too unlabelled for supervised learning to work.",
          "Isolation Forest isolates points with random splits; one-class SVM learns a boundary; autoencoder reconstruction error flags unusual inputs.",
          "The contamination/threshold choice is what turns a score into an alert, and it sets your false-alarm rate.",
          "Novelty (unseen at training) and outlier (present but rare) detection are different setups with different validation strategies.",
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
    description: "The loop from business question to a deployed model that stays correct.",
    color: "#F97316",
    icon: "Wrench",
    topics: [
      {
        id: "ml-workflow",
        title: "The applied ML workflow",
        summary:
          "An applied ML project is a loop - frame, collect, split, baseline, model, evaluate, deploy, monitor - and every stage can send you backwards.",
        keyPoints: [
          "Start from the decision the system will make; the metric and the label definition follow from it.",
          "Build the leakage-free split and the trivial baseline before the first model, not after.",
          "Iterate with error analysis rather than architecture shopping - the next fix is usually in the data.",
          "The project is not done at the offline metric; deployment, monitoring, and retraining are part of the same loop.",
        ],
        interviewPrompt:
          "Walk end-to-end through a customer-churn project, naming what you would do first and what you would deliberately postpone.",
        code: "frame -> data -> split -> baseline -> model -> evaluate -> deploy -> monitor",
      },
      {
        id: "model-choice",
        title: "Choosing a model under real constraints",
        summary:
          "The best model is the one that meets the accuracy, latency, data, and explainability constraints at once - rarely the most powerful one.",
        keyPoints: [
          "Tabular data with under a few million rows: gradient-boosted trees are the default; deep learning rarely wins.",
          "Text, images, audio, and sequences: pretrained deep models, because the inductive bias and the transfer both matter.",
          "Small data, strict explainability, or regulated decisions push you toward linear/logistic models and shallow trees.",
          "Latency, memory, retraining cost, and who has to debug it at 3am are legitimate model-selection criteria.",
        ],
        interviewPrompt:
          "50k rows, 40 tabular features, a 20ms latency budget, and a regulator who can demand an explanation. What do you build?",
        code: "candidates = [logistic, random_forest, gbdt];  pick = meets_constraints(...)",
      },
      {
        id: "interpretability",
        title: "Interpretability and feature importance",
        summary:
          "Interpretability answers 'why this prediction' - needed for debugging, for trust, and sometimes by law.",
        keyPoints: [
          "Intrinsically interpretable models (linear coefficients, shallow trees) are different from post-hoc explanations of a black box.",
          "Impurity-based importance in trees is biased toward high-cardinality features; permutation importance is the safer global measure.",
          "SHAP gives additive per-prediction attributions with consistency guarantees; partial dependence and ICE show effect shape.",
          "All of these are correlational: an important feature is not a cause, and saying so is part of a good answer.",
        ],
        interviewPrompt:
          "A loan applicant asks why they were declined. What do you actually show them, and what are the limits of that explanation?",
        code: "permutation_importance(model, X_val, y_val, n_repeats=10)",
      },
      {
        id: "deployment-basics",
        title: "Serving a model: batch, online, and train/serve skew",
        summary:
          "How predictions reach the product - precomputed or on demand - decides the latency budget and where features come from.",
        keyPoints: [
          "Batch scoring is cheap and simple but stale; online inference is fresh but adds a hard per-request latency budget.",
          "A common hybrid precomputes the expensive part offline and does something cheap at request time.",
          "Train/serve skew is the classic production bug: the same feature computed two different ways offline and online.",
          "Version the model, the features, and the preprocessing together, and keep a rollback path that does not require a retrain.",
        ],
        interviewPrompt:
          "Offline AUC is 0.89 but online performance looks far worse, with no code changes between them. What do you check first?",
        code: "assert train_feature(x) == serve_feature(x)  # the skew contract",
      },
      {
        id: "monitoring-and-retraining",
        title: "Monitoring, drift, and retraining",
        summary:
          "A deployed model silently decays as the world moves; monitoring exists to notice before the business does.",
        keyPoints: [
          "Monitor three layers: input distributions, prediction distributions, and - once labels arrive - actual quality.",
          "Covariate shift changes P(x), label shift changes P(y), concept drift changes P(y|x) - the third is the one retraining cannot always fix.",
          "Label delay decides how fast you can retrain and how long a regression can hide.",
          "Roll out with shadow traffic, then a small percentage, and re-tune the decision threshold after every retrain.",
        ],
        interviewPrompt:
          "Precision drops 8% over three months with no deploys. Walk through detection, diagnosis, and the decision to retrain.",
        code: "psi = population_stability_index(train_dist, live_dist)",
      },
      {
        id: "interview-playbook",
        title: "Answering a Basics-of-ML interview question",
        summary:
          "The graded skill is narrowing a vague prompt to one concept and explaining that concept clearly - not surveying everything you know.",
        keyPoints: [
          "Give a one-sentence definition, then ask a clarifying question that forces the interviewer to pick a direction.",
          "Once the key concept is identified, stop surveying alternatives and spend the remaining time explaining it well.",
          "Use a concrete example with real numbers, then name the tradeoff and when you would choose differently.",
          "Say what you would check in the data before you say what model you would build.",
        ],
        interviewPrompt:
          "'Tell me about overfitting.' Produce the first 30 seconds of your answer, including the question you ask back.",
        code: "define -> clarify -> commit to one concept -> example -> tradeoff",
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
