## ML system design vs traditional system design

Candidates walking into an ML system design interview often prepare like it's a regular system design interview with a model bolted on. That's the wrong mental model, and it shows immediately when the interviewer starts asking about labels and you only have things to say about databases.

### What a traditional system design interview emphasizes

A traditional system design interview usually centers on the software system itself:

- service boundaries
- APIs
- databases and schemas
- caching
- replication/sharding
- consistency
- load balancing
- failure handling
- storage/throughput scaling

These questions are about moving bytes correctly and quickly between services, and about keeping the system up when parts of it fail.

### What an ML system design interview emphasizes

An ML system design interview still cares about production architecture - none of the list above goes away. But the center of gravity shifts to the ML lifecycle running inside that architecture:

- problem formulation
- data/label quality
- feature design
- model choice
- training objective / loss
- class imbalance
- offline evaluation
- threshold selection
- train/validation/test strategy
- inference architecture
- monitoring for drift and model quality
- retraining/rollout
- scaling training and serving

Every one of these has its own lesson later in this chapter - this page is about the shape of the interview, not the details of any one stage.

---

### The mental split

\[
\boxed{\text{Traditional SD: how do I build and scale the software system?}}
\]

\[
\boxed{\text{ML SD: how do I build, evaluate, serve, and maintain the model inside the software system?}}
\]

Traditional SD treats correctness as fixed once the code is right - a well-tested service keeps behaving the same way forever. ML SD does not get that guarantee: a model that was correct on last quarter's data can silently become wrong as the world changes, with no code change at all. That single fact is why monitoring, drift detection, and retraining show up as first-class concerns in ML SD and barely appear in traditional SD.

### Side-by-side

| | Traditional SD | ML SD |
|---|---|---|
| Core question | How do I move data correctly and fast? | How do I turn data into a decision, and keep that decision good over time? |
| "Correctness" | Fixed by the code, verified by tests | A moving target - drifts as the input distribution changes |
| Main artifact | The service | The model + the pipeline that produces and monitors it |
| Failure mode people forget | A single point of failure | Silent accuracy decay with no error, no crash, no alert |
| Still relevant from the other column | Yes - the model lives inside a normal service | Yes - a data pipeline is still a distributed system |

---

### How this plays out in an actual interview

A strong ML system design answer moves fluidly between both registers instead of treating them as separate interviews. A concrete example, for "design a fraud detection system":

- **Traditional SD lens:** the transaction service needs low-latency reads of user history, a cache for hot user profiles, and a fallback path if the fraud service times out (fail open or fail closed - a real product decision).
- **ML SD lens:** labels arrive 60-90 days late via chargebacks, the positive class is under 1% of transactions, and the threshold that trades precision for recall has to be picked based on the real cost of blocking a legitimate purchase versus missing a fraudulent one.

Neither lens alone answers the question. An interviewer grading this answer is listening for exactly this kind of switching - can you justify a caching layer for user-history lookups, and then pivot cleanly into why the label delay changes your retraining cadence?

> If you notice yourself only ever talking about services, or only ever talking about the model, that's the signal to explicitly name the other half of the split out loud and address it.

### What to keep in your back pocket

- Traditional SD concepts you should still mention when relevant: caching (for features, embeddings, or hot predictions), load balancing across serving replicas, and failure handling (what happens when the model service is down).
- ML SD concepts that should dominate the bulk of your time: how the problem was formulated, where labels come from and how reliable they are, what the model actually optimizes, how you evaluate it offline, and how you'd know if it started failing in production.

Every later lesson in this chapter goes one level deeper into one of the ML-SD bullets above - treat this page as the map, not the territory.
