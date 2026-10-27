# Encoder-decoder models and teacher forcing

## 1. Map one sequence to another

A **sequence-to-sequence model** predicts an output sequence conditioned on an input sequence. An **encoder** represents the source; a **decoder** generates the target using that representation and an available target prefix.

A recurrent encoder can summarize the source in its final state. This gives a concrete initial design before attention adds direct access to multiple source states.

## 2. Factor the target distribution

\[
P(y\mid x)=\prod_{t=1}^{T}P(y_t\mid y_{<t},x)
\]

\(x\) is the complete source; \(y_t\) target token \(t\); \(y_{<t}\) earlier target tokens; \(T\) includes the chosen termination event.

The source is allowed evidence. The unseen future target is not.

## 3. Shift inputs and labels

**Teacher forcing** supplies earlier reference target tokens as decoder inputs during training.

```nlp-visual
teacher-forcing
```

For target “I agree,” decoder inputs are [BOS, I, agree] and labels are [I, agree, EOS]. Position by position, the decoder predicts the next target rather than copying its current input.

BOS marks a beginning; EOS marks termination.

## 4. Fit only the intended positions

Cross-entropy sums or averages target-token losses. Artificial padding must be excluded, with the denominator matching the intended example or token weighting.

A source-only encoder can read its complete input. A decoder must not obtain later target tokens through another path; recurrence enforces a forward path, while later Transformer lessons introduce explicit masks.

## 5. Generate using the model’s own prefix

At inference, start with the beginning marker, predict a token, append it, and continue until a stop rule fires.

An incorrect early token can change later inputs. **Exposure bias** describes the mismatch between reference prefixes used in teacher-forced training and model-generated prefixes encountered in generation.

Evaluate complete generated sequences as well as reference-prefix token loss.

## 6. Identify the summary bottleneck

Compressing a long source into one fixed-width state can make details difficult to retain. Increasing width can help but is not equivalent to giving each prediction direct access to relevant source positions.

This motivates attention, which the next chapter develops as a separate information-reading mechanism.

## 7. Interview reasoning

**Question:** Why can low teacher-forced loss coexist with weak complete translations?

**Answer:** Training predictions receive correct earlier targets; generation must use its own earlier choices. Errors, stopping, and decoding policy can produce poor sequences despite good reference-prefix predictions.
