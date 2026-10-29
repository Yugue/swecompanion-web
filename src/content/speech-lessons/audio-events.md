# 4.1 Audio classification, event detection, and keyword spotting

## 1. Decide what the output locates

**Clip classification** assigns labels to a whole recording. **Sound Event Detection (SED)** predicts which events occur and when. **Keyword spotting** detects a particular spoken word or phrase, often continuously.

A ten-second clip labeled “glass breaking” does not reveal the event's onset or duration. The label granularity limits the supervision available.

## 2. Single-label and multilabel outputs

Use a categorical softmax when exactly one mutually exclusive class is appropriate. Use independent sigmoid scores when speech, music, and a siren can coexist.

For binary target yc and event probability pc:

\[
L=-\sum_c \left[y_c\log p_c+(1-y_c)\log(1-p_c)\right]
\]

c indexes event classes. Missing annotations are not necessarily negative labels; determine whether the dataset exhaustively labels all audible classes.

## 3. From frames to recording labels

An encoder produces temporal features. A frame head supports detection; a pooling operation gives clip predictions.

Mean pooling can dilute a brief event; max pooling emphasizes one peak; learned attention pooling chooses evidence but can attend to background shortcuts.

```text
features → temporal encoder → frame scores → event boundaries
                              ↓ pooling
                            clip labels
```

## 4. Learn from weak labels carefully

**Weak labels** identify an event somewhere in a clip without boundaries. **Multiple-instance learning** treats the clip as a collection of regions and aggregates region evidence.

A model can satisfy the clip objective using a correlated background, such as road noise for sirens. Test isolated events, changed backgrounds, and recordings from new sources.

## 5. Thresholds turn scores into events

Threshold frame probabilities, optionally smooth them, then merge nearby detections or require a minimum duration. These rules affect misses, false alarms, and onset delay.

Tune on validation data with the actual event-duration and alerting policy. A threshold of 0.5 has no special guarantee when scores are uncalibrated or error costs differ.

## 6. Keyword spotting is a continuous detection problem

A keyword detector needs hard negatives: similar-sounding words, conversational occurrences, television, and noise. A small clip classifier's balanced-set accuracy does not estimate false activations over hours of ambient audio.

A cascaded detector can use a cheap first stage and a stronger verifier. Count end-to-end false alarms and missed triggers after both stages.

## 7. Evaluate at the right granularity

| Product question | Required evaluation |
|---|---|
| Which sounds occur in a clip? | Clip-level precision/recall and ranking |
| When does the event happen? | Event boundaries and detection tolerance |
| Can this run all day? | False alarms per hour and missed-event rate |
| Are tiny events ignored? | Duration and rarity slices |

The shared evaluation lesson develops formulas; here the central decision is what counts as one correct prediction.
