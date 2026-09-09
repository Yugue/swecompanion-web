## Part VI — Practical ML Reasoning  
### Topic 7: End-to-End ML System Reasoning

This is the final Part VI topic, and it ties everything together.

An interviewer may give you something vague like:

> “Design a machine-learning system that detects fraudulent transactions.”

They are usually not looking for one magic architecture. They want to see whether you can reason through the **entire ML lifecycle**:

```text
Problem definition
       ↓
Data + labels
       ↓
Baseline
       ↓
Model
       ↓
Training
       ↓
Offline evaluation
       ↓
Error analysis
       ↓
Deployment
       ↓
Monitoring
       ↓
Retraining
```

The key mental model is:

\[
\boxed{
\text{ML system} \neq \text{just the neural network}
}
\]

The model is only one component.

---

# 1. Start by defining the prediction problem

Before talking about architecture, clarify exactly what the model should predict.

Suppose the task is:

> Detect fraudulent credit-card transactions.

What is the output?

Perhaps:

\[
P(\text{fraud}\mid x)
\]

Then:

```text
transaction
     ↓
features
     ↓
model
     ↓
fraud probability
     ↓
decision threshold
     ↓
allow / block / review
```

Immediately ask:

- What counts as fraud?
- When must the prediction be made?
- How quickly do we need an answer?
- What happens after a prediction?

This determines the entire system.

---

# 2. Define the business objective

Accuracy is rarely the true objective.

Suppose:

```text
False negative:
fraud goes through
→ financial loss

False positive:
legitimate purchase blocked
→ bad user experience
```

Those costs aren't equal.

Maybe the requirement is:

> Catch at least 95% of fraud while keeping false-positive rate below 0.5%.

That gives you an actual optimization target.

So first establish:

\[
\boxed{\text{business objective} \rightarrow \text{ML metric}}
\]

not the other way around.

---

# 3. Determine where labels come from

Now ask:

> How do we know whether a transaction was actually fraudulent?

Potential labels might come from:

```text
user chargeback
bank investigation
manual review
account compromise report
```

This seems simple, but labels often arrive **later**.

Example:

```text
Transaction at day 0
      ↓
chargeback at day 30
      ↓
fraud label becomes available
```

That creates a **label delay**.

This matters because your newest production data may not yet have ground-truth labels.

---

# 4. Be careful about label leakage

Suppose you use this feature:

> `"transaction_was_chargebacked"`

to predict whether the transaction is fraud.

That would give amazing training performance.

But the feature only exists **after** fraud occurs.

At inference time:

```text
transaction occurs
        ↓
need prediction NOW
```

you don't know whether there will later be a chargeback.

That's data leakage.

A very useful interview question is:

> **Would this feature exist at the exact moment the prediction is made?**

If not, it usually cannot be used.

---

# 5. Build features from information available at inference time

For fraud detection, useful features might include:

```text
transaction amount
merchant
country
device
account age
transactions in past hour
average transaction amount
distance from previous transaction
```

Notice that some require historical aggregation:

```text
raw transactions
       ↓
feature pipeline
       ↓
"transactions in last hour"
"average spend last 30 days"
```

So a production ML system often needs more than just:

```python
model(x)
```

It needs reliable feature computation too.

---

# 6. Establish a simple baseline

Before building something complicated:

```text
heuristic
   ↓
logistic regression
   ↓
gradient-boosted tree
   ↓
complex neural model
```

For fraud, perhaps:

```text
if amount > $10,000
and new device
and unusual country
→ flag
```

Even this simple rule gives you a baseline.

Then:

> Does the machine-learning model actually improve on it?

Without a baseline, saying:

\[
AUC=0.92
\]

doesn't tell you whether that's good.

---

# 7. Split the data correctly

The split must reflect deployment.

For time-dependent problems, randomly mixing past and future data can be dangerous.

Imagine:

```text
January
February
March
April
May
```

If you randomly split transactions across all five months, the model may indirectly learn patterns from the future relative to validation examples.

A more realistic split might be:

```text
Train:
Jan ───────── Mar

Validation:
Apr

Test:
May
```

This simulates:

> train on the past → predict the future.

The general rule is:

\[
\boxed{\text{evaluation should mimic deployment}}
\]

---

# 8. Select the model based on the data

Now architecture becomes relevant.

Fraud features are mostly structured/tabular:

```text
amount
merchant
device
location
account statistics
```

A strong initial model might be a gradient-boosted tree.

If transaction sequence history becomes extremely important, perhaps:

```text
historical transactions
        ↓
sequence encoder
        ↓
current transaction features
        ↓
fraud score
```

