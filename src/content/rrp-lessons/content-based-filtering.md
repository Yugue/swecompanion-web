## Content-based filtering

## 1. Match descriptions to interests

**Content-based filtering** recommends using item attributes and a user's stated or observed interests. It does not require other users to have consumed the same items.

> Describe the interests, then look for matching descriptions.

## 2. Turn attributes into vectors

A **feature vector** is a numeric list describing an item: category indicators, duration, or measurements extracted from text and images.

A **pretrained model** supplies representations learned from another dataset. Check whether its similarity matches this recommendation task.

## 3. Build a simple interest profile

Average the vectors of liked items. Two cooking items [1,0] and one travel item [0,1] give:

\[
p_u=([1,0]+[1,0]+[0,1])/3=[2/3,1/3]
\]

\(p_u\) is user \(u\)'s profile; the coordinates here mean cooking and travel.

## 4. Score a candidate

A **dot product** multiplies matching coordinates and sums:

\[
s(u,i)=p_u^\top v_i=\sum_{f=1}^{d}p_{uf}v_{if}
\]

\(v_i\): item \(i\)'s vector; \(d\): coordinate count; \(f\): coordinate index; \(s\): compatibility score.

Cooking [1,0] scores **2/3**; travel [0,1] scores **1/3**. These are not click probabilities.

## 5. Preserve several interests

One average can blur cooking and motorsport into an unhelpful middle. Keep separate interest profiles or retrieve from individual history items, then merge.

Recency weights change which interests dominate; test them rather than assuming newest always wins.

## 6. Know what attributes miss

Similar descriptions need not mean similar usefulness. Ink complements a printer without resembling it; behavioral evidence may capture that relationship better.

Use content-based methods when attributes are informative, especially for new inventory. Measure relevance and variety.

## 7. Interview reasoning

**Question:** Why might a content model recommend another printer instead of ink?

**Answer:** It learned attribute similarity. Complementary purchasing is a different relationship, better supported by suitable purchase behavior or explicit compatibility features.
