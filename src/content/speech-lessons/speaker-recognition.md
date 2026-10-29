# 4.2 Speaker embeddings, identification, and verification

## 1. Separate identity tasks

**Identification** asks which enrolled speaker produced a recording. **Verification** asks whether two recordings belong to the same speaker. **Open-set** operation permits speakers outside the enrolled population.

A closed-set classifier can score known people well while failing as a reusable similarity system for unseen identities.

## 2. Turn variable duration into an embedding

An acoustic encoder maps frames to features. Statistics pooling may combine their means and standard deviations, producing a fixed-size vector; a projection gives a **speaker embedding**.

Mask invalid frames. Longer recordings often provide more evidence, but multiple speakers within one recording can contaminate the pooled identity.

```text
speech segment → frame encoder → masked pooling → embedding
enrollment embeddings ──────────────────────────→ comparison
```

## 3. Learn discriminative identity structure

Classification training separates training speakers. Metric-learning objectives encourage same-speaker embeddings to be close and different-speaker embeddings to be distant.

A triplet objective is:

\[
L=\max(0,d(a,p)-d(a,n)+m)
\]

a is an anchor, p a same-speaker example, n a different-speaker example, d a distance, and m a positive margin. Mining easy triplets teaches little; mislabeled hard examples can destabilize learning.

Angular-margin classification is another way to encourage separation on normalized embeddings, without requiring a separate lesson on every margin variant.

## 4. Enrollment and scoring

Build an enrollment template from one or more verified recordings. Compare an incoming embedding using cosine similarity or a learned backend.

If averaging normalized embeddings, normalize the resulting template again when cosine scoring requires it. Include a quality rule for too-short, silent, or corrupted inputs.

## 5. Threshold depends on consequences

False acceptance treats different speakers as the same; false rejection rejects the genuine speaker. A threshold trades these errors.

**Equal Error Rate (EER)** summarizes the point where the rates coincide, not the correct production threshold for every application. A high-risk authentication system may require a much lower false-accept rate.

## 6. Control content and channel confounds

Train and evaluate across different words, sessions, microphones, noise, and durations. Otherwise a model may exploit repeated prompts or recording channels.

**Text-dependent** verification expects a particular phrase; **text-independent** verification does not. They have different operating assumptions and should not share results without qualification.

## 7. Identity evidence is not proof of live presence

Replay, synthesis, and voice conversion can resemble an enrolled voice. A speaker verifier answers a similarity question; anti-spoofing and liveness checks address different evidence.

For consequential authentication, evaluate attacks and fallback procedures explicitly. Do not present an embedding match as sufficient identity assurance.
