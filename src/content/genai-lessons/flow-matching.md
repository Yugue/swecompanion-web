# Flow matching

## 1. Learn motion from noise to data

**Flow matching** trains a model to predict a velocity field that transports a simple distribution toward the data distribution. A **velocity field** assigns a direction and speed to each state at each time.

An ordinary differential equation, or **ODE**, describes continuous change using such velocities.

## 2. Choose a simple training path

\[
x_t=(1-t)z+tx,\qquad u=x-z
\]
z is sampled noise, x a data example, and t runs from zero to one. The path starts at noise and ends at data; u is its target velocity.

For z=−1 and x=3, t=0.25 gives \(x_t\)=0 and u=4. This is one conditional path choice, not a restriction on every flow-matching method.

## 3. Fit the velocity predictor

\[
L=\mathbb E\|v_\theta(x_t,t)-u\|_2^2
\]
\(v_\theta\) is the trainable field and u the paired path’s target velocity. Many noise/data pairs can reach a similar state at the same time with different velocities; the network learns their conditional average.

Training samples intermediate states directly. Generation, unlike this training calculation, must integrate the learned field.

## 4. Integrate during generation

```genai-visual
flow-field
```

Start from noise and follow the learned field toward t=1. A simple **Euler step** uses \(x_{\mathrm{next}}=x+\Delta t\,v_\theta(x,t)\), where x is the current state and Δt a small time increment.

An **ODE solver** chooses the numerical integration procedure and step sizes.

## 5. Compare with diffusion

Both learn transformations from simple noise to structured data. Common diffusion formulations predict noise or related denoising quantities; flow matching directly fits a chosen path’s velocity target.

The families have mathematical connections. Neither name alone specifies architecture, guidance, sampling quality, or required step count.

## 6. Understand approximation limits

Straight training interpolations do not guarantee straight trajectories under the learned aggregate field. Finite model capacity and coarse integration create error.

One very large Euler step can fail even if training loss is low. Evaluate sample quality and condition adherence at the chosen solver budget.
