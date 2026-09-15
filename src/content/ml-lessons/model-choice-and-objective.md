## Model choice and training objective

Model choice is a means to an end, not the goal of the design. The training objective - the loss function - is what actually tells the model what "good" means, and it has to match the real decision the system will make with the model's output.

### Start from a baseline

Before justifying anything sophisticated, establish a simple, well-understood baseline: logistic regression or a gradient-boosted tree for tabular data, a simple heuristic or the current production system otherwise.

The baseline isn't a formality - it sets the bar the more complex model has to clear, and it's often shockingly close to a much fancier model's performance. If a deep neural network beats logistic regression by 0.3% AUC at 50x the training and serving cost, the honest answer in an interview is that the complexity probably isn't justified.

### The loss has to match the real cost structure

The single most common mistake in this stage: picking a loss function by default (cross-entropy for anything classification-shaped) without asking what the model's output actually needs to mean downstream.

- **Cross-entropy** assumes you need calibrated probabilities - the output should be usable as an actual probability (e.g. to compute expected value, or to set a threshold with a known false-positive rate).
- **A ranking loss** (pairwise or listwise) assumes only the *relative order* of predictions matters, not their absolute values - appropriate for search and feed ranking, where "item A above item B" is the only thing consumed downstream.
- **A regression loss** (MSE, MAE, quantile loss) should be chosen based on how outliers should be treated - MSE punishes large errors heavily, MAE treats all errors linearly, quantile loss lets you target a specific percentile (useful for delivery-time estimates where underestimating is worse than overestimating).

\[
\text{loss function} \neq \text{arbitrary choice - it encodes what "correct" means for this specific decision}
\]

### Trading off more than accuracy

Model choice is a multi-objective decision, and offline accuracy is only one axis:

| Axis | What to weigh |
|---|---|
| Interpretability | Can you explain a denied loan or a flagged transaction? Regulatory and trust requirements sometimes rule out black-box models entirely. |
| Training cost | Does the team have the infrastructure and iteration speed to retrain a large model on a useful cadence? |
| Inference latency | Does the model fit inside the serving budget (see the inference architecture lesson)? |
| Data volume | A high-capacity model with too little labeled data will overfit; a simpler model with strong inductive bias can outperform it in the low-data regime. |

### A model that wins offline can still be the wrong model

A model that improves offline loss by 2% but doubles p99 inference latency, or requires an order of magnitude more training compute than the team can support on a weekly retraining cadence, is not automatically the better choice. Say this explicitly in an interview - it signals that you're evaluating "best model" against the actual production constraints, not against a leaderboard.

### A worked example

For tabular fraud detection with roughly 50,000 labeled examples and heavy class imbalance:

- A gradient-boosted tree (e.g. XGBoost/LightGBM) is a strong default: it handles mixed feature types and missing values natively, trains fast, and is far less prone to overfitting than a deep network at this data volume.
- A deep neural network's main advantage - learning feature interactions and representations automatically from large amounts of raw data - is muted here because there isn't enough labeled data to earn that flexibility back, and hand-engineered features plus a tree-based model will likely both train faster and generalize better.
- The loss should be a class-weighted (or focal) cross-entropy, since the output needs to be a reasonably calibrated fraud probability that feeds into a threshold decision - not just a ranking of transactions by riskiness.

This is the pattern to reproduce in an interview: name the baseline, name the loss and justify it against what the output is used for, and only then argue for something more complex if the data and constraints actually support it.