could justify a Transformer or another sequence model.

The architecture should come **after understanding the task and data**.

---

# 9. Train and tune

Now use the concepts from earlier Part VI topics:

```text
training set
     ↓
learn parameters

validation set
     ↓
hyperparameter tuning
     ↓
model selection
```

You might tune:

- learning rate
- model capacity
- regularization
- tree depth
- decision threshold

depending on the model.

And keep the test set untouched.

---

# 10. Evaluate more than one number

Suppose:

\[
ROC\text{-AUC}=0.98
\]

That sounds excellent.

But production requires a particular operating point.

Maybe:

```text
threshold = 0.5

recall = 97%
false positive rate = 4%
```

and 4% false positives is completely unacceptable.

So evaluation needs to reflect the actual decision threshold and costs.

For fraud you might investigate:

\[
\text{precision},\quad
\text{recall},\quad
PR\text{-AUC}
\]

and metrics at specific operating points.

The key point:

> A globally strong ranking metric does not automatically imply the deployed threshold is good.

---

# 11. Error analysis tells you what to improve

Suppose the model misses 1,000 fraud cases.

Break them down:

```text
40% new accounts
25% international transactions
20% account takeover
10% unusual merchant category
 5% other
```

Now you have direction.

Maybe new accounts lack sufficient behavioral history.

Then:

> a larger model isn't necessarily the answer.

You may need better features or a dedicated model for new accounts.

This is why the loop is:

```text
Train
  ↓
Evaluate
  ↓
Analyze errors
  ↓
Fix dominant failure
  ↓
Retrain
```

---

# 12. Offline performance is not enough

Suppose validation results are great.

You deploy the model.

Now real traffic looks like:

```text
request
   ↓
feature service
   ↓
model service
   ↓
fraud probability
   ↓
policy
```

Problems can appear that offline evaluation never captured:

- feature computation is slow
- features differ between training and serving
- model latency is too high
- traffic distribution changed
- downstream system uses score incorrectly

So:

\[
\boxed{\text{offline model quality} \neq \text{production system quality}}
\]

---

# 13. Training-serving skew

This is an important practical failure mode.

Suppose training computes:

```python
avg_spend_7d = ...
```

using one implementation.

Production computes the same feature with different logic.

Training:

```text
7 calendar days
```

Serving:

```text
previous 168 hours
```

Subtle difference, but distributions can diverge.

Now the model receives a different feature definition than the one it learned from.

This is called **training-serving skew**.

A common solution is to reuse the same feature definitions/pipelines whenever possible.

---

# 14. Deploy carefully

You often shouldn't immediately send 100% of traffic to a new model.

A safer progression:

```text
offline evaluation
       ↓
shadow deployment
       ↓
small traffic %
       ↓
A/B test or canary
       ↓
increase traffic
       ↓
full rollout
```

### Shadow mode

New model sees real traffic but doesn't control decisions.

```text
production request
      │
      ├── old model → actual decision
      │
      └── new model → record prediction only
```

This allows you to inspect behavior safely.

---

# 15. Monitor the system after deployment

Deployment is not the end.

You need to monitor at least three broad layers.

### System metrics

```text
latency
error rate
requests/sec
GPU utilization
```

### Data metrics

```text
feature distributions
missing values
input distributions
```

### Model metrics

When labels become available:

```text
precision
recall
loss
fraud caught
false positives
```

Think of monitoring as:

```text
Infrastructure
     +
Data
     +
Model
```

A model can fail even while the server itself is perfectly healthy.

---

# 16. Detect distribution drift

Suppose training data has:

```text
5% cryptocurrency merchants
```

Six months later production has:

```text
30% cryptocurrency merchants
```

The input distribution changed.

This is **data drift**.

You might monitor feature distributions:

\[
P_{\text{train}}(X)
\]

versus:

\[
P_{\text{prod}}(X)
\]

Large changes don't automatically mean the model is wrong, but they are a warning signal.

---

# 17. Concept drift is different

Suppose fraudsters change behavior.

Previously:

```text
fraud → large overseas transactions
```

Now:

```text
fraud → many tiny domestic transactions
```

The relationship:

\[
P(Y\mid X)
\]

has changed.

That's **concept drift**.

Data can look superficially similar while the mapping from features to label changes.

Important distinction:

\[
\boxed{
\text{data drift: }P(X)\text{ changes}
}
\]

\[
\boxed{
\text{concept drift: }P(Y\mid X)\text{ changes}
}
\]

---

# 18. Retraining strategy

You need to decide:

> When should the model retrain?

Possibilities:

