# Confidence, calibration, and abstention

## 1. Define the probability of interest

**Confidence** should refer to a specific event, such as “the final extracted date is correct.” A high probability for one next token is a different event.

An answer has many tokens and may express the same claim in many ways. Multiplying one wording's token probabilities does not directly give the probability that its factual claim is true.

## 2. Check calibration

**Confidence calibration** means that predictions assigned confidence c are correct about fraction c of the time on the relevant population.

Among 100 representative answers assigned confidence 0.8, roughly 80 should be correct over repeated comparable samples. Calibration can change under a new domain, prompt, or user population.

## 3. Separate ranking from probability quality

A confidence score may rank correct answers above wrong ones while exaggerating every probability. Conversely, matching overall accuracy with one constant score is calibrated in a coarse sense but cannot distinguish easy cases.

For example, give every answer confidence 0.8 in a population that is 80% correct. The average is calibrated, but the score cannot select safer requests. Check both reliability and the ability to rank errors below successes.

## 4. Allow an unanswered outcome

**Abstention** means declining to give an unsupported answer or requesting clarification under a defined policy. **Coverage** is the fraction of requests answered.

Answering 80 of 100 requests with 72 correct yields coverage 0.8 and answered-case accuracy 72/80=0.9. Report both; omitting hard requests can inflate apparent accuracy.

## 5. Set thresholds on held-out data

Choose an answering threshold based on the cost of errors and omissions, using a development set. Evaluate the fixed threshold on an independent set and important slices.

Missing-evidence signals, verifier results, and retrieval support may help. Agreement across model samples is not independent proof: they can share the same misconception.

Track error rate among answered requests, coverage, and appropriate escalations. Check whether confidence remains meaningful after model, prompt, or data changes.

A verbal “I am certain” has no special statistical status. Treat it as a score to validate, not as authority.
