## Fairness, policy, and what not to show

**Ranking decides who gets attention,** which makes exposure something you are allocating whether or not you meant to.

---

## 1. Two sides to it

```text
user-side     do different groups of users get equally good recommendations?
item-side     do different creators, sellers, or publishers get a fair chance
              at being seen?
```

### Core intuition

The second is easy to forget and often the one with commercial and regulatory weight. A system can be excellent for every user and still concentrate all exposure on a handful of suppliers.

---

## 2. Popularity bias is the default outcome

Nothing malicious has to happen:

```text
popular item → ranked higher → shown more → more engagement → looks better
new/niche    → no data       → ranked low → not shown       → still no data
```

Left alone, this creates a **feedback loop**: popular items receive more exposure, which produces more interactions and makes them appear even more popular. Counteracting it requires something deliberate, such as exposure floors, per-item caps, or exploration.

### Rule of thumb

> Fair exposure does not emerge from accurate ranking. If nothing in the system enforces it, it does not happen.

---

## 3. Identify context-specific policy requirements

Housing, employment, financial services, advertising, minors' content, and regional availability can carry different requirements. Determine the current rules for the actual jurisdiction and surface with the responsible legal and policy teams; a general study guide is not a compliance specification.

Removing a sensitive attribute alone does not eliminate discrimination risk: other inputs may correlate with it. Keep policy context explicit and audit the resulting decisions, not just the feature list.

---

## 4. Policy is a filter, not a score

This is the part most worth getting right in an interview:

```text
✗  add a penalty to the ranking score for disallowed items
       → a score can always be outweighed by a large enough relevance
       → "mostly not shown" is not a policy

✓  remove disallowed items from the slate, as a hard rule
       → filter early where possible; recheck hard rules before final display
       → auditable: you can log exactly what was filtered and why
```

### Rule of thumb

Soft constraints belong in the score. Hard ones belong in a filter. Mixing them up is how a policy violation ships.

---

## 5. Audit eligibility and exposure decisions

Attach a reason and policy version to filtered items. Recheck availability and policy at serving time, including cached slates, because a previously allowed item can become disallowed.

Monitor missing policy metadata, blocked-item leakage, and how filters affect different eligible providers. Use a safe fallback when required policy information is unavailable; relevance is not a reason to bypass the check.

---

## 6. Choose the comparison before judging fairness

Equal impressions, exposure proportional to relevance, and opportunity for new suppliers are different objectives. Define the eligible population and the intended comparison before choosing a metric.

Examine uncertainty in small groups and whether the relevance labels inherit historical exposure bias. An apparently merit-based rule can reproduce incumbency if 'merit' is measured only by past traffic.

---

## 7. Measuring it

```text
user-side     ranking quality sliced by user segment, looking at the worst slice
item-side     exposure distribution across creators/sellers - Gini or share of top 1%
              new-item impression share
              exposure relative to quality, not just absolute exposure
```

That last line matters: perfectly equal exposure is not the goal either, since items genuinely differ in quality. The usual framing is whether exposure is proportionate to merit rather than to incumbency.

And note the honest caveat - the fairness definitions conflict with each other, so you cannot satisfy all of them at once. Saying which one you chose and why is the mature answer.

---

## What matters most

- **Two sides: users receiving good results, and items getting a fair chance at exposure.** The second is easier to forget.
- **Popularity bias is the default outcome,** so fair exposure has to be enforced rather than expected.
- **"We didn't use the protected attribute" is not a defence,** because correlated features reproduce it.
- **Policy belongs in a filter, not in the score** - a score can always be outweighed, and "mostly not shown" is not a policy.
- **Measure exposure relative to merit, not equality,** and say which fairness definition you chose, since they conflict.

Next topic is **Characteristic failure modes**.
