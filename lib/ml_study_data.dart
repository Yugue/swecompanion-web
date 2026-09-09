import 'package:flutter/material.dart';

class MlTopic {
  const MlTopic({
    required this.id,
    required this.title,
    required this.summary,
    required this.keyPoints,
    required this.interviewPrompt,
    this.code,
  });

  final String id;
  final String title;
  final String summary;
  final List<String> keyPoints;
  final String interviewPrompt;
  final String? code;
}

class MlQuizQuestion {
  const MlQuizQuestion({required this.question, required this.answer});

  final String question;
  final String answer;
}

class MlPart {
  const MlPart({
    required this.id,
    required this.number,
    required this.title,
    required this.description,
    required this.color,
    required this.icon,
    required this.topics,
    this.quiz = const [],
  });

  final String id;
  final String number;
  final String title;
  final String description;
  final Color color;
  final IconData icon;
  final List<MlTopic> topics;
  final List<MlQuizQuestion> quiz;
}

MlTopic _topic(
  String id,
  String title,
  String summary,
  List<String> keyPoints,
  String interviewPrompt, {
  String? code,
}) => MlTopic(
  id: id,
  title: title,
  summary: summary,
  keyPoints: keyPoints,
  interviewPrompt: interviewPrompt,
  code: code,
);

MlQuizQuestion _quiz(String question, String answer) =>
    MlQuizQuestion(question: question, answer: answer);

const _blue = Color(0xFF4285F4);
const _red = Color(0xFFEA4335);
const _yellow = Color(0xFFFBBC04);
const _green = Color(0xFF34A853);
const _purple = Color(0xFFA78BFA);
const _cyan = Color(0xFF22D3EE);
const _orange = Color(0xFFF97316);

