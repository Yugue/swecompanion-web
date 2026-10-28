# Conditioning, guidance, and image editing

## 1. Guide a generative distribution

For image generation, text, an existing image, or a spatial layout can condition the denoiser alongside its noisy state and timestep.

Text token vectors can supply cross-attention keys and values while image features supply queries. This gives image locations a route to read the requested content.

## 2. Train with missing conditions

**Classifier-free guidance (CFG)** combines conditional and unconditional model predictions. Training randomly drops conditioning for some examples, teaching the model both prediction modes.

“Unconditional” here usually means a designated empty condition, not a network with no input or timestep.

## 3. Combine predictions

\[
\hat\epsilon=\epsilon_u+s(\epsilon_c-\epsilon_u)
\]
\(\epsilon_u\) is the unconditional noise prediction; \(\epsilon_c\) the conditional prediction; s guidance scale. In this convention, s=0 is unconditional and s=1 is the ordinary conditional prediction.

Values above one extrapolate toward the condition. Other implementations can name the scale differently.

## 4. See the direction of guidance

```genai-visual
guidance
```

The conditional-minus-unconditional vector estimates how the condition changes the prediction. Amplifying it can improve prompt adherence while moving outside ordinary prediction behavior.

Strong guidance can cause oversaturation, artifacts, and reduced diversity. It is not equivalent to sampling temperature.

## 5. Edit an existing image

**Image-to-image generation** starts from a noised representation of a supplied image. More initial noise allows larger changes but preserves less of the original.

**Inpainting** targets an indicated region using a **mask**, an array identifying which locations may change. Preserve known regions through the model’s editing procedure.

## 6. Supply spatial constraints

Text alone can struggle with exact layouts. Edges, depth, or keypoint conditions provide explicit spatial information when supported by the trained model.

Evaluate both edit quality and unintended changes outside the requested region. A plausible new image can still be an unsuccessful edit.
