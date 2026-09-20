## Answering RRP questions

**The graded skill is narrowing a broad prompt to one part of the funnel and explaining that part concretely** - not surveying everything you know about recommenders.

---

## 1. The shape of an answer

```text
1. one-sentence definition
2. ONE clarifying question           ← let them choose the direction
3. name the stage you are in         retrieval? ranking? re-ranking?
4. the row and the label
5. mechanism, with numbers
6. the trade-off, and when you'd choose differently
7. stop
```

### Core intuition

Step 3 is specific to this domain and it is the highest-value habit here. Retrieval, ranking, and re-ranking have different constraints, different metrics, and different models. An answer that does not say which one it is about will sound muddled however good the content is.

---

## 2. Pin down the row and the label early

Most vague answers are vague because nobody said what one example is.

```text
weak:    "we'd train a model on user behavior"
strong:  "one row is one impression - this user, this video, this context,
          with the features as they were at serve time. The label is whether
          they watched past 30 seconds, known within minutes, so we can
          retrain daily."
```

That sentence settles the loss, the metric, the pipeline, and the retraining cadence all at once.

### Rule of thumb

> If you have not said what one training row is, you have not started answering.

---

## 3. Always quote a baseline

```text
weak:    "recall@100 was 0.31"
strong:  "recall@100 was 0.31, against 0.24 for popularity-in-context -
          so the personalization is worth about 7 points"
```

### Rule of thumb

Popularity is the floor in this domain (Chapter 1), and quoting against it is the fastest way to sound like you have measured something rather than reported a number.

---

## 4. Raise the biases before they do

Interviewers in this area are listening for whether you know the data is not a clean sample:

```text
position bias    clicks reward placement as well as relevance
exposure bias    you only see outcomes for what the old system showed
feedback loops   the system trains on data it generated
popularity bias  unnormalized similarity surfaces bestsellers everywhere
```

### Common issue

Naming one of these unprompted, in the right place, is one of the strongest signals available. Naming all four unprompted sounds like a recitation - pick the one that bears on the question.

---

## 5. Phrases that land

```text
"Which stage are we talking about - retrieval or ranking? The constraints
 are completely different."
"Let me say what one training row is before I pick a model."
"What's the popularity baseline here?"
"That score needs to be calibrated, because it's being multiplied by a bid."
"I'd check whether the right item was even retrieved before touching the ranker."
"Offline that's a hypothesis; I'd want it in an A/B test with guardrails."
```

**When you do not know.** Say what you do know, name the boundary, reason forward:

> "I have not used that particular architecture. The problem it solves is learning feature interactions over very sparse ids, which I would otherwise approach with a factorization machine or explicit cross layers - so what I would want to know is how it handles the embedding table size, because that is usually the binding constraint."

That answers the underlying question and is far stronger than bluffing.

---

## What matters most

- **Say which stage you are in.** Retrieval, ranking, and re-ranking have different constraints, metrics, and models.
- **Define the training row and the label before choosing a model** - it settles the loss, the metric, and the cadence at once.
- **Quote every result against the popularity baseline,** and state the metric and the k.
- **Raise one relevant bias unprompted** - position, exposure, feedback, or popularity - rather than reciting all four.
- **Treat offline results as hypotheses** and say what would settle them online.

You have reached the end of this guide. Go back to any chapter and re-read the "what matters most" sections - together they are a compact summary of the whole domain.
