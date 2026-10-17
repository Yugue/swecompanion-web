## Content-based filtering

**Content-based filtering** recommends using item attributes and a user's expressed or observed interests. It can compare descriptions without needing other users to have consumed the same items.

## 1. Build a profile from item features

Represent items as numeric **feature vectors**. A simple user profile averages vectors from previously liked items, optionally weighting recency or action strength.

Suppose two liked items have [cooking=1, travel=0] and one has [0, 1]:

\[
p_u=\tfrac13([1,0]+[1,0]+[0,1])=[2/3,1/3]
\]

A **dot product** multiplies matching coordinates and adds them. A cooking candidate [1, 0] scores 2/3; a travel candidate [0, 1] scores 1/3.

These are compatibility scores, not click probabilities. The example also assumes comparable feature scales and that these attributes capture useful similarity.

## 2. Choose what describes an item

| Representation | Example information |
|---|---|
| Structured attributes | Category, brand, language, duration |
| Text representation | Words or learned features from title and description |
| Image or audio representation | Features from an appropriate pretrained model |
| Related metadata | Creator, seller, series, availability |

A **pretrained model** supplies features learned from another dataset. Validate whether its notion of similarity fits this task: visually similar covers need not imply similar content quality.

A new item can be represented once its features are available. It still needs a route into the eligible candidate set and, for indexed retrieval, timely index insertion.

## 3. Avoid collapsing several interests into one average

A user interested in cooking and motorsport need not want an item midway between those topics. Keep multiple profiles or retrieve neighbors of separate recent items, then merge and remove duplicates.

Averaging and recency weighting are modelling choices. Test them on later requests and on users with several interests rather than assuming the newest action always dominates.

## 4. Know what evidence is missing

Attribute similarity can over-specialize or miss complementary relationships. Printer ink may complement a printer without having a similar description. Behavioral co-purchase evidence can supply that relationship.

Content-based systems can also inherit popularity and presentation bias through their training signals or profile weights. They are not automatically immune because the final score compares attributes.

Use content-based retrieval as a baseline or source when features are informative, especially for new inventory. Measure relevance, variety, cold-item coverage, and serving cost.

> **Mental image:** build a description of the user's interests, then look for items whose descriptions match. The description is useful only for the aspects it actually captures.
