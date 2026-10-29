# 5.2 Generative modeling: autoregression, parallel prediction, and iterative refinement

## 1. One input can have many valid outputs

Generation learns a conditional distribution over possible acoustic outputs, not merely an average target. Let c denote text, speaker, style, or other context, and z an acoustic representation.

Averaging alternative timing or phase realizations can produce an output that resembles none of them, motivating distributional objectives.

## 2. Autoregressive factorization

\[
P(z\mid c)=\prod_{t=1}^{T}P(z_t\mid z_{<t},c)
\]

zt is the next acoustic frame or discrete token, T sequence length, and z<t the preceding outputs. Train using observed prefixes; generate by repeatedly sampling or selecting the next output.

Autoregression naturally represents output dependence, but sequential decisions limit parallelism and create exposure mismatch.

## 3. Sampling changes behavior

For logits li over discrete choices, temperature τ produces probabilities proportional to exp(li/τ). Lower temperature concentrates probability; higher temperature increases diversity, potentially increasing artifacts or content errors.

Truncating the candidate set can remove unlikely choices but also eliminate valid rare continuations. Tune using intelligibility, naturalness, stability, and use-case requirements rather than diversity alone.

## 4. Parallel prediction needs structure

A duration-conditioned model can predict acoustic frames in parallel after expanding the text sequence. This improves throughput and often stabilizes alignment.

Parallelism does not imply independence everywhere: the network can mix context across the whole expanded sequence. A simple deterministic regression head can still underrepresent ambiguous fine detail.

## 5. Diffusion learns to reverse corruption

A common training construction adds Gaussian noise:

\[
z_t=\sqrt{\bar\alpha_t}z_0+
\sqrt{1-\bar\alpha_t}\epsilon,\qquad
L=\mathbb E\|\epsilon-\epsilon_\theta(z_t,t,c)\|_2^2
\]

z0 is clean data, ε standard Gaussian noise, t a noise level, and ᾱt a schedule coefficient between zero and one. The model predicts noise under this particular parameterization.

Generation starts from noise and applies a sequence of denoising updates. More steps can improve approximation but cost time; step count alone does not guarantee quality.

## 6. Flow matching learns a transport velocity

In a simple straight-path construction:

\[
z_t=(1-t)z_{\mathrm{noise}}+tz_{\mathrm{data}},\qquad
L=\mathbb E\|v_\theta(z_t,t,c)-
(z_{\mathrm{data}}-z_{\mathrm{noise}})\|_2^2
\]

t ranges from zero to one; vθ predicts velocity along the chosen path. Generation integrates dz/dt = vθ from noise toward data.

Flow matching and diffusion both support iterative conditional generation, but their training targets and sampling interpretations differ; they should not be treated as interchangeable names.

## 7. Conditioning and guidance

Conditioning tells the generator what content, voice, or style to produce. Some models train with dropped conditions so inference can combine conditional and unconditional predictions for stronger guidance.

Greater guidance may improve adherence while reducing diversity or creating artifacts. It is not a remedy for incorrect text or inadequate acoustic evidence.

## 8. Compare costs on the actual output representation

| Method | Main inference dependency | Common limitation |
|---|---|---|
| Autoregressive | Prior generated tokens/frames | Sequential latency |
| Parallel duration-based | Expanded alignment and context | Duration errors; limited detail |
| Diffusion | Iterative denoising steps | Quality–step-count tradeoff |
| Flow matching | Numerical integration steps | Solver and step-budget sensitivity |

Token rate, codec levels, chunk size, and hardware determine actual latency; family names alone do not.
