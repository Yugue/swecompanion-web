# 6.6 End-to-end system design, monitoring, and iteration

## 1. Use one reusable reasoning framework

```text
requirements → targets/data → preprocessing → baseline → model/objective
             → evaluation/error analysis → serving → monitoring → iteration
```

At each arrow, state the contract and what failure would look like. Begin with user-visible quality and latency needs rather than a favorite model.

## 2. Case study: meeting transcription

Requirements: long recordings, multiple speakers, overlap, timestamps, names, and possibly live captions.

Start with a pretrained recognizer and modular diarization baseline. Preserve time mappings, compare optional enhancement against bypass, and decide whether streaming partial revisions are acceptable.

Evaluate word errors, speaker attribution, overlap slices, timestamp quality, names, and stable-caption delay. Store enough stage evidence to distinguish acoustic, alignment, clustering, and formatting failures.

## 3. Case study: conversational voice assistant

Requirements: correct actions, quick first response, interruptibility, appropriate voice, and privacy.

A modular baseline uses streaming recognition, a text reasoning/action component, and streaming synthesis. Track turn state and cancellation so obsolete answers cannot play after an interruption.

Evaluate task completion and critical semantic errors in addition to word errors, acoustic quality, and response delay. Test pauses, background speech, and accidental wakeups.

## 4. Case study: acoustic-event monitoring

Requirements: rare target events over long negative exposure, constrained compute, and actionable alerts.

Begin with a small event detector and threshold policy, retaining hard negatives from realistic environments. Keep overlapping events representable.

Measure event recall, false alarms per hour, detection delay, battery or serving load, and device/environment slices. Consider human review when alert consequences require it.

## 5. Component errors compound

If VAD discards speech, a stronger recognizer cannot recover it. If the true transcript is missing from a shortlist, rescoring cannot select it. If a synthesis frontend expands a number incorrectly, a realistic vocoder says the wrong number clearly.

Run **oracle substitutions** in offline diagnosis: replace one stage with reference information to estimate how much fixing that stage could help. These are diagnostic upper bounds, not deployable results.

## 6. Monitor evidence and outcomes separately

Track sample-rate mismatches, clipping, silence, duration, noise proxies, prediction distributions, latency, queue depth, and stream failures.

Input or prediction drift is a warning, not proof of accuracy degradation. Obtain representative labeled audits or product outcomes to assess correctness.

Respect consent and retention limits when sampling recordings; logs should be useful without retaining raw audio unnecessarily.

## 7. Feedback can bias the next dataset

Users report conspicuous failures, not a random sample. Confidence filtering favors easy cases, and production actions influence which labels become observable.

Combine targeted failure collection with representative audits. Keep the fixed regression suite and a fresh evaluation sample so repeated tuning does not turn every test into training feedback.

## 8. Choose improvements by evidence

For a new microphone failure, first verify preprocessing and capture changes. For new names, test vocabulary context and labeled examples. For overlap failures, inspect segmentation and separation.

Prefer the smallest change addressing the measured mechanism, then re-evaluate quality, slices, operational constraints, and rollback readiness.
