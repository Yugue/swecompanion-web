## What a recommender actually does

**A recommender picks a short list out of a very large catalogue, for one person, at one moment.**

That sentence contains the whole difficulty. A video app has ten million videos and six slots on the home screen. The job is not to predict a number - it is to *choose*.

---

## 1. The same machine with different names

```text
search        → rank documents for a query
home feed     → rank items for a user
ads           → rank ads for a user, weighted by money
"people you   → rank people for a person
 may know"
```

### Core intuition

All four score candidates for a user in a context, then show the best few. Learn one and you have learned the shape of all of them.

---

## 2. One product surface, four different problems

"Recommendations" on a single video app means at least four systems that share machinery and optimize different things:

```text
surface            candidates      what "good" means            metric
home feed          everything      something worth watching     watch time / session
search results     query-matched   answers THIS query           NDCG, relevance
"up next"          related to now  keeps the session going      continuation rate
notifications      everything      worth interrupting for       precision, unsubscribes
```

Notice the last row. The same model that is excellent at the home feed is dangerous in notifications, because the cost of a bad recommendation jumps from "you scroll past" to "you turn notifications off permanently". Precision has to dominate there in a way it never does in a feed.

### Rule of thumb

That is why the first question in any of these interviews is *which surface*, and why answering "a recommender" without saying which one is the most common way to sound unfocused.

---

## 3. The size gap decides the design

```text
    10,000,000 items in the catalogue
             ↓
             6 shown on screen
```

You cannot run a good model over ten million items in the 50 milliseconds a page load allows. Everything in Chapter 3 exists because of this one constraint.

---

## 4. Predicting a rating is not the job

The famous version of this problem was "predict the star rating this user would give this film". That is a regression problem, and it is **not** what a product needs.

```text
predict the rating   →  "you would give this 4.2 stars"
choose the list      →  "here are six things, in this order"
```

A model can be excellent at the first and useless at the second. What matters is whether the handful of items you actually showed were the right ones.

### Rule of thumb

> You are graded on the top of the list, not on the accuracy of every score.

---

## 5. The part that makes this domain hard

You only ever find out what happened for the items you chose to show.

```text
shown     → you observe a click or no click
not shown → you observe NOTHING, ever
```

### Common issue

An ordinary classifier sees a fixed dataset. A recommender **creates** its dataset by deciding what to show, then trains on the result. That circularity is behind position bias, feedback loops, and the reason offline numbers mislead - all covered in Chapter 5.

---

## 6. The score is a means, not the goal

There are three different things people call "the metric", and confusing them causes a lot of arguing:

| Level | Example | Who cares |
|---|---|---|
| Model output | predicted click probability | the ranker |
| List quality | was the top-6 any good | the product |
| Business outcome | did people come back tomorrow | the company |

A model improvement that does not move the second is not an improvement. One that moves the second but not the third needs a conversation.

---

## What matters most

- **The output is an ordered list of a few items chosen from millions,** and that size gap drives every architectural decision that follows.
- **Search, feeds, ads, and friend suggestions are one machine** - score candidates for a user in a context, show the best few.
- **"Predict the rating" and "choose what to show" are different problems.** Only the second is what a product needs.
- **You never observe what would have happened for items you did not show,** which is what separates this domain from ordinary prediction.
- **Keep model score, list quality, and business outcome separate** in your head and in your answers.

Next topic is **The retrieval and ranking funnel**.
