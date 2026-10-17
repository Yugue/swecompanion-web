export const cvVisuals = {
  "mlp-forward": {
    title: "Inputs become hidden features, then a prediction",
    caption: "An MLP connects dense layers in a forward chain. Each hidden unit mixes both inputs, then applies ReLU. The output combines the hidden features; this pass computes a prediction without updating weights. Matrices use column inputs: z = W₁x + b₁.",
    alt: "A two-input, two-hidden-unit, one-output multilayer perceptron with a step-through forward computation.",
  },
  "rgb-channels": {
    title: "One image, three channel grids",
    caption: "Each pixel has one red, green, and blue value. Stacking the channel grids gives C × H × W; stacking images adds the batch axis.",
    alt: "The same four-pixel image separates into red, green, and blue numeric channel grids.",
  },
  aliasing: {
    title: "Shrinking stripes: false pattern or honest average?",
    caption: "Keeping every second pixel turns alternating black/white stripes into solid black. Averaging each pair first yields gray: detail is lost without inventing a new pattern.",
    alt: "Alternating black and white samples become black when subsampled, or gray when averaged before subsampling.",
  },
  canny: {
    title: "From brightness to a thin boundary",
    caption: "Schematic cross-section through an edge. The intensity step produces a broad gradient response; non-maximum suppression retains its peak. Canny also uses smoothing and connected strong/weak thresholds.",
    alt: "A brightness step, a broad gradient peak, and a single retained edge position shown along the same image row.",
  },
  morphology: {
    title: "A stencil changes the mask's shape",
    caption: "Exact binary operations with a 3 × 3 square stencil. Opening removes the isolated speck; closing fills the small hole. These examples have enough empty border to avoid boundary clipping.",
    alt: "Two rows of masks show erosion followed by dilation removing a speck, and dilation followed by erosion filling a hole.",
  },
  transforms: {
    title: "Which geometry can your transform change?",
    caption: "The gray outline is the reference. Rigid motion preserves length; similarity also changes scale; affine allows shear; a homography allows perspective while keeping straight lines straight.",
    alt: "Four transformed quadrilaterals compare rigid, similarity, affine, and projective mappings against a reference square.",
  },
  ransac: {
    title: "Fit the agreement, not every point",
    caption: "Schematic line-fitting example. A least-squares fit can be pulled by outliers; a consensus fit follows the larger consistent group. Image registration applies the same idea to point correspondences.",
    alt: "A cluster of points supports a sloping line while isolated outliers pull another fit away from the cluster.",
  },
  projection: {
    title: "One pixel can correspond to many depths",
    caption: "A 2D cross-section of a pinhole camera, drawn with a virtual image plane in front of the camera. Points on the same ray project to the same location; one pixel alone does not identify depth.",
    alt: "Two scene points at different depths lie on one camera ray and intersect a virtual image plane at the same point.",
  },
  stereo: {
    title: "A second viewpoint constrains the distance",
    caption: "With f = 800 pixels and baseline B = 0.1 m, Z = 2 m gives disparity 40 pixels, while Z = 10 m gives 8 pixels. Rays are schematic; the disparity bars use the stated values.",
    alt: "Two cameras observe a near and a far point, with disparity bars of forty and eight pixels.",
  },
  aperture: {
    title: "An edge hides motion along itself",
    caption: "Inside a small window, sliding a long straight edge along its length leaves the pattern unchanged. A corner supplies a second directional cue. The orange arrow shows the ambiguous direction.",
    alt: "A straight vertical edge can slide vertically without changing its local patch, while a corner's position changes visibly.",
  },
  "mlp-backprop": {
    title: "Follow one MLP forward, then backward",
    caption: "Two inputs, two ReLU hidden units, and one linear output. The arrows follow activations forward and sensitivities backward. Weight w₂₂ connects input x₂ to hidden unit 2. Matrices use column inputs: z = W₁x + b₁.",
    alt: "A two-input, two-hidden-unit, one-output multilayer perceptron with a step-through forward pass, loss, backward gradients, and update.",
  },
  "gradient-descent": {
    title: "The gradient gives direction; the rate sets distance",
    caption: "For L(w) = (w − 3)² at w = 1, the gradient is −4. Rate 0.1 moves to 1.4; rate 2 overshoots to 9 and raises loss from 4 to 36.",
    alt: "A parabola marks the current weight, a small downhill update, and a large update overshooting the minimum.",
  },
  "learning-curves": {
    title: "Training improves; validation can worsen",
    caption: "Schematic loss curves. Training keeps improving, but validation turns upward. Select a checkpoint using validation; keep the final test independent.",
    alt: "Training loss falls continuously while validation loss falls and then rises, marking an early-stopping candidate.",
  },
  convolution: {
    title: "Slide a kernel to build a feature map",
    caption: "Multiply a 3 × 3 patch by the same kernel, add the nine products, and write one output value. Stride 1, no padding, no bias. This is the cross-correlation used by CNN libraries; example kernels are hand-chosen.",
    alt: "An interactive five-by-five input, three-by-three kernel, highlighted input patch, and computed three-by-three output map.",
  },
  "receptive-field": {
    title: "One output can see a 7 × 7 input region",
    caption: "A local example without padding: 3 × 3 at stride 2, then 3 × 3 at stride 1. The final cell combines nine first-layer cells whose input footprints span seven pixels.",
    alt: "Seven-by-seven input becomes a three-by-three feature map and one output cell; overlapping first-layer patches give a seven-by-seven receptive field.",
  },
  residual: {
    title: "Add a correction through a shortcut",
    caption: "The identity path carries x unchanged; the learned branch computes F(x). Addition combines compatible shapes. Backward sensitivities also reach x through both routes.",
    alt: "An input forks into an identity shortcut and a learned branch, then rejoins at addition.",
  },
  "paired-augmentation": {
    title: "Flip the label with the image",
    caption: "A horizontal flip moves both the object and its box. Flipping only the image leaves supervision pointing at the wrong place.",
    alt: "An image and its bounding box are flipped together, compared with an incorrect image-only flip.",
  },
  "box-overlap": {
    title: "IoU counts shared area relative to the union",
    caption: "Each box has area 100. They share 40, so the union is 100 + 100 − 40 = 160 and IoU = 40 / 160 = 0.25.",
    alt: "Two equal boxes overlap in a shaded strip, illustrating intersection forty and union one hundred sixty.",
  },
  segmentation: {
    title: "Same scene, three different answers",
    caption: "Semantic labels give both people the same class. Instance masks separate the people and omit scene-wide background labels. Panoptic output combines individual people with road and sky categories.",
    alt: "Two people and a road are shown as semantic categories, separate person instances, and a complete panoptic scene.",
  },
  "keypoint-heatmap": {
    title: "A landmark becomes a peak on a grid",
    caption: "This is one wrist's target heatmap, not a whole-person mask. The Gaussian peak marks the labeled location; argmax selects its highest cell. Other joints have separate heatmaps.",
    alt: "A person's wrist is marked on a stick figure and mapped to the peak of a nine-by-nine Gaussian heatmap.",
  },
  tracking: {
    title: "Crossing paths can swap identities",
    caption: "Schematic identities A and B pass one another. The letters identify the true paths; both people have the same appearance. Nearest-position matching can exchange their names. Motion and appearance help, but a hidden crossing can remain ambiguous.",
    alt: "Three frames show two people crossing, contrasting their continuing identities with a possible identity swap.",
  },
  attention: {
    title: "Weights decide how much each value contributes",
    caption: "One query receives weights 0.75 and 0.25 after comparing with keys. Values 2 and 10 combine to 0.75 × 2 + 0.25 × 10 = 4. The numbers are illustrative.",
    alt: "A query connects to two key-value pairs with thick and thin weighted arrows and produces the weighted output four.",
  },
  "patch-tokens": {
    title: "Patches become a sequence with positions",
    caption: "Toy 8 × 8 image with four 4 × 4 patches. A shared projection turns each patch into a token vector; position information preserves where it came from.",
    alt: "An image is split into four colored patches that become four ordered feature tokens with position labels.",
  },
  "prompt-mask": {
    title: "The prompt selects the intended region",
    caption: "A positive point on the left object requests its region. A promptable model returns a candidate mask, which still needs validation. This is a schematic intended result, not a model prediction.",
    alt: "A positive point on one of two objects leads to a candidate mask selecting that object.",
  },
  letterbox: {
    title: "Padding moves coordinates without stretching",
    caption: "A 640 × 480 image fits a 640 × 640 canvas at scale 1, with 80 pixels above and below. Point (100, 50) becomes (100, 130); subtract the padding to restore it.",
    alt: "A landscape image is placed into a square canvas with top and bottom padding and a tracked point shifted down eighty pixels.",
  },
  calibration: {
    title: "Confidence should match observed correctness",
    caption: "Schematic reliability diagram. Perfect calibration follows the diagonal. A bin scored 0.8 but correct only 0.6 of the time is overconfident.",
    alt: "A reliability plot compares the perfect-calibration diagonal with an overconfident curve and highlights confidence point eight versus correctness point six.",
  },
} as const;

export type CvVisualId = keyof typeof cvVisuals;
export const cvVisualIds = Object.keys(cvVisuals) as CvVisualId[];
export function isCvVisualId(id: string): id is CvVisualId {
  return Object.hasOwn(cvVisuals, id);
}
