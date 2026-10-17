import { cvVisuals, type CvVisualId } from "./cvVisuals";

export interface DlVisualSpec { title: string; caption: string; alt: string; shared?: CvVisualId }
export const dlVisuals = {
  "matrix-product": {
    title: "One output cell is a row–column dot product",
    caption: "The highlighted row of W meets the column x: 1 × 5 + 2 × 6 = 17. The second row gives 39. The inner dimensions match: (2 × 2)(2 × 1) → (2 × 1).",
    alt: "A two-by-two matrix multiplies a two-by-one column vector, highlighting the row and column that produce seventeen.",
  },
  tangent: {
    title: "A derivative is the slope right here",
    caption: "For f(x) = x² at x = 3, the tangent has slope 6. A small increase Δx = 0.1 predicts Δf ≈ 0.6; the exact increase is 0.61. The tangent is a local approximation.",
    alt: "A parabola and its tangent at the point three, nine show a local slope of six.",
  },
  "normal-distribution": {
    title: "Mean moves the center; variance changes the spread",
    caption: "μ is the mean; σ is standard deviation and σ² is variance. Moving μ shifts the bell. Increasing σ makes it wider and lowers its peak. Each complete curve has total area 1; probabilities come from areas under the density curve.",
    alt: "Three Gaussian density curves compare a centered standard normal, a wider normal with standard deviation two, and a normal shifted to mean two.",
  },
  "mlp-forward": { ...cvVisuals["mlp-forward"], shared: "mlp-forward" },
  activations: {
    title: "The curve determines what passes through",
    caption: "ReLU cuts off negative inputs; Leaky ReLU keeps a small slope (0.1 shown for visibility). Sigmoid and tanh flatten at large magnitudes. GELU uses a smooth gate; its common tanh approximation is plotted here. Axes differ between panels.",
    alt: "Four function plots compare ReLU with Leaky ReLU, sigmoid, tanh, and approximate GELU, showing cutoffs and saturation.",
  },
  "regression-losses": {
    title: "Large errors grow differently under each loss",
    caption: "MSE uses e²; MAE uses |e|. Huber with δ = 1 uses ½e² near zero and |e| − ½ outside. The curves show individual errors before averaging, so their absolute scales differ.",
    alt: "Squared, absolute, and Huber loss curves against prediction error illustrate quadratic versus linear growth.",
  },
  "mlp-backprop": { ...cvVisuals["mlp-backprop"], shared: "mlp-backprop" },
  "gradient-descent": { ...cvVisuals["gradient-descent"], shared: "gradient-descent" },
  "learning-rate": {
    title: "Warm up first, then reduce the step size",
    caption: "Illustrative schedule: linear warmup over the first 10% of training, then cosine decay to 1% of the peak rate. Warmup and decay control different phases; this is a shape example, not a prescribed schedule.",
    alt: "Learning rate rises linearly during warmup and then follows a smooth cosine decay toward a small final rate.",
  },
  "gradient-clipping": {
    title: "Norm clipping shortens the vector along the same ray",
    caption: "For g = (6, 8), norm 10, a norm limit of 5 yields (3, 4). Clipping each coordinate to 5 instead gives (5, 5), changing direction and leaving norm ≈ 7.07. The circle is the norm-5 boundary.",
    alt: "An original gradient, a shorter collinear gradient on a radius-five circle, and a coordinate-clipped gradient with a different direction.",
  },
  dropout: {
    title: "Drop paths during training; restore them for evaluation",
    caption: "One possible mask at drop probability p = 0.5. Kept activations are doubled during training; evaluation passes every original value through. Scaling preserves each activation in expectation over masks, not in every individual pass.",
    alt: "Four activation paths show two dropped values and two doubled survivors during training, compared with all original activations during evaluation.",
  },
  "normalization-axes": {
    title: "Same activation matrix, different comparison groups",
    caption: "For a dense [B, D] matrix, BatchNorm computes statistics down each feature column; LayerNorm computes them across each example row. For [B, N, D] Transformer activations, LayerNorm usually treats each token's D features separately. CNN BatchNorm also includes spatial positions per channel.",
    alt: "Two batch-by-feature grids highlight a BatchNorm column and a LayerNorm row with labeled axes.",
  },
  residual: { ...cvVisuals.residual, shared: "residual" },
  "learning-curves": { ...cvVisuals["learning-curves"], shared: "learning-curves" },
  convolution: { ...cvVisuals.convolution, shared: "convolution" },
  "receptive-field": {
    title: "Two local 3 × 3 layers reach a 5 × 5 region",
    caption: "Two stride-1 convolutions, no padding, on a 5 × 5 crop. One first-layer cell sees a 3 × 3 patch. The final cell combines all nine first-layer cells, whose overlapping footprints cover 5 × 5 input pixels.",
    alt: "A five-by-five input becomes a three-by-three intermediate map and one output, with nested three-by-three and five-by-five receptive fields.",
  },
  "rnn-unrolled": {
    title: "One recurrent cell, four uses through time",
    caption: "Every step uses the same Wₓ, Wₕ, and bias. The hidden state changes as each new word arrives. Arrows between cells carry hidden states; the words enter on separate input paths.",
    alt: "Four copies of a recurrent cell share parameters while successive words enter from below and hidden states move horizontally.",
  },
  "bptt-truncation": {
    title: "Detaching cuts backward history while carrying the state forward",
    caption: "Top: the final loss reaches all four states. Bottom: detach after h₂ keeps its numerical value for step 3, but the final loss cannot backpropagate through its earlier history. Shared recurrent weights still receive contributions from uses inside the retained chunk.",
    alt: "Full and truncated recurrent graphs show a continuous blue forward state path and an orange backward path stopped at the detached boundary.",
  },
  "lstm-memory": {
    title: "Keep old memory, add new content, then expose an output",
    caption: "One scalar coordinate of an LSTM: cₜ = 0.8 × 2 + 0.5 × 0.4 = 1.8; hₜ = 0.9 × tanh(1.8) ≈ 0.852. Gates and the candidate are computed from the current input and previous hidden state; the full cell operates elementwise on vectors.",
    alt: "An LSTM cell-state route multiplies old memory by a forget gate, adds gated candidate content, then applies tanh and an output gate to produce hidden state.",
  },
  attention: { ...cvVisuals.attention, shared: "attention" },
  "attention-mask": {
    title: "A mask decides which query–key pairs can communicate",
    caption: "Rows are real query tokens; columns are keys. Dots are allowed, crosses are blocked. The causal panel keeps only current and earlier positions. PAD is a filler used to align sequence lengths. Both panels block that padding key; padded query rows are omitted here and excluded from the task loss.",
    alt: "Bidirectional and causal attention grids compare full versus lower-triangular connectivity, both excluding a padding column.",
  },
  rope: {
    title: "Move both positions; keep their relative angle",
    caption: "One toy feature pair with base q = k = (1, 0) and rotation 30° per position. Positions (1, 3) and (3, 5) both differ by 2, so the relative angle is 60° and the dot product stays 0.5. RoPE applies such rotations to Q/K pairs at multiple frequencies.",
    alt: "Two unit-circle diagrams rotate query and key together from positions one and three to three and five, preserving a sixty-degree gap and dot product one-half.",
  },
  "norm-placement": {
    title: "Where does normalization sit relative to the shortcut?",
    caption: "Pre-LN: y = x + F(LN(x)); the identity route bypasses normalization. Post-LN: y = LN(x + F(x)); even the shortcut passes through the final normalization. F is the attention or feed-forward sublayer.",
    alt: "Two residual block diagrams compare normalization inside the learned branch with normalization after the branch and shortcut are added.",
  },
  "attention-area": {
    title: "Twice as many tokens creates four times as many pairs",
    caption: "Each square is one query–key pair. N = 4 gives 16 pairs; N = 8 gives 64. This illustrates the quadratic attention-mixing work, not the whole model's cost. Memory-efficient implementations can avoid storing the entire score grid.",
    alt: "Four-by-four and eight-by-eight attention grids use equal-sized cells to show fourfold growth in the number of token pairs.",
  },
  lora: {
    title: "A narrow trainable branch adjusts a frozen matrix",
    caption: "For a 4096 → 4096 layer and rank r = 8, train A: 8 × 4096 and B: 4096 × 8, totaling 65,536 weights. W has 16,777,216 frozen weights. The branches add: y = Wx + sBAx, with s = α/r. Biases are omitted.",
    alt: "A frozen wide matrix runs in parallel with trainable A and B matrices through an eight-dimensional bottleneck, scaled and added to the base output.",
  },
  temperature: {
    title: "Temperature changes the spread of the same logits",
    caption: "All panels use logits [2, 1, 0] and softmax(z/T). Lower T concentrates probability on the leading token; higher T flattens the distribution without changing the ranking. These are probabilities before top-k or top-p filtering.",
    alt: "Three bar charts at temperatures one-half, one, and two show progressively flatter next-token probabilities from identical logits.",
  },
  "kv-cache": {
    title: "Reuse old keys and values; append the new token's pair",
    caption: "At one causal decoder layer, step 4 computes Q₄, K₄, and V₄. Reuse K/V for the three previous tokens, append the new pair, and let Q₄ attend to all four positions. Old queries are unnecessary for this new output; cached K/V still grow with sequence length.",
    alt: "A decoder cache contains keys and values for three previous tokens plus an appended fourth pair; the new query compares with all keys and mixes all values.",
  },
  "classification-threshold": {
    title: "The same scores produce different mistakes at different thresholds",
    caption: "Predict positive at score ≥ threshold. Raising the cutoff from 0.4 to 0.7 removes both false positives here, but misses one additional true positive. Precision rises from 3/5 to 2/2 while recall falls from 3/4 to 2/4. These eight scores are a toy example.",
    alt: "Two score strips place the same positive and negative examples around thresholds point four and point seven, showing changed false positives and false negatives.",
  },
  pareto: {
    title: "A better choice depends on both quality and latency",
    caption: "Illustrative models, not benchmarks. B matches D's quality at lower latency, so D is dominated. A, B, and C trade quality for speed. Under a 50 ms budget, B offers the highest quality among these feasible choices.",
    alt: "A quality-versus-latency plot marks three Pareto choices, one dominated model, and a fifty-millisecond latency budget.",
  },
} as const satisfies Record<string, DlVisualSpec>;

export type DlVisualId = keyof typeof dlVisuals;
export const dlVisualIds = Object.keys(dlVisuals) as DlVisualId[];
export function isDlVisualId(id: string): id is DlVisualId { return Object.hasOwn(dlVisuals, id); }
