## Fairness, policy, and what not to show

**Ranking decides who gets attention,** which makes exposure something you are allocating whether or not you meant to.

### 1. Two sides to it

```text
user-side     do different groups of users get equally good recommendations?
item-side     do different creators, sellers, or publishers get a fair chance
              at being seen?
```

The second is easy to forget and often the one with commercial and regulatory weight. A system can be excellent for every user and still concentrate all exposure on a handful of suppliers.

---

### 2. Popularity bias is the default outcome

Nothing malicious has to happen:

```text
popular item → ranked higher → shown more → more engagement → looks better
new/niche    → no data       → ranked low → not shown       → still no data
```

Left alone, this concentrates attention until a small fraction of the catalogue absorbs nearly all of it - the feedback loop from Chapter 5, seen from the supply side. Counteracting it requires something deliberate: exposure floors, per-item caps, or exploration.

### Rule of thumb

> Fair exposure does not emerge from accurate ranking. If nothing in the system enforces it, it does not happen.

---

### 3. Where there are legal constraints

Some domains restrict what may be used to target or rank, and the restrictions are specific rather than general:

```text
housing, credit, employment       targeting on protected attributes is restricted
political and issue advertising   disclosure and targeting rules
minors                            content and advertising restrictions
regional content rules            availability varies by jurisdiction
```

Two practical consequences. First, "we did not use the protected attribute as a feature" is **not** a defence - correlated features reproduce it, and postcode is a well-known proxy. Second, these constraints usually apply to a specific surface or ad category, so the system needs the concept of a restricted context rather than one global rule.

---

### 4. Policy is a filter, not a score

This is the part most worth getting right in an interview:

```text
✗  add a penalty to the ranking score for disallowed items
       → a score can always be outweighed by a large enough relevance
       → "mostly not shown" is not a policy

✓  remove disallowed items from the slate, as a hard rule
       → applied late, in re-ranking, where the whole list exists
       → auditable: you can log exactly what was filtered and why
```

Soft constraints belong in the score. Hard ones belong in a filter. Mixing them up is how a policy violation ships.

---

### 5. Measuring it

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
