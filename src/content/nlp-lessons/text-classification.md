# Text classification, sentiment, and intent

## 1. Define the category’s meaning

**Text classification** predicts categories from a text input. **Sentiment analysis** classifies expressed attitude; **intent classification** predicts the requested action or communicative goal.

“The refund was handled brilliantly” mentions refunds with positive sentiment. Topic, sentiment, and intent are different labels even when their evidence overlaps.

## 2. Match the output structure

| Setup | Label contract | Suitable head |
|---|---|---|
| Binary | Spam or legitimate | One sigmoid score |
| Multiclass | Exactly one routing category | Softmax over categories |
| Multilabel | Several issues may apply | Separate sigmoid outputs |

A message mentioning billing and delivery needs a policy for mixed requests. No loss function can repair an undefined label contract.

## 3. Establish a credible comparison

Compare current rules, a TF-IDF linear classifier, and a contextual model on the same valid split.

Lexical models can exploit distinctive phrases cheaply. Contextual models can represent negation and interactions, but need appropriate training and evaluation. Larger parameter count is not proof of a useful advantage.

## 4. Fit and evaluate the intended decisions

Use cross-entropy for exclusive classes and appropriate binary losses for multilabel targets. Check the class axis, target encoding, and label order.

Evaluate precision, recall, F1, and class-level behavior according to the decision. **Class imbalance** means some classes are much rarer; majority-class accuracy can hide poor rare-intent detection.

Macro averaging gives each class equal weight but does not remove uncertainty in classes with very few examples.

## 5. Separate representation and threshold failures

If useful cases are ranked above negatives but few pass a default cutoff, test the decision rule. If relevant and irrelevant messages receive indistinguishable scores, investigate features, labels, and training.

Class weighting or resampling changes the fitting emphasis. Preserve a representative evaluation population and recheck probability meaning when scores drive actions.

## 6. Inspect linguistic failure modes

Test negation, quoted language, mixed requests, spelling variants, unfamiliar names, and conversations needing earlier context.

An unseen intent may be forced into a known class. A model’s largest softmax score is not automatically reliable evidence that the input belongs to the supported taxonomy. Consider a validated review or clarification path.

## 7. Interview reasoning

**Question:** Does a high sentiment score identify which support team should receive a message?

**Answer:** No. Sentiment describes attitude, while routing requires task-specific intent or issue labels. Train and evaluate the output that the operational decision actually needs.