```text
every week
every month
when enough new labels arrive
when performance drops
when distribution changes significantly
```

This could be:

### Scheduled retraining

```text
every Sunday
     ↓
new data
     ↓
retrain
```

or event/performance-driven retraining.

But never automatically deploy a newly trained model simply because it is newer.

It still needs validation.

---

# 19. Model versioning and rollback

Production models should be versioned:

```text
fraud_model_v17
fraud_model_v18
fraud_model_v19
```

Suppose v19 suddenly doubles false positives.

You need:

```text
v19
 ↓
rollback
 ↓
v18
```

quickly.

So the ML system should track:

- model version
- training data version
- feature definitions
- hyperparameters
- evaluation metrics

Reproducibility is part of ML engineering.

---

# 20. Feedback loops can be dangerous

Here's a subtle problem.

Suppose the model blocks transactions it believes are fraud.

Then those transactions never complete.

Therefore you may never observe whether they would actually have become fraud.

```text
model says fraud
      ↓
block transaction
      ↓
no outcome
      ↓
missing label
```

The model influences the data that future versions train on.

This is a **feedback loop**.

Similar issues happen in:

- recommendations
- ranking
- advertising
- content moderation

For example:

```text
recommend item A
      ↓
users click A
      ↓
training data says users like A
      ↓
recommend A even more
```

This is why production ML data isn't always an unbiased sample of reality.

---

# 21. End-to-end example

Suppose Google asks:

> Design a model to predict whether a YouTube user will click a recommended video.

A strong reasoning flow might be:

```text
1. Define prediction
   P(click | user, video, context)

2. Define metric
   offline: log loss / ranking metric
   online: click-through rate, watch time, satisfaction

3. Get labels
   historical impressions + clicks

4. Avoid leakage
   only use information available before recommendation

5. Features
   user history
   video embedding
   context
   recency

6. Baseline
   popularity / logistic regression

7. Model
   embeddings + ranking network
   potentially sequence model for user history

8. Train
   historical examples

9. Validate
   realistic time-based split

10. Analyze errors/slices
    new users
    rare videos
    different regions

11. Deploy safely
    shadow / A-B test

12. Monitor
    latency
    distribution
    online metrics

13. Retrain
    new interactions

14. Version + rollback
```

That is end-to-end ML reasoning.

---

# 22. The interview framework to memorize

You don't need to memorize a huge system.

Remember this sequence:

```text
       WHAT?
        │
        ▼
Problem + metric
        │
        ▼
      DATA?
        │
        ▼
Labels + features + leakage
        │
        ▼
     MODEL?
        │
        ▼
Baseline → architecture
        │
        ▼
      GOOD?
        │
        ▼
Evaluation + error analysis
        │
        ▼
      SERVE?
        │
        ▼
Latency + deployment
        │
        ▼
     HEALTHY?
        │
        ▼
Monitoring + drift
        │
        ▼
      UPDATE?
        │
        ▼
Retraining + versioning
```

If you get stuck in an interview, move through these stages.

---

## Minimal code intuition

Production inference may ultimately look as simple as:

```python
score = model(features)
```

But that one line depends on an entire system:

```text
raw data
→ feature pipeline
→ versioned model
→ inference
→ decision
→ logs
→ labels
→ retraining
```

That's why designing an ML system is much more than choosing a neural network.

---

# The most important interview distinction

A normal software service can often be tested against relatively deterministic behavior:

```text
input → expected output
```

An ML system depends on:

```text
code
+
data
+
learned parameters
```

and production performance can degrade even if **no code changes at all**.

For example:

```text
same code
same model
different user behavior
        ↓
performance drops
```

That is one of the fundamental differences between ML engineering and ordinary software engineering.

---

## Part VI takeaway

For an open-ended ML question, don't immediately jump into:

> “I'd use a Transformer.”

Instead:

> First I'd define the prediction target and product metric, determine how labels and inference-time features are obtained, establish a simple baseline, choose an architecture that matches the data and constraints, train and validate on a representative split, perform error analysis, and then deploy incrementally. In production I'd monitor system health, feature distributions, and delayed model-quality metrics, detect drift, and retrain/version models with rollback capability.

That's the kind of structured answer that demonstrates **end-to-end ML judgment**.

### Part VI is now complete

You've covered:

1. Hyperparameter tuning
2. Model selection
3. Error analysis
4. Choosing an architecture
5. Training vs inference tradeoffs
6. Latency / memory / accuracy tradeoffs
7. **End-to-end ML system reasoning**

The natural next step is a **Part VI interview quiz**, because this section is much more about reasoning through scenarios than memorizing formulas.
