# Confidence, calibration, and abstention

## 1. Define the probability of interest

**Confidence** must name an event, such as “this extracted date is correct.” A token’s probability concerns one wording choice, not whole-answer factual truth.

## 2. Check calibration

**Confidence calibration** means that predictions assigned confidence c are correct about fraction c of the time on the relevant population.

Among 100 representative answers assigned confidence 0.8, roughly 80 should be correct over repeated comparable samples. Calibration can change under a new domain, prompt, or user population.

## 3. Separate ranking from probability quality

Constant confidence 0.8 on an 80%-correct population can be calibrated yet useless for choosing safer answers. Check probability reliability and error ranking separately.

## 4. Allow an unanswered outcome

**Abstention** means declining to give an unsupported answer or requesting clarification under a defined policy. **Coverage** is the fraction of requests answered.

Answering 80 of 100 requests with 72 correct yields coverage 0.8 and answered-case accuracy 72/80=0.9. Report both; omitting hard requests can inflate apparent accuracy.

## 5. Set thresholds on held-out data

Choose an answer threshold on development data using error/omission costs. Test it independently by slice.

Monitor coverage and answered-case error after updates. Verifier support can help; repeated agreement or verbal certainty still needs validation.

> **Reason it through:** Every answer receives the same calibrated confidence. Why might that score still be useless for abstention?
