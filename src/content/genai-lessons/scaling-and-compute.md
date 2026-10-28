# Model size, data, and compute

## 1. Allocate a finite budget

**Scaling** changes model capacity, training data, or computation to improve performance. A **scaling law** is an empirical relationship measured over a range of such choices, not a guarantee of unlimited improvement.

**Compute** measures executed numerical work. A floating-point operation is one arithmetic operation on floating-point values.

## 2. Estimate dense training work

\[
C\approx 6ND
\]
C is approximate training floating-point operations, N dense model parameters, and D processed training tokens. The factor six is a rough forward/backward estimate; attention, context length, architecture, and implementation alter actual cost.

One billion parameters and 20 billion tokens give approximately 1.2×10²⁰ operations. Two billion parameters and 10 billion tokens have the same estimate; measured quality decides which allocation is better.

## 3. Balance capacity and exposure

A huge model with too few tokens may be undertrained. A tiny model with repeated data can hit a capacity or data-quality limit.

**Compute-optimal training** chooses a parameter/token allocation that minimizes an objective under a fixed training budget. The optimum depends on the evaluated setting and assumptions.

## 4. Count useful data

Processed tokens include repeats. Repeating one million tokens one hundred times is not equivalent to one hundred million diverse, relevant tokens.

Data quality and mixture can shift the scaling curve. Compare validation performance under controlled changes rather than treating raw token count as sufficient.

## 5. Include inference demand

Lifetime cost includes training plus repeated inference. Training a smaller model for longer may cost more initially while reducing later serving expense.

An MoE model needs separate total-parameter, active-compute, and communication accounting. Dense approximations should not be applied blindly.

## 6. Run small controlled experiments

Measure several model/data sizes, fit trends cautiously, and validate predicted gains with a larger run. Track token loss and downstream behavior separately.

Scaling does not fix label leakage, missing evidence, or an incorrect objective. Resolve those before buying a larger training run.
