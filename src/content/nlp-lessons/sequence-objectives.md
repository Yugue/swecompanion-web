# Encoder-decoder models and teacher forcing

## 1. Map a source to a target sequence

A **sequence-to-sequence model** predicts output text conditioned on input text.

An **encoder** represents the source; a **decoder** predicts targets using that representation and earlier target tokens.

A basic recurrent encoder supplies its final state to the decoder.

## 2. Factor target probability

\[
P(y\mid x)=\prod_{t=1}^{T}P(y_t\mid y_{<t},x)
\]

x is source; y_t target token t; y_<t earlier targets; T includes the chosen termination event.

The complete source is available. Future target text is unknown.

## 3. Align reference inputs and labels

**Teacher forcing** supplies earlier reference tokens during training:

```nlp-visual
teacher-forcing
```

For “I agree,” inputs [BOS,I,agree] predict labels [I,agree,EOS]. Each position predicts the next token, rather than copying itself.

## 4. Score intended positions

Sum or average target cross-entropy, excluding padding. Decide whether examples or tokens receive equal weight.

A decoder must not see future targets through another path. Recurrence enforces dependent forward states; other designs need explicit access restrictions.

## 5. Generate from the model’s own prefix

```text
BOS → predict → append chosen token → predict again → EOS
```

**Exposure bias** is the mismatch between reference prefixes during teacher-forced training and generated prefixes at inference.

An early error changes later inputs. Evaluate complete outputs alongside reference-prefix loss.

## 6. Recognize the summary bottleneck

One fixed-width source state can lose long-input details. Increasing width differs from letting each prediction read relevant source positions directly.

The next chapter develops that direct-reading mechanism.

## 7. Interview reasoning

**Question:** Why can low teacher-forced loss coexist with poor translations?

**Answer:** Generation uses the model’s own earlier choices. Prefix errors, stopping, and search can damage complete outputs despite good predictions under reference prefixes.
