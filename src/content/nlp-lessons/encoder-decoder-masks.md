# Padding masks, causal masks, and information access

## 1. Specify legal reading paths

A **mask** excludes selected information from a computation. An **attention mask** determines which key positions each query may read.

This is different from modifying a word’s meaning or setting an ignored target label. Each operation needs its own contract.

## 2. Block scores before normalization

For compatibility scores \(s_j\), add mask value \(m_j\):

\[
a_j=\operatorname{softmax}_j(s_j+m_j)
\]

Use \(m_j=0\) when allowed and conceptually \(-\infty\) when blocked. The blocked weight becomes zero while remaining weights renormalize.

With scores [log 3, 0], blocking the second changes weights [0.75,0.25] to [1,0]. Zeroing the second weight afterward without renormalizing would leave a different computation.

## 3. Prevent future-target access

A **causal mask** allows a position to read its prefix, including itself under the usual next-token input convention.

```nlp-visual
masks
```

At input token “cats,” predict “sleep.” Reading the current input is legal; reading the future target “sleep” is not. Shifted labels and the mask must agree.

## 4. Exclude artificial keys

A **padding mask** blocks storage positions that do not contain real inputs. A source encoder can read all valid source tokens without reading padding.

Blocking padded keys does not automatically zero padded query outputs. Ignore or handle those outputs where appropriate, such as sentence pooling or token scoring.

## 5. Separate other masks

| Mask | Excludes |
|---|---|
| Attention | Keys unavailable to a query |
| Pooling | Positions excluded from a summary |
| Loss | Targets excluded from training cost |

A token can legally provide context while its position is not a training target. Prompt tokens in some fine-tuning setups are one example.

## 6. Handle edge cases explicitly

A row with every score blocked has no valid normalized distribution under ordinary softmax. Handle empty or fully masked inputs deliberately rather than relying on accidental library behavior.

Mask APIs differ in boolean direction and broadcasting conventions. Check the actual operation and dimensions; some use true to allow while others use true to block.

## 7. Interview reasoning

**Question:** Is setting padding labels to an ignored value sufficient to stop padding from influencing predictions?

**Answer:** No. It removes those targets from loss, but attention and pooling may still read padded states. Check all three paths independently.