final mlParts = <MlPart>[
  MlPart(
    id: 'foundations',
    number: '1',
    title: 'Foundations',
    description:
        'The mathematical and modeling vocabulary needed to reason from first principles.',
    color: _blue,
    icon: Icons.foundation_outlined,
    topics: [
      _topic(
        'ml-fundamentals',
        'ML fundamentals',
        'Machine learning learns a mapping from data; the real goal is performance on unseen examples, not memorizing the training set.',
        [
          'Supervised learning uses labels; unsupervised learning finds structure; self-supervised learning derives targets from the data itself.',
          'Parameters are learned. Hyperparameters—learning rate, batch size, depth—are chosen.',
          'Use train data to fit, validation data to choose, and the test set once for final evaluation.',
          'Underfitting is high bias; overfitting is high variance. Leakage gives the model information unavailable at prediction time.',
        ],
        'Given a widening train–validation gap, identify whether capacity, data, leakage, or distribution shift is the likely cause.',
        code: 'model.fit(x_train, y_train)  # tune on validation, never test',
      ),
      _topic(
        'linear-algebra',
        'Linear algebra essentials',
        'Neural networks are compositions of linear transformations and nonlinearities; shapes explain what every operation can do.',
        [
          'A tensor generalizes scalars, vectors, and matrices; always state its shape.',
          'A dot product measures aligned magnitude. Matrix multiplication applies many dot products at once.',
          'Norms measure size; cosine similarity measures direction rather than magnitude.',
          'Eigenvectors keep their direction under a linear transformation; useful intuition, rarely a long interview derivation.',
        ],
        'Reason through the shape of XW when X is [batch, features] and W is [features, hidden].',
        code: 'hidden = x @ weight  # [B, D] @ [D, H] -> [B, H]',
      ),
      _topic(
        'calculus',
        'Calculus essentials',
        'A gradient tells how a small change in every parameter changes a scalar loss.',
        [
          'A partial derivative changes one input while holding the others fixed.',
          'The gradient collects all partial derivatives and points toward steepest increase.',
          'The chain rule multiplies local sensitivities through a computation graph.',
          'A Jacobian generalizes derivatives for vector-valued functions; backprop efficiently computes vector–Jacobian products.',
        ],
        'Explain what ∂L/∂W means and why its shape must match W.',
        code: 'loss.backward()  # autograd applies the chain rule',
      ),
      _topic(
        'probability-statistics',
        'Probability and statistics essentials',
        'Probability models uncertainty; statistics helps estimate and evaluate behavior from finite samples.',
        [
          'Expectation is a probability-weighted average; variance measures spread around it.',
          'Bernoulli models a binary outcome, categorical models one of many classes, and Gaussian models continuous variation.',
          'Bayes’ rule reverses a conditional using a prior and likelihood.',
          'Maximum likelihood chooses parameters that make observed data probable; log-likelihood turns products into sums.',
        ],
        'Connect maximum likelihood to cross-entropy for classification.',
        code: 'log_likelihood = distribution.log_prob(target).sum()',
      ),
      _topic(
        'neuron-mlp',
        'Neuron → Multi-Layer Perceptron',
        'A neuron computes a weighted sum plus bias; stacking layers with nonlinearities learns hierarchical representations.',
        [
          'A linear layer is z = Wx + b; the bias shifts the decision boundary.',
          'Width controls units per layer; depth controls the number of successive transformations.',
          'Without nonlinear activations, many linear layers collapse into one linear map.',
          'The output head must match the task: one logit for binary, C logits for C classes, continuous values for regression.',
        ],
        'Compute parameter count and output shape for a two-layer network.',
        code:
            'net = nn.Sequential(nn.Linear(d, h), nn.ReLU(), nn.Linear(h, c))',
      ),
      _topic(
        'activations',
        'Activation functions',
        'Activations introduce nonlinearity and shape the gradient flow through a network.',
        [
          'ReLU is simple and usually effective, but negative units can die; Leaky ReLU preserves a small negative slope.',
          'Sigmoid maps to (0, 1) and suits binary probabilities, but saturates in deep hidden layers.',
          'Tanh is zero-centered but also saturates. Gaussian Error Linear Unit (GELU) is a smooth gate common in Transformers.',
          'Rule of thumb: ReLU-family for standard hidden layers, GELU for Transformers, sigmoid only where bounded output is required.',
        ],
        'Why can a network with only linear layers not represent XOR?',
        code: 'x = torch.nn.functional.gelu(x)',
      ),
      _topic(
        'loss-functions',
        'Loss functions',
        'A loss is the differentiable training objective; a metric is the human-facing measure used to judge success.',
        [
          'Mean Squared Error (MSE) is common for regression and strongly penalizes large errors.',
          'Binary cross-entropy with logits combines sigmoid and a stable log-loss.',
          'Multiclass cross-entropy consumes raw logits and a class index; do not apply softmax first.',
          'Mean Absolute Error is robust to outliers; Huber is quadratic near zero and linear for large errors.',
        ],
        'Choose a loss and evaluation metric for a highly imbalanced fraud classifier.',
        code: 'loss = F.cross_entropy(logits, class_ids)',
      ),
      _topic(
        'forward-propagation',
        'Forward propagation',
        'The forward pass applies the model’s current parameters to inputs and records operations needed for learning.',
        [
          'Track batch and feature dimensions at every layer.',
          'Forward propagation computes predictions but does not update weights.',
          'Training mode enables behavior such as dropout and Batch Normalization updates; evaluation mode disables or freezes them.',
          'Inference usually adds no-grad mode to avoid storing a backward graph.',
        ],
        'Explain the difference among forward pass, inference, train mode, and eval mode.',
        code: 'with torch.no_grad(): prediction = model(x)',
      ),
      _topic(
        'backpropagation',
        'Backpropagation + chain rule',
        'Backpropagation reuses intermediate derivatives to propagate loss sensitivity from outputs to every parameter.',
        [
          'Forward: compute activations and loss. Backward: apply the chain rule in reverse topological order.',
          'At a branch, gradient contributions add because one value influenced the loss through multiple paths.',
          'Gradients accumulate by default in PyTorch, so clear them before the next update.',
          'The optimizer uses gradients; backprop itself does not change parameters.',
        ],
        'Walk through ∂L/∂W₁ in a two-layer network without hiding behind “autograd does it.”',
        code: 'optimizer.zero_grad(); loss.backward(); optimizer.step()',
      ),
    ],
    quiz: [
      _quiz(
        'Why are nonlinear activations necessary between linear layers?',
        'Without them, the composition W₂(W₁x+b₁)+b₂ is still a single linear transformation and cannot model nonlinear boundaries.',
      ),
      _quiz(
        'X has shape [32, 128] and W has shape [128, 64]. What is XW?',
        '[32, 64]: one 64-dimensional representation for each of 32 examples.',
      ),
      _quiz(
        'What should Binary Cross-Entropy with Logits receive?',
        'Raw, unbounded logits. It applies the sigmoid internally in a numerically stable way.',
      ),
      _quiz(
        'What is the difference between a logit and a probability?',
        'A logit is an unnormalized real-valued score. A probability is normalized and bounded, produced through sigmoid or softmax.',
      ),
      _quiz(
        'What does backpropagation compute?',
        'The gradient of a scalar loss with respect to intermediate values and parameters by applying the chain rule backward through the graph.',
      ),
      _quiz(
        'What does a positive ∂L/∂w tell you?',
        'Increasing w locally increases the loss; gradient descent therefore moves w in the negative-gradient direction.',
      ),
      _quiz(
        'Why does cross-entropy heavily punish a confident wrong prediction?',
        'The negative log of the true-class probability grows rapidly as that probability approaches zero.',
      ),
      _quiz(
        'Training loss falls while validation loss rises. What is happening?',
        'The model is overfitting: it fits training-specific patterns that do not generalize.',
      ),
      _quiz(
        'How do high bias and high variance differ?',
        'High bias underfits both train and validation data. High variance fits training data well but has a large validation gap.',
      ),
      _quiz(
        'Training loss does not decrease. What do you check first?',
        'Verify data/labels and loss wiring, overfit a tiny batch, inspect learning rate and gradients, then check initialization and activations.',
      ),
    ],
  ),
  MlPart(
    id: 'learning',
    number: '2',
    title: 'How neural networks learn',
    description:
        'Optimization, stability, regularization, and the evidence used to debug training.',
    color: _red,
    icon: Icons.trending_down_rounded,
    topics: [
      _topic(
        'gradient-descent',
        'Gradient descent',
        'Gradient descent iteratively moves parameters opposite the loss gradient.',
        [
          'Update rule: θ ← θ − η∇L; η is the learning rate.',
          'Too large can oscillate or diverge; too small makes little progress.',
          'The gradient is local, so deep-learning objectives do not guarantee the global optimum.',
        ],
        'Sketch what the loss curve looks like when the learning rate is too high.',
        code: 'for p in model.parameters(): p -= lr * p.grad',
      ),
      _topic(
        'mini-batches',
        'Stochastic and mini-batch training',
        'Mini-batches trade exact gradients for efficient, noisy estimates.',
        [
          'Full-batch uses all examples per update; stochastic gradient descent uses one; mini-batch uses a practical middle ground.',
          'Smaller batches use less memory and add noise; larger batches improve accelerator utilization and gradient stability.',
          'Changing batch size often requires retuning the learning rate.',
        ],
        'Compare batch size 16 with 4096 for memory, noise, throughput, and generalization.',
        code: 'for x, y in loader: loss_fn(model(x), y).backward()',
      ),
      _topic(
        'optimizers',
        'Momentum, RMSProp, Adam, and AdamW',
        'Modern optimizers reshape raw gradients to move faster and more stably.',
        [
          'Momentum keeps an exponential moving average of gradients to smooth oscillation.',
          'RMSProp scales each coordinate using recent squared gradients.',
          'Adam combines first- and second-moment estimates with bias correction.',
          'AdamW decouples weight decay from the adaptive gradient update and is the common default for Transformers.',
        ],
        'Explain what Adam adds beyond momentum and why AdamW differs from Adam plus L2.',
        code: 'optimizer = torch.optim.AdamW(model.parameters(), lr=3e-4)',
      ),
      _topic(
        'learning-rates',
        'Learning rates and schedules',
        'The learning rate controls step size; schedules change it as training moves from exploration to refinement.',
        [
          'Warmup starts small and increases, protecting unstable early optimization.',
          'Decay lowers the rate later to settle into a good solution; cosine decay is a smooth common choice.',
          'Fine-tuning usually needs a much smaller rate than training from scratch.',
        ],
        'Distinguish warmup from decay and say when each helps.',
        code:
            'scheduler = torch.optim.lr_scheduler.CosineAnnealingLR(opt, T_max=steps)',
      ),
      _topic(
        'initialization',
        'Weight initialization',
        'Initialization must break symmetry while keeping activation and gradient scales healthy across layers.',
        [
          'All-zero weights make units learn identically.',
          'Xavier/Glorot initialization suits tanh-like activations.',
          'He/Kaiming initialization accounts for ReLU dropping roughly half of activations.',
          'Initialization matters less after training succeeds, but can decide whether training starts at all.',
        ],
        'Why is zero initialization acceptable for some biases but not for all weights?',
        code:
            'torch.nn.init.kaiming_normal_(layer.weight, nonlinearity="relu")',
      ),
      _topic(
        'gradient-pathologies',
        'Vanishing and exploding gradients',
        'Repeated Jacobian multiplication can shrink or grow gradients exponentially through depth or time.',
        [
          'Vanishing gradients prevent early layers from learning long-range dependencies.',
          'Exploding gradients cause unstable updates, very large loss, or NaNs.',
          'Residual paths, normalization, gating, and good initialization improve flow; clipping specifically limits explosions.',
        ],
        'A recurrent model produces NaNs after long sequences—diagnose before changing architecture.',
        code:
            'total_norm = torch.nn.utils.clip_grad_norm_(model.parameters(), 1.0)',
      ),
      _topic(
        'gradient-clipping',
        'Gradient clipping',
        'Clipping caps an update when the gradient norm becomes dangerously large.',
        [
          'Norm clipping rescales the entire gradient vector only when its norm exceeds a threshold.',
          'It stabilizes training but does not fix the source of chronic explosions.',
          'Clipping is an optimization safeguard, not a regularizer whose purpose is better validation performance.',
        ],
        'Why can clipping stop NaNs but fail to improve a poorly specified model?',
        code:
            'torch.nn.utils.clip_grad_norm_(model.parameters(), max_norm=1.0)',
      ),
      _topic(
        'regularization',
        'Regularization',
        'Regularization biases learning toward solutions likely to generalize beyond the training sample.',
        [
          'L2/weight decay discourages large weights; L1 encourages sparsity.',
          'Early stopping limits memorization; data augmentation injects valid invariances.',
          'Label smoothing prevents overconfident targets.',
          'Optimization fixes poor training fit; regularization primarily targets the train–validation gap.',
        ],
        'Pick interventions for low train accuracy versus excellent train but poor validation accuracy.',
        code: 'loss = data_loss + weight_decay * weight.square().sum()',
      ),
      _topic(
        'dropout',
        'Dropout',
        'Dropout randomly removes activations during training so the network cannot rely on one fragile path.',
        [
          'During training, units are dropped and survivors are scaled; at inference, dropout is disabled.',
          'It can reduce overfitting but may slow optimization.',
          'It is less central in some modern normalized architectures, but remains a useful regularizer.',
        ],
        'Why must model.train() and model.eval() produce different dropout behavior?',
        code: 'x = F.dropout(x, p=0.1, training=self.training)',
      ),
      _topic(
        'normalization',
        'BatchNorm, LayerNorm, and RMSNorm',
        'Normalization stabilizes activation scale, but the normalized axes and inference behavior differ.',
        [
          'Batch Normalization uses batch statistics per feature and running statistics at inference; small batches can be noisy.',
          'Layer Normalization normalizes features within each example and works naturally for variable-length sequences.',
          'Root Mean Square Normalization (RMSNorm) scales by root-mean-square magnitude without subtracting the mean.',
          'All learn a scale; BatchNorm and LayerNorm also commonly learn a shift.',
        ],
        'For a Transformer token tensor [B, N, D], explain why LayerNorm over D is preferred.',
        code: 'x = torch.nn.LayerNorm(hidden_size)(x)',
      ),
      _topic(
        'residuals',
        'Residual connections',
        'A residual block learns a change F(x) around an identity route: y = x + F(x).',
        [
          'The identity path lets information and gradients bypass difficult transformations.',
          'Residuals make very deep networks easier to optimize; they do not merely add representational capacity.',
          'Shapes must match, or a projection is needed.',
        ],
        'Explain why an identity path helps even if F initially learns almost zero.',
        code: 'x = x + block(norm(x))',
      ),
      _topic(
        'bias-variance',
        'Overfitting, underfitting, and bias–variance',
        'Training and validation curves reveal whether the bottleneck is fitting the data or generalizing.',
        [
          'High training and validation error suggests underfitting/high bias.',
          'Low training error with worse validation error suggests overfitting/high variance.',
          'More capacity can reduce bias; more representative data and regularization can reduce variance.',
        ],
        'Read a pair of learning curves and choose the smallest evidence-based intervention.',
        code: 'gap = validation_loss - training_loss',
      ),
      _topic(
        'training-diagnostics',
        'Training diagnostics and debugging',
        'Debug the pipeline before tuning the model: prove each component works in a controlled setting.',
        [
          'Overfit a tiny batch to test model, loss, labels, and optimizer wiring.',
          'Inspect gradient norms, activation distributions, learning rate, and examples—not only aggregate loss.',
          'Compare against a simple baseline and change one variable at a time.',
          'NaNs suggest numerical instability; a flat loss suggests broken gradients, tiny steps, or mismatched targets.',
        ],
        'Give a prioritized checklist for a model stuck at random accuracy.',
        code: 'assert model(tiny_x).shape == tiny_y_expected_shape',
      ),
      _topic(
        'generalization-validation',
        'Generalization and validation',
        'Validation estimates performance on the deployment distribution and guides decisions without contaminating the final test.',
        [
          'Split by the real generalization boundary—often time, user, or entity—not blindly at random.',
          'Repeated test-set decisions overfit the test set.',
          'Cross-validation helps when data is limited; distribution shift can invalidate a clean random split.',
        ],
        'Design a leakage-safe split for recommendations or fraud with repeated users over time.',
        code:
            'train = data[data.time < cutoff]; valid = data[data.time >= cutoff]',
      ),
    ],
    quiz: [
      _quiz(
        'What does an extremely small learning rate look like?',
        'Loss decreases very slowly; gradients may be valid, but each parameter update is too small for the compute budget.',
      ),
      _quiz(
        'Loss becomes NaN and gradient norms spike. What immediate safeguard helps?',
        'Clip the global gradient norm, then find the underlying cause such as learning rate, unstable operations, or bad inputs.',
      ),
      _quiz(
        'What does momentum remember?',
        'An exponential moving average of past gradients, which accelerates consistent directions and damps oscillation.',
      ),
      _quiz(
        'What does Adam add to momentum?',
        'A per-parameter second-moment estimate that adaptively scales the first-moment update, plus bias correction.',
      ),
      _quiz(
        'Warmup and decay solve what different problems?',
        'Warmup protects unstable early steps; decay reduces later step size so training can refine a solution.',
      ),
      _quiz(
        'Why does He initialization suit ReLU?',
        'Its variance accounts for ReLU zeroing about half the signal, helping activation and gradient scales survive depth.',
      ),
      _quiz(
        'BatchNorm or LayerNorm for a Transformer—and why?',
        'LayerNorm, because it normalizes each token across features and does not depend on batch composition or running batch statistics.',
      ),
      _quiz(
        'What changes for dropout at inference?',
        'It is disabled; the training-time scaling already makes expected activation magnitude match inference.',
      ),
      _quiz(
        'Why do residual connections improve optimization?',
        'They provide a clean identity route for signals and gradients, so each block can learn a residual correction.',
      ),
      _quiz(
        'Train accuracy is poor and validation accuracy is similarly poor. Add regularization?',
        'Usually no. This is underfitting or an optimization/data problem; more regularization can make training fit worse.',
      ),
    ],
  ),
  MlPart(
    id: 'architectures',
    number: '3',
    title: 'Core architectures',
    description:
        'The progression from spatial inductive bias to recurrent memory and attention.',
    color: _yellow,
    icon: Icons.account_tree_outlined,
    topics: [
      _topic(
        'cnn',
        'Convolutional Neural Network fundamentals',
        'A Convolutional Neural Network (CNN) applies learned local filters across space, reusing the same parameters at every location.',
        [
          'Local connectivity matches spatial structure.',
          'Weight sharing makes CNNs parameter-efficient and translation equivariant.',
          'Early filters learn edges; deeper layers combine them into larger patterns.',
          'Input and output channels determine how filters mix feature maps.',
        ],
        'Why is a CNN usually a stronger image baseline than a similarly sized fully connected network?',
        code: 'conv = nn.Conv2d(in_channels=3, out_channels=64, kernel_size=3)',
      ),
      _topic(
        'cnn-geometry',
        'Receptive fields, stride, padding, and pooling',
        'CNN geometry controls output resolution and how much of the original input each feature can see.',
        [
          'Output size per axis is floor((N + 2P − K)/S) + 1.',
          'Stride downsamples; padding preserves border information or size; dilation expands coverage without more kernel weights.',
          'The receptive field grows across stacked layers.',
          'Pooling aggregates neighborhoods and adds some invariance, but discards precise location.',
        ],
        'Calculate output shape and effective receptive field for two 3×3 convolutions.',
        code: 'out = (size + 2 * padding - kernel) // stride + 1',
      ),
      _topic(
        'resnet',
        'ResNet as a CNN architecture',
        'ResNet applies residual blocks to make deep convolutional feature extractors trainable.',
        [
          'A block learns F(x) and returns x + F(x).',
          'Projection shortcuts reconcile changed channel counts or spatial sizes.',
          'The main point is optimization and gradient flow, not memorizing named ResNet depths.',
        ],
        'When does a ResNet shortcut need a learned projection?',
        code: 'return projection(x) + conv_block(x)',
      ),
      _topic(
        'rnn',
        'Recurrent Neural Network fundamentals',
        'A Recurrent Neural Network (RNN) processes a sequence one step at a time, carrying a hidden state.',
        [
          'Typical recurrence: hₜ = f(Wₓxₜ + Wₕhₜ₋₁ + b).',
          'Weights are shared across time.',
          'Sequential dependence limits parallelism and makes long-range information hard to preserve.',
        ],
        'State the hidden-state equation and explain what is shared over time.',
        code: 'h = torch.tanh(x_t @ W_x + h @ W_h + b)',
      ),
      _topic(
        'bptt',
        'Backpropagation Through Time',
        'Backpropagation Through Time (BPTT) unfolds recurrence into a deep graph and applies ordinary backprop across timesteps.',
        [
          'The same recurrent weights receive gradient contributions from every use.',
          'Many Jacobian products cause vanishing or exploding gradients.',
          'Truncated BPTT limits how far gradients travel to control compute and instability.',
        ],
        'Why can an RNN remember a signal forward while still failing to learn a long-range dependency?',
        code: 'loss.backward()  # graph includes the unrolled recurrent steps',
      ),
      _topic(
        'lstm-gru',
        'Long Short-Term Memory and Gated Recurrent Unit',
        'Gated recurrent cells create controlled memory paths that preserve useful information over longer spans.',
        [
          'Long Short-Term Memory (LSTM) separates cell state cₜ from hidden state hₜ and uses forget, input, and output gates.',
          'The cell’s additive update improves gradient flow.',
          'A Gated Recurrent Unit (GRU) is simpler and has no separate cell state; it uses update and reset gates.',
          'Gating helps but recurrent computation remains sequential.',
        ],
        'Contrast the roles of cₜ and hₜ, then explain the structural difference in a GRU.',
        code: 'output, (h_n, c_n) = nn.LSTM(d, h)(sequence)',
      ),
      _topic(
        'seq2seq',
        'Sequence-to-sequence models',
        'A sequence-to-sequence model maps an input sequence to an output sequence, often through encoder and decoder components.',
        [
          'The encoder builds a source representation; the decoder predicts tokens autoregressively.',
          'A single fixed vector creates an information bottleneck for long inputs.',
          'Teacher forcing feeds the true previous target during training; inference must feed the model’s own previous output.',
          'Exposure bias comes from this train–inference mismatch.',
        ],
        'Explain teacher forcing and why it can make training easier but inference brittle.',
        code:
            'decoder_input = target[:, :-1]  # shifted targets during training',
      ),
      _topic(
        'encoder-decoder-attention',
        'Encoder–decoder attention',
        'Attention lets each decoder step retrieve the most relevant encoder states instead of relying on one fixed summary.',
        [
          'A decoder query scores all encoder states.',
          'Normalized scores form a weighted context vector.',
          'This solves the fixed-vector bottleneck and improves alignment.',
          'Here attention connects decoder to encoder; self-attention is introduced separately in Transformers.',
        ],
        'Why was attention useful before self-attention and Transformers existed?',
        code: 'context = attention(decoder_state, encoder_states)',
      ),
    ],
    quiz: [
      _quiz(
        'Why are CNNs parameter-efficient?',
        'A small kernel connects locally and the same kernel weights are shared across every spatial position.',
      ),
      _quiz(
        'What is the convolution output-size formula?',
        'floor((input + 2×padding − kernel)/stride) + 1 for each spatial axis.',
      ),
      _quiz(
        'What is a receptive field?',
        'The region of the original input that can influence one feature; it grows as convolutional or pooling layers stack.',
      ),
      _quiz(
        'What does pooling trade away?',
        'It reduces spatial resolution and computation and adds some invariance, but loses exact location and fine detail.',
      ),
      _quiz(
        'State a basic RNN hidden-state recurrence.',
        'hₜ = f(Wₓxₜ + Wₕhₜ₋₁ + b), with the same parameters reused at each timestep.',
      ),
      _quiz(
        'Why does BPTT suffer vanishing or exploding gradients?',
        'It multiplies many recurrent Jacobians; repeated factors below or above one shrink or grow gradients exponentially.',
      ),
      _quiz(
        'What are the two LSTM states?',
        'Cell state cₜ is the long-lived memory path; hidden state hₜ is the exposed output used by the cell and downstream layers.',
      ),
      _quiz(
        'What is the key structural difference between GRU and LSTM?',
        'A GRU has no separate cell state and uses fewer gates, making it simpler and often cheaper.',
      ),
      _quiz(
        'What is teacher forcing?',
        'During training, the decoder receives the true previous target token rather than its own previous prediction.',
      ),
      _quiz(
        'What problem did encoder–decoder attention solve?',
        'It removed the need to compress an entire input sequence into one fixed vector by letting each decoder step retrieve relevant encoder states.',
      ),
    ],
  ),
  MlPart(
    id: 'transformers',
    number: '4',
    title: 'Transformers in depth',
    description:
        'Attention mechanics, block structure, model families, and the cost of long context.',
    color: _green,
    icon: Icons.hub_outlined,
    topics: [
      _topic(
        'qkv',
        'Self-attention + Query / Key / Value',
        'Self-attention lets every token retrieve information from other tokens in the same sequence.',
        [
          'Query is what this token is looking for.',
          'Key is what each token can be matched against.',
          'Value is the information retrieved when a match is strong.',
          'Scores come from QKᵀ; softmax weights are applied to V.',
        ],
        'Explain Q, K, and V without saying only that they are learned projections.',
        code: 'attention = softmax(Q @ K.transpose(-2, -1) / sqrt(d_k)) @ V',
      ),
      _topic(
        'scaled-multihead',
        'Scaled dot-product + multi-head attention',
        'Dot products measure query–key compatibility; scaling stabilizes softmax, and multiple heads learn different relations.',
        [
          'Dot-product variance grows with key dimension dₖ.',
          'Dividing by √dₖ keeps logits in a range where softmax has useful gradients.',
          'Each head has its own projections and subspace; outputs are concatenated and projected.',
          'Heads can specialize, but their roles are learned rather than assigned.',
        ],
        'Why does omitting √dₖ make training harder as head dimension grows?',
        code: 'scores = (q @ k.transpose(-2, -1)) * (q.size(-1) ** -0.5)',
      ),
      _topic(
        'masking',
        'Attention masking and causal masking',
        'Masks remove invalid attention edges before softmax.',
        [
          'Padding masks stop real tokens from attending to padding.',
          'A causal mask blocks future positions so autoregressive training cannot leak the answer.',
          'Use a very negative score before softmax, not a zero probability afterward.',
          'Encoder self-attention is usually bidirectional; decoder self-attention is causal.',
        ],
        'What information leakage occurs if a next-token model omits its causal mask?',
        code: 'scores = scores.masked_fill(mask == 0, float("-inf"))',
      ),
      _topic(
        'positional',
        'Positional encoding and embeddings',
        'Because attention alone is permutation-equivariant, models must inject token order.',
        [
          'Sinusoidal encodings are deterministic; learned position embeddings are trainable table entries.',
          'Position signals are combined with token representations before or within attention.',
          'Absolute schemes encode where a token is; relative schemes emphasize distances between tokens.',
        ],
        'Why can self-attention not distinguish “dog bites man” from a permutation without position information?',
        code: 'x = token_embedding(ids) + position_embedding(positions)',
      ),
      _topic(
        'rope',
        'Rotary Position Embedding',
        'Rotary Position Embedding (RoPE) rotates query and key feature pairs so their dot product carries relative-position information.',
        [
          'The rotation angle depends on token position and frequency.',
          'Applying it to Q and K makes attention depend naturally on relative offsets.',
          'It does not add a position vector directly to values.',
          'Extrapolation still depends on training range and scaling choices.',
        ],
        'What is rotated in RoPE, and how does that affect QKᵀ?',
        code: 'q, k = apply_rotary_pos_emb(q, k, cos, sin)',
      ),
      _topic(
        'transformer-block',
        'The Transformer block',
        'A block alternates token mixing through attention and per-token feature transformation through a feed-forward network.',
        [
          'Attention mixes information across sequence positions.',
          'The feed-forward network applies the same Multi-Layer Perceptron independently to each token.',
          'Residual connections preserve an identity route; normalization stabilizes scale.',
          'In Pre-Layer Normalization: x ← x + Attention(LN(x)), then x ← x + FFN(LN(x)).',
        ],
        'Identify which component mixes tokens and which mixes features.',
        code: 'x = x + attn(norm1(x)); x = x + ffn(norm2(x))',
      ),
      _topic(
        'pre-post-ln',
        'Pre-LayerNorm vs Post-LayerNorm',
        'Normalization placement changes the residual path and optimization behavior.',
        [
          'Pre-LN uses x + F(LN(x)), leaving a clean identity route.',
          'Post-LN uses LN(x + F(x)).',
          'Pre-LN generally trains deep Transformers more reliably; Post-LN can require careful warmup.',
          'The distinction is placement, not a different normalization formula.',
        ],
        'Write both block equations and point to the clean identity path.',
        code: 'pre_ln = x + sublayer(layer_norm(x))',
      ),
      _topic(
        'encoder-only',
        'Encoder-only Transformers',
        'Encoder-only models build bidirectional contextual representations of an observed sequence.',
        [
          'Every non-padding token can attend to tokens on both sides.',
          'They suit classification, tagging, retrieval, and masked-token pretraining.',
          'A task head reads a pooled token or token-level outputs.',
          'BERT is the canonical example.',
        ],
        'Why is an encoder-only model unsuitable for unrestricted next-token generation without changing its mask/objective?',
        code: 'features = encoder(input_ids, attention_mask=mask)',
      ),
      _topic(
        'decoder-only',
        'Decoder-only Transformers',
        'Decoder-only models predict the next token using causal self-attention.',
        [
          'Each position can see only itself and earlier tokens.',
          'Training predicts many next-token targets in parallel despite the causal dependency.',
          'Generation is sequential and benefits from a Key-Value cache.',
          'GPT is the canonical family.',
        ],
        'How can decoder training be parallel while autoregressive inference is sequential?',
        code:
            'loss = F.cross_entropy(logits[:, :-1].flatten(0, 1), ids[:, 1:].flatten())',
      ),
      _topic(
        'encoder-decoder',
        'Encoder–decoder Transformers',
        'An encoder represents the source; a causal decoder generates the target and cross-attends to encoder outputs.',
        [
          'Encoder self-attention is bidirectional.',
          'Decoder self-attention is causal.',
          'Cross-attention uses decoder queries with encoder keys and values.',
          'This structure is natural for translation and input-conditioned generation.',
        ],
        'For cross-attention, which component supplies Q and which supplies K/V?',
        code: 'decoded = decoder(target, memory=encoder(source))',
      ),
      _topic(
        'bert-gpt-t5',
        'BERT vs GPT vs T5',
        'These families mainly differ in block structure, pretraining objective, and the tasks they naturally support.',
        [
          'BERT: encoder-only, bidirectional, originally masked-language modeling.',
          'GPT: decoder-only, causal next-token prediction.',
          'T5: encoder–decoder, text-to-text span-corruption pretraining.',
          'Choose based on input/output structure and constraints, not brand recency.',
        ],
        'Choose among BERT, GPT, and T5 for tagging, free generation, and translation.',
        code:
            'architecture = {"tagging": "encoder", "generation": "decoder", "translation": "encoder-decoder"}',
      ),
      _topic(
        'transformer-complexity',
        'Transformer compute and memory complexity',
        'Dense attention creates an N×N score matrix, so sequence length is the dominant long-context cost.',
        [
          'Q is [N, d], Kᵀ is [d, N], and QKᵀ is [N, N].',
          'Attention compute is O(N²d); score memory is O(N²) per layer/head grouping.',
          'Doubling sequence length roughly quadruples the attention portion.',
          'The feed-forward network often dominates FLOPs at shorter contexts; both matter.',
        ],
        'What changes when context length doubles, and which tensors cause it?',
        code: 'scores = q @ k.transpose(-2, -1)  # [..., N, N]',
      ),
    ],
    quiz: [
      _quiz(
        'Define Query, Key, and Value.',
        'Query says what the current token seeks; Key says what each token can match; Value carries the information retrieved when that match receives weight.',
      ),
      _quiz(
        'What operation produces attention weights?',
        'Compute QKᵀ/√dₖ, apply any masks, then softmax across candidate key positions.',
      ),
      _quiz(
        'Why divide by √dₖ?',
        'Unscaled dot products grow in variance with dimension, saturating softmax and shrinking useful gradients.',
      ),
      _quiz(
        'Why use multiple attention heads?',
        'Separate learned projections let the model attend to different relationships and representation subspaces in parallel.',
      ),
      _quiz(
        'What does a causal mask guarantee?',
        'Position t cannot use tokens after t, so next-token training and generation remain autoregressive.',
      ),
      _quiz(
        'What problem does positional information solve?',
        'Plain self-attention has no inherent order; positions let identical token sets in different orders produce different representations.',
      ),
      _quiz(
        'Which Transformer component mixes positions, and which mixes features?',
        'Attention mixes information across positions; the feed-forward network transforms features independently at each position.',
      ),
      _quiz(
        'State the Pre-LN residual form.',
        'x + F(LN(x)); normalization is inside the sublayer branch, preserving a clean identity route.',
      ),
      _quiz(
        'Where do Q, K, and V come from in cross-attention?',
        'Queries come from decoder states; keys and values come from encoder outputs.',
      ),
      _quiz(
        'Why is dense attention quadratic in sequence length?',
        'It forms and processes an N×N compatibility matrix. Doubling N creates about four times as many token pairs.',
      ),
    ],
  ),
  MlPart(
    id: 'modern-deep-learning',
    number: '5',
    title: 'Modern deep-learning fundamentals',
    description:
        'Representation learning, adaptation, decoding, and efficient autoregressive inference.',
    color: _purple,
    icon: Icons.auto_awesome_outlined,
    topics: [
      _topic(
        'embeddings',
        'Embeddings and representation learning',
        'An embedding is a learned dense vector, not the integer token identifier used to look it up.',
        [
          'Token ID → embedding table → initial vector.',
          'After Transformer layers, the vector becomes contextual: the same token can represent different meanings in different sentences.',
          'Useful representations place semantically related inputs near one another under a suitable similarity measure.',
        ],
        'Distinguish a token ID, an input embedding, and a contextual hidden state.',
        code: 'x = embedding_table[token_ids]',
      ),
      _topic(
        'self-supervised-pretraining',
        'Self-supervised learning + pretraining',
        'Self-supervision creates prediction targets from raw data, enabling learning from data without manual labels.',
        [
          'Next-token prediction uses earlier tokens to predict the next token.',
          'Masked prediction reconstructs hidden pieces from context.',
          'Pretraining learns broadly reusable patterns at scale; its objective is a proxy for downstream usefulness.',
          'Autoregressive likelihood factorizes P(x₁…xₙ) into conditional next-token probabilities.',
        ],
        'Why is next-token prediction self-supervised rather than unsupervised in the vague sense?',
        code: 'inputs, targets = tokens[:, :-1], tokens[:, 1:]',
      ),
      _topic(
        'transfer-finetuning',
        'Transfer learning + fine-tuning',
        'Transfer learning reuses pretrained representations; fine-tuning adapts them to a new distribution or objective.',
        [
          'Full fine-tuning can update every parameter.',
          'Feature extraction freezes the backbone and trains a new head.',
          'Use smaller learning rates to avoid destroying useful pretrained structure.',
          'Domain mismatch, limited labels, and catastrophic forgetting shape the strategy.',
        ],
        'When would you freeze layers, fully fine-tune, or choose a parameter-efficient method?',
        code: 'for p in backbone.parameters(): p.requires_grad = False',
      ),
      _topic(
        'instruction-tuning',
        'Instruction tuning',
        'Instruction tuning is supervised fine-tuning on diverse instruction–response pairs so a model learns to follow requested behavior.',
        [
          'The loss can still be ordinary next-token cross-entropy.',
          'Diversity teaches the format and intent of instructions, not only one task.',
          'It improves controllability but does not guarantee factuality or alignment to every preference.',
        ],
        'How does instruction tuning differ from base-model pretraining?',
        code:
            'loss = causal_lm(instruction_plus_response, labels=response_masked_labels).loss',
      ),
      _topic(
        'lora',
        'Low-Rank Adaptation + parameter-efficient fine-tuning',
        'Low-Rank Adaptation (LoRA) freezes a pretrained weight W and learns a compact update ΔW = BA.',
        [
          'A and B are trainable low-rank matrices with rank r much smaller than model dimension d.',
          'The effective weight is W′ = W + BA.',
          'It reduces trainable parameters and optimizer memory; the base weights remain reusable.',
          'Parameter-Efficient Fine-Tuning (PEFT) describes the broader family; it is not the same as full fine-tuning.',
        ],
        'Where does LoRA save memory, and what remains expensive during the forward pass?',
        code: 'output = x @ W.T + (x @ A.T) @ B.T',
      ),
      _topic(
        'decoding',
        'Decoding strategies',
        'Decoding converts next-token probabilities into a sequence, trading likelihood, diversity, latency, and repetition.',
        [
          'Greedy decoding selects the highest-probability token each step.',
          'Beam search keeps the best k partial sequences, expands them, and retains the best k by cumulative score.',
          'Sampling draws according to probabilities; high-probability tokens remain more likely.',
          'Temperature uses softmax(z/T): T<1 sharpens, T>1 flattens.',
          'Top-k keeps a fixed candidate count; top-p keeps the smallest variable set whose cumulative probability reaches p.',
        ],
        'Compare greedy, beam, temperature, top-k, and top-p for a deterministic task versus creative generation.',
        code: 'probs = torch.softmax(logits / temperature, dim=-1)',
      ),
      _topic(
        'kv-cache',
        'Key-Value cache basics',
        'Autoregressive inference caches past attention Keys and Values so old tokens are not projected again at every step.',
        [
          'The new token computes Qnew, Knew, and Vnew.',
          'Qnew attends to all cached K/V plus the new K/V.',
          'Old Queries are not cached because only the new position needs an output.',
          'Cache memory grows O(N) with context length per layer, batch, and KV head.',
        ],
        'Why cache K/V but not Q, and what latency–memory tradeoff does this create?',
        code: 'keys = torch.cat([cached_keys, key_new], dim=-2)',
      ),
    ],
    quiz: [
      _quiz(
        'Is token ID 1532 an embedding?',
        'No. It is an arbitrary vocabulary index used to retrieve a learned dense embedding vector.',
      ),
      _quiz(
        'What makes next-token prediction self-supervised?',
        'The raw sequence supplies both input and target by shifting itself; no human label is required.',
      ),
      _quiz(
        'Does fine-tuning always update fewer parameters?',
        'No. Full fine-tuning can update all parameters; freezing and PEFT methods explicitly reduce the trainable subset.',
      ),
      _quiz(
        'What is instruction tuning?',
        'Supervised fine-tuning on diverse instruction–response examples so the model learns to interpret and follow instructions.',
      ),
      _quiz(
        'Write the LoRA update.',
        'Freeze W and learn ΔW = BA, where A and B have low rank r ≪ d; use W′ = W + BA.',
      ),
      _quiz(
        'What exactly does beam search retain?',
        'The best k partial sequences by cumulative score, repeatedly expanded and pruned at each generation step.',
      ),
      _quiz(
        'What does temperature do mathematically?',
        'It divides logits before softmax: T<1 sharpens the distribution; T>1 flattens it.',
      ),
      _quiz(
        'How do top-k and top-p differ?',
        'Top-k always keeps k tokens. Top-p keeps the smallest variable-sized set whose cumulative probability reaches p.',
      ),
      _quiz(
        'What does the KV cache store?',
        'Past Keys and Values for every layer; the new token computes a fresh Query and attends over those cached states.',
      ),
      _quiz(
        'What is catastrophic forgetting?',
        'Fine-tuning overwrites useful pretrained behavior. Mitigate it with a smaller learning rate, freezing, PEFT, or mixing broader data.',
      ),
    ],
  ),
  MlPart(
    id: 'practical-reasoning',
    number: '6',
    title: 'Practical ML reasoning',
    description:
        'How to choose, diagnose, deploy, and defend an ML system under real constraints.',
    color: _cyan,
    icon: Icons.engineering_outlined,
    topics: [
      _topic(
        'hyperparameter-tuning',
        'Hyperparameter tuning',
        'Tune the few choices with the largest effect using validation evidence and a controlled search budget.',
        [
          'Start with learning rate, then batch size, optimizer/schedule, regularization, and capacity.',
          'Random search usually explores important dimensions better than a dense grid.',
          'Bayesian and bandit methods help when evaluations are expensive.',
          'Track every run and change one hypothesis at a time.',
        ],
        'Given ten runs of budget, design a search that does more than blindly grid every parameter.',
        code: 'trial.suggest_float("lr", 1e-5, 1e-2, log=True)',
      ),
      _topic(
        'model-selection',
        'Model selection',
        'Choose the model that best satisfies the real objective on validation data—not the model with the best training score.',
        [
          'The selection metric must reflect business costs such as precision, recall, calibration, or ranking quality.',
          'Keep the test set outside repeated decisions.',
          'Prefer the simplest model that meets constraints; compare against a baseline.',
          'Account for latency, memory, interpretability, robustness, and maintenance—not only accuracy.',
        ],
        'Two models trade 1% recall for 10× lower latency. How do you decide?',
        code: 'best = max(candidates, key=lambda m: validation_utility(m))',
      ),
      _topic(
        'error-analysis',
        'Error analysis',
        'Inspect mistakes and organize them into actionable failure modes before changing architecture.',
        [
          'Manually review a representative sample of false positives and false negatives.',
          'Slice by class, subgroup, time, length, quality, and confidence.',
          'Separate label errors, missing coverage, preprocessing bugs, ambiguity, and genuine model limitations.',
          'Prioritize categories by frequency × fixability × product value.',
        ],
        'A classifier is 90% accurate. What evidence do you collect before making it larger?',
        code: 'errors = examples[predictions != labels]',
      ),
      _topic(
        'architecture-choice',
        'Choosing an architecture for a problem',
        'Match the model’s inductive bias to data modality, data volume, and deployment constraints, starting from a credible baseline.',
        [
          'Tabular: linear/logistic or boosted trees are strong baselines.',
          'Images: CNN or Vision Transformer; text: Transformer; graphs: graph models; simple numeric inputs: linear model or MLP.',
          'More modern is not automatically better.',
          'Data quality and pretrained availability can matter more than architecture novelty.',
        ],
        'Defend a model choice for tabular churn, image defects, and text classification.',
        code: 'baseline = LogisticRegression().fit(x_train, y_train)',
      ),
      _topic(
        'training-inference',
        'Training vs inference tradeoffs',
        'Training learns parameters with forward, backward, and optimizer state; inference only executes predictions.',
        [
          'Training stores activations, gradients, and optimizer moments, so it consumes much more memory.',
          'Gradient checkpointing saves memory by recomputing activations.',
          'Inference can use batching, quantization, compilation, caching, and lower precision.',
          'Autoregressive inference is sequential and may be dominated by memory bandwidth and KV-cache size.',
        ],
        'Why can a model fit for inference but not training on the same device?',
        code:
            'model.eval(); prediction = model(x)  # no optimizer state or backward graph',
      ),
      _topic(
        'system-tradeoffs',
        'Latency, memory, and accuracy tradeoffs',
        'Production model choice is constrained optimization: maximize useful quality while meeting resource and reliability budgets.',
        [
          'Latency is time per request; throughput is work per unit time. Batching can improve throughput while hurting queueing latency.',
          'Quantization reduces memory and often latency with possible quality loss.',
          'Distillation trains a smaller student; pruning removes low-value weights or structure.',
          'Measure end-to-end percentiles and cost, not only isolated average model time.',
        ],
        'Choose among quantization, distillation, batching, and a smaller architecture for an on-device model.',
        code:
            'quantized = torch.quantization.quantize_dynamic(model, {nn.Linear})',
      ),
      _topic(
        'end-to-end',
        'End-to-end ML system reasoning',
        'An ML system is the complete loop from objective and labels through deployment, monitoring, and retraining—not just a neural network.',
        [
          'Define prediction timing, action, latency, and asymmetric error costs before selecting a metric.',
          'Design labels and time-aware splits; prevent leakage and account for label delay, imbalance, and distribution shift.',
          'Build a simple baseline, train candidates, evaluate relevant slices, and perform error analysis.',
          'Deploy with versioning and rollback; monitor inputs, predictions, latency, drift, and delayed outcomes.',
          'Close the loop with retraining triggers, human review, and safeguards against feedback loops.',
        ],
        'Design a fraud or ranking system from business objective through post-deployment monitoring.',
        code:
            'objective -> data -> baseline -> model -> evaluate -> deploy -> monitor -> retrain',
      ),
    ],
  ),
  MlPart(
    id: 'generative-models',
    number: '7',
    title: 'Generative and representation models',
    description:
        'Lower-priority concepts worth recognizing and explaining at a high level.',
    color: _orange,
    icon: Icons.bubble_chart_outlined,
    topics: [
      _topic(
        'autoencoders',
        'Autoencoders',
        'An autoencoder compresses input x into latent code z and decodes z into a reconstruction x̂.',
        [
          'The reconstruction target is the input itself.',
          'A bottleneck, noise, sparsity, or another constraint prevents trivial copying and encourages useful structure.',
          'Uses include dimensionality reduction, denoising, anomaly detection, and representation learning.',
          'A plain autoencoder is not automatically a good generative model because its latent space may be irregular.',
        ],
        'Why does an unconstrained overcomplete autoencoder risk learning the identity?',
        code: 'reconstruction = decoder(encoder(x))',
      ),
      _topic(
        'vae',
        'Variational autoencoders',
        'A Variational Autoencoder (VAE) learns a distribution over latent codes and a smooth, sampleable latent space.',
        [
          'The encoder predicts μ and variance rather than one deterministic code.',
          'The reparameterization trick enables gradients through sampling.',
          'The objective balances reconstruction with Kullback–Leibler divergence toward a prior.',
          'The tradeoff is sample smoothness and coverage versus sharper reconstruction.',
        ],
        'Why is z = μ + σ⊙ε useful for backpropagation?',
        code: 'z = mu + torch.exp(0.5 * logvar) * torch.randn_like(mu)',
      ),
      _topic(
        'gans',
        'Generative adversarial networks',
        'A Generative Adversarial Network (GAN) trains a generator to fool a discriminator while the discriminator learns real versus fake.',
        [
          'The generator maps noise to samples; the discriminator supplies a learned training signal.',
          'GANs can create sharp samples but training is unstable.',
          'Mode collapse means the generator covers only part of the data distribution.',
          'The two networks form a minimax game rather than a simple fixed supervised objective.',
        ],
        'What is mode collapse and why can aggregate sample quality hide it?',
        code: 'g_loss = -torch.log(discriminator(generator(noise))).mean()',
      ),
      _topic(
        'diffusion',
        'Diffusion models',
        'Diffusion models learn to reverse a gradual noising process and generate data from noise through repeated denoising.',
        [
          'The forward process adds noise according to a schedule.',
          'Training commonly predicts the added noise or an equivalent parameterization.',
          'Sampling repeatedly applies the learned reverse step.',
          'They are stable and high quality but iterative sampling can be slow.',
        ],
        'Contrast diffusion’s training/sampling process with a GAN’s adversarial game.',
        code: 'loss = F.mse_loss(model(noisy_x, timestep), added_noise)',
      ),
      _topic(
        'contrastive',
        'Contrastive learning',
        'Contrastive learning shapes representations by pulling related examples together and pushing unrelated examples apart.',
        [
          'Positive pairs can be augmentations of the same item or semantically linked examples.',
          'Negatives teach separation, though some objectives avoid explicit negatives.',
          'Temperature controls concentration in similarity logits.',
          'Representation quality depends heavily on what the pairing and augmentation rules declare invariant.',
        ],
        'How can a bad augmentation policy teach the wrong invariance?',
        code: 'logits = normalized_a @ normalized_b.T / temperature',
      ),
    ],
  ),
];

final mlTopicsById = <String, MlTopic>{
  for (final part in mlParts)
    for (final topic in part.topics) topic.id: topic,
};

final mlPartsById = <String, MlPart>{for (final part in mlParts) part.id: part};

int get mlTopicCount =>
    mlParts.fold(0, (sum, part) => sum + part.topics.length);
