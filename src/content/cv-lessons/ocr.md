# 5.8 Text detection and recognition

## 1. OCR is a pipeline

**OCR** turns visible text into symbols. Document extraction also assigns those symbols to fields.

```text
image → text regions → rectified crops → text
                                          ↓
                           reading order → structured fields
```

Reading “1250” correctly still fails if it is assigned to the tax field instead of the total.

## 2. Find and normalize the region

Detect boxes, rotated boxes, or polygons. Rectify perspective and orientation before recognition.

Preserve character resolution and aspect ratio. Tight crops can cut off digits; shrinking a full page can erase small print.

Thresholding and morphology are useful baselines for controlled text. Crops or tiles help with dense pages; restore their coordinates consistently.

## 3. Text has variable length

A recognizer predicts an ordered sequence over an alphabet.

“cat” and “catalog” need different output lengths. Repeated characters matter: “book” must retain both o's.

Alphabet and script coverage are part of the task definition.

## 4. CTC handles unknown alignment

**CTC** sums probabilities over valid monotonic alignments between output steps and target text. Dynamic programming computes its negative log likelihood.

Decode by collapsing consecutive repeats **before** removing blanks:

```text
c c blank a a blank t → cat
a a                   → a
a blank a             → aa
```

Repeated target characters need enough steps for separation. CTC handles ordered sequences; document reading order needs separate logic.

## 5. A minimal CTC operation

For logits shaped \(T\times B\times C\), including blank:

```python
log_probs = logits.log_softmax(dim=2)
loss = torch.nn.CTCLoss(blank=0)(
    log_probs, targets, input_lengths, target_lengths
)
```

Targets exclude blank. Lengths count valid steps and characters, excluding padding.

Autoregressive decoding uses earlier symbols as context. It adds sequential work and can favor plausible text over the actual image.

## 6. Measure edits and field correctness

\[
\mathrm{CER}=\frac{S+D+I}{N}
\]

\(S,D,I\) are substitutions, deletions, and insertions; \(N\) is reference characters. WER uses words instead.

“1250” → “1280” gives one substitution: CER \(=1/4=25\%\), but exact total correctness is zero.

Insertions can make the rate exceed 100%. Specify case, punctuation, and spacing normalization.

## 7. Locate the failure

Inspect detection misses, crop truncation, recognition, reading order, and field assignment separately.

Blur, curved text, handwriting, and unfamiliar scripts need different data. Language priors help common words but can corrupt serial numbers.

Use confidence to route uncertain critical fields to review.

## 8. Interview reasoning

**Question:** Character accuracy is high, but invoice totals are wrong. What do you check?

**Answer:** Trace failed totals through crops, digits, decimal/currency handling, reading order, and field assignment. Measure exact field correctness so a layout error is not mistaken for a recognition problem.
