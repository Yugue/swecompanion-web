## Diagnosing overfitting and underfitting

## 1. Diagnose transfer, not just training fit

**Underfitting** misses useful relationships. **Overfitting** learns sample-specific details that fail to transfer.

Compare the same error definition across train and validation, using consistent preprocessing.

## 2. Treat gaps as clues

| Train / validation error | Investigate |
|---|---|
| High / high | Weak inputs, restricted model, failed fitting, noise |
| Low / much higher | Overfitting, shift, pipeline mismatch |
| Low / low | Good transfer, or an overly easy evaluation |

“High” depends on baselines and task costs. The bias-variance lesson explains why these are clues rather than direct measurements of bias or variance.

## 3. Read a learning curve

A **learning curve** varies training-set size with a comparable evaluation protocol.

```aml-visual
learning-curves
```

Continued validation improvement supports trying more representative data. A poor plateau suggests checking features, capacity, fitting, and labels; it does not prove more data can never help.

## 4. Distinguish other curves

A **validation curve** varies one hyperparameter, such as depth. An **iteration curve** follows steps within one fit.

Falling training loss with rising validation loss suggests later steps fit less transferable detail. Early stopping retains a validation-chosen checkpoint.

## 5. Test the suspected cause

Check population match, feature consistency, label alignment, and incomplete outcomes before prescribing regularization.

Try fitting a flexible model to a small subset as a pipeline check. Failure may expose fitting or label problems, but a constrained linear model cannot memorize arbitrary outcomes, and identical inputs with conflicting labels remain inseparable.

## 6. Interview reasoning

**Question:** Validation loss rises after iteration 20 while training loss falls. What next?

**Answer:** Test a checkpoint near the validation minimum and stronger restrictions. Also rule out inconsistent preprocessing or evaluation noise before assuming overfitting is the only cause.
