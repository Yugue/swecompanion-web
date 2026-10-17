## Retraining and drift

**Retraining** fits updated parameters. **Drift** is a change in data or in the relationship between inputs and outcomes. **Refreshing** features or catalogue indexes is a separate operation that may not require retraining.

Choose the response from the cause rather than treating every quality drop as a retraining request.

## 1. Different components age differently

| Change | Possible response |
|---|---|
| Newly published item with supported features | Encode and insert into the current compatible index |
| Recent session actions arrive | Update the history feature or request representation |
| Existing behavior changes | Evaluate fitting on newer representative evidence |
| Score meaning changes | Recheck calibration and decision policy |
| Feature counter stops updating | Repair the data path |

A feature-based item encoder can represent new inventory with fixed weights. An identifier-only representation may need new fitted evidence or a fallback. Neither issue is identical to index-publication delay.

## 2. Diagnose the evidence path first

Check missing values, feature ages, row counts, joins, source timeouts, fallback traffic, and index versions. A broken pipeline is an incident, not evidence that interests changed.

Then examine traffic mix, catalogue composition, layout changes, labels, and outcome rates. A changed click rate can reflect placement or instrumentation as well as preferences.

Input drift does not always cause quality loss. A changed input–outcome relationship may need new outcome evidence; repeatedly fitting unchanged old data cannot teach that new relationship.

## 3. Choose data recency and cadence together

A short training window adapts quickly but can remove useful evidence for rare users and items. A longer window stabilizes some estimates while preserving obsolete behavior.

Compare windows and recency weights on later data and cold slices. Include label maturity, compute cost, and rollout time when choosing a schedule. There is no universal daily or weekly cadence for all components.

Monitor immediate serving health separately from delayed satisfaction, purchase, or retention outcomes.

## 4. Promote a compatible, validated bundle

New encoders can change coordinate conventions. Validate the request encoder, item vectors, preprocessing, normalization, and index together before switching traffic.

Check later-period quality, calibration where consumed, important slices, and serving constraints. Reassess thresholds and blend weights rather than automatically copying them from an unrelated score scale.

Use a controlled rollout with explicit health and quality gates and a previous compatible bundle for rollback. Completing training is not the same as demonstrating a useful update.
